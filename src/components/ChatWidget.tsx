import React, { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
}

const QUICK_QUESTIONS = [
  '🎓 Khoa học trường nào & ngành gì?',
  '⚡ Kỹ năng công nghệ cốt lõi của Khoa?',
  '✉️ Làm sao để liên hệ với Khoa?',
  '🚀 Dự án sắp tới của Khoa là gì?',
]

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Xin chào! 👋 Tôi là **Khoa\'s AI Assistant**. Tôi có thể giúp gì cho bạn về thông tin học vấn, kỹ năng (C++, Python, MySQL) hoặc liên hệ với Khoa?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen, loading])

  const handleSend = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim()
    if (!messageText || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    if (!textToSend) setInput('')
    setLoading(true)

    try {
      // Build history for API
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history,
        }),
      })

      const data = await res.json()
      const aiReply = data.reply || 'Xin lỗi, tôi chưa thể trả lời câu hỏi này lúc này.'

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error('Chat error:', err)
      const errMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Khoa hiện là sinh viên năm 2 chuyên ngành Data Science & AI tại UTH. 3 kỹ năng cốt lõi: C++, Python, MySQL. Bạn có thể liên hệ trực tiếp qua email khoalevodang301007@gmail.com!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, errMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Round Floating Mini-Chat Button with Chatbot Logo */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '5.2rem',
        zIndex: 95,
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* Tooltip on hover */}
        <div className="chat-tooltip" style={{
          position: 'absolute',
          right: 'calc(100% + 12px)',
          whiteSpace: 'nowrap',
          background: 'rgba(11, 17, 32, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          borderRadius: '8px',
          padding: '0.4rem 0.8rem',
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.78rem',
          color: '#dce4f0',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
          opacity: 0,
          transform: 'translate3d(8px, 0, 0)',
          transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
        }}>
          ✨ Chat with Khoa AI
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open AI Chatbot"
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: isOpen
              ? 'rgba(17, 28, 48, 0.9)'
              : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #38bdf8 100%)',
            border: `1px solid ${isOpen ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: isOpen
              ? '0 8px 24px rgba(0,0,0,0.4)'
              : '0 8px 28px rgba(99,102,241,0.6), 0 0 20px rgba(56,189,248,0.35)',
            transform: isOpen ? 'scale(0.95)' : 'translate3d(0,0,0)',
            transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate3d(0,-3px,0) scale(1.05)'
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.7), 0 0 28px rgba(56,189,248,0.5)'
            const tooltip = e.currentTarget.parentElement?.querySelector('.chat-tooltip') as HTMLElement
            if (tooltip) {
              tooltip.style.opacity = '1'
              tooltip.style.transform = 'translate3d(0, 0, 0)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = isOpen ? 'scale(0.95)' : 'translate3d(0,0,0)'
            e.currentTarget.style.boxShadow = isOpen
              ? '0 8px 24px rgba(0,0,0,0.4)'
              : '0 8px 28px rgba(99,102,241,0.6), 0 0 20px rgba(56,189,248,0.35)'
            const tooltip = e.currentTarget.parentElement?.querySelector('.chat-tooltip') as HTMLElement
            if (tooltip) {
              tooltip.style.opacity = '0'
              tooltip.style.transform = 'translate3d(8px, 0, 0)'
            }
          }}
        >
          {/* Subtle Outer Pulsing Wave Ring */}
          {!isOpen && (
            <div style={{
              position: 'absolute', inset: -4, borderRadius: '50%',
              border: '1.5px solid rgba(99,102,241,0.6)',
              animation: 'pulseRing 2.8s ease-out infinite',
              pointerEvents: 'none',
            }} />
          )}

          {/* Icon: Logo Robot / Chatbot or Close Icon */}
          {isOpen ? (
            <span style={{ fontSize: '1.25rem', color: '#fff', lineHeight: 1 }}>✕</span>
          ) : (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Custom SVG Chatbot Logo */}
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Antennas */}
                <path d="M12 2V5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="2" r="1" fill="#38bdf8" />
                {/* Robot Head Body */}
                <rect x="3" y="5" width="18" height="14" rx="5" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.8" />
                {/* Glowing AI Eyes */}
                <circle cx="8" cy="11.5" r="1.75" fill="#38bdf8" />
                <circle cx="16" cy="11.5" r="1.75" fill="#38bdf8" />
                {/* Friendly AI Smile */}
                <path d="M8.5 15C9.5 16 14.5 16 15.5 15" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
              </svg>

              {/* Status active indicator dot */}
              <span style={{
                position: 'absolute', top: -3, right: -4,
                width: 9, height: 9, borderRadius: '50%',
                background: '#22c55e', border: '1.5px solid #0b1120',
                boxShadow: '0 0 8px #22c55e',
              }} />
            </div>
          )}
        </button>
      </div>

      {/* Floating Chat Dialog Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '5.2rem',
          right: '2rem',
          width: 'clamp(320px, 90vw, 400px)',
          height: 'clamp(460px, 70vh, 560px)',
          zIndex: 100,
          background: 'rgba(9, 14, 26, 0.82)',
          backdropFilter: 'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          borderRadius: '20px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.65), 0 0 40px rgba(99,102,241,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'chatAppear 0.35s cubic-bezier(0.16,1,0.3,1)',
        }}>
          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            background: 'linear-gradient(90deg, rgba(99,102,241,0.2) 0%, rgba(167,139,250,0.15) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 14px rgba(99,102,241,0.5)',
                fontSize: '1.1rem',
              }}>
                🤖
              </div>
              <div>
                <div style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  color: '#fff',
                  display: 'flex', alignItems: 'center', gap: '0.4rem'
                }}>
                  <span>Khoa&apos;s AI Assistant</span>
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.66rem',
                  color: '#22c55e',
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                  Gemini 1.5 Flash · Online
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={() => setMessages([messages[0]])}
                title="Xóa lịch sử chat"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#94a3b8',
                  padding: '0.3rem 0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Đóng"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#94a3b8',
                  width: '26px', height: '26px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Message List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
                  gap: '0.25rem',
                }}
              >
                <div style={{
                  maxWidth: '85%',
                  padding: '0.75rem 1rem',
                  borderRadius: m.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                    : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${m.role === 'user' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'}`,
                  color: m.role === 'user' ? '#fff' : '#dce4f0',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.86rem',
                  lineHeight: 1.55,
                  boxShadow: m.role === 'user' ? '0 4px 14px rgba(99,102,241,0.3)' : '0 2px 8px rgba(0,0,0,0.2)',
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.content}
                </div>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.62rem',
                  color: '#64748b',
                  padding: '0 0.3rem',
                }}>
                  {m.time}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.8rem', background: 'rgba(255,255,255,0.04)', borderRadius: 10, width: 'fit-content' }}>
                <span style={{ fontSize: '0.75rem', color: '#818cf8', fontFamily: "'JetBrains Mono', monospace" }}>AI đang gõ</span>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#818cf8', animation: 'cursorBlink 1s infinite' }} />
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#818cf8', animation: 'cursorBlink 1s infinite 0.2s' }} />
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#818cf8', animation: 'cursorBlink 1s infinite 0.4s' }} />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Suggestions */}
          {messages.length <= 2 && (
            <div style={{
              padding: '0 1rem 0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#64748b' }}>
                GỢI Ý CÂU HỎI NHANH:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    style={{
                      background: 'rgba(99,102,241,0.12)',
                      border: '1px solid rgba(99,102,241,0.3)',
                      borderRadius: '999px',
                      padding: '0.3rem 0.65rem',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.73rem',
                      color: '#c4d1e6',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(99,102,241,0.25)'
                      e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(99,102,241,0.12)'
                      e.currentTarget.style.color = '#c4d1e6'
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input Bar */}
          <div style={{
            padding: '0.85rem 1rem',
            background: 'rgba(5, 8, 15, 0.9)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi cho AI..."
              disabled={loading}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '999px',
                padding: '0.6rem 1rem',
                color: '#fff',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: input.trim() && !loading ? 'linear-gradient(135deg, #6366f1, #38bdf8)' : 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
              }}
            >
              ➔
            </button>
          </div>
        </div>
      )}
    </>
  )
}
