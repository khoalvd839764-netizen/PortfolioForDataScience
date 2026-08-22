import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

const SYSTEM_INSTRUCTION = `
Bạn là "Khoa's AI Assistant" — Trợ lý Trí tuệ Nhân tạo đại diện cho Lê Võ Đăng Khoa.
Mục tiêu của bạn là trả lời các câu hỏi của nhà tuyển dụng, khách tham quan website một cách lịch sự, chuyên nghiệp, thông minh và súc tích (dưới 150 từ mỗi câu trả lời).

Thông tin chính xác về Lê Võ Đăng Khoa:
- Họ và tên: Lê Võ Đăng Khoa
- Học vấn: Sinh viên (Nhập học: 01/09/2025 – Hiện tại) tại Trường Đại học Giao thông Vận tải TP.HCM (UTH).
- Chuyên ngành: Data Science & AI (Khoa học Dữ liệu & Trí tuệ Nhân tạo).
- 3 Kỹ năng cốt lõi (Core Tech Stack):
  1. C++: Cấu trúc dữ liệu & Giải thuật nâng cao, Lập trình hướng đối tượng (OOP), C++ STL, tối ưu bộ nhớ.
  2. Python: Khoa học dữ liệu, Machine Learning, xử lý và trực quan hóa dữ liệu (NumPy, Pandas, Scikit-Learn, Matplotlib).
  3. MySQL: Thiết kế hệ quản trị cơ sở dữ liệu quan hệ (RDBMS), tối ưu hóa câu truy vấn SQL, phân tích dữ liệu kinh doanh.
- Dự án tiêu biểu (Projects):
  1. "Hành Trang Của Mẹ & Góc Nhỏ Của Ba" (App URL: https://khoalevodang-bavame.vercel.app/) — Nền tảng cẩm nang gia đình, chia sẻ mẹo hay cuộc sống & kinh nghiệm nuôi dạy con, xây dựng bằng React, TypeScript, Tailwind CSS, tối ưu PWA trên Vercel. Trạng thái: Đang phát triển (Ngày bắt đầu: 21/08/2026).
  2. Các dự án AI/ML, C++ DSA Engine và Database Schema đang tiếp tục được phát triển và public trên GitHub.
- Chứng chỉ (Certificates):
  1. "C++ Essentials 1" — Cấp bởi Cisco Networking Academy & C++ Institute (Open Education & Development Group) ngày 22/08/2026. Cert ID: 5af2e763-9146-4b4a-a909-b236739c7c4c (xác thực trực tuyến chính thức qua cổng Cisco NetAcad).
- Địa điểm: TP. Hồ Chí Minh, Việt Nam.
- Email liên hệ: khoalevodang301007@gmail.com
- GitHub: https://github.com/khoalvd839764-netizen

Phong cách trả lời:
- Luôn thân thiện, khiêm tốn, tự tin và chuyên nghiệp.
- Nếu được hỏi thông tin ngoài phạm vi của Khoa, hãy trả lời ngắn gọn và khéo léo hướng người hỏi liên hệ trực tiếp qua Email hoặc GitHub của Khoa.
- Có thể trả lời bằng cả tiếng Việt và tiếng Anh tùy theo ngôn ngữ người dùng hỏi.
`

// API Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' })
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      process.env.VITE_GOOGLE_API_KEY ||
      process.env.API_KEY

    if (!apiKey) {
      return res.status(200).json({
        reply: '⚠️ AI hiện tại chưa hoạt động (chưa được cấu hình GEMINI_API_KEY). Vui lòng thêm biến môi trường GEMINI_API_KEY hoặc liên hệ với Khoa qua email: khoalevodang301007@gmail.com!',
      })
    }

    const contents = [
      {
        role: 'user',
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      {
        role: 'model',
        parts: [{ text: 'Tôi đã hiểu rõ vai trò là Trợ lý AI đại diện cho Lê Võ Đăng Khoa. Tôi sẵn sàng hỗ trợ!' }],
      },
    ]

    if (Array.isArray(history)) {
      history.slice(-6).forEach((h) => {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }],
        })
      })
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    })

    const payload = {
      contents,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    }

    const candidateModels = [
      'gemini-3.7-flash',
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-3.1-flash-lite',
      'gemini-flash-latest',
      'gemini-1.5-flash',
    ]

    let replyText = null
    let lastError = ''

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
        const geminiRes = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify(payload),
        })

        if (geminiRes.ok) {
          const data = await geminiRes.json()
          replyText = data.candidates?.[0]?.content?.parts?.[0]?.text
          if (replyText) break
        } else {
          lastError = await geminiRes.text()
          console.warn(`Model ${model} returned error:`, lastError)
        }
      } catch (err) {
        lastError = err?.message || String(err)
        console.warn(`Fetch error for model ${model}:`, lastError)
      }
    }

    if (!replyText) {
      console.error('All Gemini models failed. Last error:', lastError)
      replyText = 'Rất tiếc, AI tạm thời chưa thể phản hồi lúc này. Bạn có thể liên hệ trực tiếp với Khoa qua email khoalevodang301007@gmail.com nhé!'
    }

    return res.status(200).json({ reply: replyText })
  } catch (error) {
    console.error('Server error:', error)
    return res.status(200).json({
      reply: 'Xin chào! Hiện tại hệ thống AI đang bảo trì. Bạn có thể liên hệ trực tiếp với Khoa qua email: khoalevodang301007@gmail.com.',
    })
  }
})

