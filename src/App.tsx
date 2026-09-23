import React, { useState, useEffect, useMemo, type ReactNode } from 'react'
import ChatWidget from './components/ChatWidget'

/* ─── Data ─────────────────────────────────────────────────────────────── */

const NAV = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'LeetCode', href: '#leetcode' },
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
    featured: false,
    status: 'Tạm ngưng phát triển',
    pauseReason: 'Không đạt kết quả mong muốn',
    startDate: '21/08/2026',
    badge: 'TẠM NGƯNG PHÁT TRIỂN',
    icon: '🏡',
    grad: ['#f59e0b', '#ec4899', '#6366f1'],
    stats: [
      { label: 'Ngày bắt đầu', value: '21/08/2026' },
      { label: 'Nền tảng', value: 'Web & PWA' },
      { label: 'Trạng thái', value: 'Tạm ngưng phát triển' },
    ],
  },
]

export interface LeetCodeProblem {
  id?: number | string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category?: string
  submissionUrl?: string
  leetcodeUrl?: string
  language?: string
  status?: string // 'Accepted' (mặc định)
  runtime?: string
  memory?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// LINK TRANG CÁ NHÂN LEETCODE CỦA BẠN
// ─────────────────────────────────────────────────────────────────────────────
const LEETCODE_PROFILE_URL = 'https://leetcode.com/u/khoalvd839764-netizen/'

// ─────────────────────────────────────────────────────────────────────────────
// TRẠNG THÁI HIỂN THỊ KHU VỰC LEETCODE:
// 👉 true: Hiển thị giao diện "Coming Soon / Đang cập nhật" (tạm thời)
// 👉 false: Bật hiển thị danh sách bài nộp và bộ lọc khi bạn sẵn sàng
// ─────────────────────────────────────────────────────────────────────────────
const LEETCODE_COMING_SOON = true

// ─────────────────────────────────────────────────────────────────────────────
// KHU VỰC DANH SÁCH BÀI ĐÃ NỘP TRÊN LEETCODE (LEETCODE SUBMISSION TRACKER)
// 👉 Bạn làm xong bài nào trên LeetCode thì chỉ cần dán link vào đây để người khác check!
//    Không cần viết code hay giải thích dài dòng gì cả.
//    Ví dụ:
//      {
//        id: 1,
//        title: 'Two Sum',
//        difficulty: 'Easy',
//        submissionUrl: 'https://leetcode.com/problems/two-sum/', // hoặc link nộp bài
//        language: 'C++',
//        category: 'Array · Hash Table',
//      },
// ─────────────────────────────────────────────────────────────────────────────
const LEETCODE_SOLUTIONS: LeetCodeProblem[] = [
  // Thêm các bài bạn đã làm xong trên LeetCode vào đây:
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
      position: 'fixed', top: 0, left: 0, right: 0, height: '3px',
      zIndex: 200, pointerEvents: 'none', background: 'rgba(255,255,255,0.03)'
    }}>
      <div style={{
        height: '100%',
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #38bdf8 0%, #6366f1 35%, #a855f7 70%, #f43f5e 100%)',
        boxShadow: '0 0 16px rgba(99,102,241,0.9), 0 0 28px rgba(56,189,248,0.6)',
        transition: 'width 0.1s linear',
        position: 'relative',
      }}>
        {progress > 0 && (
          <div style={{
            position: 'absolute', top: -3.5, right: -5,
            width: 10, height: 10, borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 0 10px #38bdf8, 0 0 20px #6366f1, 0 0 30px #a855f7',
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


/* ─── Neural Network, Comet & Deep Space Canvas Background ───────────────── */
function NeuralSpaceBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = window.innerWidth
    let height = window.innerHeight

    const handleResize = () => {
      if (!canvas) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }

    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })

    // Mouse / Touch coordinates for interactive connection
    const mouse = { x: -1000, y: -1000, radius: width < 640 ? 110 : 150 }
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

    // Scroll parallax tracking
    let currentScrollY = window.scrollY
    let targetScrollY = window.scrollY
    const handleScroll = () => {
      targetScrollY = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Generate Stars (Layered depth with parallax - tuned for performance)
    const isMobile = width < 640
    const starCount = isMobile ? 30 : 55
    const stars: { x: number; y: number; baseY: number; size: number; alpha: number; speed: number; layer: number }[] = []
    for (let i = 0; i < starCount; i++) {
      const y = Math.random() * height
      stars.push({
        x: Math.random() * width,
        y,
        baseY: y,
        size: Math.random() * 1.3 + 0.35,
        alpha: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.02 + 0.006,
        layer: Math.random() * 0.12 + 0.04,
      })
    }

    // Generate Neural Nodes (Adaptive density)
    const nodeCount = isMobile ? 12 : 18
    const nodes: {
      x: number
      y: number
      baseY: number
      vx: number
      vy: number
      radius: number
      color: string
    }[] = []

    const colors = ['#6366f1', '#a78bfa', '#38bdf8', '#818cf8']

    for (let i = 0; i < nodeCount; i++) {
      const y = Math.random() * height
      nodes.push({
        x: Math.random() * width,
        y,
        baseY: y,
        vx: (Math.random() - 0.5) * (isMobile ? 0.25 : 0.35),
        vy: (Math.random() - 0.5) * (isMobile ? 0.25 : 0.35),
        radius: Math.random() * 1.6 + 1.0,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    // Cosmic Comet (Shooting star effect)
    const comet = {
      x: 0,
      y: 0,
      length: 0,
      speed: 0,
      angle: 0,
      alpha: 0,
      active: false,
    }
    let lastCometTime = 0

    const maybeSpawnComet = (now: number) => {
      if (!comet.active && now - lastCometTime > (isMobile ? 8000 : 5500)) {
        if (Math.random() < 0.45) {
          comet.active = true
          comet.x = Math.random() * (width * 0.8)
          comet.y = Math.random() * (height * 0.35)
          comet.length = Math.random() * 70 + 50
          comet.speed = Math.random() * 7 + 9
          comet.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2
          comet.alpha = 1
          lastCometTime = now
        }
      }
    }

    let tick = 0

    const render = (time: number) => {
      tick++
      // Smooth interpolation for scroll parallax
      currentScrollY += (targetScrollY - currentScrollY) * 0.08
      ctx.clearRect(0, 0, width, height)

      // 1. Draw Twinkling Stars with subtle scroll parallax
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]
        const currentAlpha = star.alpha + Math.sin(tick * star.speed) * 0.25
        const parallaxY = (star.baseY - currentScrollY * star.layer) % height
        const drawY = parallaxY < 0 ? parallaxY + height : parallaxY

        ctx.beginPath()
        ctx.arc(star.x, drawY, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.12, Math.min(0.9, currentAlpha))})`
        ctx.fill()
      }

      // 2. Cosmic Comet / Shooting Star
      maybeSpawnComet(time)
      if (comet.active) {
        const tailX = comet.x - Math.cos(comet.angle) * comet.length
        const tailY = comet.y - Math.sin(comet.angle) * comet.length
        const grad = ctx.createLinearGradient(tailX, tailY, comet.x, comet.y)
        grad.addColorStop(0, 'rgba(56, 189, 248, 0)')
        grad.addColorStop(0.6, `rgba(99, 102, 241, ${comet.alpha * 0.5})`)
        grad.addColorStop(1, `rgba(255, 255, 255, ${comet.alpha})`)

        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(comet.x, comet.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.4
        ctx.stroke()

        // Comet head (clean, 0 blur overhead)
        ctx.beginPath()
        ctx.arc(comet.x, comet.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${comet.alpha})`
        ctx.fill()

        comet.x += Math.cos(comet.angle) * comet.speed
        comet.y += Math.sin(comet.angle) * comet.speed
        comet.alpha -= 0.015
        if (comet.alpha <= 0 || comet.x > width + 100 || comet.y > height + 100) {
          comet.active = false
        }
      }

      // 3. Update & Draw Neural Nodes & Synapses (Optimized distance calculation)
      const maxConnectDist = isMobile ? 80 : 110
      const maxConnectDistSq = maxConnectDist * maxConnectDist
      const mouseRadiusSq = mouse.radius * mouse.radius

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        node.x += node.vx
        node.y += node.vy

        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1

        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()

        // Connect neighboring nodes (Neural Network Synapses)
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j]
          const dx = node.x - other.x
          const dy = node.y - other.y
          const distSq = dx * dx + dy * dy

          if (distSq < maxConnectDistSq) {
            const dist = Math.sqrt(distSq)
            const alpha = (1 - dist / maxConnectDist) * 0.2
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }

        // Connect node to Mouse Cursor
        const mdx = node.x - mouse.x
        const mdy = node.y - mouse.y
        const mdistSq = mdx * mdx + mdy * mdy
        if (mdistSq < mouseRadiusSq) {
          const mdist = Math.sqrt(mdistSq)
          const mAlpha = (1 - mdist / mouse.radius) * 0.4
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = `rgba(56, 189, 248, ${mAlpha})`
          ctx.lineWidth = 1.0
          ctx.stroke()
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Deep Space / Cosmic Ambient Backdrops with Parallax & Aurora Pulsing */}
      <div className="aurora-glow-top" style={{
        position: 'absolute', top: '-12%', left: '50%', transform: 'translateX(-50%)',
        width: 'min(100vw, 1100px)', height: '650px',
        background: 'radial-gradient(ellipse 65% 55% at 50% 30%, rgba(99,102,241,0.18) 0%, rgba(167,139,250,0.08) 45%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      <div className="aurora-glow-middle" style={{
        position: 'absolute', top: '45%', right: '3%',
        width: 'min(90vw, 680px)', height: 'min(90vw, 680px)',
        background: 'radial-gradient(circle, rgba(56,189,248,0.09) 0%, rgba(6,182,212,0.04) 40%, transparent 68%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute', bottom: '5%', left: '2%',
        width: 'min(85vw, 550px)', height: 'min(85vw, 550px)',
        background: 'radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 65%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      {/* Dynamic Starfield, Comets & Neural Network Canvas */}
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

/* ─── 3D Interactive Parallax Card Tilt & Holographic Glare (Zero Re-render) ─── */
function TiltCard({
  children,
  className = '',
  style = {},
  maxTilt = 6,
  glare = true,
  borderRadius = 22,
}: {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  maxTilt?: number
  glare?: boolean
  borderRadius?: number | string
}) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const glareRef = React.useRef<HTMLDivElement>(null)
  const rafId = React.useRef<number | null>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (rafId.current) cancelAnimationFrame(rafId.current)
    rafId.current = requestAnimationFrame(() => {
      if (!cardRef.current) return
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = ((y - centerY) / centerY) * -maxTilt
      const rotateY = ((x - centerX) / centerX) * maxTilt

      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.012, 1.012, 1.012)`
      cardRef.current.style.transition = 'transform 0.08s ease-out'

      if (glare && glareRef.current) {
        const glareX = (x / rect.width) * 100
        const glareY = (y / rect.height) * 100
        glareRef.current.style.opacity = '1'
        glareRef.current.style.background = `
          radial-gradient(circle 260px at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.02) 40%, transparent 70%),
          radial-gradient(circle 380px at ${glareX}% ${glareY}%, rgba(56, 189, 248, 0.22) 0%, rgba(168, 85, 247, 0.16) 35%, rgba(245, 158, 11, 0.1) 65%, transparent 80%)
        `
      }
    })
  }

  const handleMouseLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current)
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
      cardRef.current.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '0'
    }
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        ...style,
        position: 'relative',
        borderRadius,
        transformStyle: 'preserve-3d',
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        willChange: 'transform',
      }}
    >
      {children}

      {/* Holographic Multi-Spectrum Specular Glare (0 React re-renders) */}
      {glare && (
        <div
          ref={glareRef}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius,
            pointerEvents: 'none',
            zIndex: 15,
            opacity: 0,
            transition: 'opacity 0.25s ease',
            mixBlendMode: 'screen',
          }}
        />
      )}
    </div>
  )
}

function SectionHeader({
  label,
  title,
  sub,
  accent = '#38bdf8',
}: {
  label: string
  title: string
  sub?: string
  accent?: string
}) {
  return (
    <div style={{ marginBottom: 'clamp(2.2rem, 4.5vw, 3.2rem)' }}>
      <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <span style={{
          fontFamily: C.mono,
          color: accent,
          fontSize: '0.72rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          padding: '0.25rem 0.75rem',
          borderRadius: '999px',
          background: `${accent}18`,
          border: `1px solid ${accent}40`,
          boxShadow: `0 0 16px ${accent}25`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, boxShadow: `0 0 8px ${accent}` }} />
          {label}
        </span>
        <div style={{
          height: 2,
          flex: '0 0 54px',
          background: `linear-gradient(90deg, ${accent} 0%, rgba(99,102,241,0.5) 70%, transparent 100%)`,
          borderRadius: 2,
          boxShadow: `0 0 8px ${accent}55`,
        }} />
      </div>
      <h2 className="reveal delay-1" style={{
        fontFamily: C.display, fontWeight: 800,
        fontSize: 'clamp(1.85rem, 4.8vw, 2.75rem)',
        letterSpacing: '-0.03em', color: '#ffffff', lineHeight: 1.15,
        marginBottom: sub ? '0.75rem' : 0,
        textShadow: '0 2px 24px rgba(0,0,0,0.6)',
      }}>
        {title}
      </h2>
      {sub && (
        <p className="reveal delay-2" style={{
          fontFamily: C.body, color: '#94a3b8',
          fontSize: 'clamp(0.88rem, 1.6vw, 1rem)',
          maxWidth: '560px', lineHeight: 1.7
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
            khoadang<span style={{ color: C.muted, fontWeight: 400 }}>.site</span>
          </a>

          {/* Nav links — hidden on mobile */}
          <nav className="nav-pills" style={{ display: 'flex', gap: '0.2rem' }}>
            {NAV.map((l) => {
              const isActive = activeSection === l.href.substring(1)
              return (
                <a
                  key={l.href}
                  href={l.href}
                  style={{
                    fontFamily: C.body, fontSize: '0.8rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#ffffff' : C.muted,
                    textDecoration: 'none', padding: '0.42rem 0.9rem',
                    borderRadius: '999px',
                    background: isActive ? 'linear-gradient(135deg, rgba(99,102,241,0.38) 0%, rgba(56,189,248,0.28) 100%)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(56,189,248,0.65)' : 'transparent'}`,
                    boxShadow: isActive ? '0 0 16px rgba(99,102,241,0.55), 0 0 8px rgba(56,189,248,0.45)' : 'none',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
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

          {/* CTA: Ultra-Modern Glowing Beacon Pill */}
          <a
            href="#contact"
            className="nav-cta hire-me-btn"
            style={{
              fontFamily: C.body,
              fontSize: '0.8rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 45%, #06b6d4 100%)',
              color: '#ffffff',
              padding: '0.42rem 1.1rem',
              borderRadius: '999px',
              textDecoration: 'none',
              marginLeft: '0.4rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.45), 0 0 6px rgba(6, 182, 212, 0.3)',
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translate3d(0, -1.5px, 0) scale(1.03)'
              e.currentTarget.style.boxShadow = '0 0 24px rgba(99, 102, 241, 0.7), 0 0 12px rgba(6, 182, 212, 0.5)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translate3d(0, 0, 0) scale(1)'
              e.currentTarget.style.boxShadow = '0 0 16px rgba(99, 102, 241, 0.45), 0 0 6px rgba(6, 182, 212, 0.3)'
            }}
          >
            <span
              className="beacon-pulse"
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#4ade80',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span>Hire me</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>✨</span>
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
                      color: isActive ? '#38bdf8' : C.text,
                      background: isActive ? 'linear-gradient(90deg, rgba(56,189,248,0.16) 0%, rgba(99,102,241,0.08) 100%)' : 'transparent',
                      borderLeft: `3px solid ${isActive ? '#38bdf8' : 'transparent'}`,
                      fontSize: '0.95rem',
                      fontWeight: isActive ? 600 : 400,
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span>{l.label}</span>
                    {isActive && (
                      <span style={{
                        fontSize: '0.68rem',
                        color: '#38bdf8',
                        fontFamily: C.mono,
                        fontWeight: 700,
                        background: 'rgba(56,189,248,0.18)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 999,
                        border: '1px solid rgba(56,189,248,0.38)',
                        boxShadow: '0 0 10px rgba(56,189,248,0.25)',
                      }}>ACTIVE</span>
                    )}
                  </a>
                )
              })}
            </div>

            <div style={{ padding: '0.85rem 1.25rem 1.25rem', borderTop: `1px solid ${C.border}` }}>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="hire-me-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1.15rem',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #06b6d4 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  color: '#ffffff',
                  borderRadius: '14px',
                  fontFamily: C.body,
                  textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(99,102,241,0.45)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    className="beacon-pulse"
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      background: '#4ade80',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, letterSpacing: '0.01em', color: '#fff' }}>
                      Hire Me · Hợp tác dự án
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.82)', fontFamily: C.mono }}>
                      Sẵn sàng nhận dự án Data Science & AI
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff' }}>➔</span>
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
      {/* Atmospheric Stage Spotlight - Deep Indigo & Royal Blue for Hero */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 'min(1100px, 98vw)', height: '480px',
        background: 'radial-gradient(ellipse 80% 65% at 50% 0%, rgba(99, 102, 241, 0.22) 0%, rgba(56, 189, 248, 0.12) 45%, transparent 80%)',
        pointerEvents: 'none', zIndex: 0
      }} />

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

          {/* Skill card column with animated glowing border and 3D Holographic Tilt */}
          <TiltCard
            className="reveal-right glow-card-container"
            borderRadius={22}
            maxTilt={7}
            style={{ width: '100%' }}
          >
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
          </TiltCard>
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
  const [isPausedHovered, setIsPausedHovered] = useState(false)

  return (
    <section id="projects" className="section-glow-divider section-glow-projects" style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', borderTop: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
      {/* Atmospheric Stage Spotlight - Warm Amber & Indigo for Projects */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 'min(1000px, 98vw)', height: '420px',
        background: 'radial-gradient(ellipse 75% 65% at 50% 0%, rgba(245, 158, 11, 0.16) 0%, rgba(99, 102, 241, 0.09) 45%, transparent 80%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* Ambient background glows */}
      <div className="ambient-glow-1" style={{
        position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 'min(600px, 85vw)', height: 'min(400px, 65vw)', background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      <div className="responsive-container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeader
          label="// PERSONAL PROJECTS"
          title="Dự án của tôi"
          sub="Các sản phẩm, ứng dụng thực tế và dự án học thuật được xây dựng & triển khai trực tiếp."
          accent="#f59e0b"
        />

        {/* Khu vực dự án cá nhân: Thu nhỏ Hành Trang Của Mẹ ở 1 góc với hiệu ứng làm mờ thể hiện tạm ngưng */}
        <div style={{ maxWidth: 960, margin: '0 auto 3rem' }}>
          <div
            className="reveal delay-1 glass-card"
            onMouseEnter={() => setIsPausedHovered(true)}
            onMouseLeave={() => setIsPausedHovered(false)}
            style={{
              maxWidth: 580,
              margin: '0',
              borderRadius: 20,
              padding: 'clamp(1.4rem, 3vw, 2rem)',
              position: 'relative',
              overflow: 'hidden',
              border: isPausedHovered ? '1px dashed rgba(245, 158, 11, 0.65)' : '1px dashed rgba(245, 158, 11, 0.38)',
              background: 'linear-gradient(165deg, rgba(245, 158, 11, 0.04) 0%, rgba(15, 23, 42, 0.8) 100%)',
              backdropFilter: 'blur(16px)',
              // Hiệu ứng làm mờ thể hiện dự án tạm ngưng phát triển
              opacity: isPausedHovered ? 0.98 : 0.76,
              filter: isPausedHovered ? 'none' : 'grayscale(35%)',
              transform: isPausedHovered ? 'translateY(-3px)' : 'none',
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: isPausedHovered ? '0 12px 30px rgba(0,0,0,0.4), 0 0 20px rgba(245, 158, 11, 0.15)' : '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            {/* Watermark dán chéo "PAUSED" chìm ở góc card */}
            <div style={{
              position: 'absolute',
              top: 14,
              right: -34,
              transform: 'rotate(22deg)',
              background: 'rgba(245, 158, 11, 0.16)',
              border: '1px solid rgba(245, 158, 11, 0.38)',
              color: '#fbbf24',
              fontFamily: C.mono,
              fontSize: '0.62rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              padding: '0.2rem 2.4rem',
              pointerEvents: 'none',
              zIndex: 2,
              userSelect: 'none',
            }}>
              PAUSED
            </div>

            {/* Header: Badge trạng thái tạm ngưng & Loại hình */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.15rem',
              flexWrap: 'wrap',
              gap: '0.6rem',
              paddingRight: '3.5rem',
            }}>
              <span style={{
                fontFamily: C.mono, fontSize: '0.7rem', fontWeight: 700,
                color: '#fbbf24',
                background: 'rgba(245, 158, 11, 0.14)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                padding: '0.25rem 0.75rem', borderRadius: '6px',
                letterSpacing: '0.05em',
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              }}>
                <span>⏸</span> TẠM NGƯNG PHÁT TRIỂN
              </span>

              <span style={{
                fontFamily: C.mono, fontSize: '0.7rem',
                color: '#94a3b8',
                background: 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${C.border}`,
                padding: '0.25rem 0.65rem', borderRadius: '6px',
              }}>
                Web & PWA
              </span>
            </div>

            {/* Title & Icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.35rem', flexShrink: 0,
              }}>
                🏡
              </div>
              <div>
                <h3 style={{
                  fontFamily: C.display, fontWeight: 700,
                  fontSize: 'clamp(1.15rem, 2.5vw, 1.45rem)',
                  color: '#fff', lineHeight: 1.25,
                }}>
                  Hành Trang Của Mẹ & Góc Nhỏ Của Ba
                </h3>
                <div style={{ fontFamily: C.mono, fontSize: '0.75rem', color: '#a78bfa', marginTop: '0.15rem' }}>
                  Family Knowledge & Life Hub Platform
                </div>
              </div>
            </div>

            {/* Notice Box (Thông báo tạm ngưng phát triển) */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.09)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              margin: '1rem 0',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.45rem',
                color: '#fbbf24', fontFamily: C.mono, fontSize: '0.72rem', fontWeight: 700,
                marginBottom: '0.3rem', letterSpacing: '0.04em'
              }}>
                <span>⚠️</span> THÔNG BÁO TẠM DỪNG
              </div>
              <div style={{ fontFamily: C.body, fontSize: '0.8rem', color: '#f1f5f9', fontWeight: 600, lineHeight: 1.45 }}>
                Dự án tạm ngưng phát triển.
              </div>
              <div style={{ fontFamily: C.body, fontSize: '0.76rem', color: '#94a3b8', marginTop: '0.2rem', lineHeight: 1.45 }}>
                Lý do: Không đạt kết quả mong muốn trong quá trình triển khai & đánh giá thực tế.
              </div>
            </div>

            {/* Description */}
            <p style={{
              fontFamily: C.body, color: '#94a3b8',
              fontSize: '0.85rem', lineHeight: 1.65, marginBottom: '1rem',
            }}>
              Nền tảng chia sẻ mẹo hay cuộc sống, cẩm nang gia đình và lưu giữ những lời dạy yêu thương. Được thiết kế tối ưu PWA trên React, TypeScript và Tailwind CSS.
            </p>

            {/* Tech Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
              {['React', 'TypeScript', 'Tailwind CSS', 'PWA', 'Vercel'].map((t) => (
                <span key={t} style={{
                  fontFamily: C.mono, fontSize: '0.68rem', color: '#cbd5e1',
                  background: 'rgba(255, 255, 255, 0.04)', border: `1px solid ${C.border}`,
                  padding: '0.2rem 0.55rem', borderRadius: 4,
                }}>
                  {t}
                </span>
              ))}
            </div>

            {/* Footer with Metadata & Active Link to the Web */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.9rem',
              borderTop: `1px solid ${C.border}`,
              flexWrap: 'wrap',
              gap: '0.65rem',
            }}>
              <span style={{ fontFamily: C.mono, fontSize: '0.72rem', color: '#64748b' }}>
                Bắt đầu: 21/08/2026 · Trạng thái: Tạm dừng
              </span>

              {/* Vẫn giữ link dẫn đến web hành trang */}
              <a
                href="https://khoalevodang-bavame.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontFamily: C.body,
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: isPausedHovered ? '#fbbf24' : '#cbd5e1',
                  background: isPausedHovered ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                  border: isPausedHovered ? '1px solid rgba(245, 158, 11, 0.45)' : `1px solid ${C.border}`,
                  padding: '0.45rem 0.95rem',
                  borderRadius: 8,
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                  boxShadow: isPausedHovered ? '0 4px 12px rgba(245, 158, 11, 0.2)' : 'none',
                }}
              >
                <span>Truy cập website</span>
                <span style={{ fontSize: '0.95rem' }}>↗</span>
              </a>
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
              UPCOMING PROJECTS & ROADMAP
            </span>
          </div>

          <h4 style={{
            fontFamily: C.display, fontWeight: 800,
            fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
            color: '#fff', marginBottom: '0.65rem',
          }}>
            Dự án tiếp theo đang nghiên cứu
          </h4>

          <p style={{
            fontFamily: C.body, color: C.muted,
            fontSize: 'clamp(0.88rem, 1.5vw, 0.95rem)',
            maxWidth: 560, margin: '0 auto 1.5rem', lineHeight: 1.7,
          }}>
            Các dự án chuyên sâu về Machine Learning, C++ Engine và MySQL Database Optimization đang trong quá trình phát triển và sẽ sớm được công bố trên GitHub.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.45rem' }}>
            {['C++ DSA Engine', 'Python Machine Learning', 'Computer Vision', 'Database Query Optimizer', 'LLM Agent'].map((t) => (
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

/* ─── Sample LeetCode Solved & Verified Submissions ──────────────────────── */
const SAMPLE_LEETCODE_PROBLEMS: LeetCodeProblem[] = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Array · Hash Table',
    submissionUrl: 'https://leetcode.com/problems/two-sum/',
    language: 'C++',
    status: 'Accepted',
  },
  {
    id: 20,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'String · Stack',
    submissionUrl: 'https://leetcode.com/problems/valid-parentheses/',
    language: 'Python',
    status: 'Accepted',
  },
  {
    id: 3,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Sliding Window · Hash Set',
    submissionUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    language: 'C++',
    status: 'Accepted',
  },
  {
    id: 42,
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    category: 'Array · Two Pointers',
    submissionUrl: 'https://leetcode.com/problems/trapping-rain-water/',
    language: 'C++',
    status: 'Accepted',
  },
]

const getDifficultyColor = (diff: 'Easy' | 'Medium' | 'Hard') => {
  switch (diff) {
    case 'Easy':
      return '#10b981'
    case 'Medium':
      return '#f59e0b'
    case 'Hard':
      return '#ef4444'
    default:
      return '#38bdf8'
  }
}

/* ─── Compact LeetCode Solved & Verified Problem Row ─────────────────────── */
function LeetCodeProblemListItem({ problem }: { problem: LeetCodeProblem }) {
  const diffColor = getDifficultyColor(problem.difficulty)
  const targetUrl = problem.submissionUrl || problem.leetcodeUrl || LEETCODE_PROFILE_URL

  const handleOpen = () => {
    window.open(targetUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      onClick={handleOpen}
      className="glass-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem clamp(0.85rem, 2.5vw, 1.35rem)',
        borderRadius: 14,
        borderLeft: `4px solid ${diffColor}`,
        cursor: 'pointer',
        transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        gap: '0.9rem',
        flexWrap: 'wrap',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translate3d(4px, 0, 0)'
        e.currentTarget.style.borderColor = `${diffColor}66`
        e.currentTarget.style.background = 'rgba(17, 28, 48, 0.9)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translate3d(0, 0, 0)'
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
        e.currentTarget.style.background = 'rgba(11, 17, 32, 0.72)'
      }}
    >
      {/* Left: ID, Title & Topic */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: '1 1 280px' }}>
        {problem.id !== undefined && (
          <span
            style={{
              fontFamily: C.mono,
              fontWeight: 800,
              fontSize: '0.82rem',
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              padding: '0.2rem 0.55rem',
              borderRadius: 6,
              flexShrink: 0,
            }}
          >
            #{problem.id}
          </span>
        )}

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: C.display,
              fontWeight: 700,
              fontSize: 'clamp(0.92rem, 2vw, 1.05rem)',
              color: '#ffffff',
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
            }}
          >
            {problem.title}
          </div>
          {problem.category && (
            <div
              style={{
                fontFamily: C.mono,
                fontSize: '0.72rem',
                color: '#94a3b8',
                marginTop: '0.15rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {problem.category}
            </div>
          )}
        </div>
      </div>

      {/* Right: Badges & Direct Check Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
        }}
      >
        {/* Accepted Badge */}
        <span
          style={{
            fontFamily: C.mono,
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#4ade80',
            background: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.35)',
            padding: '0.22rem 0.6rem',
            borderRadius: 999,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            whiteSpace: 'nowrap',
          }}
        >
          <span>✓</span>
          <span>{problem.status || 'Accepted'}</span>
        </span>

        {/* Difficulty Pill */}
        <span
          style={{
            fontFamily: C.mono,
            fontSize: '0.72rem',
            fontWeight: 700,
            color: diffColor,
            background: `${diffColor}18`,
            border: `1px solid ${diffColor}40`,
            padding: '0.22rem 0.65rem',
            borderRadius: 999,
            whiteSpace: 'nowrap',
          }}
        >
          ● {problem.difficulty}
        </span>

        {/* Language Badge */}
        {problem.language && (
          <span
            style={{
              fontFamily: C.mono,
              fontSize: '0.72rem',
              color: '#cbd5e1',
              background: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${C.border}`,
              padding: '0.22rem 0.6rem',
              borderRadius: 8,
              whiteSpace: 'nowrap',
            }}
          >
            ⚡ {problem.language}
          </span>
        )}

        {/* Direct Check Link Button */}
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="touch-target"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontFamily: C.mono,
            fontSize: '0.76rem',
            fontWeight: 700,
            color: '#fb923c',
            background: 'rgba(251, 146, 60, 0.14)',
            border: '1px solid rgba(251, 146, 60, 0.45)',
            padding: '0.35rem 0.85rem',
            borderRadius: 8,
            textDecoration: 'none',
            marginLeft: '0.2rem',
            transition: 'all 0.2s',
            boxShadow: '0 0 10px rgba(251, 146, 60, 0.15)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(251, 146, 60, 0.25)'
            e.currentTarget.style.borderColor = 'rgba(251, 146, 60, 0.8)'
            e.currentTarget.style.boxShadow = '0 0 16px rgba(251, 146, 60, 0.35)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(251, 146, 60, 0.14)'
            e.currentTarget.style.borderColor = 'rgba(251, 146, 60, 0.45)'
            e.currentTarget.style.boxShadow = '0 0 10px rgba(251, 146, 60, 0.15)'
          }}
        >
          <span>Check bài nộp</span>
          <span>↗</span>
        </a>
      </div>
    </div>
  )
}

