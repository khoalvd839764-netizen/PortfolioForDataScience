// Vercel Serverless Function: /api/chat
export const config = {
  runtime: 'edge', // Fast edge runtime on Vercel
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

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

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { message, history } = (await req.json()) as {
      message: string
      history?: ChatMessage[]
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Message cannot be empty' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // If GEMINI_API_KEY is not configured yet
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          reply: '⚠️ AI hiện tại chưa hoạt động (chưa được cấu hình GEMINI_API_KEY trên hệ thống). Vui lòng liên hệ trực tiếp với Lê Võ Đăng Khoa qua email: khoalevodang301007@gmail.com!',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Call Google Gemini 1.5 Flash API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

    // Build context history for Gemini
    const contents: any[] = [
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

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7,
        },
      }),
    })

    if (!geminiRes.ok) {
      const errData = await geminiRes.text()
      console.error('Gemini API error:', errData)
      throw new Error('Gemini API call failed')
    }

    const data = await geminiRes.json()
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Rất tiếc, tôi chưa thể trả lời câu hỏi này lúc này. Bạn có thể liên hệ trực tiếp với Khoa qua email nhé!'

    return new Response(JSON.stringify({ reply: replyText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Server error:', error)
    return new Response(
      JSON.stringify({
        reply: 'Xin chào! Hiện tại hệ thống AI đang bảo trì. Bạn có thể liên hệ trực tiếp với Khoa qua email: khoalevodang301007@gmail.com.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
