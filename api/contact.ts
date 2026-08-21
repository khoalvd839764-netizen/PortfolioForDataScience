// Vercel Serverless Function: /api/contact
export const config = {
  runtime: 'edge',
}

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const RECIPIENT_EMAIL = 'khoalevodang301007@gmail.com'

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: CORS_HEADERS,
    })
  }

  try {
    const { name, email, message } = (await req.json()) as {
      name: string
      email: string
      message: string
    }

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Vui lòng điền đầy đủ Tên, Email và Tin nhắn.' }),
        { status: 400, headers: CORS_HEADERS }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return new Response(
        JSON.stringify({ error: 'Địa chỉ email không hợp lệ.' }),
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const resendKey =
      process.env.RESEND_API_KEY ||
      process.env.VITE_RESEND_API_KEY ||
      process.env.EMAIL_API_KEY

    const web3FormsKey =
      process.env.WEB3FORMS_ACCESS_KEY ||
      process.env.VITE_WEB3FORMS_ACCESS_KEY

    if (!resendKey && !web3FormsKey) {
      return new Response(
        JSON.stringify({
          error:
            'Chưa cấu hình API Key gửi email. Vui lòng thêm RESEND_API_KEY hoặc WEB3FORMS_ACCESS_KEY vào biến môi trường (Environment Variables) trên Vercel hoặc file .env!',
        }),
        { status: 500, headers: CORS_HEADERS }
      )
    }

    const currentTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })

    // Option 1: Resend API
    if (resendKey) {
      // 1. Notification Email to Khoa
      const notifyHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; background-color: #0b1120; color: #f1f5f9; padding: 24px; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #111c30; border: 1px solid rgba(99,102,241,0.3); border-radius: 12px; padding: 24px; box-shadow: 0 8px 30px rgba(0,0,0,0.5);">
            <h2 style="color: #38bdf8; margin-top: 0; font-size: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">
              🔔 Có tin nhắn liên hệ mới từ Portfolio!
            </h2>
            <div style="margin: 16px 0; font-size: 14px; line-height: 1.6;">
              <p style="margin: 6px 0;"><strong style="color: #94a3b8;">Người gửi:</strong> <span style="color: #ffffff; font-weight: bold;">${name}</span></p>
              <p style="margin: 6px 0;"><strong style="color: #94a3b8;">Email:</strong> <a href="mailto:${email}" style="color: #818cf8; text-decoration: none;">${email}</a></p>
              <p style="margin: 6px 0;"><strong style="color: #94a3b8;">Thời gian:</strong> <span style="color: #cbd5e1;">${currentTime} (GMT+7)</span></p>
            </div>
            <div style="background-color: rgba(255,255,255,0.04); border-left: 3px solid #6366f1; padding: 14px; border-radius: 6px; margin: 18px 0;">
              <div style="font-size: 12px; color: #818cf8; font-weight: bold; margin-bottom: 6px; text-transform: uppercase;">Nội dung tin nhắn:</div>
              <div style="white-space: pre-wrap; font-size: 14px; color: #e2e8f0; line-height: 1.6;">${message}</div>
            </div>
            <div style="margin-top: 24px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: #64748b; text-align: center;">
              Email tự động từ hệ thống Portfolio của Lê Võ Đăng Khoa
            </div>
          </div>
        </body>
        </html>
      `

      // 2. Thank You Auto-Reply Email to the Sender
      const thankYouHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; background-color: #0b1120; color: #f1f5f9; padding: 24px; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #111c30; border: 1px solid rgba(99,102,241,0.3); border-radius: 12px; padding: 28px; box-shadow: 0 8px 30px rgba(0,0,0,0.5);">
            <div style="text-align: center; margin-bottom: 20px;">
              <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #38bdf8); font-size: 24px;">
                ✨
              </div>
              <h2 style="color: #ffffff; margin: 12px 0 4px; font-size: 22px;">Cảm ơn bạn đã liên hệ!</h2>
              <p style="color: #94a3b8; font-size: 14px; margin: 0;">Lê Võ Đăng Khoa — Data Science & AI Portfolio</p>
            </div>
            
            <div style="font-size: 15px; line-height: 1.7; color: #dce4f0; margin-bottom: 20px;">
              <p>Xin chào <strong>${name}</strong>,</p>
              <p>Khoa đã nhận được tin nhắn của bạn qua website Portfolio. Cảm ơn bạn rất nhiều vì đã dành thời gian quan tâm và gửi thông tin!</p>
              <p>Khoa sẽ đọc kỹ nội dung và phản hồi lại bạn qua email <strong style="color: #38bdf8;">${email}</strong> trong vòng <strong>24 giờ tới</strong>.</p>
            </div>

            <div style="background-color: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.25); border-radius: 8px; padding: 14px; margin-bottom: 24px;">
              <div style="font-size: 12px; color: #818cf8; font-weight: bold; margin-bottom: 4px;">Tóm tắt nội dung bạn đã gửi:</div>
              <div style="font-size: 13px; color: #cbd5e1; font-style: italic; white-space: pre-wrap;">"${message}"</div>
            </div>

            <div style="font-size: 14px; color: #cbd5e1; line-height: 1.6; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 18px;">
              <p style="margin: 0 0 4px;">Trân trọng,</p>
              <p style="margin: 0; font-weight: bold; color: #ffffff;">Lê Võ Đăng Khoa</p>
              <p style="margin: 2px 0 0; font-size: 13px; color: #94a3b8;">Sinh viên Data Science & AI · UTH</p>
              <p style="margin: 4px 0 0; font-size: 13px;">
                <a href="https://github.com/khoalvd839764-netizen" style="color: #38bdf8; text-decoration: none;">GitHub</a> · 
                <a href="mailto:${RECIPIENT_EMAIL}" style="color: #38bdf8; text-decoration: none;">Email trực tiếp</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `

      // Send Email 1: Notification to Khoa
      const sendNotify = fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: [RECIPIENT_EMAIL],
          reply_to: email,
          subject: `🔔 [Portfolio Contact] Tin nhắn mới từ ${name}`,
          html: notifyHtml,
        }),
      })

      // Send Email 2: Auto-reply to Sender
      const sendThankYou = fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Lê Võ Đăng Khoa <onboarding@resend.dev>',
          to: [email],
          reply_to: RECIPIENT_EMAIL,
          subject: `✨ Cảm ơn bạn đã liên hệ với Lê Võ Đăng Khoa!`,
          html: thankYouHtml,
        }),
      })

      const [resNotify, resThankYou] = await Promise.all([sendNotify, sendThankYou])

      if (!resNotify.ok) {
        const errData = await resNotify.text()
        console.error('Resend notify error:', errData)
        return new Response(
          JSON.stringify({ error: `Lỗi khi gửi email qua Resend: ${errData}` }),
          { status: 500, headers: CORS_HEADERS }
        )
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Đã gửi thông báo và email cảm ơn tự động thành công!',
        }),
        { status: 200, headers: CORS_HEADERS }
      )
    }

    // Option 2: Web3Forms API
    if (web3FormsKey) {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: web3FormsKey,
          name,
          email,
          message,
          subject: `🔔 [Portfolio Contact] Tin nhắn mới từ ${name}`,
          from_name: 'Lê Võ Đăng Khoa Portfolio',
        }),
      })

      const data = await res.json()
      if (data.success) {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Đã gửi tin nhắn thành công qua Web3Forms!',
          }),
          { status: 200, headers: CORS_HEADERS }
        )
      } else {
        return new Response(
          JSON.stringify({ error: data.message || 'Lỗi gửi mail qua Web3Forms' }),
          { status: 500, headers: CORS_HEADERS }
        )
      }
    }

    return new Response(
      JSON.stringify({ error: 'Không thể xử lý yêu cầu gửi email.' }),
      { status: 500, headers: CORS_HEADERS }
    )
  } catch (err: any) {
    console.error('Contact API Error:', err)
    return new Response(
      JSON.stringify({ error: err?.message || 'Lỗi máy chủ khi gửi email.' }),
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
