'use client'

import EbookForm from '@/components/ebook/EbookForm'
import {
  ArrowRight,
  CheckCircle,
  ExternalLink,
  FileText,
  Globe,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const FEATURES = [
  { label: 'Step-by-step U.S. LLC setup', color: '#0B4F49', soft: '#EAF4F1' },
  { label: 'Bank solutions from Nigeria', color: '#C9821E', soft: '#FBEEDA' },
  { label: 'Tax & compliance roadmap', color: '#B23E27', soft: '#FBE7E1' },
  { label: 'Immigration & visa pathways', color: '#1F4E6B', soft: '#E7EEF3' },
]

export default function Ebook() {
  const [viewState, setViewState] = useState<'landing' | 'form'>('landing')
  const [isMounted, setIsMounted] = useState(false)

  const trackEvent = async (
    type: 'page_view' | 'button_click',
    payload?: string,
  ) => {
    console.log(`[Analytics] ${type}`, payload ?? '(no payload)')

    try {
      await fetch('/api/admin/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, payload }),
      })
    } catch (error) {
      console.error('Analytics error:', error)
    }
  }

  useEffect(() => {
    setIsMounted(true)
    trackEvent('page_view', '/ebook')
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div
      className="min-h-screen bg-white flex flex-col justify-between selection:text-white antialiased"
      style={{ fontFamily: "'General Sans', sans-serif", color: '#12211E' }}
    >
      {/* Top Notification Bar */}
      <div
        className="w-full text-xs py-2.5 px-4 text-center font-medium flex items-center justify-center gap-2"
        style={{
          background: 'linear-gradient(90deg, #0B4F49 0%, #0F6E63 100%)',
          color: '#DCEFEA',
        }}
      >
        <Sparkles
          className="w-3.5 h-3.5 animate-pulse"
          style={{ color: '#E8A33D' }}
        />
        <span>
          Special U.S. Expansion Blueprint released for Nigerian Entrepreneurs
        </span>
      </div>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 py-12 md:py-20">
        {viewState === 'landing' ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-7 sm:space-y-8 text-left">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-semibold"
                style={{
                  background: '#FBEEDA',
                  borderColor: '#E8A33D66',
                  color: '#7A5215',
                }}
              >
                <ShieldCheck className="w-4 h-4" style={{ color: '#0F6E63' }} />
                <span>100% verified legal roadmap</span>
              </div>
              <div className="space-y-4">
                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]"
                  style={{ color: '#12211E' }}
                >
                  Welcome to <br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        'linear-gradient(90deg, #0B4F49, #0F6E63, #C9821E)',
                    }}
                  >
                    Elevate Dreams
                  </span>
                </h1>
                <p
                  className="text-base sm:text-lg leading-relaxed max-w-xl"
                  style={{ color: '#55645F' }}
                >
                  At Elevate Dreams, we empower individuals, entrepreneurs, and
                  visionaries to reach their fullest potential by simplifying
                  the path to U.S. immigration and business success.
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {FEATURES.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 text-sm font-medium p-3.5 rounded-xl border transition-colors"
                    style={{
                      background: item.soft,
                      borderColor: `${item.color}33`,
                      color: '#12211E',
                    }}
                  >
                    <CheckCircle
                      className="w-4 h-4 shrink-0"
                      style={{ color: item.color }}
                    />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                <button
                  onClick={() => {
                    trackEvent(
                      'button_click',
                      'Download the ebook now (Landing)',
                    )
                    setViewState('form')
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-[0.98] cursor-pointer group"
                  style={{ background: '#E8A33D', color: '#1F1608' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = '#D6922B')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = '#E8A33D')
                  }
                >
                  <span>Download the ebook now</span>
                  <ArrowRight className="w-4.5 h-4.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
                <a
                  href="https://www.experthubllc.com/book/Elevate-Dreams"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent('button_click', 'Book a consultation')
                  }
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 border"
                  style={{
                    background: '#EAF4F1',
                    color: '#0B4F49',
                    borderColor: '#0F6E6333',
                  }}
                >
                  <span>Book a consultation</span>
                  <ExternalLink
                    className="w-4 h-4"
                    style={{ color: '#0F6E63' }}
                  />
                </a>
              </div>
            </div>

            {/* Right Column - Ebook Card */}
            <div className="lg:col-span-5 w-full">
              <div
                className="relative p-8 sm:p-9 rounded-2xl text-white border overflow-hidden"
                style={{
                  background:
                    'linear-gradient(155deg, #0B4F49 0%, #0A3B36 55%, #12211E 100%)',
                  borderColor: '#12857A55',
                }}
              >
                <div
                  className="absolute -right-20 -top-20 w-56 h-56 rounded-full blur-3xl pointer-events-none"
                  style={{ background: '#E8A33D22' }}
                />
                <div
                  className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                  style={{ background: '#E1573A26' }}
                />
                <div className="relative z-10 space-y-6">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: '#E8A33D', color: '#1F1608' }}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <span
                      className="text-[11px] font-bold tracking-wide"
                      style={{ color: '#E8A33D' }}
                    >
                      Featured publication
                    </span>
                    <h3 className="text-2xl sm:text-[1.7rem] font-extrabold tracking-tight leading-snug">
                      The Nigerian Founder&apos;s Guide to U.S. Business
                      Registration
                    </h3>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: '#CFE6E0' }}
                  >
                    Everything you need to successfully transition your startup
                    or enterprise to the United States market with complete
                    legal protection.
                  </p>
                  <div
                    className="pt-4 flex items-center justify-between text-xs font-medium"
                    style={{
                      borderTop: '1px solid #12857A40',
                      color: '#B9D9D1',
                    }}
                  >
                    <span>Format: PDF (instant download)</span>
                    <span
                      className="font-bold px-2.5 py-1 rounded-full"
                      style={{ background: '#E1573A2E', color: '#F2A98E' }}
                    >
                      Free access
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      trackEvent('button_click', 'Get your copy (Card)')
                      setViewState('form')
                    }}
                    className="w-full py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                    style={{ background: '#E8A33D', color: '#1F1608' }}
                  >
                    <span>Get your copy</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Form View */
          <div className="w-full max-w-md mx-auto space-y-5 animate-fadeIn">
            <button
              onClick={() => {
                trackEvent('button_click', 'Back to overview')
                setViewState('landing')
              }}
              className="text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              style={{ color: '#55645F' }}
            >
              ← Back to overview
            </button>
            <div style={{ borderColor: '#E3E8E6' }}>
              <EbookForm trackEvent={trackEvent} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className="w-full border-t py-8 px-6 text-center text-sm"
        style={{ borderColor: '#EAF4F1', color: '#55645F' }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-medium m-0">
            © {new Date().getFullYear()} Elevate Dreams. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span>For more insights, visit</span>
            <a
              href="https://www.elevatedreams.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('button_click', 'Footer Website Link')}
              className="font-semibold underline underline-offset-2 inline-flex items-center gap-1.5 transition-colors"
              style={{ color: '#0F6E63' }}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>www.elevatedreams.com</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
