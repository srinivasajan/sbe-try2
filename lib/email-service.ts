/**
 * Transactional Email Notification Service for Shree Balaji Enterprises
 * Dispatches real-time lead notification emails to the business owner via Resend REST API.
 */

export interface EmailNotificationPayload {
  name: string
  phone: string
  email?: string
  interest: string
  message?: string
  source?: string
  submittedAt?: Date
}

export interface EmailNotificationResult {
  success: boolean
  status: "sent" | "failed" | "not_configured"
  id?: string
  error?: string
  sentAt?: string
}

const DEFAULT_RECIPIENT = "shreebalajienterprisesamb@gmail.com"
const DEFAULT_SENDER = "Shree Balaji Enterprises <onboarding@resend.dev>"

/**
 * Formats a Date object into a readable Indian Standard Time (IST) string.
 */
export function formatIST(date: Date = new Date()): string {
  try {
    return (
      new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date) + " IST"
    )
  } catch {
    return date.toISOString()
  }
}

/**
 * Sends a transactional notification email to the business owner when an enquiry is received.
 */
export async function sendEnquiryNotificationEmail(
  payload: EmailNotificationPayload
): Promise<EmailNotificationResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const recipient = (process.env.NOTIFICATION_RECIPIENT_EMAIL?.trim() || DEFAULT_RECIPIENT).trim()
  const fromEmail = (process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_SENDER).trim()

  if (!apiKey) {
    console.warn(
      "[EmailService] RESEND_API_KEY is not configured in server environment. Notification delivery paused."
    )
    return {
      success: false,
      status: "not_configured",
      error:
        "RESEND_API_KEY environment variable is missing. Set RESEND_API_KEY in .env.local to enable live email delivery.",
    }
  }

  const submittedDate = payload.submittedAt || new Date()
  const istTime = formatIST(submittedDate)
  const source = payload.source || "Contact Us"
  const formattedPhone = payload.phone.startsWith("+91") ? payload.phone : `+91 ${payload.phone}`
  const rawPhoneDigits = payload.phone.replace(/\D/g, "")

  const subject = `New Property Enquiry – Shree Balaji Enterprises`

  // Plain text email body
  const textBody = `Subject: ${subject}

New customer enquiry received!

Customer Name: ${payload.name}
Mobile Number: ${formattedPhone}
Email: ${payload.email && payload.email.trim() ? payload.email.trim() : "Not provided"}
Interested In: ${payload.interest}
Requirements: ${payload.message && payload.message.trim() ? payload.message.trim() : "Looking for property assistance."}
Source Page: ${source}
Submitted At: ${istTime}

Please contact the customer as soon as possible.`

  // Rich HTML email body
  const htmlBody = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
    <div style="background: linear-gradient(135deg, #006AFF, #004ecc); padding: 20px 24px; color: #ffffff;">
      <h1 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 700; color: #ffffff;">New Customer Enquiry Received</h1>
      <p style="margin: 0; font-size: 13px; opacity: 0.9;">Shree Balaji Enterprises &bull; RERA Reg: A51700023633</p>
    </div>
    
    <div style="padding: 24px;">
      <p style="margin: 0 0 16px 0; font-size: 14px; color: #475569;">
        A new property enquiry has been submitted through the <strong>${source}</strong> page.
      </p>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
        <tbody>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: 600; color: #64748b; width: 140px;">Customer Name</td>
            <td style="padding: 10px 0; font-weight: 700; color: #0f172a;">${payload.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Mobile Number</td>
            <td style="padding: 10px 0; font-weight: 700; color: #0f172a;">
              <a href="tel:+91${rawPhoneDigits}" style="color: #006AFF; text-decoration: none;">${formattedPhone}</a>
              &nbsp;&bull;&nbsp;
              <a href="https://wa.me/91${rawPhoneDigits}" style="color: #25D366; text-decoration: none; font-weight: 600;">Chat on WhatsApp</a>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Email Address</td>
            <td style="padding: 10px 0; color: #0f172a;">
              ${
                payload.email && payload.email.trim()
                  ? `<a href="mailto:${payload.email.trim()}" style="color: #006AFF; text-decoration: none;">${payload.email.trim()}</a>`
                  : `<span style="color: #94a3b8; font-style: italic;">Not provided</span>`
              }
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Interested In</td>
            <td style="padding: 10px 0; color: #006AFF; font-weight: 600;">${payload.interest}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: 600; color: #64748b; vertical-align: top;">Requirements</td>
            <td style="padding: 10px 0; color: #334155; line-height: 1.5; white-space: pre-wrap;">${
              payload.message && payload.message.trim()
                ? payload.message.trim()
                : "Looking for property assistance."
            }</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Source Page</td>
            <td style="padding: 10px 0; color: #475569;">${source}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Submitted At</td>
            <td style="padding: 10px 0; color: #475569; font-family: monospace;">${istTime}</td>
          </tr>
        </tbody>
      </table>

      <div style="text-align: center; margin: 24px 0 8px 0;">
        <a href="tel:+91${rawPhoneDigits}" style="display: inline-block; background-color: #006AFF; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-right: 8px;">
          Call Customer
        </a>
        <a href="https://wa.me/91${rawPhoneDigits}" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          Open WhatsApp
        </a>
      </div>
    </div>

    <div style="background-color: #f1f5f9; padding: 14px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
      Please contact the customer as soon as possible &bull; Shree Balaji Enterprises, Ambernath (West)
    </div>
  </div>
</body>
</html>`

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [recipient],
        subject,
        text: textBody,
        html: htmlBody,
      }),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      const errDetail = data?.message || `HTTP error ${res.status}`
      console.error("[EmailService] Resend API error:", errDetail)
      return {
        success: false,
        status: "failed",
        error: errDetail,
      }
    }

    return {
      success: true,
      status: "sent",
      id: data?.id,
      sentAt: new Date().toISOString(),
    }
  } catch (err: any) {
    console.error("[EmailService] Network / fetch error while calling Resend:", err)
    return {
      success: false,
      status: "failed",
      error: err?.message || "Failed to connect to email provider.",
    }
  }
}
