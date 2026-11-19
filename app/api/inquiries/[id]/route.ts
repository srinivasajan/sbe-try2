import { NextRequest, NextResponse } from "next/server"
import { verifySessionToken, getSessionSecret } from "@/lib/auth-tokens"
import { deleteServerInquiry } from "@/lib/server-inquiries"

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
 * DELETE /api/inquiries/[id]
 * Protected administrative endpoint to delete an enquiry.
 */
export async function DELETE(
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

  const success = await deleteServerInquiry(numericId)
  if (!success) {
    return NextResponse.json({ ok: false, error: "Enquiry not found." }, { status: 404 })
  }

  return NextResponse.json({ ok: true, message: "Enquiry deleted successfully." }, { status: 200 })
}
