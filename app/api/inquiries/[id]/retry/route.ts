import { NextRequest, NextResponse } from "next/server"
import { verifySessionToken, getSessionSecret } from "@/lib/auth-tokens"
import {
  getServerInquiryById,
  updateServerInquiryNotification,
} from "@/lib/server-inquiries"
import { sendEnquiryNotificationEmail } from "@/lib/email-service"

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
 * POST /api/inquiries/[id]/retry
 * Protected administrative endpoint to retry email notification delivery.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthed = await checkAdminAuth(req)
  if (!isAuthed) {
    return NextResponse.json({ ok: false, error: "Unauthorized access." }, { status: 401 })
  }

  const { id } = await params
  const numericId = parseInt(id, 10)
  if (isNaN(numericId)) {
    return NextResponse.json({ ok: false, error: "Invalid enquiry ID." }, { status: 400 })
  }

  const inquiry = await getServerInquiryById(numericId)
  if (!inquiry) {
    return NextResponse.json({ ok: false, error: "Enquiry not found." }, { status: 404 })
  }

  const result = await sendEnquiryNotificationEmail({
    name: inquiry.name,
    phone: inquiry.phone,
    email: inquiry.email,
    interest: inquiry.interest,
    message: inquiry.message,
    source: inquiry.source || "Contact Us",
    submittedAt: inquiry.date ? new Date(inquiry.date) : new Date(),
  })

  await updateServerInquiryNotification(numericId, {
    status: result.status,
    error: result.error,
    sentAt: result.sentAt,
  })

  return NextResponse.json(
    {
      ok: result.success,
      notificationStatus: result.status,
      error: result.error,
      sentAt: result.sentAt,
      message: result.success
        ? "Notification email dispatched successfully."
        : `Notification delivery failed: ${result.error}`,
    },
    { status: result.success ? 200 : 400 }
  )
}