// API Contact Endpoint (Auto notification & Thank-you email)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ Tên, Email và Tin nhắn.' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Địa chỉ email không hợp lệ.' })
    }

    const resendKey =
      process.env.RESEND_API_KEY ||
      process.env.VITE_RESEND_API_KEY ||
      process.env.EMAIL_API_KEY

    const web3FormsKey =
      process.env.WEB3FORMS_ACCESS_KEY ||
      process.env.VITE_WEB3FORMS_ACCESS_KEY

    if (!resendKey && !web3FormsKey) {
      return res.status(500).json({
        error:
          'Chưa cấu hình API Key gửi email. Vui lòng thêm RESEND_API_KEY hoặc WEB3FORMS_ACCESS_KEY vào file .env!',
      })
    }

    const RECIPIENT_EMAIL = 'khoalevodang301007@gmail.com'
    const currentTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })

    if (resendKey) {
      const notifyHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #0b1120; color: #f1f5f9; padding: 24px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #111c30; border: 1px solid rgba(99,102,241,0.3); border-radius: 12px; padding: 24px;">
            <h2 style="color: #38bdf8; margin-top: 0;">🔔 Có tin nhắn liên hệ mới từ Portfolio!</h2>
            <p><strong>Người gửi:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #818cf8;">${email}</a></p>
            <p><strong>Thời gian:</strong> ${currentTime}</p>
            <div style="background-color: rgba(255,255,255,0.04); border-left: 3px solid #6366f1; padding: 14px; margin: 18px 0;">
              <strong>Nội dung tin nhắn:</strong><br><br>${message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
      `

      const thankYouHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #0b1120; color: #f1f5f9; padding: 24px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #111c30; border: 1px solid rgba(99,102,241,0.3); border-radius: 12px; padding: 28px;">
            <h2 style="color: #ffffff; margin-top: 0;">✨ Cảm ơn bạn đã liên hệ với Lê Võ Đăng Khoa!</h2>
            <p>Xin chào <strong>${name}</strong>,</p>
            <p>Khoa đã nhận được tin nhắn của bạn qua website Portfolio. Khoa sẽ đọc kỹ nội dung và phản hồi lại bạn qua email <strong>${email}</strong> trong vòng 24 giờ tới.</p>
            <div style="background-color: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.25); border-radius: 8px; padding: 14px; margin: 18px 0;">
              <em>"${message.replace(/\n/g, '<br>')}"</em>
            </div>
            <p style="margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 14px;">
              Trân trọng,<br><strong>Lê Võ Đăng Khoa</strong><br>Sinh viên Data Science & AI · UTH
            </p>
          </div>
        </div>
      `

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

      const [resNotify] = await Promise.all([sendNotify, sendThankYou])

      if (!resNotify.ok) {
        const errData = await resNotify.text()
        console.error('Resend error:', errData)
        return res.status(500).json({ error: `Lỗi khi gửi email qua Resend: ${errData}` })
      }

      return res.status(200).json({ success: true, message: 'Đã gửi thông báo và email cảm ơn tự động thành công!' })
    }

    if (web3FormsKey) {
      const response = await fetch('https://api.web3forms.com/submit', {
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

      const data = await response.json()
      if (data.success) {
        return res.status(200).json({ success: true, message: 'Đã gửi tin nhắn thành công qua Web3Forms!' })
      } else {
        return res.status(500).json({ error: data.message || 'Lỗi gửi mail qua Web3Forms' })
      }
    }
  } catch (err) {
    console.error('Contact error:', err)
    return res.status(500).json({ error: 'Lỗi máy chủ khi gửi email.' })
  }
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Serve static frontend files from 'dist' directory
const distPath = path.join(__dirname, 'dist')
app.use(express.static(distPath))

// SPA Fallback: send index.html for all other non-API routes
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`)
})
