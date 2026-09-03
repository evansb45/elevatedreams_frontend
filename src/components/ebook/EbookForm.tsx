'use client'

import {
  AlertCircle,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Download,
  Loader2,
  Mail,
  Phone,
  User,
} from 'lucide-react'
import { useState } from 'react'

export default function EbookForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    phone: '',
    company: '',
  })

  const [loading, setLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false) // Controls transition to success view
  const [status, setStatus] = useState<{
    type: 'success' | 'error'
    msg: string
  } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      console.log(
        '[Client handleSubmit] Sending POST request to /api/ebook-download...',
        formData,
      )
      const res = await fetch('/api/ebook-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const contentType = res.headers.get('content-type')
      let data

      if (contentType && contentType.includes('application/json')) {
        data = await res.json()
      } else {
        throw new Error(
          `Server error (${res.status}): Please check your API endpoint.`,
        )
      }

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed')
      }

      // Trigger automatic browser download for the primary guide
      const ebookUrl = '/documents/usguide.pdf'
      const link = document.createElement('a')
      link.href = ebookUrl
      link.download = 'usguide.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Switch to the success confirmation view
      setIsSubmitted(true)
    } catch (err: any) {
      setStatus({
        type: 'error',
        msg: err.message || 'Something went wrong. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  // Handler to open booking link in a new tab
  const handleBookConsultation = () => {
    window.open('https://www.experthubllc.com/book/Elevate-Dreams', '_blank')
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4"
      style={{ fontFamily: "'General Sans', sans-serif" }}
    >
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-3xl overflow-hidden  transition-all duration-300">
          {/* CONDITIONAL VIEW: SUCCESS STATE VS FORM STATE */}
          {isSubmitted ? (
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Submission Received!
                </h2>
                <p className="mt-2 text-slate-600 text-sm sm:text-[15px] leading-relaxed">
                  Thank you for your interest. Your download should begin
                  automatically, and a copy has been sent to your email.
                </p>
              </div>

              {/* Available Resources Section with Distinct Routes */}
              <div className="bg-slate-50 p-4 rounded-2xl text-left space-y-3 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Available Resources:
                </p>
                <div className="space-y-2">
                  {/* Business Formation Download */}
                  <a
                    href="/documents/usguide.pdf"
                    download="usguide.pdf"
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200  transition-all text-sm font-semibold text-slate-700 group "
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-teal-600 shrink-0" />
                      Download e-book / Business Formation
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 transition-transform shrink-0" />
                  </a>

                  {/* Intellectual Property Download */}
                  <a
                    href="/documents/ip.pdf"
                    download="ip.pdf"
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200  transition-all text-sm font-semibold text-slate-700 group "
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-teal-600 shrink-0" />
                      Download e-book / Intellectual Property
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 transition-transform shrink-0" />
                  </a>
                </div>
              </div>

              {/* Book Consultation Button */}
              <button
                type="button"
                onClick={handleBookConsultation}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-slate-900 text-[15px] tracking-tight transition-all duration-300 ease-in-out flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer bg-[#facc15]"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Consultation</span>
              </button>
            </div>
          ) : (
            // REGULAR FORM VIEW
            <>
              {/* Header */}
              <div className="text-center pt-8 px-6 sm:px-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Get Your Free Ebook
                </h2>
                <p className="mt-2 sm:mt-3 text-slate-600 text-sm sm:text-[15px] leading-snug font-normal">
                  Complete the fields below to instantly receive your download.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
                {/* Name Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      First Name <span className="text-yellow-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-4 w-4 h-4 text-teal-600 pointer-events-none transition-colors duration-200" />
                      <input
                        type="text"
                        name="firstName"
                        required
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none transition-all duration-200 bg-white text-slate-800 placeholder:text-slate-400 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Surname <span className="text-yellow-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-4 w-4 h-4 text-teal-600 pointer-events-none transition-colors duration-200" />
                      <input
                        type="text"
                        name="surname"
                        required
                        placeholder="Doe"
                        value={formData.surname}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none transition-all duration-200 bg-white text-slate-800 placeholder:text-slate-400 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Email Address <span className="text-yellow-600">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-4 h-4 text-teal-600 pointer-events-none transition-colors duration-200" />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none transition-all duration-200 bg-white text-slate-800 placeholder:text-slate-400 text-sm"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Phone Number <span className="text-yellow-600">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-4 w-4 h-4 text-teal-600 pointer-events-none transition-colors duration-200" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none transition-all duration-200 bg-white text-slate-800 placeholder:text-slate-400 text-sm"
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Company Name
                  </label>
                  <div className="relative flex items-center">
                    <Building2 className="absolute left-4 w-4 h-4 text-teal-600 pointer-events-none transition-colors duration-200" />
                    <input
                      type="text"
                      name="company"
                      placeholder="Acme Inc."
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none transition-all duration-200 bg-white text-slate-800 placeholder:text-slate-400 text-sm"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full py-3.5 px-6 rounded-2xl font-bold text-slate-900 text-[15px] tracking-tight transition-all duration-300 ease-in-out flex items-center justify-center gap-2 group hover:scale-[1.01] active:scale-[0.99] disabled:hover:scale-100 cursor-pointer disabled:cursor-not-allowed"
                  style={{
                    background: loading
                      ? 'linear-gradient(to right, #64748b, #475569)'
                      : '#facc15',
                    color: loading ? '#ffffff' : '#0f172a',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span className="text-white">Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Get Instant Access</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {status && (
                  <div
                    className={`mt-4 p-4 rounded-2xl text-sm text-center font-medium flex items-center justify-center gap-2 transition-all animate-fadeIn ${
                      status.type === 'success'
                        ? 'bg-teal-50 text-teal-800 border border-teal-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}
                  >
                    {status.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    )}
                    <span>{status.msg}</span>
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
