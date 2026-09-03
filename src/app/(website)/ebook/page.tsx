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

export default function Ebook() {
  const [viewState, setViewState] = useState<'landing' | 'form'>('landing')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div
      className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-teal-500 selection:text-white antialiased"
      style={{ fontFamily: "'General Sans', sans-serif" }}
    >
      {/* Top Notification Bar */}
      <div className="w-full bg-teal-900 text-teal-100 text-xs py-2.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
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
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-900 text-xs sm:text-sm font-semibold">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>100% Verified Legal Roadmap</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                  Welcome To <br />
                  <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-yellow-600 bg-clip-text text-transparent">
                    Elevate Dreams
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                  At Elevate Dreams, we empower individuals, entrepreneurs, and
                  visionaries to reach their fullest potential by simplifying
                  the path to U.S. immigration and business success.
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  'Step-by-step U.S. LLC setup',
                  'Bank solutions from Nigeria',
                  'Tax & Compliance Roadmap',
                  'Immigration & Visa pathways',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 text-sm font-medium text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-teal-200 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                <button
                  onClick={() => setViewState('form')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-slate-900 text-base transition-all duration-200 flex items-center justify-center gap-2.5 bg-yellow-400 hover:bg-yellow-300 active:scale-[0.98] cursor-pointer group"
                >
                  <span>Download The Ebook Now</span>
                  <ArrowRight className="w-4.5 h-4.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>

                <a
                  href="https://www.elevatedreams.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-teal-800 text-base transition-all duration-200 flex items-center justify-center gap-2 bg-teal-50 hover:bg-teal-100 border border-teal-200"
                >
                  <span>Book A Consultation</span>
                  <ExternalLink className="w-4 h-4 text-teal-600" />
                </a>
              </div>
            </div>

            {/* Right Column - Ebook Card */}
            <div className="lg:col-span-5 w-full">
              <div className="relative bg-gradient-to-br from-teal-900 via-teal-950 to-slate-900 p-8 sm:p-9 rounded-2xl text-white border border-teal-800/60 overflow-hidden">
                {/* Soft decorative glows (no hard shadows) */}
                <div className="absolute -right-20 -top-20 w-56 h-56 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  <div className="w-11 h-11 rounded-xl bg-yellow-400 flex items-center justify-center text-teal-950">
                    <FileText className="w-5 h-5" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-yellow-400">
                      Featured Publication
                    </span>
                    <h3 className="text-2xl sm:text-[1.7rem] font-extrabold tracking-tight leading-snug">
                      The Nigerian Founder&apos;s Guide to U.S. Business
                      Registration
                    </h3>
                  </div>

                  <p className="text-teal-100/85 text-sm leading-relaxed">
                    Everything you need to successfully transition your startup
                    or enterprise to the United States market with complete
                    legal protection.
                  </p>

                  <div className="pt-4 border-t border-teal-700/50 flex items-center justify-between text-xs text-teal-200 font-medium">
                    <span>Format: PDF (Instant Download)</span>
                    <span className="text-yellow-400 font-bold">
                      Free Access
                    </span>
                  </div>

                  <button
                    onClick={() => setViewState('form')}
                    className="w-full py-3.5 rounded-xl font-bold text-teal-950 bg-yellow-400 hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <span>Get Your Copy</span>
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
              onClick={() => setViewState('landing')}
              className="text-sm font-semibold text-slate-500 hover:text-teal-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              ← Back to Overview
            </button>

            <div className="bg-white rounded-2xl border border-slate-200 p-1 sm:p-2">
              <EbookForm />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-teal-100 bg-white py-8 px-6 text-center text-sm text-slate-500">
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
              className="text-teal-700 font-semibold underline underline-offset-2 inline-flex items-center gap-1.5 hover:text-teal-800 transition-colors"
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
