import React, { useState, useEffect, type ReactNode } from 'react'

/* ─── Data ─────────────────────────────────────────────────────────────── */

const NAV = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Contact', href: '#contact' },
]

const SKILLS = [
  { name: 'Machine Learning', icon: '⬡', tags: ['scikit-learn', 'XGBoost', 'LightGBM'], grad: ['#6366f1', '#818cf8'] },
  { name: 'Deep Learning & LLMs', icon: '◈', tags: ['PyTorch', 'HuggingFace', 'LangChain'], grad: ['#a78bfa', '#c084fc'] },
  { name: 'Python & SQL', icon: '◉', tags: ['Pandas', 'NumPy', 'PostgreSQL'], grad: ['#38bdf8', '#6366f1'] },
  { name: 'NLP & Text Mining', icon: '◎', tags: ['BERT', 'PhoBERT', 'spaCy'], grad: ['#f59e0b', '#fb923c'] },
  { name: 'Data Visualization', icon: '◈', tags: ['Plotly', 'Power BI', 'Tableau'], grad: ['#34d399', '#38bdf8'] },
  { name: 'Cloud & MLOps', icon: '⬡', tags: ['AWS', 'Docker', 'Airflow'], grad: ['#f472b6', '#a78bfa'] },
]

const PROJECTS = [
  {
    num: '01',
    title: 'Customer Churn Prediction',
    tags: ['Python', 'XGBoost', 'SHAP', 'Streamlit'],
    desc: 'End-to-end ML pipeline cho công ty Telco. Đạt AUC 94% với dashboard giải thích mô hình SHAP. Giảm tỷ lệ rời bỏ khách hàng 18% sau triển khai.',
    metric: 'AUC 94%',
  },
  {
    num: '02',
    title: 'Vietnamese Sentiment Analysis',
    tags: ['PhoBERT', 'PyTorch', 'FastAPI', 'Docker'],
    desc: 'Fine-tuned PhoBERT trên 120k đánh giá sản phẩm tiếng Việt. REST API phục vụ real-time với F1-score 91% trên tập benchmark VLSP.',
    metric: 'F1 91%',
  },
  {
    num: '03',
    title: 'Retail Sales Forecasting',
    tags: ['Prophet', 'Pandas', 'Power BI', 'Azure'],
    desc: 'Hệ thống dự báo chuỗi thời gian cho 500+ cửa hàng bán lẻ. Giảm sai số dự báo 23% so với baseline. Dashboard Power BI cho stakeholders.',
    metric: '−23% Error',
  },
  {
    num: '04',
    title: 'RAG Chatbot Internal Docs',
    tags: ['LangChain', 'OpenAI', 'Pinecone', 'Next.js'],
    desc: 'Chatbot RAG cho phép nhân viên truy vấn 10,000+ tài liệu nội bộ bằng ngôn ngữ tự nhiên. Triển khai Azure với phân quyền theo vai trò.',
    metric: '10k+ Docs',
  },
  {
    num: '05',
    title: 'Medical Imaging — Chest X-ray',
    tags: ['CNN', 'TensorFlow', 'DICOM', 'GCP'],
    desc: 'Mô hình deep learning phân loại 14 bệnh lý từ X-quang ngực. Huấn luyện trên NIH ChestX-ray14. AUC trung bình 0.89 trên tất cả nhãn.',
    metric: 'AUC 0.89',
  },
  {
    num: '06',
    title: 'Automated ELT Pipeline',
    tags: ['Airflow', 'dbt', 'Snowflake', 'Python'],
    desc: 'Pipeline ELT xử lý 2M+ sự kiện/ngày. Giảm độ trễ dữ liệu từ 24h xuống 15 phút với kiểm tra chất lượng dữ liệu toàn diện.',
    metric: '2M+ events/day',
  },
]

