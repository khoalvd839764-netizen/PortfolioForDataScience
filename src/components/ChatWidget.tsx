import React, { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
}

const QUICK_QUESTIONS = [
  { icon: '🎓', text: 'Khoa học trường nào & ngành gì?' },
  { icon: '⚡', text: 'Kỹ năng công nghệ cốt lõi của Khoa?' },
  { icon: '🏡', text: 'Dự án Hành Trang Của Mẹ & Góc Nhỏ Của Ba?' },
  { icon: '✉️', text: 'Làm sao để liên hệ nhanh với Khoa?' },
]

const POPUP_GREETINGS = [
  {
    badge: '👋 Xin chào!',
    text: 'Tôi là **AI Assistant** của Khoa. Bạn có muốn tìm hiểu về học vấn UTH, kỹ năng hay dự án của Khoa không?',
  },
  {
    badge: '🚀 Dự án mới',
    text: 'Khoa vừa phát triển dự án **"Hành Trang Của Mẹ & Góc Nhỏ Của Ba"**. Hỏi tôi để biết thêm chi tiết nhé!',
  },
  {
    badge: '⚡ Trợ lý 24/7',
    text: 'Cần kết nối với Khoa? Tôi có thể trả lời câu hỏi và hướng dẫn bạn gửi email liên hệ ngay lập tức!',
  },
]

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showPopBubble, setShowPopBubble] = useState(false)
  const [popIndex, setPopIndex] = useState(0)
  const [bubbleDismissed, setBubbleDismissed] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Xin chào! 👋 Tôi là **Khoa's AI Assistant** (hỗ trợ bởi Gemini AI). Tôi có thể giúp gì cho bạn về thông tin học vấn tại UTH, kỹ năng (C++, Python, MySQL), dự án thực tế hoặc hỗ trợ liên hệ với Khoa?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Track screen size for responsive chat layout
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto pop-up speech bubble after 2.5s if not opened
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && !bubbleDismissed) {
        setShowPopBubble(true)
      }
    }, 2500)
    return () => clearTimeout(timer)
  }, [isOpen, bubbleDismissed])

  // Cycle through popup greetings every 10s
  useEffect(() => {
    if (!showPopBubble || isOpen) return
    const interval = setInterval(() => {
      setPopIndex((prev) => (prev + 1) % POPUP_GREETINGS.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [showPopBubble, isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Prevent background body scroll when full modal is open on mobile
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, isMobile])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      setShowPopBubble(false)
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
        content:
          '⚠️ AI hiện tại không hoạt động (chưa kết nối API trên server). Vui lòng liên hệ trực tiếp với Khoa qua email: khoalevodang301007@gmail.com!',
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

  // Simple parser to format **bold** and *italic* and URLs in message text
  const renderFormattedMessage = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*|https?:\/\/[^\s]+)/g)
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} style={{ color: '#ffffff', fontWeight: 700 }}>
            {part.slice(2, -2)}
          </strong>
        )
      }
      if (part.startsWith('http://') || part.startsWith('https://')) {
        return (
          <a
            key={idx}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#38bdf8', textDecoration: 'underline', wordBreak: 'break-all' }}
          >
            {part}
          </a>
        )
      }
      return part
    })
  }

  const currentGreeting = POPUP_GREETINGS[popIndex]

  return (
    <>
      {/* ─── Floating Mini-Chat Speech Bubble Pop-up ─── */}
      {!isOpen && showPopBubble && (
        <div
          className="chat-pop-bubble"
          style={{
            position: 'fixed',
            zIndex: 94,
            animation: 'bubblePopIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div
            style={{
              position: 'relative',
              background: 'rgba(11, 17, 32, 0.94)',
              backdropFilter: 'blur(24px) saturate(190%)',
              WebkitBackdropFilter: 'blur(24px) saturate(190%)',
              border: '1px solid rgba(99, 102, 241, 0.45)',
              borderRadius: '16px',
              padding: '0.85rem 1.15rem',
              boxShadow: '0 16px 36px rgba(0,0,0,0.6), 0 0 24px rgba(99,102,241,0.25)',
              maxWidth: isMobile ? '280px' : '320px',
              color: '#dce4f0',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {/* Header with dismiss button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'rgba(99,102,241,0.18)',
                    border: '1px solid rgba(99,102,241,0.4)',
                    borderRadius: '999px',
                    padding: '0.15rem 0.55rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.66rem',
                    color: '#a78bfa',
                    fontWeight: 700,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                  {currentGreeting.badge}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowPopBubble(false)
                  setBubbleDismissed(true)
                }}
                aria-label="Đóng thông báo"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  padding: '2px',
                  lineHeight: 1,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
              >
                ✕
              </button>
            </div>

            {/* Bubble Message Text */}
            <p style={{ fontSize: '0.82rem', lineHeight: 1.55, margin: '0 0 0.65rem', color: '#cbd5e1' }}>
              {renderFormattedMessage(currentGreeting.text)}
            </p>

            {/* Action CTA */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={() => {
                  setIsOpen(true)
                  setShowPopBubble(false)
                }}
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '0.3rem 0.75rem',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: '0 2px 10px rgba(99,102,241,0.4)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translate3d(0,-1px,0) scale(1.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translate3d(0,0,0)')}
              >
                <span>Trò chuyện ngay</span>
                <span style={{ fontSize: '0.85rem' }}>✨</span>
              </button>

              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: '#64748b' }}>
                AI Trợ lý Khoa
              </span>
            </div>

            {/* Speech Bubble Arrow Tail */}
            <div
              className="chat-bubble-arrow"
              style={{
                position: 'absolute',
                width: 0,
                height: 0,
                borderStyle: 'solid',
              }}
            />
          </div>
        </div>
      )}

      {/* ─── Round Floating Mini-Chat Trigger Button ─── */}
      <div
        className="chat-trigger-container"
        style={{
          position: 'fixed',
          zIndex: 95,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Tooltip on hover (desktop only) */}
        {!isMobile && (
          <div
            className="chat-tooltip"
            style={{
              position: 'absolute',
              right: 'calc(100% + 12px)',
              whiteSpace: 'nowrap',
              background: 'rgba(11, 17, 32, 0.94)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.78rem',
              fontWeight: 500,
              color: '#dce4f0',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 0 16px rgba(99,102,241,0.25)',
              pointerEvents: 'none',
              opacity: 0,
              transform: 'translate3d(8px, 0, 0)',
              transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            🤖 Chat với Khoa AI Assistant
          </div>
        )}

        <button
          onClick={() => {
            setIsOpen(!isOpen)
            if (!isOpen) setShowPopBubble(false)
          }}
          aria-label="Mở Trợ lý AI Chatbot"
          className="touch-target"
          style={{
            width: isMobile ? '52px' : '56px',
            height: isMobile ? '52px' : '56px',
            borderRadius: '50%',
            background: isOpen
              ? 'rgba(17, 28, 48, 0.95)'
              : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 45%, #38bdf8 100%)',
            border: `1px solid ${isOpen ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.35)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: isOpen
              ? '0 8px 24px rgba(0,0,0,0.5)'
              : '0 10px 30px rgba(99,102,241,0.65), 0 0 24px rgba(56,189,248,0.4)',
            transform: isOpen ? 'scale(0.95)' : 'translate3d(0,0,0)',
            transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.currentTarget.style.transform = 'translate3d(0,-3px,0) scale(1.06)'
              e.currentTarget.style.boxShadow =
                '0 14px 36px rgba(99,102,241,0.75), 0 0 32px rgba(56,189,248,0.55)'
              const tooltip = e.currentTarget.parentElement?.querySelector('.chat-tooltip') as HTMLElement
              if (tooltip) {
                tooltip.style.opacity = '1'
                tooltip.style.transform = 'translate3d(0, 0, 0)'
              }
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.currentTarget.style.transform = isOpen ? 'scale(0.95)' : 'translate3d(0,0,0)'
              e.currentTarget.style.boxShadow = isOpen
                ? '0 8px 24px rgba(0,0,0,0.5)'
                : '0 10px 30px rgba(99,102,241,0.65), 0 0 24px rgba(56,189,248,0.4)'
              const tooltip = e.currentTarget.parentElement?.querySelector('.chat-tooltip') as HTMLElement
              if (tooltip) {
                tooltip.style.opacity = '0'
                tooltip.style.transform = 'translate3d(8px, 0, 0)'
              }
            }
          }}
        >
          {/* Subtle Outer Pulsing Wave Rings */}
          {!isOpen && (
            <>
              <div
                style={{
                  position: 'absolute',
                  inset: -5,
                  borderRadius: '50%',
                  border: '1.5px solid rgba(99,102,241,0.65)',
                  animation: 'pulseRing 2.8s ease-out infinite',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: -10,
                  borderRadius: '50%',
                  border: '1px solid rgba(56,189,248,0.4)',
                  animation: 'pulseRing 2.8s ease-out infinite 1.4s',
                  pointerEvents: 'none',
                }}
              />
            </>
          )}

          {/* Icon: Logo Robot / Chatbot or Close Icon */}
          {isOpen ? (
            <span style={{ fontSize: '1.3rem', color: '#fff', lineHeight: 1 }}>✕</span>
          ) : (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2V5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="12" cy="2" r="1.2" fill="#38bdf8" />
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="5"
                  fill="rgba(255,255,255,0.18)"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle cx="8" cy="11.5" r="1.8" fill="#38bdf8" />
                <circle cx="16" cy="11.5" r="1.8" fill="#38bdf8" />
                <path d="M8.5 15C9.5 16 14.5 16 15.5 15" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </svg>

              {/* Status active indicator dot with ripple */}
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background: '#22c55e',
                  border: '1.5px solid #0b1120',
                  boxShadow: '0 0 10px #22c55e',
                }}
              />
            </div>
          )}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isOpen && isMobile && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: 'rgba(3, 7, 18, 0.82)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            animation: 'fadeInBackdrop 0.25s ease',
          }}
        />
      )}

      {/* ─── Floating Chat Dialog Window ─── */}
      {isOpen && (
        <div
          className="chat-dialog-window"
          style={{
            position: 'fixed',
            zIndex: 100,
            background: 'rgba(9, 14, 28, 0.95)',
            backdropFilter: 'blur(32px) saturate(200%)',
            WebkitBackdropFilter: 'blur(32px) saturate(200%)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            boxShadow:
              '0 28px 70px rgba(0,0,0,0.75), 0 0 50px rgba(99,102,241,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Mobile Drag Indicator Handle */}
          {isMobile && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '0.65rem',
                paddingBottom: '0.25rem',
                background: 'linear-gradient(180deg, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.05) 100%)',
              }}
            >
              <div style={{ width: 38, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.35)' }} />
            </div>
          )}

          {/* Header */}
          <div
            style={{
              padding: '0.95rem 1.25rem',
              background:
                'linear-gradient(90deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.18) 50%, rgba(56,189,248,0.15) 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.09)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #38bdf8 100%)',
                  border: '1.5px solid rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 16px rgba(99,102,241,0.6)',
                  fontSize: '1.15rem',
                  flexShrink: 0,
                  position: 'relative',
                }}
              >
                🤖
                <span
                  style={{
                    position: 'absolute',
                    bottom: -1,
                    right: -1,
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: '#22c55e',
                    border: '1.5px solid #090e1c',
                    boxShadow: '0 0 8px #22c55e',
                  }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.94rem',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <span>Khoa&apos;s AI Assistant</span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.62rem',
                      background: 'rgba(99,102,241,0.25)',
                      color: '#a78bfa',
                      border: '1px solid rgba(99,102,241,0.4)',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      fontWeight: 600,
                    }}
                  >
                    PRO
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.66rem',
                    color: '#4ade80',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    marginTop: '0.1rem',
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#22c55e',
                      display: 'inline-block',
                      boxShadow: '0 0 6px #22c55e',
                    }}
                  />
                  Gemini AI · Sẵn sàng trò chuyện 24/7
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
              <button
                onClick={() => setMessages([messages[0]])}
                title="Xóa đoạn chat"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '7px',
                  color: '#94a3b8',
                  padding: '0.32rem 0.6rem',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239,68,68,0.15)'
                  e.currentTarget.style.color = '#f87171'
                  e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.color = '#94a3b8'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                }}
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Đóng chat"
                className="touch-target"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '7px',
                  color: '#94a3b8',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.color = '#94a3b8'
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Message List Area */}
          <div
            className="touch-scroll"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              background:
                'radial-gradient(circle at top right, rgba(99,102,241,0.06) 0%, transparent 60%), radial-gradient(circle at bottom left, rgba(56,189,248,0.04) 0%, transparent 50%)',
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  gap: '0.55rem',
                  alignItems: 'flex-end',
                  justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {/* AI Avatar icon next to assistant messages */}
                {m.role === 'assistant' && (
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      flexShrink: 0,
                      boxShadow: '0 0 10px rgba(99,102,241,0.4)',
                    }}
                  >
                    🤖
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: isMobile ? '86%' : '82%',
                  }}
                >
                  <div
                    style={{
                      padding: '0.8rem 1.05rem',
                      borderRadius:
                        m.role === 'user' ? '16px 16px 3px 16px' : '16px 16px 16px 3px',
                      background:
                        m.role === 'user'
                          ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                          : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${
                        m.role === 'user' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.09)'
                      }`,
                      color: m.role === 'user' ? '#fff' : '#e2e8f0',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      boxShadow:
                        m.role === 'user'
                          ? '0 6px 18px rgba(99,102,241,0.35)'
                          : '0 4px 12px rgba(0,0,0,0.25)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {renderFormattedMessage(m.content)}
                  </div>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.62rem',
                      color: '#64748b',
                      marginTop: '0.25rem',
                      padding: '0 0.35rem',
                    }}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {/* AI Typing Loading Indicator */}
            {loading && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 0.95rem',
                  background: 'rgba(99,102,241,0.12)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  borderRadius: '14px 14px 14px 3px',
                  width: 'fit-content',
                }}
              >
                <span
                  style={{
                    fontSize: '0.74rem',
                    color: '#818cf8',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600,
                  }}
                >
                  AI đang soạn câu trả lời
                </span>
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: '#38bdf8',
                    animation: 'cursorBlink 1s infinite',
                  }}
                />
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: '#818cf8',
                    animation: 'cursorBlink 1s infinite 0.2s',
                  }}
                />
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: '#a78bfa',
                    animation: 'cursorBlink 1s infinite 0.4s',
                  }}
                />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Chips Suggestions */}
          {messages.length <= 2 && (
            <div
              style={{
                padding: '0 1rem 0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                paddingTop: '0.65rem',
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.66rem',
                  color: '#818cf8',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                💡 GỢI Ý CÂU HỎI NHANH:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q.text}
                    onClick={() => handleSend(q.text)}
                    style={{
                      background: 'rgba(99,102,241,0.12)',
                      border: '1px solid rgba(99,102,241,0.3)',
                      borderRadius: '999px',
                      padding: '0.34rem 0.75rem',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.73rem',
                      color: '#dce4f0',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(99,102,241,0.28)'
                      e.currentTarget.style.borderColor = 'rgba(167,139,250,0.6)'
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.transform = 'translate3d(0,-1px,0)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(99,102,241,0.12)'
                      e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'
                      e.currentTarget.style.color = '#dce4f0'
                      e.currentTarget.style.transform = 'translate3d(0,0,0)'
                    }}
                  >
                    <span>{q.icon}</span>
                    <span>{q.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input Bar */}
          <div
            style={{
              padding: '0.8rem 1.1rem',
              paddingBottom: isMobile ? 'calc(0.85rem + var(--sab))' : '0.8rem',
              background: 'rgba(5, 8, 16, 0.98)',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'center' }}>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: '999px',
                  padding: '0.2rem 0.5rem 0.2rem 1rem',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Hỏi AI bất kỳ điều gì về Khoa..."
                  disabled={loading}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '16px', // Prevents iOS Safari auto-zoom
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  aria-label="Gửi tin nhắn"
                  className="touch-target"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background:
                      input.trim() && !loading
                        ? 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)'
                        : 'rgba(255,255,255,0.08)',
                    border: 'none',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: input.trim() && !loading ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                    boxShadow: input.trim() && !loading ? '0 0 14px rgba(99,102,241,0.5)' : 'none',
                  }}
                >
                  ➔
                </button>
              </div>
            </div>

            {/* Sub footer badge */}
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.6rem',
                color: '#64748b',
                textAlign: 'center',
                paddingTop: '2px',
              }}
            >
              ⚡ Powered by Google Gemini AI · Trả lời tự động tức thì
            </div>
          </div>
        </div>
      )}

      {/* ─── Responsive & Animation Styles ─── */}
      <style>{`
        @keyframes bubblePopIn {
          0% {
            opacity: 0;
            transform: translate3d(12px, 12px, 0) scale(0.85);
          }
          60% {
            opacity: 1;
            transform: translate3d(-2px, -2px, 0) scale(1.03);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @media (min-width: 640px) {
          .chat-trigger-container {
            bottom: calc(2rem + var(--sab));
            right: calc(5.4rem + var(--sar));
          }
          .chat-pop-bubble {
            bottom: calc(5.8rem + var(--sab));
            right: calc(5.4rem + var(--sar));
          }
          .chat-bubble-arrow {
            bottom: -9px;
            right: 18px;
            border-width: 9px 9px 0 9px;
            border-color: rgba(99, 102, 241, 0.45) transparent transparent transparent;
          }
          .chat-dialog-window {
            bottom: calc(5.4rem + var(--sab));
            right: calc(2rem + var(--sar));
            width: 400px;
            height: 580px;
            border-radius: 24px;
            animation: chatAppear 0.32s cubic-bezier(0.16, 1, 0.3, 1);
          }
        }

        @media (max-width: 639px) {
          .chat-trigger-container {
            bottom: calc(1.25rem + var(--sab));
            right: calc(1.25rem + var(--sar));
          }
          .chat-pop-bubble {
            bottom: calc(5.2rem + var(--sab));
            right: calc(1.25rem + var(--sar));
          }
          .chat-bubble-arrow {
            bottom: -8px;
            right: 16px;
            border-width: 8px 8px 0 8px;
            border-color: rgba(99, 102, 241, 0.45) transparent transparent transparent;
          }
          .chat-dialog-window {
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 86vh;
            max-height: calc(100dvh - 3.5rem);
            border-radius: 24px 24px 0 0;
            animation: mobileSheetSlideUp 0.32s cubic-bezier(0.16, 1, 0.3, 1);
          }
        }
      `}</style>
    </>
  )
}