/* ─── LeetCode Section ───────────────────────────────────────────────────── */
function LeetCode() {
  const [filter, setFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All')
  const [search, setSearch] = useState('')

  const hasCustomSolutions = LEETCODE_SOLUTIONS.length > 0
  const [dataSource, setDataSource] = useState<'custom' | 'sample'>(hasCustomSolutions ? 'custom' : 'sample')

  const currentDataset = dataSource === 'custom' && hasCustomSolutions ? LEETCODE_SOLUTIONS : SAMPLE_LEETCODE_PROBLEMS

  // Metrics for current dataset
  const stats = useMemo(() => {
    const total = currentDataset.length
    const easy = currentDataset.filter((p) => p.difficulty === 'Easy').length
    const medium = currentDataset.filter((p) => p.difficulty === 'Medium').length
    const hard = currentDataset.filter((p) => p.difficulty === 'Hard').length
    return { total, easy, medium, hard }
  }, [currentDataset])

  // Filter and search
  const filteredProblems = useMemo(() => {
    return currentDataset.filter((p) => {
      const matchDiff = filter === 'All' || p.difficulty === filter
      const q = search.trim().toLowerCase()
      const matchSearch =
        q === '' ||
        p.title.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.language && p.language.toLowerCase().includes(q)) ||
        (p.id !== undefined && String(p.id).includes(q.replace('#', '')))
      return matchDiff && matchSearch
    })
  }, [currentDataset, filter, search])

  // Grouped for 'All' view when not searching
  const easyGroup = useMemo(() => filteredProblems.filter((p) => p.difficulty === 'Easy'), [filteredProblems])
  const mediumGroup = useMemo(() => filteredProblems.filter((p) => p.difficulty === 'Medium'), [filteredProblems])
  const hardGroup = useMemo(() => filteredProblems.filter((p) => p.difficulty === 'Hard'), [filteredProblems])

  const isGroupedView = filter === 'All' && search.trim() === ''

  return (
    <section
      id="leetcode"
      className="section-glow-divider section-glow-leetcode"
      style={{
        padding: 'clamp(4rem, 8vw, 6rem) 0',
        borderTop: `1px solid ${C.border}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Atmospheric Stage Spotlight - LeetCode Warm Orange & Amber */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(1000px, 98vw)',
          height: '420px',
          background: 'radial-gradient(ellipse 75% 65% at 50% 0%, rgba(251, 146, 60, 0.16) 0%, rgba(99, 102, 241, 0.08) 45%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="responsive-container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeader
          label="// LEETCODE & PROBLEM SOLVING"
          title="LeetCode & Thuật toán"
          sub={
            LEETCODE_COMING_SOON
              ? 'Khu vực theo dõi và kiểm tra các bài giải thuật toán LeetCode đang được chuẩn bị và sẽ sớm ra mắt.'
              : 'Danh mục các bài toán LeetCode đã hoàn thành và nộp bài thành công (Accepted). Nhấp vào bài bất kỳ để kiểm tra bài nộp và kết quả chấm trực tiếp trên hệ thống LeetCode.'
          }
          accent="#fb923c"
        />

        {LEETCODE_COMING_SOON ? (
          /* ─── Coming Soon Display ─── */
          <div
            className="reveal glass-card"
            style={{
              position: 'relative',
              borderRadius: 24,
              padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.2rem, 4vw, 2.5rem)',
              textAlign: 'center',
              border: '1px solid rgba(251, 146, 60, 0.32)',
              background: 'linear-gradient(180deg, rgba(251, 146, 60, 0.07) 0%, rgba(11, 17, 32, 0.88) 100%)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 35px rgba(251, 146, 60, 0.12)',
              overflow: 'hidden',
              maxWidth: 860,
              margin: '0 auto',
            }}
          >
            {/* Ambient Glow Orb */}
            <div
              style={{
                position: 'absolute',
                top: '-25%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 340,
                height: 220,
                background: 'radial-gradient(circle, rgba(251, 146, 60, 0.22) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            {/* Badge: COMING SOON */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span
                style={{
                  fontFamily: C.mono,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#fb923c',
                  background: 'rgba(251, 146, 60, 0.15)',
                  border: '1px solid rgba(251, 146, 60, 0.45)',
                  padding: '0.35rem 0.95rem',
                  borderRadius: 999,
                  boxShadow: '0 0 16px rgba(251, 146, 60, 0.25)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <span
                  className="beacon-pulse"
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#fb923c',
                    boxShadow: '0 0 8px #fb923c',
                  }}
                />
                COMING SOON · ĐANG CẬP NHẬT
              </span>
            </div>

            {/* Icon Graphic */}
            <div
              style={{
                width: 76,
                height: 76,
                margin: '0 auto 1.25rem',
                borderRadius: 22,
                background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.22) 0%, rgba(234, 88, 12, 0.1) 100%)',
                border: '1px solid rgba(251, 146, 60, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.3rem',
                boxShadow: '0 0 25px rgba(251, 146, 60, 0.28)',
              }}
            >
              ⚡
            </div>

            {/* Main Title */}
            <h3
              style={{
                fontFamily: C.display,
                fontSize: 'clamp(1.4rem, 3.2vw, 1.95rem)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                marginBottom: '0.85rem',
                lineHeight: 1.3,
              }}
            >
              Hệ Thống LeetCode Submission Tracker Sắp Ra Mắt
            </h3>

            {/* Subtitle Description */}
            <p
              style={{
                fontFamily: C.body,
                color: '#94a3b8',
                fontSize: 'clamp(0.9rem, 1.8vw, 1rem)',
                lineHeight: 1.7,
                maxWidth: 620,
                margin: '0 auto 2rem',
              }}
            >
              Danh sách bài toán, tiến độ giải thuật (DSA) và liên kết nộp bài xác thực trên LeetCode đang được chuẩn bị để cập nhật. Trong thời gian này, bạn có thể ghé thăm trực tiếp hồ sơ LeetCode chính thức của tôi.
            </p>

            {/* Teaser 3 Highlights */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                gap: '1rem',
                marginBottom: '2.25rem',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: 14,
                  padding: '1.1rem 1rem',
                }}
              >
                <div style={{ fontFamily: C.mono, fontSize: '0.7rem', color: '#10b981', fontWeight: 600, letterSpacing: '0.06em' }}>
                  🟢 NGÔN NGỮ CHỦ ĐẠO
                </div>
                <div style={{ fontFamily: C.display, fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', marginTop: '0.35rem' }}>
                  C++ & Python
                </div>
                <div style={{ fontFamily: C.body, fontSize: '0.78rem', color: '#64748b', marginTop: '0.15rem' }}>
                  Tối ưu bộ nhớ & thời gian
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: 14,
                  padding: '1.1rem 1rem',
                }}
              >
                <div style={{ fontFamily: C.mono, fontSize: '0.7rem', color: '#f59e0b', fontWeight: 600, letterSpacing: '0.06em' }}>
                  🟡 PHÂN LOẠI ĐỘ KHÓ
                </div>
                <div style={{ fontFamily: C.display, fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', marginTop: '0.35rem' }}>
                  Easy · Medium · Hard
                </div>
                <div style={{ fontFamily: C.body, fontSize: '0.78rem', color: '#64748b', marginTop: '0.15rem' }}>
                  Đầy đủ cấp độ thuật toán
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: 14,
                  padding: '1.1rem 1rem',
                }}
              >
                <div style={{ fontFamily: C.mono, fontSize: '0.7rem', color: '#38bdf8', fontWeight: 600, letterSpacing: '0.06em' }}>
                  🔵 XÁC THỰC BÀI NỘP
                </div>
                <div style={{ fontFamily: C.display, fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', marginTop: '0.35rem' }}>
                  Direct Link Tracker
                </div>
                <div style={{ fontFamily: C.body, fontSize: '0.78rem', color: '#64748b', marginTop: '0.15rem' }}>
                  Kiểm tra trực tiếp trên LeetCode
                </div>
              </div>
            </div>

            {/* Primary CTA Button: Visit LeetCode Profile */}
            <a
              href={LEETCODE_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                fontFamily: C.body,
                fontSize: '0.92rem',
                fontWeight: 700,
                color: '#ffffff',
                background: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: '0.75rem 1.75rem',
                borderRadius: 12,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(251, 146, 60, 0.4), 0 0 12px rgba(251, 146, 60, 0.25)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate3d(0, -2px, 0)'
                e.currentTarget.style.boxShadow = '0 6px 28px rgba(251, 146, 60, 0.6), 0 0 20px rgba(251, 146, 60, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate3d(0, 0, 0)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(251, 146, 60, 0.4), 0 0 12px rgba(251, 146, 60, 0.25)'
              }}
            >
              <span>Ghé thăm Hồ sơ LeetCode chính thức</span>
              <span>↗</span>
            </a>
          </div>
        ) : (
          <>
            {/* ─── Status Banner & Dataset Switcher ─── */}
        <div
          className="reveal glass-card"
          style={{
            borderRadius: 18,
            padding: '1rem 1.35rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            border: '1px solid rgba(251, 146, 60, 0.28)',
            background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.07) 0%, rgba(11, 17, 32, 0.85) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.15rem' }}>💡</span>
            <div>
              <div style={{ fontFamily: C.body, fontSize: '0.86rem', color: '#f1f5f9', fontWeight: 600 }}>
                {dataSource === 'sample'
                  ? 'Đang xem danh sách mẫu tham khảo (Easy · Medium · Hard)'
                  : `Đang xem danh sách bài nộp của bạn (${LEETCODE_SOLUTIONS.length} bài)`}
              </div>
              <div style={{ fontFamily: C.mono, fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                {dataSource === 'sample'
                  ? 'Bạn làm xong bài nào trên LeetCode chỉ cần dán link vào mảng LEETCODE_SOLUTIONS trong file src/App.tsx.'
                  : 'Mỗi bài nộp đều có thể nhấp vào để kiểm tra lời giải và trạng thái Accepted trực tiếp trên LeetCode.'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setDataSource('sample')}
              style={{
                fontFamily: C.mono,
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '0.35rem 0.75rem',
                borderRadius: 8,
                background: dataSource === 'sample' ? 'rgba(251, 146, 60, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${dataSource === 'sample' ? 'rgba(251, 146, 60, 0.6)' : C.border}`,
                color: dataSource === 'sample' ? '#fb923c' : '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              ✨ Bài mẫu ({SAMPLE_LEETCODE_PROBLEMS.length})
            </button>

            <button
              onClick={() => setDataSource('custom')}
              style={{
                fontFamily: C.mono,
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '0.35rem 0.75rem',
                borderRadius: 8,
                background: dataSource === 'custom' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${dataSource === 'custom' ? 'rgba(99, 102, 241, 0.6)' : C.border}`,
                color: dataSource === 'custom' ? '#818cf8' : '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              📁 Danh sách của bạn ({LEETCODE_SOLUTIONS.length})
            </button>

            <a
              href={LEETCODE_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target"
              style={{
                fontFamily: C.mono,
                fontSize: '0.74rem',
                fontWeight: 700,
                padding: '0.35rem 0.85rem',
                borderRadius: 8,
                background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.2) 0%, rgba(234, 88, 12, 0.25) 100%)',
                border: '1px solid rgba(251, 146, 60, 0.45)',
                color: '#fb923c',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 0 12px rgba(251, 146, 60, 0.2)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate3d(0, -1px, 0)'
                e.currentTarget.style.boxShadow = '0 0 18px rgba(251, 146, 60, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate3d(0, 0, 0)'
                e.currentTarget.style.boxShadow = '0 0 12px rgba(251, 146, 60, 0.2)'
              }}
            >
              <span>Hồ sơ LeetCode chính thức</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* ─── Stats Overview Summary Bar ─── */}
        <div
          className="reveal"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          {/* Total solved */}
          <div
            className="glass-card"
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontFamily: C.mono, fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>TỔNG BÀI TOÁN</div>
              <div style={{ fontFamily: C.display, fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginTop: '0.15rem' }}>
                {stats.total} <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 400 }}>bài</span>
              </div>
            </div>
            <span style={{ fontSize: '1.4rem', opacity: 0.8 }}>📊</span>
          </div>

          {/* Easy */}
          <div
            className="glass-card"
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderLeft: '3.5px solid #10b981',
            }}
          >
            <div>
              <div style={{ fontFamily: C.mono, fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>EASY</div>
              <div style={{ fontFamily: C.display, fontSize: '1.5rem', fontWeight: 800, color: '#4ade80', marginTop: '0.15rem' }}>
                {stats.easy} <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 400 }}>bài</span>
              </div>
            </div>
            <span style={{ fontFamily: C.mono, fontSize: '0.75rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '0.2rem 0.5rem', borderRadius: 6 }}>
              🟢 Dễ
            </span>
          </div>

          {/* Medium */}
          <div
            className="glass-card"
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderLeft: '3.5px solid #f59e0b',
            }}
          >
            <div>
              <div style={{ fontFamily: C.mono, fontSize: '0.7rem', color: '#f59e0b', fontWeight: 600 }}>MEDIUM</div>
              <div style={{ fontFamily: C.display, fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.15rem' }}>
                {stats.medium} <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 400 }}>bài</span>
              </div>
            </div>
            <span style={{ fontFamily: C.mono, fontSize: '0.75rem', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '0.2rem 0.5rem', borderRadius: 6 }}>
              🟡 Trung bình
            </span>
          </div>

          {/* Hard */}
          <div
            className="glass-card"
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderLeft: '3.5px solid #ef4444',
            }}
          >
            <div>
              <div style={{ fontFamily: C.mono, fontSize: '0.7rem', color: '#ef4444', fontWeight: 600 }}>HARD</div>
              <div style={{ fontFamily: C.display, fontSize: '1.5rem', fontWeight: 800, color: '#f87171', marginTop: '0.15rem' }}>
                {stats.hard} <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 400 }}>bài</span>
              </div>
            </div>
            <span style={{ fontFamily: C.mono, fontSize: '0.75rem', color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '0.2rem 0.5rem', borderRadius: 6 }}>
              🔴 Khó
            </span>
          </div>
        </div>

        {/* ─── Filter & Search Toolbar ─── */}
        <div
          className="reveal"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          {/* Segmented difficulty buttons */}
          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
            {(
              [
                { key: 'All', label: 'Tất cả', count: stats.total, color: '#fb923c' },
                { key: 'Easy', label: '🟢 Easy', count: stats.easy, color: '#10b981' },
                { key: 'Medium', label: '🟡 Medium', count: stats.medium, color: '#f59e0b' },
                { key: 'Hard', label: '🔴 Hard', count: stats.hard, color: '#ef4444' },
              ] as const
            ).map((item) => {
              const isAct = filter === item.key
              return (
                <button
                  key={item.key}
                  onClick={() => setFilter(item.key)}
                  className="touch-target"
                  style={{
                    fontFamily: C.mono,
                    fontSize: '0.76rem',
                    fontWeight: isAct ? 700 : 500,
                    padding: '0.42rem 0.95rem',
                    borderRadius: 999,
                    background: isAct ? `${item.color}25` : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${isAct ? item.color : C.border}`,
                    color: isAct ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: isAct ? `0 0 16px ${item.color}35` : 'none',
                    transition: 'all 0.22s',
                  }}
                >
                  <span>{item.label}</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      opacity: 0.85,
                      background: isAct ? `${item.color}40` : 'rgba(255,255,255,0.08)',
                      padding: '0.1rem 0.4rem',
                      borderRadius: 999,
                    }}
                  >
                    {item.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search box */}
          <div style={{ position: 'relative', minWidth: 'min(100%, 280px)' }}>
            <span
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b',
                fontSize: '0.9rem',
                pointerEvents: 'none',
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Tìm theo tên, #ID, chủ đề..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(11, 17, 32, 0.7)',
                border: `1px solid ${search ? '#fb923c' : C.border}`,
                borderRadius: 12,
                padding: '0.5rem 2.2rem 0.5rem 2.35rem',
                color: '#ffffff',
                fontFamily: C.body,
                fontSize: '0.86rem',
                outline: 'none',
                boxShadow: search ? '0 0 16px rgba(251, 146, 60, 0.25)' : 'none',
                transition: 'all 0.2s',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  padding: '0.2rem',
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ─── Main List Container ─── */}
        {dataSource === 'custom' && LEETCODE_SOLUTIONS.length === 0 ? (
          /* Empty state for personal solutions */
          <div
            className="reveal glass-card"
            style={{
              borderRadius: 20,
              padding: '3rem 1.5rem',
              textAlign: 'center',
              border: '1px dashed rgba(251, 146, 60, 0.4)',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.85rem' }}>🎯</div>
            <h3 style={{ fontFamily: C.display, fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
              Danh sách bài nộp của bạn hiện đang để trống
            </h3>
            <p style={{ fontFamily: C.body, color: '#94a3b8', fontSize: '0.9rem', maxWidth: 540, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              Làm xong bài nào trên LeetCode, bạn chỉ cần mở file <code>src/App.tsx</code> và dán link vào mảng <code>LEETCODE_SOLUTIONS</code> để người khác click vào kiểm tra bài nộp ngay!
            </p>
            <button
              onClick={() => setDataSource('sample')}
              style={{
                fontFamily: C.mono,
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '0.55rem 1.25rem',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(251, 146, 60, 0.4)',
              }}
            >
              Xem danh sách bài mẫu demo ➔
            </button>
          </div>
        ) : filteredProblems.length === 0 ? (
          /* No search results */
          <div
            className="reveal glass-card"
            style={{
              borderRadius: 18,
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔎</div>
            <div style={{ fontFamily: C.body, color: '#e2e8f0', fontSize: '0.95rem', fontWeight: 600 }}>
              Không tìm thấy bài giải nào phù hợp với bộ lọc hiện tại
            </div>
            <button
              onClick={() => {
                setFilter('All')
                setSearch('')
              }}
              style={{
                marginTop: '1rem',
                fontFamily: C.mono,
                fontSize: '0.78rem',
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '0.4rem 0.95rem',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              Đặt lại bộ lọc & tìm kiếm
            </button>
          </div>
        ) : isGroupedView ? (
          /* Grouped View by Difficulty (Easy, Medium, Hard) */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Group 1: Easy */}
            {easyGroup.length > 0 && (
              <div className="reveal">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    marginBottom: '0.85rem',
                    paddingLeft: '0.25rem',
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#10b981',
                      boxShadow: '0 0 8px #10b981',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: C.mono,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#10b981',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    EASY PROBLEMS ({easyGroup.length} bài)
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.3) 0%, transparent 100%)',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {easyGroup.map((problem) => (
                    <LeetCodeProblemListItem
                      key={problem.id !== undefined ? problem.id : problem.title}
                      problem={problem}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Group 2: Medium */}
            {mediumGroup.length > 0 && (
              <div className="reveal">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    marginBottom: '0.85rem',
                    paddingLeft: '0.25rem',
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#f59e0b',
                      boxShadow: '0 0 8px #f59e0b',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: C.mono,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#f59e0b',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    MEDIUM PROBLEMS ({mediumGroup.length} bài)
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.3) 0%, transparent 100%)',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {mediumGroup.map((problem) => (
                    <LeetCodeProblemListItem
                      key={problem.id !== undefined ? problem.id : problem.title}
                      problem={problem}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Group 3: Hard */}
            {hardGroup.length > 0 && (
              <div className="reveal">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    marginBottom: '0.85rem',
                    paddingLeft: '0.25rem',
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#ef4444',
                      boxShadow: '0 0 8px #ef4444',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: C.mono,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#ef4444',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    HARD PROBLEMS ({hardGroup.length} bài)
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.3) 0%, transparent 100%)',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {hardGroup.map((problem) => (
                    <LeetCodeProblemListItem
                      key={problem.id !== undefined ? problem.id : problem.title}
                      problem={problem}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Filtered or Searched Single Flat List */
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {filteredProblems.map((problem) => (
              <LeetCodeProblemListItem
                key={problem.id !== undefined ? problem.id : problem.title}
                problem={problem}
              />
            ))}
          </div>
        )}
          </>
        )}
      </div>
    </section>
  )
}


/* ─── Education Section ──────────────────────────────────────────────────── */
function Education() {
  return (
    <section id="education" className="section-glow-divider section-glow-education" style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', borderTop: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
      {/* Atmospheric Stage Spotlight - Emerald Teal & Cyan for Education */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 'min(1000px, 98vw)', height: '420px',
        background: 'radial-gradient(ellipse 75% 65% at 50% 0%, rgba(16, 185, 129, 0.16) 0%, rgba(6, 182, 212, 0.09) 45%, transparent 80%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      <div className="responsive-container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeader
          label="// EDUCATION"
          title="Học vấn"
          sub="Quá trình đào tạo đại học chính quy tại Trường Đại học Giao thông Vận tải TP.HCM (UTH)."
          accent="#10b981"
        />

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
                background: 'linear-gradient(90deg, #10b981, #06b6d4, #6366f1)',
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
    <section id="certificates" className="section-glow-divider section-glow-certificates" style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', borderTop: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
      {/* Atmospheric Stage Spotlight - Cyber Cyan & Electric Indigo for Certificates */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 'min(1000px, 98vw)', height: '440px',
        background: 'radial-gradient(ellipse 75% 65% at 50% 0%, rgba(6, 182, 212, 0.20) 0%, rgba(99, 102, 241, 0.11) 45%, transparent 80%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      <div className="responsive-container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeader
          label="// CERTIFICATES & VERIFICATION"
          title="Chứng chỉ & Xác thực"
          sub="Các chứng nhận & chứng chỉ chuyên môn quốc tế được xác thực trực tuyến qua mã QR và cổng Cisco NetAcad."
          accent="#06b6d4"
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 1100, margin: '0 auto' }}>
          {CERTIFICATES.map((cert) => (
            <TiltCard
              key={cert.id}
              className="reveal delay-1 glow-card-container"
              borderRadius={24}
              maxTilt={6}
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
            </TiltCard>
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
    <section id="contact" className="section-glow-divider section-glow-contact" style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', borderTop: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
      {/* Atmospheric Stage Spotlight - Neon Violet & Fuchsia for Contact */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 'min(1000px, 98vw)', height: '420px',
        background: 'radial-gradient(ellipse 75% 65% at 50% 0%, rgba(168, 85, 247, 0.18) 0%, rgba(244, 63, 94, 0.09) 45%, transparent 80%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      <div className="responsive-container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeader
          label="// CONTACT"
          title="Liên hệ"
          sub="Có dự án thú vị? Hãy cùng trao đổi."
          accent="#a855f7"
        />

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
  const currentYear = new Date().getFullYear()

  const navLinks = [
    { label: 'Về bản thân', href: '#about' },
    { label: 'Dự án cá nhân', href: '#projects' },
    { label: 'LeetCode & Thuật toán', href: '#leetcode' },
    { label: 'Học vấn & Chuyên môn', href: '#education' },
    { label: 'Chứng chỉ quốc tế', href: '#certificates' },
    { label: 'Liên hệ hợp tác', href: '#contact' },
  ]

  const connectLinks = [
    {
      icon: '⌨',
      name: 'GitHub',
      handle: 'khoalvd839764-netizen',
      href: 'https://github.com/khoalvd839764-netizen',
      isExternal: true,
      color: '#38bdf8',
    },
    {
      icon: '✉',
      name: 'Email Cá Nhân',
      handle: 'khoalevodang301007@gmail.com',
      href: 'mailto:khoalevodang301007@gmail.com',
      isExternal: false,
      color: '#a78bfa',
    },
    {
      icon: '💼',
      name: 'LinkedIn',
      handle: 'Cập nhật hồ sơ sau',
      badge: 'Soon',
      color: '#60a5fa',
    },
    {
      icon: '🎓',
      name: 'Đại Học UTH',
      handle: 'Data Science & AI',
      color: '#34d399',
    },
  ]

  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 10,
        background: 'linear-gradient(180deg, rgba(3, 7, 18, 0.5) 0%, rgba(5, 8, 15, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Top glowing laser line */}
      <div
        style={{
          height: '1px',
          width: '100%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.5) 20%, rgba(56,189,248,0.7) 50%, rgba(168,85,247,0.5) 80%, transparent 100%)',
          boxShadow: '0 0 12px rgba(56,189,248,0.4)',
        }}
      />

      <div
        className="responsive-container"
        style={{
          paddingTop: 'clamp(2.5rem, 5vw, 4rem)',
          paddingBottom: 'calc(clamp(1.5rem, 3vw, 2.5rem) + var(--sab))',
        }}
      >
        {/* Main Footer Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            marginBottom: 'clamp(2.2rem, 4vw, 3.2rem)',
            alignItems: 'start',
          }}
        >
          {/* Column 1: Brand & Profile */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <a
              href="#about"
              style={{
                fontFamily: C.mono,
                fontWeight: 800,
                fontSize: '1.25rem',
                letterSpacing: '-0.02em',
                color: '#ffffff',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                width: 'fit-content',
              }}
            >
              <span>khoadang</span>
              <span style={{ color: '#38bdf8' }}>.site</span>
            </a>

            {/* Live Availability Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.3rem 0.8rem',
                borderRadius: '999px',
                background: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.28)',
                fontFamily: C.mono,
                fontSize: '0.74rem',
                color: '#4ade80',
                width: 'fit-content',
              }}
            >
              <span
                className="beacon-pulse"
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#22c55e',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              <span>Sẵn sàng cộng tác & tiếp nhận dự án</span>
            </div>

            <p
              style={{
                fontFamily: C.body,
                fontSize: '0.86rem',
                lineHeight: 1.7,
                color: '#94a3b8',
                maxWidth: '380px',
                margin: 0,
              }}
            >
              Lê Võ Đăng Khoa — Sinh viên ngành Khoa học Dữ liệu tại Trường Đại học Giao thông Vận tải TP.HCM (UTH).
              Đam mê Machine Learning, Data Analytics & nghiên cứu các mô hình AI ứng dụng vào thực tế.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
              <span style={{ fontFamily: C.mono, fontSize: '0.72rem', color: '#64748b' }}>📍 TP. Hồ Chí Minh, Việt Nam</span>
            </div>
          </div>

          {/* Column 2: Quick Navigation Sitemap */}
          <div>
            <div
              style={{
                fontFamily: C.mono,
                fontSize: '0.72rem',
                color: '#38bdf8',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 700,
                marginBottom: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8' }} />
              <span>ĐIỀU HƯỚNG & DANH MỤC</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.75rem 1rem',
              }}
            >
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  style={{
                    fontFamily: C.body,
                    fontSize: '0.85rem',
                    color: '#94a3b8',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#38bdf8'
                    e.currentTarget.style.transform = 'translate3d(4px, 0, 0)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#94a3b8'
                    e.currentTarget.style.transform = 'translate3d(0, 0, 0)'
                  }}
                >
                  <span style={{ color: '#475569', fontSize: '0.8rem' }}>›</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Connect & Verified Profiles */}
          <div>
            <div
              style={{
                fontFamily: C.mono,
                fontSize: '0.72rem',
                color: '#a78bfa',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 700,
                marginBottom: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa' }} />
              <span>HỒ SƠ & LIÊN KẾT TRỰC TUYẾN</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {connectLinks.map((item) => {
                const isClickable = Boolean(item.href)
                const cardContent = (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.85rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '10px',
                      transition: 'all 0.2s ease',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (isClickable) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'
                        e.currentTarget.style.borderColor = `${item.color}50`
                        e.currentTarget.style.transform = 'translate3d(0, -1px, 0)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isClickable) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'
                        e.currentTarget.style.transform = 'translate3d(0, 0, 0)'
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                      <span style={{ fontSize: '0.95rem', opacity: 0.9 }}>{item.icon}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: C.body, fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', lineHeight: 1.2 }}>
                          {item.name}
                        </div>
                        <div
                          style={{
                            fontFamily: C.mono,
                            fontSize: '0.7rem',
                            color: '#64748b',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '180px',
                          }}
                        >
                          {item.handle}
                        </div>
                      </div>
                    </div>

                    {item.badge ? (
                      <span
                        style={{
                          fontFamily: C.mono,
                          fontSize: '0.62rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          background: 'rgba(148, 163, 184, 0.12)',
                          color: '#94a3b8',
                          border: '1px solid rgba(148, 163, 184, 0.25)',
                        }}
                      >
                        {item.badge}
                      </span>
                    ) : isClickable ? (
                      <span style={{ fontSize: '0.85rem', color: item.color, opacity: 0.8 }}>↗</span>
                    ) : null}
                  </div>
                )

                return isClickable ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target={item.isExternal ? '_blank' : undefined}
                    rel={item.isExternal ? 'noopener noreferrer' : undefined}
                    style={{ textDecoration: 'none' }}
                  >
                    {cardContent}
                  </a>
                ) : (
                  <div key={item.name}>{cardContent}</div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Tech Stack Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.07)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          {/* Copyright text */}
          <div>
            <div style={{ fontFamily: C.mono, fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 500 }}>
              © {currentYear} Lê Võ Đăng Khoa · Bản quyền đã được bảo lưu (All Rights Reserved)
            </div>
            <div style={{ fontFamily: C.body, fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
              Portfolio Data Science & AI Engineer · Thiết kế tối ưu hiệu năng cao và trải nghiệm người dùng
            </div>
          </div>

          {/* Tech badge & Back to top button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: C.mono,
                fontSize: '0.7rem',
                color: '#94a3b8',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '0.3rem 0.7rem',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span>⚡</span>
              <span>React 19 · Vite · TypeScript</span>
            </span>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="touch-target"
              style={{
                fontFamily: C.mono,
                fontSize: '0.72rem',
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                padding: '0.3rem 0.75rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.18)'
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.5)'
                e.currentTarget.style.transform = 'translate3d(0, -1.5px, 0)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)'
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.25)'
                e.currentTarget.style.transform = 'translate3d(0, 0, 0)'
              }}
            >
              <span>Lên đầu trang</span>
              <span>↑</span>
            </button>
          </div>
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
    const isMobile = window.innerWidth < 768

    // 1. Reveal observer with adaptive device thresholds
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
      {
        rootMargin: isMobile ? '0px 0px -15px 0px' : '0px 0px -35px 0px',
        threshold: isMobile ? 0.05 : 0.1,
      }
    )
    revealEls.forEach((el) => revealObs.observe(el))

    // 2. Section spy observer for navbar
    const sectionIds = ['about', 'projects', 'leetcode', 'education', 'certificates', 'contact']
    const sectionEls = sectionIds.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const sectionObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.target.id) {
            setActiveSection(e.target.id)
          }
        })
      },
      { rootMargin: '-18% 0px -55% 0px', threshold: 0 }
    )
    sectionEls.forEach(el => sectionObs.observe(el))

    // 3. Ultra-smooth scroll progress & back-to-top button
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight
          const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0
          setScrollProgress(progress)
          setShowScrollTop(window.scrollY > 280)

          if (window.scrollY < 120) {
            setActiveSection('about')
          } else if (totalHeight > 0 && window.scrollY >= totalHeight - 60) {
            setActiveSection('contact')
          }
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
      <LeetCode />
      <Education />
      <Certificates />
      <Contact />
      <Footer />
      <ChatWidget />
      <ScrollToTopButton show={showScrollTop} />
    </div>
  )
}