const EDUCATION = [
  {
    degree: 'Thạc sĩ Khoa học Dữ liệu',
    school: 'Đại học Bách Khoa Hà Nội',
    period: '2022 – 2024',
    gpa: '3.8 / 4.0',
    desc: 'Chuyên sâu Machine Learning, Deep Learning và Big Data Engineering. Luận văn: "Ứng dụng Transformer trong phân tích cảm xúc tiếng Việt".',
    badge: 'M.Sc',
  },
  {
    degree: 'Cử nhân Công nghệ Thông tin',
    school: 'Đại học Khoa học Tự nhiên TP.HCM',
    period: '2018 – 2022',
    gpa: '3.7 / 4.0',
    desc: 'Chuyên ngành Hệ thống thông tin. Tốt nghiệp loại Giỏi. Đồ án: "Hệ thống gợi ý sản phẩm dùng Collaborative Filtering".',
    badge: 'B.Sc',
  },
]

const CERTS = [
  { name: 'AWS Certified ML — Specialty', org: 'Amazon Web Services', year: '2024', abbr: 'AWS', hue: '#FF9900' },
  { name: 'TensorFlow Developer Certificate', org: 'Google', year: '2023', abbr: 'TF', hue: '#FF6F00' },
  { name: 'Professional Data Engineer', org: 'Google Cloud Platform', year: '2023', abbr: 'GCP', hue: '#4285F4' },
  { name: 'Deep Learning Specialization', org: 'DeepLearning.AI · Coursera', year: '2022', abbr: 'DL', hue: '#6366f1' },
  { name: 'Data Scientist with Python', org: 'DataCamp', year: '2022', abbr: 'DC', hue: '#03EF62' },
  { name: 'Azure AI Fundamentals', org: 'Microsoft', year: '2023', abbr: 'AZ', hue: '#0078D4' },
]

/* ─── Scroll reveal hook ─────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

/* ─── Shared primitives ──────────────────────────────────────────────────── */

const C = {
  bg: '#05080f',
  surface: '#0b1120',
  surfaceHigh: '#111c30',
  border: 'rgba(255,255,255,0.07)',
  borderAccent: 'rgba(99,102,241,0.25)',
  text: '#dce4f0',
  muted: '#586480',
  accent: '#6366f1',     // indigo
  accentSoft: 'rgba(99,102,241,0.12)',
  gold: '#f59e0b',
  mono: "'JetBrains Mono', monospace",
  display: "'Outfit', sans-serif",
  body: "'Inter', sans-serif",
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span style={{
      fontFamily: C.mono, fontSize: '0.68rem', letterSpacing: '0.04em',
      background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`,
      color: C.muted, padding: '0.2rem 0.55rem', borderRadius: '4px',
    }}>
      {children}
    </span>
  )
}

function SkillChip({ skill }: { skill: { name: string; icon: string; tags: string[]; grad: string[] } }) {
  const [hov, setHov] = useState(false)
  const gradStr = `linear-gradient(135deg, ${skill.grad[0]}, ${skill.grad[1]})`
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        background: hov ? C.surfaceHigh : C.surface,
        border: `1px solid ${hov ? `${skill.grad[0]}50` : C.border}`,
        borderRadius: 12, padding: '1rem',
        transition: 'all 0.25s ease', cursor: 'default',
        boxShadow: hov ? `0 0 20px ${skill.grad[0]}18` : 'none',
      }}
    >
      {/* Glow corner on hover */}
      {hov && (
        <div style={{
          position: 'absolute', top: -20, right: -20, width: 80, height: 80,
          background: `radial-gradient(circle, ${skill.grad[0]}30, transparent 70%)`,
          borderRadius: '50%', pointerEvents: 'none',
        }} />
      )}

      {/* Icon circle */}
      <div style={{
        width: 34, height: 34, borderRadius: 8, marginBottom: '0.65rem',
        background: `${skill.grad[0]}18`,
        border: `1px solid ${skill.grad[0]}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1rem',
        background: hov ? gradStr : `${skill.grad[0]}18`,
        transition: 'background 0.25s',
      } as React.CSSProperties}>
        <span style={{
          fontFamily: C.mono, fontSize: '0.85rem', lineHeight: 1,
          color: hov ? '#fff' : skill.grad[0],
          transition: 'color 0.25s',
        }}>{skill.icon}</span>
      </div>

      <div style={{
        fontFamily: C.body, fontWeight: 600, fontSize: '0.8rem',
        background: hov ? gradStr : 'none',
        WebkitBackgroundClip: hov ? 'text' : 'unset',
        WebkitTextFillColor: hov ? 'transparent' : C.text,
        color: hov ? 'transparent' : C.text,
        marginBottom: '0.5rem', lineHeight: 1.2,
        transition: 'all 0.25s',
      }}>
        {skill.name}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
        {skill.tags.map(t => (
          <span key={t} style={{
            fontFamily: C.mono, fontSize: '0.6rem', letterSpacing: '0.04em',
            background: `${skill.grad[0]}12`,
            border: `1px solid ${skill.grad[0]}22`,
            color: hov ? skill.grad[0] : C.muted,
            padding: '0.15rem 0.45rem', borderRadius: 4,
            transition: 'all 0.2s',
          }}>{t}</span>
        ))}
      </div>
    </div>
  )
}

