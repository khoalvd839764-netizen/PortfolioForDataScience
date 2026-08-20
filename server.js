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
- Học vấn: Sinh viên năm 2 (Khóa 2024 - Hiện tại) tại Trường Đại học Giao thông Vận tải TP.HCM (UTH).
- Chuyên ngành: Data Science & AI (Khoa học Dữ liệu & Trí tuệ Nhân tạo).
- 3 Kỹ năng cốt lõi (Core Tech Stack):
  1. C++: Cấu trúc dữ liệu & Giải thuật nâng cao, Lập trình hướng đối tượng (OOP), C++ STL, tối ưu bộ nhớ.
  2. Python: Khoa học dữ liệu, Machine Learning, xử lý và trực quan hóa dữ liệu (NumPy, Pandas, Scikit-Learn, Matplotlib).
  3. MySQL: Thiết kế hệ quản trị cơ sở dữ liệu quan hệ (RDBMS), tối ưu hóa câu truy vấn SQL, phân tích dữ liệu kinh doanh.
- Dự án (Projects): Đang trong quá trình hoàn thiện các dự án thực tế về AI/ML, C++ Engine và Database Schema để sớm public trên GitHub.
- Chứng chỉ (Certificates): Đang trong lộ trình học tập & chuẩn bị thi chứng chỉ chuyên ngành.
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
