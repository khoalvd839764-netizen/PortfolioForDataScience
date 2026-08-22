import React, { useState, useEffect, useMemo, type ReactNode } from 'react'
import ChatWidget from './components/ChatWidget'

/* ─── Data ─────────────────────────────────────────────────────────────── */

const NAV = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Contact', href: '#contact' },
]

const SKILLS = [
  {
    name: 'C++',
    icon: '⚡',
    badge: 'OOP & DSA',
    desc: 'Algorithms, Data Structures & OOP',
    tags: ['Data Structures', 'Algorithms', 'OOP', 'STL'],
    grad: ['#6366f1', '#818cf8'],
  },
  {
    name: 'Python',
    icon: '◉',
    badge: 'Data Science',
    desc: 'Data Processing & Analytics',
    tags: ['Data Science', 'Pandas', 'NumPy', 'OOP'],
    grad: ['#38bdf8', '#6366f1'],
  },
  {
    name: 'MySQL',
    icon: '◈',
    badge: 'Database',
    desc: 'Relational DB & Query Optimization',
    tags: ['RDBMS', 'SQL Queries', 'DB Design', 'Optimization'],
    grad: ['#f59e0b', '#fb923c'],
  },
]

const PROJECTS = [
  {
    id: 'bavame',
    title: 'Hành Trang Của Mẹ & Góc Nhỏ Của Ba',
    subtitle: 'Family Knowledge & Life Hub Platform',
    desc: 'Nền tảng chia sẻ mẹo hay cuộc sống, cẩm nang gia đình, kinh nghiệm nuôi dạy con và lưu giữ những lời dạy yêu thương. Được thiết kế hiện đại, tối ưu PWA trên cả di động và máy tính.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'PWA', 'Vercel'],
    link: 'https://khoalevodang-bavame.vercel.app/',
    featured: true,
    status: 'Đang phát triển',
    startDate: '21/08/2026',
    badge: 'ĐANG PHÁT TRIỂN',
    icon: '🏡',
    grad: ['#f59e0b', '#ec4899', '#6366f1'],
    stats: [
      { label: 'Ngày bắt đầu', value: '21/08/2026' },
      { label: 'Nền tảng', value: 'Web & PWA' },
      { label: 'Trạng thái', value: 'Đang phát triển' },
    ],
  },
]

const EDUCATION = [
  {
    degree: 'Chuyên ngành Data Science & AI',
    school: 'Trường Đại học Giao thông Vận tải TP.HCM (UTH)',
    period: '01/09/2025 – Hiện tại',
    status: 'Đang theo học',
    desc: 'Trúng tuyển và nhập học ngày 01/09/2025, theo học chương trình đào tạo chính quy chuyên ngành Data Science & AI tại UTH. Tập trung nghiên cứu về Cấu trúc dữ liệu & Giải thuật C++, Xử lý & Phân tích Dữ liệu với Python và Hệ quản trị Cơ sở Dữ liệu MySQL.',
    badge: 'UTH',
  },
]

const CERTIFICATES = [
  {
    id: 'cplusplus-essentials-1',
    title: 'C++ Essentials 1',
    issuer: 'Cisco Networking Academy',
    issuerSub: 'C++ Institute · Open Education & Development Group',
    recipient: 'Lê Võ Đăng Khoa',
    issueDate: '22 Aug 2026',
    issueDateVN: '22/08/2026',
    certId: '5af2e763-9146-4b4a-a909-b236739c7c4c',
    verifyUrl: 'https://www.netacad.com/recognitions/verify/5af2e763-9146-4b4a-a909-b236739c7c4c',
    image: '/certificates/cplusplus-essentials-1.webp',
    pngImage: '/certificates/cplusplus-essentials-1.png',
    qrImage: '/certificates/cplusplus-essentials-1-qr-hd.png',
    pdfUrl: '/certificates/cplusplus-essentials-1.pdf',
    signatory: 'Lynn Bloomer (Director, Cisco Networking Academy)',
    badge: 'OFFICIAL CISCO NETACAD',
    statusText: 'Đã xác thực chính thức (Verified)',
    desc: 'Chứng nhận hoàn thành xuất sắc khoá đào tạo C++ Essentials 1 do Cisco Networking Academy phối hợp cùng C++ Institute tổ chức. Khẳng định nền tảng vững vàng về ngôn ngữ C++, tư duy thuật toán, kiểu dữ liệu, luồng điều khiển, hàm, mảng, con trỏ và quản lý bộ nhớ.',
    skills: [
      'C++ Core Syntax',
      'Data Types & Variables',
      'Control Flow & Logic',
      'Functions & Modularity',
      'Pointers & Memory',
      'Arrays & Structures',
    ],
    grad: ['#06b6d4', '#3b82f6', '#6366f1'],
    accentColor: '#06b6d4',
  },
]


/* ─── Shared Styling Constants ───────────────────────────────────────────── */

const C = {
  bg: 'transparent',
  surface: 'rgba(11, 17, 32, 0.62)',
  surfaceHigh: 'rgba(17, 28, 48, 0.78)',
  border: 'rgba(255, 255, 255, 0.09)',
  borderAccent: 'rgba(99, 102, 241, 0.38)',
  text: '#dce4f0',
  muted: '#718096',
  accent: '#6366f1',     // indigo
  accentSoft: 'rgba(99, 102, 241, 0.14)',
  gold: '#f59e0b',
  mono: "'JetBrains Mono', monospace",
  display: "'Outfit', sans-serif",
  heading: "'Outfit', sans-serif",
  body: "'Inter', sans-serif",
}

/* ─── Scroll Progress Bar ────────────────────────────────────────────────── */
function ScrollProgressBar({ progress }: { progress: number }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: '3.5px',
      zIndex: 200, pointerEvents: 'none', background: 'rgba(255,255,255,0.03)'
    }}>
      <div style={{
        height: '100%',
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #38bdf8 0%, #6366f1 40%, #a78bfa 75%, #f43f5e 100%)',
        boxShadow: '0 0 14px rgba(99,102,241,0.8), 0 0 22px rgba(56,189,248,0.5)',
        transition: 'width 0.12s linear',
        position: 'relative',
      }}>
        {progress > 0 && (
          <div style={{
            position: 'absolute', top: -3, right: -4,
            width: 9, height: 9, borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 0 10px #38bdf8, 0 0 18px #6366f1',
          }} />
        )}
      </div>
    </div>
  )
}

/* ─── Scroll To Top Button ───────────────────────────────────────────────── */
function ScrollToTopButton({ show }: { show: boolean }) {
  const [hov, setHov] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <button
        onClick={scrollToTop}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        aria-label="Scroll to top"
        className="scroll-to-top-btn touch-target"
        style={{
          position: 'fixed',
          zIndex: 90,
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: hov ? 'rgba(99,102,241,0.9)' : 'rgba(17,28,48,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: `1px solid ${hov ? '#6366f1' : 'rgba(255,255,255,0.12)'}`,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          opacity: show ? 1 : 0,
          pointerEvents: show ? 'auto' : 'none',
          transform: show ? (hov ? 'translate3d(0,-4px,0)' : 'translate3d(0,0,0)') : 'translate3d(0,16px,0)',
          boxShadow: show ? (hov ? '0 0 20px rgba(99,102,241,0.5)' : '0 4px 16px rgba(0,0,0,0.4)') : 'none',
          transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>

      <style>{`
        @media (min-width: 640px) {
          .scroll-to-top-btn {
            bottom: calc(2rem + var(--sab));
            right: calc(2rem + var(--sar));
          }
        }
        @media (max-width: 639px) {
          .scroll-to-top-btn {
            bottom: calc(5rem + var(--sab));
            right: calc(1.35rem + var(--sar));
          }
        }
      `}</style>
    </>
  )
}


/* ─── Neural Network & Deep Space Canvas Background ─────────────────────── */
function NeuralSpaceBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize, { passive: true })

    // Mouse / Touch coordinates for interactive connection
    const mouse = { x: -1000, y: -1000, radius: width < 640 ? 100 : 140 }
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    // Touch support for mobile / tablet
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX
        mouse.y = e.touches[0].clientY
      }
    }
    const handleTouchEnd = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    window.addEventListener('touchstart', handleTouchMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    // Generate Stars (Adaptive density: fewer on mobile for optimal 60fps & battery)
    const isMobile = width < 640
    const starCount = isMobile ? Math.floor(Math.min(width, height) / 20) : Math.floor(Math.min(width, height) / 12)
    const stars: { x: number; y: number; size: number; alpha: number; speed: number }[] = []
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.4 + 0.4,
        alpha: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.02 + 0.005,
      })
    }

    // Generate Neural Nodes (Adaptive density)
    const nodeCount = isMobile ? 18 : Math.floor(Math.min(width, 1200) / 22)
    const nodes: {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string
    }[] = []

    const colors = ['#6366f1', '#a78bfa', '#38bdf8', '#818cf8']

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.45),
        vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.45),
        radius: Math.random() * 1.8 + 1.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    let tick = 0

    const render = () => {
      tick++
      ctx.clearRect(0, 0, width, height)

      // 1. Draw Twinkling Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]
        const currentAlpha = star.alpha + Math.sin(tick * star.speed) * 0.3
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, currentAlpha))})`
        ctx.fill()
      }

      // 2. Update & Draw Neural Nodes
      const maxConnectDist = isMobile ? 90 : 120
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        node.x += node.vx
        node.y += node.vy

        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1

        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.shadowColor = node.color
        ctx.shadowBlur = 6
        ctx.fill()
        ctx.shadowBlur = 0

        // Connect neighboring nodes (Neural Network Synapses)
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j]
          const dx = node.x - other.x
          const dy = node.y - other.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < maxConnectDist) {
            const alpha = (1 - dist / maxConnectDist) * 0.22
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }

        // Connect node to Pointer / Touch Cursor
        const mdx = node.x - mouse.x
        const mdy = node.y - mouse.y
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mdist < mouse.radius) {
          const mAlpha = (1 - mdist / mouse.radius) * 0.45
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = `rgba(56, 189, 248, ${mAlpha})`
          ctx.lineWidth = 1.1
          ctx.stroke()
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('touchstart', handleTouchMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Deep Space / Cosmic Ambient Backdrops */}
      <div style={{
        position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
        width: 'min(100vw, 1000px)', height: '600px',
        background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(99,102,241,0.14) 0%, rgba(167,139,250,0.07) 45%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '5%',
        width: 'min(90vw, 600px)', height: 'min(90vw, 600px)',
        background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 65%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      {/* Dynamic Starfield & Neural Network Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
        }}
      />
    </div>
  )
}

/* ─── Shared primitives ──────────────────────────────────────────────────── */

function Tag({ children }: { children: ReactNode }) {
  return (
    <span style={{
      fontFamily: C.mono, fontSize: '0.68rem', letterSpacing: '0.04em',
      background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`,
      color: '#8b9bb4', padding: '0.2rem 0.55rem', borderRadius: '4px',
    }}>
      {children}
    </span>
  )
}

