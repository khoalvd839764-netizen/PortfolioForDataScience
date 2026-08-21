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



const EDUCATION = [
  {
    degree: 'Chuyên ngành Data Science & AI',
    school: 'Trường Đại học Giao thông Vận tải TP.HCM (UTH)',
    period: '2024 – Hiện tại',
    status: 'Đang theo học (Năm 2)',
    desc: 'Đang học tập chuyên ngành Data Science & AI tại UTH. Tập trung nghiên cứu về Cấu trúc dữ liệu & Giải thuật C++, Xử lý & Phân tích Dữ liệu với Python và Hệ quản trị Cơ sở Dữ liệu MySQL.',
    badge: 'UTH',
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
              {[['N/A', 'Years exp.'], ['N/A', 'Projects'], ['N/A', 'Certificates'], ['N/A', 'Degrees']].map(([v, l]) => (
                <div key={l} className="glass-card" style={{
                  padding: '0.85rem 0.65rem', borderRadius: 12, textAlign: 'center',
                }}>
                  <div style={{ fontFamily: C.mono, fontWeight: 700, fontSize: '1.2rem', color: '#64748b', lineHeight: 1 }}>{v}</div>
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

/* ─── Projects Section (Pure Coming Soon) ─────────────────────────────────── */
function Projects() {
  return (
    <section id="projects" style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', borderTop: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
      {/* Ambient background glows */}
      <div className="ambient-glow-1" style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 'min(500px, 80vw)', height: 'min(350px, 60vw)', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      <div className="responsive-container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeader
          label="// PROJECTS"
          title="My Projects"
          sub="Các dự án cá nhân & học thuật đang trong quá trình phát triển."
        />

        {/* Pure Aesthetic Coming Soon Box with Rotating Border Beam */}
        <div className="reveal delay-1 glow-card-container" style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="glow-card-inner" style={{
            padding: 'clamp(2.5rem, 5vw, 4.5rem) clamp(1.25rem, 4vw, 3rem)',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            {/* Concentric Pulse Rings with Rocket Icon */}
            <div style={{ position: 'relative', width: 84, height: 84, margin: '0 auto 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Outer pulse ring 1 */}
              <div style={{
                position: 'absolute', inset: -16, borderRadius: '50%',
                border: '1px solid rgba(99,102,241,0.3)',
                animation: 'pulseRing 3s ease-out infinite',
              }} />
              {/* Outer pulse ring 2 */}
              <div style={{
                position: 'absolute', inset: -7, borderRadius: '50%',
                border: '1px solid rgba(167,139,250,0.4)',
                animation: 'pulseRing 3s ease-out infinite 1.5s',
              }} />
              {/* Center glowing circle */}
              <div style={{
                width: 68, height: 68, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(167,139,250,0.3) 100%)',
                border: '1px solid rgba(99,102,241,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 30px rgba(99,102,241,0.4), inset 0 0 15px rgba(167,139,250,0.3)',
              }}>
                <span style={{ fontSize: '1.85rem' }}>🚀</span>
              </div>
            </div>

            {/* Status pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.35)',
              borderRadius: '999px', padding: '0.35rem 1rem', marginBottom: '1.15rem',
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#22c55e', boxShadow: '0 0 10px #22c55e',
                display: 'inline-block',
              }} />
              <span style={{ fontFamily: C.mono, fontSize: '0.72rem', color: '#818cf8', fontWeight: 600, letterSpacing: '0.12em' }}>
                IN ACTIVE DEVELOPMENT
              </span>
            </div>

            {/* Giant Gradient Title */}
            <h3 style={{
              fontFamily: C.display, fontWeight: 900,
              fontSize: 'clamp(2.1rem, 5.5vw, 4rem)',
              lineHeight: 1.1, letterSpacing: '-0.03em',
              marginBottom: '0.85rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 40px rgba(99,102,241,0.3)',
            }}>
              Coming Soon
            </h3>

            <p style={{
              fontFamily: C.body, color: '#94a3b8',
              fontSize: 'clamp(0.92rem, 1.4vw, 1.05rem)',
              lineHeight: 1.75, maxWidth: 520, margin: '0 auto 1.75rem',
            }}>
              Các dự án thực tế đang được hoàn thiện kỹ lưỡng và sẽ sớm ra mắt trong thời gian tới.
            </p>

            {/* Tech badges indicator */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
              {['C++', 'Python', 'MySQL', 'Data Science', 'AI & Machine Learning'].map((t) => (
                <span key={t} style={{
                  fontFamily: C.mono, fontSize: '0.7rem', color: '#cbd5e1',
                  background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`,
                  padding: '0.28rem 0.75rem', borderRadius: 999,
                  letterSpacing: '0.03em'
                }}>
                  ✦ {t}
                </span>
              ))}
            </div>
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

/* ─── Certificates Section ───────────────────────────────────────────────── */
function Certificates() {
  return (
    <section id="certificates" style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', borderTop: `1px solid ${C.border}`, position: 'relative' }}>
      <div className="responsive-container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeader label="// CERTIFICATES" title="Chứng chỉ" sub="Các chứng nhận & chứng chỉ chuyên môn quốc tế." />

        <div className="reveal delay-1 glass-card" style={{
          border: `1px dashed ${C.border}`,
          borderRadius: 18,
          padding: 'clamp(2.2rem, 5vw, 3.2rem) clamp(1.2rem, 4vw, 2rem)',
          textAlign: 'center',
          maxWidth: 620,
          margin: '0 auto',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${C.borderAccent}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
            fontSize: '1.4rem',
            boxShadow: '0 0 20px rgba(99,102,241,0.2)'
          }}>
            📜
          </div>
          <div style={{ fontFamily: C.mono, fontSize: '1.2rem', fontWeight: 700, color: '#dce4f0', marginBottom: '0.4rem' }}>
            None
          </div>
          <p style={{ fontFamily: C.body, color: C.muted, fontSize: '0.86rem', lineHeight: 1.6 }}>
            Chưa cập nhật chứng chỉ — Đang trong lộ trình học tập và chuẩn bị.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─── Contact Section ────────────────────────────────────────────────────── */
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [focus, setFocus] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setSent(false), 3500)
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
              <div style={{ fontFamily: C.mono, color: '#818cf8', fontSize: '0.7rem', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.4rem' }}>RESPONSE TIME</div>
              <div style={{ fontFamily: C.body, color: '#b0bcd4', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Thường phản hồi trong vòng <strong style={{ color: C.text }}>24 giờ</strong> trong ngày làm việc.
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="reveal-right glass-card" onSubmit={handleSubmit} style={{
            display: 'flex', flexDirection: 'column', gap: '1.1rem',
            padding: 'clamp(1.25rem, 4vw, 2rem)', borderRadius: 18,
          }}>
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
                onChange={e => setForm({ ...form, message: e.target.value })}
                onFocus={() => setFocus('message')} onBlur={() => setFocus('')}
              />
            </div>
            <button type="submit" className="touch-target" style={{
              fontFamily: C.body, fontWeight: 700, fontSize: '0.92rem',
              background: sent ? 'rgba(34,197,94,0.2)' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: sent ? '#22c55e' : '#fff',
              border: sent ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.15)',
              padding: '0.9rem', borderRadius: 10, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              boxShadow: sent ? 'none' : `0 0 24px rgba(99,102,241,0.4)`,
            }}>
              {sent ? '✓ Đã gửi thành công!' : 'Gửi tin nhắn →'}
            </button>
          </form>
        </div>
      </div>
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

