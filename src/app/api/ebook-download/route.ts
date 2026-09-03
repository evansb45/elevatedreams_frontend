import path from 'node:path'
import { dbConnect } from '@/lib/dbConnect'
import EbookLead from '@/models/EbookLead'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'

const ebookLeadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  company: z.string().optional(),
})

export async function POST(request: Request) {
  console.log('[API /api/ebook-download] POST request received')
  try {
    const body = await request.json()
    console.log('[API /api/ebook-download] Request body parsed:', body)

    const validationResult = ebookLeadSchema.safeParse(body)
    if (!validationResult.success) {
      console.warn(
        '[API /api/ebook-download] Validation failed:',
        validationResult.error.issues,
      )
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 },
      )
    }

    console.log('[API /api/ebook-download] Validation passed')
    const { firstName, surname, email, phone, company } = validationResult.data

    console.log('[API /api/ebook-download] Calling dbConnect()...')
    await dbConnect()
    console.log('[API /api/ebook-download] Database connected successfully')

    console.log('[API /api/ebook-download] Creating lead in database...')
    const newLead = await EbookLead.create({
      firstName,
      surname,
      email,
      phone,
      company: company || null,
    })
    console.log(
      '[API /api/ebook-download] Lead successfully saved with ID:',
      newLead._id,
    )

    // --- ZOHO EMAIL TRANSPORTER & ATTACHMENT DISPATCH ---
    console.log(
      '[API /api/ebook-download] Preparing to send eBook email via Zoho...',
    )

    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com', // Switched to standard smtp.zoho.com (try smtppro.zoho.com if this fails)
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_APP_PASSWORD,
      },
    })

    // Path pointing to your actual file structure: public/documents/usguide.pdf (or ip.pdf)
    const filePath = path.join(
      process.cwd(),
      'public',
      'documents',
      'usguide.pdf',
    )

    const mailOptions = {
      from: `"Elevate Dreams" <${process.env.ZOHO_EMAIL}>`,
      to: email,
      subject: 'Your Free eBook from Elevate Dreams',
      text: `Hi ${firstName},\n\nThank you for your interest! Please find your requested eBook attached to this email.\n\nBest regards,\nElevate Dreams Team`,
      html: `
            <div style="background-color: #f1f5f9; padding: 40px 16px; font-family: 'Rethink Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.05);">
              
              <!-- Top Gradient Brand Accent -->
              <div style="height: 6px; background: linear-gradient(90deg, #0f172a, #0d9488, #0f172a);"></div>
          
              <!-- Main Content Container -->
              <div style="padding: 48px 40px 36px 40px;">
                
                <!-- Greeting -->
                <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 24px; letter-spacing: -0.03em;">
                  Hi ${firstName},
                </h2>
                
                <!-- Introductory Paragraph -->
                <p style="font-size: 15px; line-height: 1.7; color: #475569; margin-top: 0; margin-bottom: 20px;">
                  Thank you for downloading our exclusive eBook. Your requested resource has been securely attached directly to this email so you can begin reading right away.
                </p>
          
                <!-- Value / Highlight Box -->
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #0d9488; padding: 20px 24px; border-radius: 0 16px 16px 0; margin-bottom: 24px;">
                  <p style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0;">
                    💡 Pro Tip for Implementation
                  </p>
                  <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0;">
                    Save the attached document to your device or digital bookshelf for easy reference whenever you are ready to put these strategies into motion.
                  </p>
                </div>
          
                <!-- Secondary Body Paragraph -->
                <p style="font-size: 15px; line-height: 1.7; color: #475569; margin-bottom: 32px;">
                  Whether you are looking to scale your current trajectory or have questions about putting these frameworks into practice, our team is always here to support your journey.
                </p>
          
                <!-- Action Button to Main Site -->
                <div style="text-align: center; margin-bottom: 36px;">
                  <a href="https://www.elevatedreams.com/" target="_blank" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15); transition: background-color 0.2s ease;">
                    Visit Our Main Website &rarr;
                  </a>
                </div>
          
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
          
                <!-- Sign-off Section -->
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td>
                      <p style="font-size: 15px; color: #475569; margin: 0 0 4px 0;">Best regards,</p>
                      <p style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0;">Elevate Dreams Team</p>
                    </td>
                    <td style="text-align: right; vertical-align: bottom;">
                      <span style="font-size: 12px; font-weight: 600; color: #0d9488; background: #f0fdfa; padding: 6px 12px; border-radius: 20px;">Verified Resource</span>
                    </td>
                  </tr>
                </table>
          
              </div>
          
              <!-- Footer -->
              <div style="background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="font-size: 13px; color: #64748b; margin: 0 0 8px 0; font-weight: 500;">
                  Empowering your vision every step of the way.
                </p>
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                  &copy; ${new Date().getFullYear()} Elevate Dreams. All rights reserved. &bull; <a href="https://www.elevatedreams.com/" target="_blank" style="color: #64748b; text-decoration: underline;">Visit Site</a>
                </p>
              </div>
          
            </div>
          </div>
            `,
      attachments: [
        {
          filename: 'usguide.pdf',
          path: filePath,
          contentType: 'application/pdf',
        },
      ],
    }

    await transporter.sendMail(mailOptions)
    console.log(
      `[API /api/ebook-download] eBook email successfully sent to ${email}`,
    )

    return NextResponse.json(
      {
        message: 'Lead saved and eBook sent successfully!',
        leadId: newLead._id,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('[API /api/ebook-download] Caught error:', error)
    return NextResponse.json(
      {
        error:
          error.message || 'Internal server error. Please try again later.',
      },
      { status: 500 },
    )
  }
}
