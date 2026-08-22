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

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

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
    const { message, history } = (await req.json()) as {
      message: string
      history?: ChatMessage[]
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Message cannot be empty' }), {
        status: 400,
        headers: CORS_HEADERS,
      })
    }

    // Check API Key from any standard environment variable
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      process.env.VITE_GOOGLE_API_KEY ||
      process.env.API_KEY

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          reply: '⚠️ AI hiện tại chưa kích hoạt (Chưa cấu hình GEMINI_API_KEY trên Vercel Environment Variables). Vui lòng thêm biến GEMINI_API_KEY trên Vercel hoặc liên hệ trực tiếp với Khoa qua email: khoalevodang301007@gmail.com!',
        }),
        {
          status: 200,
          headers: CORS_HEADERS,
        }
      )
    }

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

    const payload = {
      contents,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    }

    // Modern supported Gemini models
    const candidateModels = [
      'gemini-3.6-flash',
      'gemini-3.7-flash',
      'gemini-flash-latest',
      'gemini-2.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash',
      'gemini-2.5-pro',
      'gemini-1.5-flash',
    ]

    let replyText: string | null = null
    let lastError: string = ''

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify(payload),
        })

        if (res.ok) {
          const data = await res.json()
          replyText = data.candidates?.[0]?.content?.parts?.[0]?.text
          if (replyText) break
        } else {
          lastError = await res.text()
          console.warn(`Model ${model} returned:`, lastError)
        }
      } catch (err: any) {
        lastError = err?.message || String(err)
        console.warn(`Fetch error for model ${model}:`, lastError)
      }
    }

    if (!replyText) {
      console.error('All Gemini models failed. Last error:', lastError)
      replyText = 'Rất tiếc, AI tạm thời chưa thể phản hồi lúc này. Bạn có thể liên hệ trực tiếp với Khoa qua email khoalevodang301007@gmail.com nhé!'
    }

    return new Response(JSON.stringify({ reply: replyText }), {
      status: 200,
      headers: CORS_HEADERS,
    })
  } catch (error: any) {
    console.error('Server error:', error)
    return new Response(
      JSON.stringify({
        reply: 'Xin chào! Hiện tại hệ thống AI đang bảo trì. Bạn có thể liên hệ trực tiếp với Khoa qua email: khoalevodang301007@gmail.com.',
      }),
      {
        status: 200,
        headers: CORS_HEADERS,
      }
    )
  }
}