function SkillChip({ skill }: { skill: typeof SKILLS[0] }) {
  const [hov, setHov] = useState(false)
  const gradStr = `linear-gradient(135deg, ${skill.grad[0]}, ${skill.grad[1]})`

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: hov ? 'rgba(17,28,48,0.92)' : 'rgba(11,17,32,0.65)',
        border: `1px solid ${hov ? `${skill.grad[0]}60` : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 14,
        padding: 'clamp(0.9rem, 2.5vw, 1.25rem)',
        transition: 'all 0.28s cubic-bezier(0.16,1,0.3,1)',
        transform: hov ? 'translate3d(0,-2px,0)' : 'translate3d(0,0,0)',
        boxShadow: hov ? `0 10px 28px rgba(0,0,0,0.4), 0 0 20px ${skill.grad[0]}22` : '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'default',
      }}
    >
      {/* Glow corner on hover */}
      {hov && (
        <div style={{
          position: 'absolute', top: -30, right: -30, width: 100, height: 100,
          background: `radial-gradient(circle, ${skill.grad[0]}35, transparent 70%)`,
          borderRadius: '50%', pointerEvents: 'none',
        }} />
      )}

      {/* Header: Icon, Name & Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.95rem',
            background: hov ? gradStr : `${skill.grad[0]}18`,
            border: `1px solid ${skill.grad[0]}35`,
            color: hov ? '#fff' : skill.grad[0],
            boxShadow: hov ? `0 0 16px ${skill.grad[0]}55` : 'none',
            transition: 'all 0.25s',
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: C.mono, fontWeight: 700, fontSize: '0.95rem' }}>{skill.icon}</span>
          </div>

          <div>
            <div style={{
              fontFamily: C.display, fontWeight: 700, fontSize: '1rem',
              color: hov ? '#fff' : C.text,
              lineHeight: 1.2,
              transition: 'color 0.25s',
            }}>
              {skill.name}
            </div>
            <div style={{ fontFamily: C.body, fontSize: '0.74rem', color: C.muted, marginTop: '0.15rem' }}>
              {skill.desc}
            </div>
          </div>
        </div>

        {/* Category badge */}
        <span style={{
          fontFamily: C.mono, fontSize: '0.66rem', fontWeight: 600,
          color: skill.grad[0],
          background: `${skill.grad[0]}14`,
          border: `1px solid ${skill.grad[0]}28`,
          padding: '0.2rem 0.5rem', borderRadius: 6,
          letterSpacing: '0.03em',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {skill.badge}
        </span>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
        {skill.tags.map(t => (
          <span key={t} style={{
            fontFamily: C.mono, fontSize: '0.65rem', letterSpacing: '0.02em',
            background: `${skill.grad[0]}10`,
            border: `1px solid ${skill.grad[0]}22`,
            color: hov ? skill.grad[0] : '#94a3b8',
            padding: '0.18rem 0.5rem', borderRadius: 5,
            transition: 'all 0.2s',
          }}>{t}</span>
        ))}
      </div>
    </div>
  )
}

function SectionHeader({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
      <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.65rem' }}>
        <span style={{ fontFamily: C.mono, color: C.accent, fontSize: '0.72rem', letterSpacing: '0.14em' }}>{label}</span>
        <div style={{ height: 1, width: 42, background: C.accent, opacity: 0.4 }} />
      </div>
      <h2 className="reveal delay-1" style={{
        fontFamily: C.display, fontWeight: 800,
        fontSize: 'clamp(1.75rem, 4.5vw, 2.6rem)',
        letterSpacing: '-0.03em', color: C.text, lineHeight: 1.15,
        marginBottom: sub ? '0.65rem' : 0
      }}>
        {title}
      </h2>
      {sub && (
        <p className="reveal delay-2" style={{
          fontFamily: C.body, color: C.muted,
          fontSize: 'clamp(0.88rem, 1.6vw, 0.98rem)',
          maxWidth: '540px', lineHeight: 1.7
        }}>
          {sub}
        </p>
      )}
    </div>
  )
}

/* ─── Navbar ─────────────────────────────────────────────────────────────── */
function NavBar({ activeSection }: { activeSection: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && open) {
        setOpen(false)
      }
    }
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [open])

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {/* Floating pill navbar */}
      <header style={{
        position: 'fixed',
        top: 'calc(0.75rem + var(--sat))',
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        padding: '0 clamp(0.75rem, 3vw, 1.5rem)',
      }}>
        <div style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'rgba(11,17,32,0.92)' : 'rgba(11,17,32,0.72)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: `1px solid ${scrolled ? 'rgba(99,102,241,0.28)' : C.border}`,
          borderRadius: '999px',
          padding: '0.35rem 0.55rem',
          transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)' : '0 4px 16px rgba(0,0,0,0.25)',
          maxWidth: '100%',
        }}>
          {/* Logo */}
          <a href="#about" style={{
            fontFamily: C.mono, fontWeight: 700, fontSize: '0.84rem',
            color: C.accent, letterSpacing: '-0.01em',
            padding: '0.35rem 0.75rem',
            borderRight: `1px solid ${C.border}`,
            marginRight: '0.25rem',
            textDecoration: 'none',
            display: 'flex', alignItems: 'center',
          }}>
            nva<span style={{ color: C.muted, fontWeight: 400 }}>.ai</span>
          </a>

          {/* Nav links — hidden on mobile */}
          <nav className="nav-pills" style={{ display: 'flex', gap: '0.15rem' }}>
            {NAV.map((l) => {
              const isActive = activeSection === l.href.substring(1)
              return (
                <a
                  key={l.href}
                  href={l.href}
                  style={{
                    fontFamily: C.body, fontSize: '0.8rem', fontWeight: 500,
                    color: isActive ? '#fff' : C.muted,
                    textDecoration: 'none', padding: '0.42rem 0.85rem',
                    borderRadius: '999px',
                    background: isActive ? 'rgba(99,102,241,0.2)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(99,102,241,0.35)' : 'transparent'}`,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = C.text
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = C.muted
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {l.label}
                </a>
              )
            })}
          </nav>

          {/* CTA */}
          <a href="#contact" className="nav-cta" style={{
            fontFamily: C.body, fontSize: '0.78rem', fontWeight: 600,
            background: C.accent, color: '#fff',
            padding: '0.42rem 1.05rem', borderRadius: '999px', textDecoration: 'none',
            marginLeft: '0.4rem',
            transition: 'all 0.2s',
            boxShadow: '0 0 16px rgba(99,102,241,0.4)',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.9'
              e.currentTarget.style.transform = 'scale(0.97)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.transform = 'none'
            }}
          >
            Hire me
          </a>

          {/* Mobile burger button with touch-friendly 44px hit area */}
          <button
            onClick={() => setOpen(!open)}
            className="nav-burger touch-target"
            aria-label="Toggle navigation menu"
            style={{
              background: open ? 'rgba(99,102,241,0.2)' : 'transparent',
              border: `1px solid ${open ? 'rgba(99,102,241,0.4)' : 'transparent'}`,
              borderRadius: '999px',
              color: open ? '#fff' : C.text,
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.35rem 0.65rem',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '1.15rem', lineHeight: 1 }}>{open ? '✕' : '☰'}</span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer & Backdrop Overlay */}
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 98,
              background: 'rgba(3, 7, 18, 0.75)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              animation: 'fadeInBackdrop 0.25s ease',
            }}
          />

          <div style={{
            position: 'fixed',
            top: 'calc(4.8rem + var(--sat))',
            left: 'clamp(0.75rem, 4vw, 1.5rem)',
            right: 'clamp(0.75rem, 4vw, 1.5rem)',
            zIndex: 99,
            background: 'rgba(11,17,32,0.96)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: `1px solid ${C.borderAccent}`,
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 48px rgba(0,0,0,0.7), 0 0 30px rgba(99,102,241,0.15)',
            animation: 'mobileMenuSlideDown 0.3s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div style={{ padding: '0.5rem 0' }}>
              {NAV.map((l) => {
                const isActive = activeSection === l.href.substring(1)
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.9rem 1.4rem',
                      fontFamily: C.body,
                      color: isActive ? '#fff' : C.text,
                      background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                      borderLeft: `3px solid ${isActive ? C.accent : 'transparent'}`,
                      fontSize: '0.95rem',
                      fontWeight: isActive ? 600 : 400,
                      textDecoration: 'none',
                      transition: 'background 0.2s',
                    }}
                  >
                    <span>{l.label}</span>
                    {isActive && (
                      <span style={{ fontSize: '0.75rem', color: C.accent, fontFamily: C.mono }}>ACTIVE</span>
                    )}
                  </a>
                )
              })}
            </div>

            <div style={{ padding: '0.75rem 1.25rem 1.25rem', borderTop: `1px solid ${C.border}` }}>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.85rem',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#fff',
                  borderRadius: '12px',
                  fontFamily: C.body,
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
                }}
              >
                Hire me 🚀
              </a>
            </div>
          </div>
        </>
      )}

      <style>{`
        @media (min-width: 768px) {
          .nav-pills { display: flex !important; }
          .nav-cta { display: inline-flex !important; }
          .nav-burger { display: none !important; }
        }
        @media (max-width: 767px) {
          .nav-pills { display: none !important; }
          .nav-cta { display: none !important; }
          .nav-burger { display: flex !important; }
        }
      `}</style>
    </>
  )
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section id="about" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      paddingTop: 'calc(6rem + var(--sat))',
      paddingBottom: 'clamp(3rem, 6vw, 5rem)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle grid background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
        backgroundSize: '64px 64px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
      }} />

      {/* Lightweight GPU-accelerated ambient glows */}
      <div className="ambient-glow-1" style={{
        position: 'absolute', top: '15%', right: '8%', width: 'min(440px, 60vw)', height: 'min(440px, 60vw)',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div className="ambient-glow-2" style={{
        position: 'absolute', bottom: '15%', left: '4%', width: 'min(320px, 50vw)', height: 'min(320px, 50vw)',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="responsive-container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          gap: 'clamp(2.5rem, 5vw, 4rem)',
          alignItems: 'center',
        }}>
          {/* Left info column */}
          <div>
            <div className="reveal" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: C.accentSoft, border: `1px solid ${C.borderAccent}`,
              borderRadius: '999px', padding: '0.3rem 0.95rem', marginBottom: '1.5rem',
            }}>
              <span style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
              <span style={{ fontFamily: C.mono, fontSize: '0.72rem', color: C.accent, letterSpacing: '0.08em' }}>Last Update: 08/2026</span>
            </div>

            <h1 className="reveal delay-1" style={{
              fontFamily: C.display, fontWeight: 800,
              fontSize: 'clamp(2.4rem, 6vw, 4.6rem)',
              lineHeight: 1.08, letterSpacing: '-0.04em', color: C.text, marginBottom: '0.2rem'
            }}>
              Lê Võ
            </h1>
            <h1 className="reveal delay-2" style={{
              fontFamily: C.display, fontWeight: 800,
              fontSize: 'clamp(2.4rem, 6vw, 4.6rem)',
              lineHeight: 1.08, letterSpacing: '-0.04em', marginBottom: '1.15rem'
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>Đăng Khoa</span>
            </h1>

            <div className="reveal delay-2" style={{
              fontFamily: C.body, fontWeight: 500,
              fontSize: 'clamp(0.82rem, 1.4vw, 1rem)',
              color: '#8b9bb4', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.15rem'
            }}>
              Data Scientist &nbsp;·&nbsp; AI Engineer
            </div>

            <p className="reveal delay-3" style={{
              fontFamily: C.body, color: '#8b9bb4',
              fontSize: 'clamp(0.92rem, 1.5vw, 0.98rem)',
              lineHeight: 1.8, maxWidth: 520, marginBottom: '2rem'
            }}>
              I am a sophomore at <strong style={{ color: C.text, fontWeight: 600 }}>University of Transport and Communications HCMC (UTH)</strong>. Passionate about building hands-on applications and AI solutions that directly impact real-world problems, with the goal of contributing to a dynamic, project-driven environment.
            </p>

            {/* Action buttons (fluid and touch friendly) */}
            <div className="reveal delay-4 hero-btn-group" style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '2.25rem' }}>
              <a href="#projects" className="hero-btn touch-target" style={{
                fontFamily: C.body, fontWeight: 600, fontSize: '0.875rem',
                background: C.accent, color: '#fff',
                padding: '0.75rem 1.65rem', borderRadius: '10px', textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: `0 0 24px rgba(99,102,241,0.35)`,
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translate3d(0,-2px,0)'
                  e.currentTarget.style.boxShadow = `0 6px 28px rgba(99,102,241,0.5)`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translate3d(0,0,0)'
                  e.currentTarget.style.boxShadow = `0 0 24px rgba(99,102,241,0.35)`
                }}
              >
                View Projects
              </a>
              <a href="#contact" className="hero-btn touch-target" style={{
                fontFamily: C.body, fontWeight: 600, fontSize: '0.875rem',
                border: `1px solid ${C.border}`, color: C.text,
                padding: '0.75rem 1.65rem', borderRadius: '10px', textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                transition: 'border-color 0.2s, background 0.2s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = C.borderAccent
                  e.currentTarget.style.background = C.accentSoft
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = C.border
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                Contact Me
              </a>
            </div>

            {/* Quick Metrics: Balanced 4-column on desktop/tablet, 2x2 grid on mobile */}
            <div className="reveal delay-5 metrics-grid" style={{
              display: 'grid',
              gap: '0.75rem',
              paddingTop: '1.5rem',
              borderTop: `1px solid ${C.border}`
            }}>
              {[['N/A', 'Years exp.'], ['01', 'Projects'], ['01', 'Certificates'], ['N/A', 'Degrees']].map(([v, l]) => (
                <div key={l} className="glass-card" style={{
                  padding: '0.85rem 0.65rem', borderRadius: 12, textAlign: 'center',
                }}>
                  <div style={{
                    fontFamily: C.mono,
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    color: v === '01' ? '#38bdf8' : '#64748b',
                    lineHeight: 1,
                    textShadow: v === '01' ? '0 0 12px rgba(56,189,248,0.5)' : 'none',
                  }}>{v}</div>
                  <div style={{ fontFamily: C.body, color: C.muted, fontSize: '0.7rem', marginTop: '0.35rem', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill card column with animated glowing border */}
          <div className="reveal-right glow-card-container" style={{ width: '100%' }}>
            <div className="glow-card-inner" style={{ padding: 'clamp(1.1rem, 3vw, 1.6rem)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.15rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#38bdf8)', boxShadow: '0 0 10px #38bdf8' }} />
                  <span style={{ fontFamily: C.mono, color: C.text, fontSize: '0.74rem', letterSpacing: '0.14em', fontWeight: 700 }}>CORE TECH STACK</span>
                </div>
                <span style={{
                  fontFamily: C.mono, fontSize: '0.68rem', color: C.accent,
                  background: C.accentSoft, border: `1px solid ${C.borderAccent}`,
                  padding: '0.2rem 0.6rem', borderRadius: 4, fontWeight: 600,
                }}>
                  3 Core Skills
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {SKILLS.map((s) => (
                  <SkillChip key={s.name} skill={s} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 520px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .hero-btn {
            flex: 1 1 calc(50% - 0.5rem) !important;
            text-align: center;
          }
        }
        @media (min-width: 521px) {
          .metrics-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </section>
  )
}

/* ─── Projects Section ───────────────────────────────────────────────────── */
function Projects() {
  const [featuredHov, setFeaturedHov] = useState(false)

  return (
    <section id="projects" style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', borderTop: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
      {/* Ambient background glows */}
      <div className="ambient-glow-1" style={{
        position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 'min(600px, 85vw)', height: 'min(400px, 65vw)', background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      <div className="responsive-container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeader
          label="// FEATURED PROJECTS"
          title="Dự án của tôi"
          sub="Các sản phẩm, ứng dụng thực tế và dự án học thuật được xây dựng & triển khai trực tiếp."
        />

        {/* 1. Featured Project: Hành Trang Của Mẹ & Góc Nhỏ Của Ba */}
        <div className="reveal delay-1 glow-card-container" style={{ maxWidth: 960, margin: '0 auto 3rem' }}>
          <div className="glow-card-inner" style={{
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            position: 'relative',
          }}>
            {/* Header: Status Pills & Active Development Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: C.mono, fontSize: '0.7rem', fontWeight: 700,
                  color: '#fbbf24',
                  background: 'rgba(245, 158, 11, 0.14)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  padding: '0.25rem 0.75rem', borderRadius: '6px',
                  letterSpacing: '0.06em',
                }}>
                  ✦ DỰ ÁN ĐANG PHÁT TRIỂN
                </span>
                <span style={{
                  fontFamily: C.mono, fontSize: '0.7rem',
                  color: '#94a3b8',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${C.border}`,
                  padding: '0.25rem 0.65rem', borderRadius: '6px',
                }}>
                  Life & Family Hub
                </span>
              </div>

              {/* In Development Status indicator */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                borderRadius: '999px',
                padding: '0.3rem 0.85rem',
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 10px #22c55e',
                  display: 'inline-block',
                }} />
                <span style={{ fontFamily: C.mono, fontSize: '0.72rem', color: '#4ade80', fontWeight: 600, letterSpacing: '0.04em' }}>
                  Đang phát triển · Bắt đầu: 21/08/2026
                </span>
              </div>
            </div>

            {/* Project Content Body */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
              gap: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              alignItems: 'center',
              marginBottom: '1.75rem',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(236,72,153,0.25) 100%)',
                    border: '1px solid rgba(245,158,11,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem', flexShrink: 0,
                  }}>
                    🏡
                  </div>
                  <div>
                    <h3 style={{
                      fontFamily: C.display, fontWeight: 800,
                      fontSize: 'clamp(1.35rem, 3vw, 1.85rem)',
                      lineHeight: 1.2, color: '#fff',
                      letterSpacing: '-0.02em',
                    }}>
                      Hành Trang Của Mẹ & Góc Nhỏ Của Ba
                    </h3>
                  </div>
                </div>

                <div style={{
                  fontFamily: C.mono, fontSize: '0.8rem',
                  color: '#a78bfa', marginBottom: '0.9rem', fontWeight: 500,
                }}>
                  Family Knowledge & Life Hub Platform
                </div>

                <p style={{
                  fontFamily: C.body, color: '#94a3b8',
                  fontSize: 'clamp(0.88rem, 1.5vw, 0.95rem)',
                  lineHeight: 1.75, marginBottom: '1.25rem',
                }}>
                  Nền tảng chia sẻ mẹo hay cuộc sống, cẩm nang gia đình, kinh nghiệm nuôi dạy con và lưu giữ những lời dạy yêu thương. Được thiết kế hiện đại, tối ưu PWA trên cả di động và máy tính.
                </p>

                {/* Tech Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                  {['React', 'TypeScript', 'Tailwind CSS', 'PWA', 'Vercel'].map((t) => (
                    <span key={t} style={{
                      fontFamily: C.mono, fontSize: '0.7rem', color: '#cbd5e1',
                      background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.borderAccent}`,
                      padding: '0.25rem 0.65rem', borderRadius: 6,
                    }}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* Direct Action Link Button */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <a
                    href="https://khoalevodang-bavame.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="touch-target"
                    onMouseEnter={() => setFeaturedHov(true)}
                    onMouseLeave={() => setFeaturedHov(false)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      fontFamily: C.body,
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                      color: '#fff',
                      padding: '0.75rem 1.4rem',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      boxShadow: featuredHov ? '0 8px 24px rgba(236,72,153,0.5)' : '0 4px 16px rgba(99,102,241,0.4)',
                      transform: featuredHov ? 'translate3d(0,-2px,0)' : 'translate3d(0,0,0)',
                      transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                    }}
                  >
                    <span>Truy cập ứng dụng (Đang phát triển)</span>
                    <span style={{ fontSize: '1.1rem' }}>↗</span>
                  </a>
                </div>
              </div>

              {/* Highlights & Metrics Subcard */}
              <div style={{
                background: 'rgba(17, 28, 48, 0.55)',
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}>
                <div style={{ fontFamily: C.mono, fontSize: '0.72rem', color: '#818cf8', fontWeight: 600, letterSpacing: '0.08em' }}>
                  THÔNG TIN DỰ ÁN & CÔNG NGHỆ
                </div>

                {[
                  { icon: '🗓️', title: 'Ngày bắt đầu dự án', desc: '21/08/2026 (Đang tích cực phát triển & hoàn thiện)' },
                  { icon: '📱', title: 'Progressive Web App (PWA)', desc: 'Cài đặt trực tiếp trên iOS/Android như app gốc' },
                  { icon: '⚡', title: 'Vercel Edge Deployment', desc: 'Cập nhật trực tiếp và phản hồi tức thì với CDN' },
                  { icon: '💖', title: 'Gìn giữ yêu thương & lời dạy', desc: 'Chia sẻ kinh nghiệm nuôi dạy và cẩm nang gia đình' },
                ].map((item) => (
                  <div key={item.title} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: '0.1rem' }}>{item.icon}</span>
                    <div>
                      <div style={{ fontFamily: C.body, fontWeight: 600, fontSize: '0.85rem', color: C.text }}>
                        {item.title}
                      </div>
                      <div style={{ fontFamily: C.body, fontSize: '0.75rem', color: C.muted, marginTop: '0.15rem' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Next In Development / Coming Soon Projects */}
        <div className="reveal delay-2 glass-card" style={{
          maxWidth: 960, margin: '0 auto',
          borderRadius: 20,
          padding: 'clamp(2rem, 4vw, 3rem) clamp(1.2rem, 3.5vw, 2.5rem)',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '999px', padding: '0.3rem 0.95rem', marginBottom: '1.15rem',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
            <span style={{ fontFamily: C.mono, fontSize: '0.7rem', color: '#818cf8', fontWeight: 600, letterSpacing: '0.1em' }}>
              UPCOMING AI & DATA SCIENCE PROJECTS
            </span>
          </div>

          <h4 style={{
            fontFamily: C.display, fontWeight: 800,
            fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
            color: '#fff', marginBottom: '0.65rem',
          }}>
            Dự án AI & Khoa học Dữ liệu tiếp theo
          </h4>

          <p style={{
            fontFamily: C.body, color: C.muted,
            fontSize: 'clamp(0.88rem, 1.5vw, 0.95rem)',
            maxWidth: 560, margin: '0 auto 1.5rem', lineHeight: 1.7,
          }}>
            Các dự án chuyên sâu về Machine Learning, C++ DSA Engine và MySQL Database Optimization đang trong lộ trình phát triển và sẽ sớm được công bố.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.45rem' }}>
            {['C++ Engine', 'Python Machine Learning', 'Computer Vision', 'Database Query Optimizer', 'LLM Agent'].map((t) => (
              <span key={t} style={{
                fontFamily: C.mono, fontSize: '0.7rem', color: '#cbd5e1',
                background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`,
                padding: '0.25rem 0.75rem', borderRadius: 999,
              }}>
                ✦ {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


/* ─── Education Section ──────────────────────────────────────────────────── */
function Education() {
  return (
    <section id="education" style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', borderTop: `1px solid ${C.border}`, position: 'relative' }}>
      <div className="responsive-container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeader label="// EDUCATION" title="Học vấn" sub="Quá trình đào tạo đại học chính quy tại Trường Đại học Giao thông Vận tải TP.HCM (UTH)." />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 540px), 1fr))',
          gap: '1.5rem'
        }}>
          {EDUCATION.map((edu, i) => (
            <div key={i} className={`reveal delay-${i + 1} glass-card`} style={{
              borderRadius: 18, padding: 'clamp(1.35rem, 4vw, 2.2rem)', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: 'linear-gradient(90deg, #6366f1, #38bdf8)',
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.65rem' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: C.accentSoft,
                  border: `1px solid ${C.borderAccent}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: C.mono, fontWeight: 700, fontSize: '0.8rem',
                  color: C.accent,
                  flexShrink: 0,
                }}>
                  {edu.badge}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: C.mono, color: C.muted, fontSize: '0.72rem' }}>{edu.period}</div>
                  <div style={{ fontFamily: C.mono, fontWeight: 600, fontSize: '0.82rem', color: '#38bdf8', marginTop: '0.15rem' }}>
                    {edu.status}
                  </div>
                </div>
              </div>

              <h3 style={{ fontFamily: C.display, fontWeight: 700, fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)', color: C.text, marginBottom: '0.35rem' }}>
                {edu.degree}
              </h3>
              <div style={{ fontFamily: C.body, fontSize: '0.92rem', color: C.accent, marginBottom: '1rem', fontWeight: 500 }}>
                {edu.school}
              </div>
              <p style={{ fontFamily: C.body, color: '#8b9bb4', fontSize: '0.88rem', lineHeight: 1.75 }}>
                {edu.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── QR Scanner Cyber HUD Modal ─────────────────────────────────────────── */
function QRScannerModal({
  isOpen,
  onClose,
  cert,
  onOpenFullCert,
}: {
  isOpen: boolean
  onClose: () => void
  cert: (typeof CERTIFICATES)[0]
  onOpenFullCert: () => void
}) {
  const [scanState, setScanState] = useState<'scanning' | 'verified'>('verified')
  const [scanProgress, setScanProgress] = useState(100)
  const [copied, setCopied] = useState(false)

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleRescan = () => {
    setScanState('scanning')
    setScanProgress(0)

    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      if (progress >= 100) {
        clearInterval(interval)
        setScanProgress(100)
        setScanState('verified')
      } else {
        setScanProgress(progress)
      }
    }, 90)
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(cert.certId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.75rem, 3vw, 1.5rem)',
        background: 'rgba(3, 7, 18, 0.88)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        animation: 'fadeInBackdrop 0.25s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 900,
          maxHeight: '92vh',
          overflowY: 'auto',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.96) 0%, rgba(10, 15, 30, 0.98) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.45)',
          borderRadius: 24,
          boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 45px rgba(6, 182, 212, 0.25)',
          padding: 'clamp(1.2rem, 3vw, 2rem)',
          animation: 'chatAppear 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar with Cyberpunk HUD Branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(6, 182, 212, 0.25)',
            paddingBottom: '1rem',
            marginBottom: '1.4rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: scanState === 'scanning' ? '#f59e0b' : '#10b981',
                boxShadow: scanState === 'scanning' ? '0 0 12px #f59e0b' : '0 0 14px #10b981',
                animation: 'hudReticlePulse 1.5s infinite',
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: C.mono,
                  fontSize: '0.72rem',
                  letterSpacing: '0.14em',
                  color: '#06b6d4',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                // CYBER SCANNER HUD · CREDENTIAL VERIFIER
              </div>
              <div
                style={{
                  fontFamily: C.display,
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.01em',
                }}
              >
                Xác thực mã QR Chứng chỉ Cisco NetAcad
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleRescan}
              disabled={scanState === 'scanning'}
              title="Quét lại mã QR"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(6, 182, 212, 0.12)',
                border: '1px solid rgba(6, 182, 212, 0.35)',
                color: '#38bdf8',
                borderRadius: 8,
                padding: '0.45rem 0.8rem',
                fontSize: '0.76rem',
                fontFamily: C.mono,
                fontWeight: 600,
                cursor: scanState === 'scanning' ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: '0.9rem', display: 'inline-block', transform: scanState === 'scanning' ? 'rotate(180deg)' : 'none', transition: 'transform 0.5s' }}>
                ⚡
              </span>
              {scanState === 'scanning' ? `Đang quét (${scanProgress}%)` : 'Quét lại'}
            </button>

            <button
              onClick={onClose}
              aria-label="Đóng"
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.06)',
                border: `1px solid ${C.border}`,
                color: '#94a3b8',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Main Grid: Scanner Viewport (Left) & Decoded Data Report (Right) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '1.4rem',
            alignItems: 'start',
          }}
        >
          {/* Scanner Viewfinder Box */}
          <div
            style={{
              background: 'rgba(5, 10, 20, 0.85)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: 18,
              padding: '1.25rem',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: 'inset 0 0 30px rgba(6, 182, 212, 0.08)',
            }}
          >
            {/* Viewfinder Top Status Readout */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: C.mono,
                fontSize: '0.68rem',
                color: '#64748b',
                marginBottom: '0.8rem',
                padding: '0 0.25rem',
              }}
            >
              <span>[TARGET_LOCK: OK]</span>
              <span style={{ color: scanState === 'scanning' ? '#f59e0b' : '#38bdf8' }}>
                {scanState === 'scanning' ? `[SCANNING ${scanProgress}%]` : '[MATCH: 100%]'}
              </span>
              <span>[FPS: 60]</span>
            </div>

            {/* Viewfinder Target Reticle with QR and Laser Beam */}
            <div
              className="cyber-scanner-grid"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: 260,
                aspectRatio: '1/1',
                background: 'rgba(3, 7, 18, 0.92)',
                border: '1px dashed rgba(6, 182, 212, 0.4)',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.25rem',
                overflow: 'hidden',
              }}
            >
              {/* 4 Cyber Corner Brackets */}
              <div style={{ position: 'absolute', top: 6, left: 6, width: 18, height: 18, borderTop: '3px solid #06b6d4', borderLeft: '3px solid #06b6d4', borderTopLeftRadius: 6 }} />
              <div style={{ position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderTop: '3px solid #06b6d4', borderRight: '3px solid #06b6d4', borderTopRightRadius: 6 }} />
              <div style={{ position: 'absolute', bottom: 6, left: 6, width: 18, height: 18, borderBottom: '3px solid #06b6d4', borderLeft: '3px solid #06b6d4', borderBottomLeftRadius: 6 }} />
              <div style={{ position: 'absolute', bottom: 6, right: 6, width: 18, height: 18, borderBottom: '3px solid #06b6d4', borderRight: '3px solid #06b6d4', borderBottomRightRadius: 6 }} />

              {/* Target Crosshairs */}
              <div style={{ position: 'absolute', top: '50%', left: 10, right: 10, height: 1, background: 'rgba(6, 182, 212, 0.15)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', left: '50%', top: 10, bottom: 10, width: 1, background: 'rgba(6, 182, 212, 0.15)', pointerEvents: 'none' }} />

              {/* QR Image */}
              <div
                style={{
                  position: 'relative',
                  width: '88%',
                  height: '88%',
                  background: '#ffffff',
                  borderRadius: 12,
                  padding: 8,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.6), 0 0 20px rgba(6, 182, 212, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={cert.qrImage}
                  alt={`QR Code verification for ${cert.title}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    imageRendering: 'pixelated',
                  }}
                />

                {/* Animated Laser Scanning Beam */}
                <div className="cyber-laser-beam">
                  <div className="cyber-laser-trail" />
                </div>
              </div>
            </div>

            {/* Viewfinder Bottom Tip */}
            <div
              style={{
                marginTop: '1rem',
                textAlign: 'center',
                fontFamily: C.body,
                fontSize: '0.76rem',
                color: '#94a3b8',
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: '#38bdf8', fontWeight: 600 }}>💡 Mẹo quét thực tế:</span> Bạn có thể dùng camera điện thoại hoặc Zalo để quét trực tiếp mã QR trên màn hình.
            </div>
          </div>

          {/* Decoded Data & Verification Result Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Status Verified Banner */}
            <div
              style={{
                background: scanState === 'scanning' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                border: `1px solid ${scanState === 'scanning' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                borderRadius: 14,
                padding: '0.9rem 1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: scanState === 'scanning' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  flexShrink: 0,
                  boxShadow: scanState === 'scanning' ? '0 0 16px rgba(245, 158, 11, 0.4)' : '0 0 16px rgba(16, 185, 129, 0.4)',
                }}
              >
                {scanState === 'scanning' ? '⏳' : '🛡️'}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: C.mono,
                    fontSize: '0.72rem',
                    letterSpacing: '0.08em',
                    color: scanState === 'scanning' ? '#fbbf24' : '#34d399',
                    fontWeight: 700,
                  }}
                >
                  {scanState === 'scanning' ? 'ĐANG GIẢI MÃ DỮ LIỆU...' : 'CHỨNG NHẬN ĐÃ ĐƯỢC XÁC THỰC (OFFICIAL)'}
                </div>
                <div style={{ fontFamily: C.body, fontSize: '0.84rem', color: '#e2e8f0', marginTop: '0.15rem' }}>
                  {scanState === 'scanning'
                    ? 'Đang đối chiếu thông tin với hệ thống Cisco NetAcad...'
                    : 'Mã QR khớp 100% với dữ liệu chứng chỉ chính thức của Cisco.'}
                </div>
              </div>
            </div>

            {/* Certificate Details Table / Card */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: '1rem 1.15rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: '0.5rem', flexWrap: 'wrap', gap: '0.25rem' }}>
                <span style={{ fontFamily: C.mono, color: C.muted, fontSize: '0.75rem' }}>Họ và tên người nhận:</span>
                <span style={{ fontFamily: C.display, color: '#38bdf8', fontWeight: 700, fontSize: '0.92rem' }}>{cert.recipient}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: '0.5rem', flexWrap: 'wrap', gap: '0.25rem' }}>
                <span style={{ fontFamily: C.mono, color: C.muted, fontSize: '0.75rem' }}>Chứng chỉ hoàn thành:</span>
                <span style={{ fontFamily: C.body, color: '#f8fafc', fontWeight: 600, fontSize: '0.88rem' }}>{cert.title}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: '0.5rem', flexWrap: 'wrap', gap: '0.25rem' }}>
                <span style={{ fontFamily: C.mono, color: C.muted, fontSize: '0.75rem' }}>Tổ chức cấp:</span>
                <span style={{ fontFamily: C.body, color: '#cbd5e1', fontSize: '0.82rem', textAlign: 'right' }}>{cert.issuer}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: '0.5rem', flexWrap: 'wrap', gap: '0.25rem' }}>
                <span style={{ fontFamily: C.mono, color: C.muted, fontSize: '0.75rem' }}>Ngày cấp (Issue Date):</span>
                <span style={{ fontFamily: C.mono, color: '#fbbf24', fontWeight: 600, fontSize: '0.82rem' }}>{cert.issueDate} ({cert.issueDateVN})</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingTop: '0.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: C.mono, color: C.muted, fontSize: '0.75rem' }}>Mã định danh (Cert ID):</span>
                  <button
                    onClick={handleCopyId}
                    style={{
                      background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.07)',
                      border: `1px solid ${copied ? '#10b981' : C.border}`,
                      color: copied ? '#34d399' : '#94a3b8',
                      borderRadius: 6,
                      padding: '0.2rem 0.55rem',
                      fontSize: '0.7rem',
                      fontFamily: C.mono,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {copied ? '✓ Đã sao chép!' : '📋 Sao chép mã'}
                  </button>
                </div>
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(6, 182, 212, 0.25)',
                    borderRadius: 8,
                    padding: '0.45rem 0.75rem',
                    fontFamily: C.mono,
                    fontSize: '0.75rem',
                    color: '#38bdf8',
                    wordBreak: 'break-all',
                    letterSpacing: '0.04em',
                  }}
                >
                  {cert.certId}
                </div>
              </div>
            </div>

            {/* Action Buttons Toolbar inside Modal */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.25rem' }}>
              <a
                href={cert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #6366f1 100%)',
                  color: '#ffffff',
                  borderRadius: 12,
                  padding: '0.8rem 1.4rem',
                  fontFamily: C.body,
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(6, 182, 212, 0.35)',
                  transition: 'all 0.25s',
                  textAlign: 'center',
                }}
              >
                <span>Mở trang xác thực chính thức trên Cisco NetAcad</span>
                <span style={{ fontSize: '1.05rem' }}>↗</span>
              </a>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <button
                  onClick={() => {
                    onClose()
                    onOpenFullCert()
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${C.border}`,
                    color: '#e2e8f0',
                    borderRadius: 10,
                    padding: '0.65rem 0.9rem',
                    fontSize: '0.8rem',
                    fontFamily: C.body,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  📜 Xem bản gốc
                </button>

                <a
                  href={cert.pdfUrl}
                  download
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${C.border}`,
                    color: '#e2e8f0',
                    borderRadius: 10,
                    padding: '0.65rem 0.9rem',
                    fontSize: '0.8rem',
                    fontFamily: C.body,
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  📥 Tải file PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Full Certificate Viewer Modal ──────────────────────────────────────── */
function CertificateModal({
  isOpen,
  onClose,
  cert,
  onOpenScanner,
}: {
  isOpen: boolean
  onClose: () => void
  cert: (typeof CERTIFICATES)[0]
  onOpenScanner: () => void
}) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.5rem, 2vw, 1.5rem)',
        background: 'rgba(3, 7, 18, 0.92)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        animation: 'fadeInBackdrop 0.25s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 1050,
          maxHeight: '94vh',
          overflowY: 'auto',
          background: 'rgba(15, 23, 42, 0.98)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 22,
          boxShadow: '0 25px 70px rgba(0,0,0,0.8), 0 0 40px rgba(99, 102, 241, 0.2)',
          padding: 'clamp(1rem, 2.5vw, 1.6rem)',
          animation: 'chatAppear 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${C.border}`,
            paddingBottom: '0.85rem',
            marginBottom: '1.2rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <div style={{ fontFamily: C.mono, fontSize: '0.72rem', color: '#38bdf8', letterSpacing: '0.12em', fontWeight: 700 }}>
              // OFFICIAL CREDENTIAL · {cert.issuer}
            </div>
            <div style={{ fontFamily: C.display, fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              {cert.title} — {cert.recipient}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                onClose()
                onOpenScanner()
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(6, 182, 212, 0.14)',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                color: '#38bdf8',
                borderRadius: 8,
                padding: '0.45rem 0.85rem',
                fontSize: '0.78rem',
                fontFamily: C.body,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🔍 Mở khung quét QR
            </button>

            <a
              href={cert.pdfUrl}
              download
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: `1px solid ${C.border}`,
                color: '#e2e8f0',
                borderRadius: 8,
                padding: '0.45rem 0.85rem',
                fontSize: '0.78rem',
                fontFamily: C.body,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              📥 Tải PDF
            </a>

            <button
              onClick={onClose}
              aria-label="Đóng"
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.06)',
                border: `1px solid ${C.border}`,
                color: '#94a3b8',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Certificate Image Viewer */}
        <div
          style={{
            position: 'relative',
            borderRadius: 14,
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
            background: '#ffffff',
          }}
        >
          <img
            src={cert.image}
            alt={`${cert.title} Certificate`}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </div>

        {/* Footer info & verify link */}
        <div
          style={{
            marginTop: '1.1rem',
            paddingTop: '0.85rem',
            borderTop: `1px solid ${C.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ fontFamily: C.mono, fontSize: '0.75rem', color: C.muted }}>
            Cert ID: <span style={{ color: '#38bdf8' }}>{cert.certId}</span> · Issue Date: <span style={{ color: '#fbbf24' }}>{cert.issueDate}</span>
          </div>

          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#38bdf8',
              fontFamily: C.body,
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <span>Xác thực trực tuyến tại Cisco NetAcad</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </div>
  )
}

/* ─── Certificates Section ───────────────────────────────────────────────── */
function Certificates() {
  const [activeCert, setActiveCert] = useState<(typeof CERTIFICATES)[0] | null>(null)
  const [scannerOpen, setScannerOpen] = useState(false)
  const [certViewerOpen, setCertViewerOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleOpenScanner = (cert: (typeof CERTIFICATES)[0]) => {
    setActiveCert(cert)
    setScannerOpen(true)
  }

  const handleOpenCertViewer = (cert: (typeof CERTIFICATES)[0]) => {
    setActiveCert(cert)
    setCertViewerOpen(true)
  }

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <section id="certificates" style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', borderTop: `1px solid ${C.border}`, position: 'relative' }}>
      <div className="responsive-container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeader
          label="// CERTIFICATES & VERIFICATION"
          title="Chứng chỉ & Xác thực"
          sub="Các chứng nhận & chứng chỉ chuyên môn quốc tế được xác thực trực tuyến qua mã QR và cổng Cisco NetAcad."
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 1100, margin: '0 auto' }}>
          {CERTIFICATES.map((cert) => (
            <div
              key={cert.id}
              className="reveal delay-1 glow-card-container"
              style={{
                borderRadius: 24,
              }}
            >
              <div
                className="glow-card-inner"
                style={{
                  padding: 'clamp(1.2rem, 3vw, 2rem)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                    alignItems: 'center',
                  }}
                >
                  {/* Left Column: Visual Showcase & Mini Cyber QR Scanner Viewport */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Certificate Thumbnail Preview with Hover Overlay */}
                    <div
                      onClick={() => handleOpenCertViewer(cert)}
                      style={{
                        position: 'relative',
                        borderRadius: 16,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.5)',
                        aspectRatio: '16 / 10.8',
                        background: '#ffffff',
                      }}
                      className="group"
                    >
                      <img
                        src={cert.image}
                        alt={`${cert.title} Preview`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      />
                      {/* Hover Overlay */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(3, 7, 18, 0.55)',
                          backdropFilter: 'blur(3px)',
                          opacity: 0,
                          transition: 'opacity 0.25s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.6rem',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                      >
                        <span
                          style={{
                            background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                            color: '#ffffff',
                            padding: '0.55rem 1.1rem',
                            borderRadius: 10,
                            fontFamily: C.body,
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                          }}
                        >
                          👁 Phóng to chứng chỉ
                        </span>
                      </div>
                    </div>

                    {/* Mini Cyber QR HUD Card below Certificate Image */}
                    <div
                      onClick={() => handleOpenScanner(cert)}
                      style={{
                        background: 'rgba(5, 10, 20, 0.82)',
                        border: '1px solid rgba(6, 182, 212, 0.35)',
                        borderRadius: 14,
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.7)'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.35)'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      {/* Mini QR thumbnail with laser scan */}
                      <div
                        style={{
                          position: 'relative',
                          width: 54,
                          height: 54,
                          borderRadius: 8,
                          background: '#ffffff',
                          padding: 4,
                          flexShrink: 0,
                          overflow: 'hidden',
                          boxShadow: '0 0 14px rgba(6, 182, 212, 0.4)',
                        }}
                      >
                        <img
                          src={cert.qrImage}
                          alt="Mini QR"
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                        <div className="cyber-laser-beam" style={{ height: 2 }} />
                      </div>

                      {/* Text callout */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                          <span style={{ fontFamily: C.mono, fontSize: '0.68rem', color: '#06b6d4', fontWeight: 700, letterSpacing: '0.06em' }}>
                            CYBER QR SCANNER
                          </span>
                        </div>
                        <div style={{ fontFamily: C.display, fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.1rem' }}>
                          Khung quét QR để check
                        </div>
                        <div style={{ fontFamily: C.body, fontSize: '0.72rem', color: C.muted }}>
                          Bấm để mở HUD quét laser & xem kết quả
                        </div>
                      </div>

                      {/* Action Arrow Icon */}
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: 'rgba(6, 182, 212, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#38bdf8',
                          fontSize: '0.9rem',
                          flexShrink: 0,
                        }}
                      >
                        🔍
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Certificate Details, Badges & Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    {/* Issuer & Status Chips */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontFamily: C.mono,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#38bdf8',
                          background: 'rgba(56, 189, 248, 0.12)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          borderRadius: 999,
                          padding: '0.25rem 0.75rem',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {cert.badge}
                      </span>

                      <span
                        style={{
                          fontFamily: C.mono,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#34d399',
                          background: 'rgba(16, 185, 129, 0.12)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          borderRadius: 999,
                          padding: '0.25rem 0.75rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }} />
                        {cert.statusText}
                      </span>

                      <span
                        style={{
                          fontFamily: C.mono,
                          fontSize: '0.7rem',
                          color: '#fbbf24',
                          background: 'rgba(245, 158, 11, 0.1)',
                          border: '1px solid rgba(245, 158, 11, 0.25)',
                          borderRadius: 999,
                          padding: '0.25rem 0.75rem',
                        }}
                      >
                        📅 {cert.issueDate}
                      </span>
                    </div>

                    {/* Certificate Main Title & Organization */}
                    <div>
                      <h3
                        style={{
                          fontFamily: C.display,
                          fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)',
                          fontWeight: 900,
                          lineHeight: 1.15,
                          background: 'linear-gradient(135deg, #ffffff 30%, #38bdf8 75%, #818cf8 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {cert.title}
                      </h3>
                      <div
                        style={{
                          fontFamily: C.mono,
                          fontSize: '0.82rem',
                          color: '#94a3b8',
                          marginTop: '0.35rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span>Cấp bởi:</span>
                        <strong style={{ color: '#e2e8f0' }}>{cert.issuer}</strong>
                        <span>·</span>
                        <span style={{ color: '#06b6d4' }}>{cert.issuerSub}</span>
                      </div>
                    </div>

                    {/* Recipient & Cert ID Bar */}
                    <div
                      style={{
                        background: 'rgba(15, 23, 42, 0.65)',
                        border: `1px solid ${C.border}`,
                        borderRadius: 12,
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.6rem',
                      }}
                    >
                      <div>
                        <div style={{ fontFamily: C.mono, fontSize: '0.68rem', color: C.muted }}>NGƯỜI NHẬN</div>
                        <div style={{ fontFamily: C.display, fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
                          {cert.recipient}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div>
                          <div style={{ fontFamily: C.mono, fontSize: '0.68rem', color: C.muted, textAlign: 'right' }}>CERT ID</div>
                          <div style={{ fontFamily: C.mono, fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                            {cert.certId.slice(0, 16)}...
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy(cert.certId)}
                          title="Sao chép toàn bộ mã Cert ID"
                          style={{
                            background: copiedId === cert.certId ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                            border: `1px solid ${copiedId === cert.certId ? '#10b981' : C.border}`,
                            color: copiedId === cert.certId ? '#34d399' : '#cbd5e1',
                            borderRadius: 8,
                            padding: '0.35rem 0.6rem',
                            fontSize: '0.72rem',
                            fontFamily: C.mono,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          {copiedId === cert.certId ? '✓ Đã chép' : '📋 Copy'}
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{ fontFamily: C.body, color: '#94a3b8', fontSize: '0.86rem', lineHeight: 1.65 }}>
                      {cert.desc}
                    </p>

                    {/* Skills Tags */}
                    <div>
                      <div style={{ fontFamily: C.mono, fontSize: '0.7rem', color: C.muted, marginBottom: '0.45rem', letterSpacing: '0.06em' }}>
                        KỸ NĂNG & KIẾN THỨC ĐẠT ĐƯỢC:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {cert.skills.map((skill) => (
                          <span
                            key={skill}
                            style={{
                              fontFamily: C.mono,
                              fontSize: '0.72rem',
                              color: '#cbd5e1',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: `1px solid ${C.border}`,
                              borderRadius: 8,
                              padding: '0.22rem 0.6rem',
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons Toolbar */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        flexWrap: 'wrap',
                        paddingTop: '0.4rem',
                        borderTop: `1px solid ${C.border}`,
                      }}
                    >
                      {/* Button 1: Open Cyber QR Scanner Modal */}
                      <button
                        onClick={() => handleOpenScanner(cert)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #6366f1 100%)',
                          color: '#ffffff',
                          borderRadius: 12,
                          padding: '0.7rem 1.25rem',
                          fontFamily: C.body,
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 8px 20px rgba(6, 182, 212, 0.35)',
                          transition: 'all 0.25s',
                        }}
                      >
                        <span>🔍 Khung quét QR để check</span>
                      </button>

                      {/* Button 2: View Full Certificate */}
                      <button
                        onClick={() => handleOpenCertViewer(cert)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          background: 'rgba(255, 255, 255, 0.07)',
                          border: `1px solid ${C.border}`,
                          color: '#e2e8f0',
                          borderRadius: 12,
                          padding: '0.7rem 1.1rem',
                          fontFamily: C.body,
                          fontWeight: 600,
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <span>📜 Xem bản gốc</span>
                      </button>

                      {/* Button 3: Direct Official Cisco Link */}
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: 'transparent',
                          border: '1px solid rgba(6, 182, 212, 0.3)',
                          color: '#38bdf8',
                          borderRadius: 12,
                          padding: '0.7rem 1rem',
                          fontFamily: C.body,
                          fontWeight: 600,
                          fontSize: '0.84rem',
                          textDecoration: 'none',
                          transition: 'all 0.2s',
                        }}
                      >
                        <span>Xác thực Cisco</span>
                        <span>↗</span>
                      </a>

                      {/* Button 4: Download PDF */}
                      <a
                        href={cert.pdfUrl}
                        download
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: `1px solid ${C.border}`,
                          color: '#94a3b8',
                          borderRadius: 12,
                          padding: '0.7rem 0.95rem',
                          fontFamily: C.body,
                          fontWeight: 500,
                          fontSize: '0.84rem',
                          textDecoration: 'none',
                          transition: 'all 0.2s',
                        }}
                      >
                        <span>📥 PDF</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Scanner Cyber HUD Modal */}
      {activeCert && (
        <QRScannerModal
          isOpen={scannerOpen}
          onClose={() => setScannerOpen(false)}
          cert={activeCert}
          onOpenFullCert={() => setCertViewerOpen(true)}
        />
      )}

      {/* Full Certificate Lightbox Modal */}
      {activeCert && (
        <CertificateModal
          isOpen={certViewerOpen}
          onClose={() => setCertViewerOpen(false)}
          cert={activeCert}
          onOpenScanner={() => setScannerOpen(true)}
        />
      )}
    </section>
  )
}


/* ─── Contact Section ────────────────────────────────────────────────────── */
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [submittedData, setSubmittedData] = useState<{ name: string; email: string } | null>(null)
  const [focus, setFocus] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    setStatusMsg(null)

    const senderName = form.name.trim()
    const senderEmail = form.email.trim()

    try {
      const accessKey =
        import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ||
        '23f28cfa-5bdd-42aa-b4ea-b3a46f2ffcbc'

      const formData = new FormData()
      formData.append('access_key', accessKey)
      formData.append('name', senderName)
      formData.append('email', senderEmail)
      formData.append('message', form.message)
      formData.append('subject', `🔔 [Portfolio Contact] Tin nhắn mới từ ${senderName}`)
      formData.append('from_name', 'Lê Võ Đăng Khoa Portfolio')
      formData.append('replyto', senderEmail)

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setSubmittedData({ name: senderName, email: senderEmail })
        setShowSuccessModal(true)
        setStatusMsg({
          type: 'success',
          text: '✓ Tin nhắn đã được gửi thành công! Khoa sẽ phản hồi bạn qua email trong vòng 24 giờ.',
        })
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatusMsg({
          type: 'error',
          text: data.message || 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại!',
        })
      }
    } catch (err) {
      console.error('Contact submission error:', err)
      setStatusMsg({
        type: 'error',
        text: 'Không thể kết nối đến máy chủ gửi email. Vui lòng gửi email trực tiếp tới khoalevodang301007@gmail.com!',
      })
    } finally {
      setLoading(false)
    }
  }

  const field = (id: string): React.CSSProperties => ({
    background: focus === id ? 'rgba(17,28,48,0.85)' : 'rgba(11,17,32,0.6)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: `1px solid ${focus === id ? C.borderAccent : C.border}`,
    borderRadius: 10, padding: '0.85rem 1.1rem',
    color: C.text, fontFamily: C.body,
    fontSize: '16px', // Prevents iOS Safari auto-zoom on mobile inputs
    width: '100%', outline: 'none', transition: 'all 0.25s ease',
    boxShadow: focus === id ? '0 0 16px rgba(99,102,241,0.2)' : 'none',
  })

  return (
    <section id="contact" style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', borderTop: `1px solid ${C.border}`, position: 'relative' }}>
      <div className="responsive-container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeader label="// CONTACT" title="Liên hệ" sub="Có dự án thú vị? Hãy cùng trao đổi." />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: 'clamp(2rem, 5vw, 3.5rem)',
          alignItems: 'start',
        }}>
          {/* Info */}
          <div className="reveal-left">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
              {[
                { icon: '✉', label: 'Email', val: 'khoalevodang301007@gmail.com', href: 'mailto:khoalevodang301007@gmail.com' },
                { icon: '📍', label: 'Location', val: 'TPHCM, Việt Nam', href: undefined },
                { icon: '💼', label: 'LinkedIn', val: 'Update later', href: undefined },
                { icon: '⌨', label: 'GitHub', val: 'github.com/khoalvd839764-netizen', href: 'https://github.com/khoalvd839764-netizen' },
              ].map((info) => (
                <div key={info.label} className="glass-card" style={{
                  display: 'flex', gap: '0.9rem', alignItems: 'center',
                  padding: '0.95rem 1.15rem', borderRadius: 14
                }}>
                  <span style={{ fontSize: '1.15rem', flexShrink: 0, opacity: 0.9 }}>{info.icon}</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontFamily: C.mono, color: C.muted, fontSize: '0.65rem', letterSpacing: '0.1em', marginBottom: '0.15rem' }}>{info.label.toUpperCase()}</div>
                    {info.href ? (
                      <a href={info.href} target="_blank" rel="noopener noreferrer" className="break-words-anywhere" style={{
                        fontFamily: C.body, color: '#c4d1e6', fontSize: '0.88rem', textDecoration: 'none', transition: 'color 0.2s',
                        display: 'block',
                      }}
                        onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
                        onMouseLeave={e => (e.currentTarget.style.color = '#c4d1e6')}
                      >
                        {info.val}
                      </a>
                    ) : (
                      <div className="break-words-anywhere" style={{ fontFamily: C.body, color: '#c4d1e6', fontSize: '0.88rem' }}>{info.val}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card" style={{
              background: 'rgba(99,102,241,0.12)', border: `1px solid ${C.borderAccent}`,
              borderRadius: 14, padding: '1.25rem 1.4rem',
            }}>
              <div style={{ fontFamily: C.mono, color: '#818cf8', fontSize: '0.7rem', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.4rem' }}>AUTOMATED RESPONSE</div>
              <div style={{ fontFamily: C.body, color: '#b0bcd4', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Hệ thống tự động chuyển thông tin về Gmail của Khoa và Khoa sẽ phản hồi trực tiếp tới bạn trễ nhất trong vòng <strong style={{ color: C.text }}>24 giờ</strong>.
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="reveal-right glass-card" onSubmit={handleSubmit} style={{
            display: 'flex', flexDirection: 'column', gap: '1.1rem',
            padding: 'clamp(1.25rem, 4vw, 2rem)', borderRadius: 18,
          }}>
            {/* Status notification banner */}
            {statusMsg && (
              <div style={{
                padding: '0.85rem 1.1rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontFamily: C.body,
                lineHeight: 1.5,
                background: statusMsg.type === 'success' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                border: `1px solid ${statusMsg.type === 'success' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                color: statusMsg.type === 'success' ? '#4ade80' : '#f87171',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <span>{statusMsg.text}</span>
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
              gap: '1rem'
            }}>
              {(['name', 'email'] as const).map((f) => (
                <div key={f}>
                  <label style={{ fontFamily: C.mono, color: C.muted, fontSize: '0.67rem', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>
                    {f.toUpperCase()}
                  </label>
                  <input style={field(f)} value={form[f]}
                    type={f === 'email' ? 'email' : 'text'}
                    placeholder={f === 'name' ? 'Họ và tên' : 'email@example.com'}
                    required
                    disabled={loading}
                    onChange={e => setForm({ ...form, [f]: e.target.value })}
                    onFocus={() => setFocus(f)} onBlur={() => setFocus('')}
                  />
                </div>
              ))}
            </div>
            <div>
              <label style={{ fontFamily: C.mono, color: C.muted, fontSize: '0.67rem', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>MESSAGE</label>
              <textarea style={{ ...field('message'), resize: 'vertical', minHeight: 140 }}
                value={form.message} placeholder="Nội dung tin nhắn..." required
                disabled={loading}
                onChange={e => setForm({ ...form, message: e.target.value })}
                onFocus={() => setFocus('message')} onBlur={() => setFocus('')}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="touch-target"
              style={{
                fontFamily: C.body, fontWeight: 700, fontSize: '0.92rem',
                background: loading
                  ? 'rgba(99,102,241,0.5)'
                  : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '0.9rem', borderRadius: 10,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: `0 0 24px rgba(99,102,241,0.4)`,
              }}
            >
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, border: '2px solid #ffffff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                  <span>Đang gửi email...</span>
                </>
              ) : (
                'Gửi tin nhắn →'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ─── Luxury Success Pop-up Modal ─── */}
      {showSuccessModal && (
        <div
          onClick={() => setShowSuccessModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            padding: '1.25rem',
            animation: 'fadeInBackdrop 0.25s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '520px',
              width: '100%',
              background: 'rgba(11, 17, 32, 0.96)',
              backdropFilter: 'blur(28px) saturate(190%)',
              WebkitBackdropFilter: 'blur(28px) saturate(190%)',
              border: '1px solid rgba(99, 102, 241, 0.5)',
              borderRadius: '24px',
              padding: 'clamp(1.5rem, 5vw, 2.25rem)',
              boxShadow: '0 28px 70px rgba(0,0,0,0.85), 0 0 50px rgba(99,102,241,0.3)',
              textAlign: 'center',
              animation: 'chatAppear 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Top Close Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              aria-label="Đóng pop-up"
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s',
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

            {/* Glowing Success Badge Icon */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(34,197,94,0.25), rgba(56,189,248,0.25))',
                border: '2px solid rgba(34,197,94,0.6)',
                boxShadow: '0 0 28px rgba(34,197,94,0.4)',
                fontSize: '1.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              ✨
            </div>

            {/* Modal Title */}
            <h3
              style={{
                fontFamily: C.display,
                fontSize: 'clamp(1.2rem, 3.5vw, 1.45rem)',
                fontWeight: 800,
                color: '#ffffff',
                margin: '0 0 0.75rem',
                letterSpacing: '-0.01em',
              }}
            >
              Tin nhắn đã được gửi thành công!
            </h3>

            {/* Modal Description */}
            <div
              style={{
                fontFamily: C.body,
                fontSize: '0.92rem',
                lineHeight: 1.65,
                color: '#cbd5e1',
                textAlign: 'left',
                margin: '0 0 1.25rem',
              }}
            >
              <p style={{ margin: '0 0 0.5rem' }}>
                Xin chào <strong style={{ color: '#38bdf8' }}>{submittedData?.name || 'bạn'}</strong>,
              </p>
              <p style={{ margin: '0 0 0.65rem' }}>
                Tin nhắn của bạn đã được chuyển trực tiếp đến email của Khoa (
                <span style={{ color: '#818cf8', fontWeight: 600 }}>khoalevodang301007@gmail.com</span>).
              </p>
              <p style={{ margin: 0 }}>
                Khoa sẽ đọc kỹ nội dung và <strong style={{ color: '#4ade80' }}>phản hồi trễ nhất trong vòng 24 giờ</strong> qua địa chỉ email bạn đã nhập:
              </p>
            </div>

            {/* Highlighted Sender Email Pill */}
            <div
              style={{
                background: 'rgba(99,102,241,0.14)',
                border: '1px solid rgba(99,102,241,0.4)',
                borderRadius: '12px',
                padding: '0.85rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                marginBottom: '1.25rem',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>✉️</span>
              <span
                className="break-words-anywhere"
                style={{
                  fontFamily: C.mono,
                  color: '#38bdf8',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                }}
              >
                {submittedData?.email}
              </span>
            </div>

            {/* Additional Response Guarantees */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                fontSize: '0.78rem',
                color: '#94a3b8',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                textAlign: 'left',
                marginBottom: '1.4rem',
                fontFamily: C.body,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ color: '#22c55e', fontWeight: 'bold' }}>✓</span>
                <span>Đã lưu trữ tin nhắn an toàn & thông báo trực tiếp đến hộp thư</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>⏱</span>
                <span>Thời gian phản hồi cam kết: <strong>Tối đa 24 giờ làm việc</strong></span>
              </div>
            </div>

            {/* Action CTA Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="touch-target"
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
                border: '1px solid rgba(255,255,255,0.2)',
                fontWeight: 700,
                fontSize: '0.95rem',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                boxShadow: '0 8px 24px rgba(99,102,241,0.45)',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translate3d(0,-2px,0) scale(1.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translate3d(0,0,0) scale(1)')}
            >
              <span>Đã hiểu & Đóng thông báo</span>
              <span>✨</span>
            </button>
          </div>
        </div>
      )}
    </section>
  )
}


/* ─── Footer ─────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{
      borderTop: `1px solid ${C.border}`,
      padding: 'clamp(1.5rem, 3vw, 2.25rem) 0',
      paddingBottom: 'calc(clamp(1.5rem, 3vw, 2.25rem) + var(--sab))',
      background: 'rgba(5, 8, 15, 0.75)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="responsive-container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div style={{ fontFamily: C.mono, fontSize: '0.75rem', color: C.muted }}>
          © {new Date().getFullYear()} Lê Võ Đăng Khoa — Data Scientist & AI Engineer
        </div>
        <div style={{ display: 'flex', gap: 'clamp(1rem, 3vw, 1.5rem)', flexWrap: 'wrap' }}>
          {['GitHub', 'LinkedIn', 'Kaggle', 'HuggingFace'].map(s => (
            <a key={s} href="#" style={{ fontFamily: C.body, fontSize: '0.8rem', color: C.muted, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = C.text)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
            >{s}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}

/* ─── App ────────────────────────────────────────────────────────────────── */
export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [activeSection, setActiveSection] = useState('about')

  // Unified high-performance scroll & IntersectionObserver manager
  useEffect(() => {
    // 1. Reveal observer (single observer for entire page)
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            revealObs.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.12 }
    )
    revealEls.forEach((el) => revealObs.observe(el))

    // 2. Section spy observer for navbar
    const sectionIds = ['about', 'projects', 'education', 'certificates', 'contact']
    const sectionEls = sectionIds.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const sectionObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.target.id) {
            setActiveSection(e.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    )
    sectionEls.forEach(el => sectionObs.observe(el))

    // 3. Scroll progress & back-to-top button
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight
          const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0
          setScrollProgress(progress)
          setShowScrollTop(window.scrollY > 320)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      revealObs.disconnect()
      sectionObs.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div style={{ background: C.bg, minHeight: '100vh', position: 'relative' }}>
      <NeuralSpaceBackground />
      <ScrollProgressBar progress={scrollProgress} />
      <NavBar activeSection={activeSection} />
      <Hero />
      <Projects />
      <Education />
      <Certificates />
      <Contact />
      <Footer />
      <ChatWidget />
      <ScrollToTopButton show={showScrollTop} />
    </div>
  )
}

