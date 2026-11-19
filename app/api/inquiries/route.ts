import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { verifySessionToken, getSessionSecret } from "@/lib/auth-tokens"
import {
  getServerInquiries,
  saveServerInquiry,
  updateServerInquiryStatus,
  updateServerInquiryNotification,
} from "@/lib/server-inquiries"
import { sendEnquiryNotificationEmail } from "@/lib/email-service"

// Rate limiting state for enquiry submissions (30 submissions per 10 minutes per IP)
const submissionRateMap = new Map<string, { count: number; firstAttempt: number }>()
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const MAX_SUBMISSIONS_PER_WINDOW = process.env.NODE_ENV === "development" ? 200 : 30

function checkSubmissionRate(ip: string): boolean {
  const now = Date.now()
  const entry = submissionRateMap.get(ip)

  if (!entry || now - entry.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    submissionRateMap.set(ip, { count: 1, firstAttempt: now })
    return true
  }

  if (entry.count >= MAX_SUBMISSIONS_PER_WINDOW) {
    return false
  }

  entry.count += 1
  return true
}

// Strict Indian Mobile Number Regex: 10 digits starting with 6, 7, 8, or 9
const INDIAN_MOBILE_REGEX = /^[6-9][0-9]{9}$/

const inquirySchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name cannot exceed 100 characters."),
  phone: z
    .string({ required_error: "Mobile number is required." })
    .trim()
    .regex(
      INDIAN_MOBILE_REGEX,
      "Invalid mobile number. Must be a 10-digit Indian mobile number starting with 6, 7, 8, or 9."
    ),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .optional()
    .or(z.literal("")),
  interest: z
    .string({ required_error: "Enquiry type is required." })
    .trim()
    .min(1, "Enquiry type cannot be empty.")
    .max(100),
  message: z
    .string()
    .trim()
    .max(2000, "Message cannot exceed 2000 characters.")
    .optional(),
  source: z.string().trim().max(100).optional(),
  hp: z.string().optional(), // Honeypot field for anti-spam
})

async function checkAdminAuth(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("sbe_admin_session")?.value
  if (!token) return false
  try {
    const result = await verifySessionToken(token, getSessionSecret())
    return result.valid
  } catch {
    return false
  }
}

/**
 * POST /api/inquiries
 * Public endpoint to submit a new customer enquiry.
 */
export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1"

    // Rate Limiting
    if (!checkSubmissionRate(ip)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Too many submissions from your connection. Please wait a few minutes before trying again.",
        },
        { status: 429 }
      )
    }

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON request body." },
        { status: 400 }
      )
    }

    // Honeypot spam trap
    if (body.hp && typeof body.hp === "string" && body.hp.trim().length > 0) {
      // Silently accept without processing spam bot submissions
      return NextResponse.json(
        { ok: true, message: "Enquiry received successfully." },
        { status: 200 }
      )
    }

    const validation = inquirySchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message || "Validation failed."
      return NextResponse.json({ ok: false, error: firstError }, { status: 400 })
    }

    const { name, phone, email, interest, message, source } = validation.data

    // 1. Save enquiry to persistent storage
    const savedInquiry = await saveServerInquiry({
      name,
      phone,
      email: email || undefined,
      interest,
      message: message || undefined,
      source: source || "Contact Us",
      notificationStatus: "not_configured",
    })

    // 2. Dispatch email notification to business owner
    const emailResult = await sendEnquiryNotificationEmail({
      name,
      phone,
      email: email || undefined,
      interest,
      message: message || undefined,
      source: source || "Contact Us",
      submittedAt: new Date(),
    })

    // 3. Update enquiry record with notification delivery status
    await updateServerInquiryNotification(savedInquiry.id, {
      status: emailResult.status,
      error: emailResult.error,
      sentAt: emailResult.sentAt,
    })

    return NextResponse.json(
      {
        ok: true,
        id: savedInquiry.id,
        notificationStatus: emailResult.status,
        message: "Your enquiry has been received successfully.",
      },
      { status: 201 }
    )
  } catch (err: any) {
    console.error("[API Inquiries] Unexpected error during submission:", err)
    return NextResponse.json(
      {
        ok: false,
        error: "An internal server error occurred while processing your enquiry. Please try again.",
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/inquiries
 * Protected administrative endpoint to retrieve all enquiries.
 */
export async function GET(req: NextRequest) {
  const isAuthed = await checkAdminAuth(req)
  if (!isAuthed) {
    return NextResponse.json({ ok: false, error: "Unauthorized access." }, { status: 401 })
  }

  const inquiries = await getServerInquiries()
  return NextResponse.json({ ok: true, inquiries }, { status: 200 })
}

/**
 * PATCH /api/inquiries
 * Protected administrative endpoint to update an enquiry's status.
 */
export async function PATCH(req: NextRequest) {
  const isAuthed = await checkAdminAuth(req)
  if (!isAuthed) {
    return NextResponse.json({ ok: false, error: "Unauthorized access." }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body || typeof body.id !== "number" || !body.status) {
    return NextResponse.json(
      { ok: false, error: "Invalid status update payload." },
      { status: 400 }
    )
  }

  const updated = await updateServerInquiryStatus(body.id, body.status)
  if (!updated) {
    return NextResponse.json({ ok: false, error: "Inquiry not found." }, { status: 404 })
  }

  return NextResponse.json({ ok: true, inquiry: updated }, { status: 200 })
}