function SectionHeader({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: '3.5rem' }}>
      <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
        <span style={{ fontFamily: C.mono, color: C.accent, fontSize: '0.72rem', letterSpacing: '0.14em' }}>{label}</span>
        <div style={{ height: 1, width: 48, background: C.accent, opacity: 0.4 }} />
      </div>
      <h2 className="reveal delay-1" style={{ fontFamily: C.display, fontWeight: 800, fontSize: 'clamp(2rem,4vw,2.75rem)', letterSpacing: '-0.03em', color: C.text, lineHeight: 1.1, marginBottom: sub ? '0.75rem' : 0 }}>
        {title}
      </h2>
      {sub && (
        <p className="reveal delay-2" style={{ fontFamily: C.body, color: C.muted, fontSize: '1rem', maxWidth: '500px', lineHeight: 1.7 }}>
          {sub}
        </p>
      )}
    </div>
  )
}

/* ─── Navbar ─────────────────────────────────────────────────────────────── */
function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Floating pill navbar */}
      <header style={{
        position: 'fixed', top: '1.25rem', left: 0, right: 0, zIndex: 100,
        display: 'flex', justifyContent: 'center', pointerEvents: 'none',
      }}>
        <div style={{
          pointerEvents: 'auto',
          display: 'flex', alignItems: 'center', gap: '0',
          background: scrolled ? 'rgba(11,17,32,0.92)' : 'rgba(11,17,32,0.6)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: `1px solid ${scrolled ? 'rgba(99,102,241,0.2)' : C.border}`,
          borderRadius: '999px',
          padding: '0.35rem 0.45rem',
          transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.08)' : '0 4px 16px rgba(0,0,0,0.2)',
        }}>
          {/* Logo */}
          <div style={{
            fontFamily: C.mono, fontWeight: 700, fontSize: '0.82rem',
            color: C.accent, letterSpacing: '-0.01em',
            padding: '0.4rem 1rem',
            borderRight: `1px solid ${C.border}`,
            marginRight: '0.25rem',
          }}>
            nva<span style={{ color: C.muted, fontWeight: 400 }}>.ai</span>
          </div>

          {/* Nav links — hidden on mobile */}
          <nav className="nav-pills" style={{ display: 'flex', gap: '0.1rem' }}>
            {NAV.map((l) => (
              <a key={l.href} href={l.href}
                onClick={() => setActive(l.href)}
                style={{
                  fontFamily: C.body, fontSize: '0.8rem', fontWeight: 500,
                  color: active === l.href ? C.text : C.muted,
                  textDecoration: 'none', padding: '0.45rem 0.9rem',
                  borderRadius: '999px',
                  background: active === l.href ? 'rgba(255,255,255,0.07)' : 'transparent',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = C.text; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                onMouseLeave={e => { e.currentTarget.style.color = active === l.href ? C.text : C.muted; e.currentTarget.style.background = active === l.href ? 'rgba(255,255,255,0.07)' : 'transparent' }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <a href="#contact" className="nav-cta" style={{
            fontFamily: C.body, fontSize: '0.78rem', fontWeight: 600,
            background: C.accent, color: '#fff',
            padding: '0.45rem 1.1rem', borderRadius: '999px', textDecoration: 'none',
            marginLeft: '0.4rem',
            transition: 'opacity 0.2s, transform 0.2s',
            boxShadow: '0 0 16px rgba(99,102,241,0.35)',
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(0.97)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none' }}
          >
            Hire me
          </a>

          {/* Mobile burger */}
          <button onClick={() => setOpen(!open)} className="nav-burger"
            style={{ display: 'none', background: 'none', border: 'none', color: C.text, fontSize: '1.2rem', cursor: 'pointer', padding: '0.4rem 0.75rem' }}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile dropdown */}
      {open && (
        <div style={{
          position: 'fixed', top: '4.5rem', left: '1rem', right: '1rem', zIndex: 99,
          background: 'rgba(11,17,32,0.97)', backdropFilter: 'blur(20px)',
          border: `1px solid ${C.border}`, borderRadius: '16px',
          overflow: 'hidden',
        }}>
          {NAV.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{ display: 'block', padding: '0.875rem 1.5rem', fontFamily: C.body, color: C.muted, fontSize: '0.9rem', textDecoration: 'none', borderBottom: `1px solid ${C.border}` }}>
              {l.label}
            </a>
          ))}
          <div style={{ padding: '0.75rem 1rem' }}>
            <a href="#contact" onClick={() => setOpen(false)} style={{
              display: 'block', textAlign: 'center', padding: '0.75rem',
              background: C.accent, color: '#fff', borderRadius: '10px',
              fontFamily: C.body, fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none',
            }}>Hire me</a>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 640px) {
          .nav-pills { display: flex !important; }
          .nav-cta { display: inline-flex !important; }
          .nav-burger { display: none !important; }
        }
        @media (max-width: 639px) {
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
  useReveal()

  return (
    <section id="about" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '5rem', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
        backgroundSize: '72px 72px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
      }} />

      {/* Glow blobs */}
      <div style={{ position: 'absolute', top: '15%', right: '8%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '2%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '5rem', alignItems: 'center' }}>
          {/* Left */}
          <div>
            <div className="reveal" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: C.accentSoft, border: `1px solid ${C.borderAccent}`,
              borderRadius: '999px', padding: '0.3rem 1rem', marginBottom: '2rem',
            }}>
              <span style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%', display: 'inline-block', animation: 'ping 2s infinite' }} />
              <span style={{ fontFamily: C.mono, fontSize: '0.72rem', color: C.accent, letterSpacing: '0.08em' }}>Open to opportunities</span>
            </div>

            <h1 className="reveal delay-1" style={{ fontFamily: C.display, fontWeight: 800, fontSize: 'clamp(3rem,6.5vw,5.5rem)', lineHeight: 1.0, letterSpacing: '-0.04em', color: C.text, marginBottom: '0.25rem' }}>
              Nguyễn
            </h1>
            <h1 className="reveal delay-2" style={{ fontFamily: C.display, fontWeight: 800, fontSize: 'clamp(3rem,6.5vw,5.5rem)', lineHeight: 1.0, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>
              <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Văn An</span>
            </h1>

            <div className="reveal delay-2" style={{ fontFamily: C.body, fontWeight: 300, fontSize: 'clamp(0.95rem,1.5vw,1.1rem)', color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Data Scientist &nbsp;·&nbsp; AI Engineer
            </div>

            <p className="reveal delay-3" style={{ fontFamily: C.body, color: C.muted, fontSize: '1rem', lineHeight: 1.8, maxWidth: 520, marginBottom: '2.5rem' }}>
              Tôi biến dữ liệu phức tạp thành insight có giá trị và xây dựng các hệ thống AI sẵn sàng cho production.
              Chuyên sâu về Machine Learning, NLP và Data Engineering với <strong style={{ color: C.text, fontWeight: 500 }}>4+ năm kinh nghiệm</strong>.
            </p>

            <div className="reveal delay-4" style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <a href="#projects" style={{
                fontFamily: C.body, fontWeight: 600, fontSize: '0.875rem',
                background: C.accent, color: '#fff',
                padding: '0.75rem 1.75rem', borderRadius: '8px', textDecoration: 'none',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: `0 0 24px rgba(99,102,241,0.3)`,
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 4px 32px rgba(99,102,241,0.45)` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 0 24px rgba(99,102,241,0.3)` }}
              >
                View Projects
              </a>
              <a href="#contact" style={{
                fontFamily: C.body, fontWeight: 600, fontSize: '0.875rem',
                border: `1px solid ${C.border}`, color: C.text,
                padding: '0.75rem 1.75rem', borderRadius: '8px', textDecoration: 'none',
                transition: 'border-color 0.2s, background 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderAccent; e.currentTarget.style.background = C.accentSoft }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = 'transparent' }}
              >
                Get in touch
              </a>
            </div>

            {/* Stats */}
            <div className="reveal delay-5" style={{ display: 'flex', gap: '2.5rem', paddingTop: '2rem', borderTop: `1px solid ${C.border}` }}>
              {[['4+', 'Years exp.'], ['20+', 'Projects'], ['6', 'Certifications'], ['2', 'Degrees']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: C.display, fontWeight: 800, fontSize: '1.75rem', color: C.text, lineHeight: 1 }}>{v}</div>
                  <div style={{ fontFamily: C.body, color: C.muted, fontSize: '0.78rem', marginTop: '0.3rem', letterSpacing: '0.04em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill card */}
          <div className="reveal-right" style={{
            background: 'rgba(11,17,32,0.7)', border: `1px solid ${C.border}`,
            borderRadius: '20px', padding: '1.5rem',
            backdropFilter: 'blur(12px)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a78bfa)', boxShadow: '0 0 8px #6366f180' }} />
                <span style={{ fontFamily: C.mono, color: C.text, fontSize: '0.7rem', letterSpacing: '0.12em', fontWeight: 600 }}>CORE SKILLS</span>
              </div>
              <span style={{ fontFamily: C.mono, fontSize: '0.65rem', color: C.muted }}>6 domains</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem' }}>
              {SKILLS.map((s) => (
                <SkillChip key={s.name} skill={s} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ping {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        @media (max-width: 900px) {
          #about > div > div { grid-template-columns: 1fr !important; }
          #about > div > div > div:last-child { display: none; }
        }
      `}</style>
    </section>
  )
}

/* ─── Projects ───────────────────────────────────────────────────────────── */
function Projects() {
  useReveal()
  const [hov, setHov] = useState<string | null>(null)

  return (
    <section id="projects" style={{ padding: '7rem 0', borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }}>
        <SectionHeader label="// PROJECTS" title="Featured Work" sub="Các dự án thực tế — từ ML pipelines đến LLM-powered applications triển khai production." />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1px', border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
          {PROJECTS.map((p, i) => (
            <div key={p.num}
              className={`reveal delay-${(i % 3) + 1}`}
              onMouseEnter={() => setHov(p.num)}
              onMouseLeave={() => setHov(null)}
              style={{
                background: hov === p.num ? C.surfaceHigh : C.surface,
                borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
                padding: '1.75rem', transition: 'background 0.25s ease',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {hov === p.num && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #6366f1, #a78bfa)' }} />
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ fontFamily: C.mono, fontSize: '0.7rem', color: C.muted }}>{p.num}</span>
                <span style={{
                  fontFamily: C.mono, fontSize: '0.7rem', fontWeight: 600,
                  color: C.accent, background: C.accentSoft, border: `1px solid ${C.borderAccent}`,
                  padding: '0.2rem 0.55rem', borderRadius: '4px',
                }}>
                  {p.metric}
                </span>
              </div>
              <h3 style={{ fontFamily: C.display, fontWeight: 700, fontSize: '1rem', color: C.text, marginBottom: '0.7rem', lineHeight: 1.3 }}>
                {p.title}
              </h3>
              <p style={{ fontFamily: C.body, color: C.muted, fontSize: '0.84rem', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                {p.desc}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {p.tags.map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Education ──────────────────────────────────────────────────────────── */
function Education() {
  useReveal()

  return (
    <section id="education" style={{ padding: '7rem 0', borderTop: `1px solid ${C.border}`, background: `linear-gradient(180deg, ${C.bg} 0%, ${C.surface} 100%)` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }}>
        <SectionHeader label="// EDUCATION" title="Học vấn" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '1.25rem' }}>
          {EDUCATION.map((edu, i) => (
            <div key={i} className={`reveal delay-${i + 1}`} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 12, padding: '2rem', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: i === 0 ? 'linear-gradient(90deg, #6366f1, #a78bfa)' : 'linear-gradient(90deg, #f59e0b, #fcd34d)',
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 10,
                  background: i === 0 ? C.accentSoft : 'rgba(245,158,11,0.1)',
                  border: `1px solid ${i === 0 ? C.borderAccent : 'rgba(245,158,11,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: C.mono, fontWeight: 700, fontSize: '0.72rem',
                  color: i === 0 ? C.accent : C.gold,
                }}>
                  {edu.badge}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: C.mono, color: C.muted, fontSize: '0.72rem' }}>{edu.period}</div>
                  <div style={{ fontFamily: C.mono, fontWeight: 600, fontSize: '0.8rem', color: i === 0 ? C.accent : C.gold, marginTop: '0.2rem' }}>
                    GPA {edu.gpa}
                  </div>
                </div>
              </div>

              <h3 style={{ fontFamily: C.display, fontWeight: 700, fontSize: '1.05rem', color: C.text, marginBottom: '0.35rem' }}>
                {edu.degree}
              </h3>
              <div style={{ fontFamily: C.body, fontSize: '0.85rem', color: i === 0 ? C.accent : C.gold, marginBottom: '1rem', fontWeight: 500 }}>
                {edu.school}
              </div>
              <p style={{ fontFamily: C.body, color: C.muted, fontSize: '0.85rem', lineHeight: 1.75 }}>
                {edu.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Certificates ───────────────────────────────────────────────────────── */
function Certificates() {
  useReveal()
  const [hov, setHov] = useState<string | null>(null)

  return (
    <section id="certificates" style={{ padding: '7rem 0', borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }}>
        <SectionHeader label="// CERTIFICATES" title="Chứng chỉ quốc tế" sub="Các chứng nhận xác nhận năng lực từ các tổ chức hàng đầu thế giới." />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {CERTS.map((c, i) => (
            <div key={c.name}
              className={`reveal delay-${(i % 3) + 1}`}
              onMouseEnter={() => setHov(c.name)}
              onMouseLeave={() => setHov(null)}
              style={{
                background: hov === c.name ? C.surfaceHigh : C.surface,
                border: `1px solid ${hov === c.name ? `${c.hue}28` : C.border}`,
                borderRadius: 10, padding: '1.25rem 1.5rem',
                display: 'flex', alignItems: 'center', gap: '1.1rem',
                transition: 'all 0.25s ease', transform: hov === c.name ? 'translateY(-2px)' : 'none',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 8, flexShrink: 0,
                background: `${c.hue}16`, border: `1px solid ${c.hue}28`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: C.mono, fontWeight: 700, fontSize: '0.72rem', color: c.hue,
              }}>
                {c.abbr}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: C.body, fontWeight: 600, fontSize: '0.875rem', color: C.text, lineHeight: 1.3, marginBottom: '0.3rem' }}>
                  {c.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <span style={{ fontFamily: C.body, color: C.muted, fontSize: '0.76rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.org}</span>
                  <span style={{ fontFamily: C.mono, color: c.hue, fontSize: '0.72rem', flexShrink: 0 }}>{c.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Contact ────────────────────────────────────────────────────────────── */
function Contact() {
  useReveal()
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
    background: focus === id ? C.surfaceHigh : C.surface,
    border: `1px solid ${focus === id ? C.borderAccent : C.border}`,
    borderRadius: 8, padding: '0.8rem 1rem',
    color: C.text, fontFamily: C.body, fontSize: '0.9rem',
    width: '100%', outline: 'none', transition: 'all 0.2s',
  })

  return (
    <section id="contact" style={{ padding: '7rem 0', borderTop: `1px solid ${C.border}`, background: `linear-gradient(180deg, ${C.bg} 0%, ${C.surface} 100%)` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }}>
        <SectionHeader label="// CONTACT" title="Liên hệ" sub="Có dự án thú vị? Hãy cùng trao đổi." />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '5rem', alignItems: 'start' }}>
          {/* Info */}
          <div className="reveal-left">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              {[
                { icon: '✉', label: 'Email', val: 'nguyenvanan@email.com' },
                { icon: '📍', label: 'Location', val: 'Hà Nội, Việt Nam' },
                { icon: '💼', label: 'LinkedIn', val: 'linkedin.com/in/nguyenvanan' },
                { icon: '⌨', label: 'GitHub', val: 'github.com/nguyenvanan' },
              ].map((info) => (
                <div key={info.label} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.875rem 1.1rem', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0, opacity: 0.8 }}>{info.icon}</span>
                  <div>
                    <div style={{ fontFamily: C.mono, color: C.muted, fontSize: '0.65rem', letterSpacing: '0.1em', marginBottom: '0.15rem' }}>{info.label.toUpperCase()}</div>
                    <div style={{ fontFamily: C.body, color: '#b0bcd4', fontSize: '0.85rem' }}>{info.val}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: C.accentSoft, border: `1px solid ${C.borderAccent}`,
              borderRadius: 8, padding: '1.1rem 1.25rem',
            }}>
              <div style={{ fontFamily: C.mono, color: C.accent, fontSize: '0.68rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>RESPONSE TIME</div>
              <div style={{ fontFamily: C.body, color: '#b0bcd4', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Thường phản hồi trong vòng <strong style={{ color: C.text }}>24 giờ</strong> trong ngày làm việc.
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="reveal-right" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
              <textarea style={{ ...field('message'), resize: 'vertical', minHeight: 148 }}
                value={form.message} placeholder="Nội dung tin nhắn..." required
                onChange={e => setForm({ ...form, message: e.target.value })}
                onFocus={() => setFocus('message')} onBlur={() => setFocus('')}
              />
            </div>
            <button type="submit" style={{
              fontFamily: C.body, fontWeight: 700, fontSize: '0.9rem',
              background: sent ? 'rgba(34,197,94,0.12)' : C.accent,
              color: sent ? '#22c55e' : '#fff',
              border: sent ? '1px solid rgba(34,197,94,0.3)' : 'none',
              padding: '0.9rem', borderRadius: 8, cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: sent ? 'none' : `0 0 24px rgba(99,102,241,0.25)`,
            }}>
              {sent ? '✓ Đã gửi thành công!' : 'Gửi tin nhắn →'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          #contact > div > div:last-child { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </section>
  )
}

/* ─── Footer ─────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, padding: '1.75rem 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ fontFamily: C.mono, fontSize: '0.75rem', color: C.muted }}>
          © 2025 Nguyễn Văn An — Data Scientist & AI Engineer
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['GitHub', 'LinkedIn', 'Twitter'].map(s => (
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
  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <NavBar />
      <Hero />
      <Projects />
      <Education />
      <Certificates />
      <Contact />
      <Footer />
    </div>
  )
}
