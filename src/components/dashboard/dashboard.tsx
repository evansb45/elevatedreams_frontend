'use client'

import {
  AlertTriangle,
  Download,
  Eye,
  FileSpreadsheet,
  Inbox,
  MousePointerClick,
  RefreshCw,
  Search,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'

interface Lead {
  _id: string
  firstName: string
  surname: string
  email: string
  phone: string
  company?: string
  createdAt: string
}

interface Analytics {
  visits: number
  clicks: number
  conversionRate: string
}

interface ButtonClick {
  _id: string
  buttonName: string
  path: string
  createdAt: string
}

const DATE_TABS = [
  { label: 'All time', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: '7days' },
  { label: 'Last 30 days', value: '30days' },
]

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [analytics, setAnalytics] = useState<Analytics>({
    visits: 0,
    clicks: 0,
    conversionRate: '0%',
  })
  const [buttonClicks, setButtonClicks] = useState<ButtonClick[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [activeTab, setActiveTab] = useState<'clicks' | 'downloads'>('clicks')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [leadsRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/submissions'),
        fetch('/api/admin/analytics'),
      ])

      const leadsResult = await leadsRes.json()
      if (leadsRes.ok) {
        setLeads(leadsResult.data || [])
      }

      if (analyticsRes.ok) {
        const analyticsResult = await analyticsRes.json()
        setAnalytics({
          visits: analyticsResult.visits ?? 0,
          clicks: analyticsResult.clicks ?? 0,
          conversionRate: analyticsResult.conversionRate ?? '0%',
        })
        setButtonClicks(analyticsResult.data?.buttonClicks || [])
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err)
    } finally {
      setLoading(false)
    }
  }

  const promptDelete = (lead: Lead) => {
    setLeadToDelete(lead)
    localStorage.setItem('pending_delete_lead_id', lead._id)
    setIsModalOpen(true)
  }

  const confirmDelete = async () => {
    const targetId = localStorage.getItem('pending_delete_lead_id')
    if (!targetId) {
      setIsModalOpen(false)
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/submissions?id=${targetId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setLeads((prev) => prev.filter((lead) => lead._id !== targetId))
      } else {
        alert('Failed to delete the submission from the database.')
      }
    } catch (err) {
      console.error('Error deleting lead:', err)
      alert('Something went wrong while deleting.')
    } finally {
      localStorage.removeItem('pending_delete_lead_id')
      setIsDeleting(false)
      setIsModalOpen(false)
      setLeadToDelete(null)
    }
  }

  const cancelDelete = () => {
    localStorage.removeItem('pending_delete_lead_id')
    setIsModalOpen(false)
    setLeadToDelete(null)
  }

  const exportToExcel = () => {
    if (filteredLeads.length === 0) return
    const worksheetData = filteredLeads.map((l) => ({
      'First Name': l.firstName,
      Surname: l.surname,
      Email: l.email,
      Phone: l.phone,
      Company: l.company || 'N/A',
      Date: new Date(l.createdAt).toLocaleDateString(),
    }))

    const worksheet = XLSX.utils.json_to_sheet(worksheetData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions')
    XLSX.writeFile(
      workbook,
      `ebook-leads-${new Date().toISOString().split('T')[0]}.xlsx`,
    )
  }

  const exportToPDF = () => {
    window.print()
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.company &&
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()))

    if (!matchesSearch) return false
    if (dateFilter === 'all') return true

    const leadDate = new Date(lead.createdAt).getTime()
    const now = new Date().getTime()
    const diffDays = (now - leadDate) / (1000 * 60 * 60 * 24)

    if (dateFilter === 'today') return diffDays <= 1
    if (dateFilter === '7days') return diffDays <= 7
    if (dateFilter === '30days') return diffDays <= 30

    return true
  })

  return (
    <main
      className="min-h-screen py-16 px-6 sm:px-10 relative"
      style={{
        fontFamily: "'Rethink Sans', sans-serif",
        background: 'var(--bg)',
        color: 'var(--ink-900)',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap');

        :root {
          --bg: #F4F7F6;
          --surface: #FFFFFF;
          --border: #D8E2E0;
          --border-strong: #0D9488;
          --ink-900: #0F172A;
          --ink-600: #475569;
          --ink-400: #94A3B8;
          --primary: #0D9488;
          --primary-dark: #0F766E;
          --primary-soft: #F0FDFA;
          --warn: #991B1B;
          --warn-soft: #FEF2F2;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, #E2E8F0 0%, #CBD5E1 50%, #E2E8F0 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @media print {
          body { background: white !important; color: black !important; }
          button, input, .no-print { display: none !important; }
          table { width: 100% !important; border: 1px solid #ccc !important; }
          th, td { border: 1px solid #ccc !important; color: black !important; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 pb-6 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
              style={{
                background: 'var(--primary-soft)',
                color: 'var(--primary-dark)',
              }}
            >
              <span>Admin Portal</span>
            </div>
            <h1
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ color: 'var(--ink-900)' }}
            >
              E-book Submissions & Analytics
            </h1>
            <p
              className="mt-2 text-sm sm:text-base font-normal"
              style={{ color: 'var(--ink-600)' }}
            >
              Monitor incoming leads, track landing page traffic, and export
              clean records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 no-print">
            <button
              onClick={fetchData}
              disabled={loading}
              title="Reload data"
              className="p-3 rounded-xl border transition-all duration-150 disabled:opacity-50 cursor-pointer flex items-center justify-center bg-white"
              style={{ borderColor: 'var(--border)', color: 'var(--ink-600)' }}
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              />
            </button>

            <button
              onClick={exportToExcel}
              disabled={filteredLeads.length === 0 || loading}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border font-bold text-sm transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white"
              style={{
                borderColor: 'var(--primary)',
                color: 'var(--primary-dark)',
              }}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Excel</span>
            </button>

            <button
              onClick={exportToPDF}
              disabled={filteredLeads.length === 0 || loading}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-white"
              style={{ background: 'var(--primary)' }}
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-5 rounded-2xl border overflow-hidden bg-white"
          style={{ borderColor: 'var(--border)' }}
        >
          {[
            {
              label: 'Page visits',
              value: analytics.visits,
              color: 'var(--ink-900)',
              icon: Eye,
            },
            {
              label: 'CTA clicks',
              value: analytics.clicks,
              color: 'var(--ink-900)',
              icon: MousePointerClick,
            },
            {
              label: 'Conversion rate',
              value: analytics.conversionRate,
              color: 'var(--primary-dark)',
              icon: TrendingUp,
            },
            {
              label: 'Total submissions',
              value: leads.length,
              color: 'var(--ink-900)',
            },
            {
              label: 'Unique companies',
              value: new Set(leads.map((l) => l.company).filter(Boolean)).size,
              color: 'var(--ink-900)',
            },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="p-6 flex flex-col justify-between"
              style={
                i > 0
                  ? {
                      borderTop: '1px solid var(--border)',
                      borderLeft: '1px solid var(--border)',
                    }
                  : undefined
              }
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: 'var(--ink-400)' }}
                >
                  {stat.label}
                </span>
                {stat.icon && (
                  <stat.icon
                    className="w-4 h-4"
                    style={{ color: 'var(--primary)' }}
                  />
                )}
              </div>
              <p
                className="text-3xl font-extrabold mt-4"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Toggle Tabs */}
        <div className="flex items-center gap-2 no-print">
          <div
            className="flex items-center gap-1 p-1 bg-white rounded-xl border"
            style={{ borderColor: 'var(--border)' }}
          >
            <button
              onClick={() => setActiveTab('clicks')}
              className="px-4 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2"
              style={{
                background:
                  activeTab === 'clicks' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'clicks' ? '#FFFFFF' : 'var(--ink-600)',
              }}
            >
              <MousePointerClick className="w-4 h-4" />
              Button Clicks
              <span
                className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                style={{
                  background:
                    activeTab === 'clicks'
                      ? 'rgba(255,255,255,0.2)'
                      : 'var(--primary-soft)',
                  color:
                    activeTab === 'clicks' ? '#FFFFFF' : 'var(--primary-dark)',
                }}
              >
                {buttonClicks.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('downloads')}
              className="px-4 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2"
              style={{
                background:
                  activeTab === 'downloads' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'downloads' ? '#FFFFFF' : 'var(--ink-600)',
              }}
            >
              <Download className="w-4 h-4" />
              Download Logs
              <span
                className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                style={{
                  background:
                    activeTab === 'downloads'
                      ? 'rgba(255,255,255,0.2)'
                      : 'var(--primary-soft)',
                  color:
                    activeTab === 'downloads'
                      ? '#FFFFFF'
                      : 'var(--primary-dark)',
                }}
              >
                {leads.length}
              </span>
            </button>
          </div>
        </div>

        {/* ===================== BUTTON CLICKS TAB ===================== */}
        {activeTab === 'clicks' && (
          <div
            className="rounded-2xl border overflow-hidden bg-white"
            style={{ borderColor: 'var(--border)' }}
          >
            <div
              className="px-6 py-4 border-b flex items-center justify-between"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--bg)',
              }}
            >
              <div className="flex items-center gap-2">
                <MousePointerClick
                  className="w-4 h-4"
                  style={{ color: 'var(--primary)' }}
                />
                <h2
                  className="text-sm font-bold uppercase tracking-wider"
                  style={{ color: 'var(--ink-600)' }}
                >
                  Button Clicks Log
                </h2>
              </div>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: 'var(--primary-soft)',
                  color: 'var(--primary-dark)',
                }}
              >
                {buttonClicks.length} total
              </span>
            </div>

            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 rounded animate-shimmer" />
                ))}
              </div>
            ) : buttonClicks.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center gap-3">
                <div
                  className="p-4 rounded-2xl"
                  style={{ background: 'var(--primary-soft)' }}
                >
                  <MousePointerClick
                    className="w-7 h-7"
                    style={{ color: 'var(--primary)' }}
                  />
                </div>
                <p
                  className="text-base font-bold"
                  style={{ color: 'var(--ink-900)' }}
                >
                  No button clicks recorded yet
                </p>
                <p
                  className="text-sm font-normal"
                  style={{ color: 'var(--ink-600)' }}
                >
                  Clicks will appear here as users interact with the landing
                  page.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{
                        background: 'var(--bg)',
                        color: 'var(--ink-600)',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <th className="py-3.5 px-6">#</th>
                      <th className="py-3.5 px-6">Button Title</th>
                      <th className="py-3.5 px-6">Path</th>
                      <th className="py-3.5 px-6 text-right">Clicked At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buttonClicks.map((click, index) => (
                      <tr
                        key={click._id}
                        className="transition-all"
                        style={{ borderTop: '1px solid var(--border)' }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            'var(--primary-soft)')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = 'transparent')
                        }
                      >
                        <td
                          className="py-3.5 px-6 font-medium"
                          style={{ color: 'var(--ink-400)' }}
                        >
                          {index + 1}
                        </td>
                        <td
                          className="py-3.5 px-6 font-bold"
                          style={{ color: 'var(--ink-900)' }}
                        >
                          {click.buttonName}
                        </td>
                        <td
                          className="py-3.5 px-6 font-medium"
                          style={{ color: 'var(--ink-600)' }}
                        >
                          {click.path}
                        </td>
                        <td
                          className="py-3.5 px-6 text-right text-xs font-semibold"
                          style={{ color: 'var(--ink-400)' }}
                        >
                          {new Date(click.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ===================== DOWNLOAD LOGS TAB ===================== */}
        {activeTab === 'downloads' && (
          <>
            {/* Search & Date Tabs */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between no-print">
              <div className="relative w-full md:w-80">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: 'var(--ink-400)' }}
                />
                <input
                  type="text"
                  placeholder="Search by name, email, company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border text-sm font-medium focus:outline-none transition-all bg-white"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--ink-900)',
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = 'var(--primary)')
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = 'var(--border)')
                  }
                />
              </div>

              <div
                className="flex items-center gap-2 p-1 bg-white rounded-xl border"
                style={{ borderColor: 'var(--border)' }}
              >
                {DATE_TABS.map((tab) => {
                  const active = dateFilter === tab.value
                  return (
                    <button
                      key={tab.value}
                      onClick={() => setDateFilter(tab.value)}
                      className="px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap"
                      style={{
                        background: active ? 'var(--primary)' : 'transparent',
                        color: active ? '#FFFFFF' : 'var(--ink-600)',
                      }}
                    >
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Submissions Table */}
            <div
              className="rounded-2xl border overflow-hidden bg-white"
              style={{ borderColor: 'var(--border)' }}
            >
              {loading ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{
                          background: 'var(--bg)',
                          color: 'var(--ink-600)',
                          borderBottom: '1px solid var(--border)',
                        }}
                      >
                        <th className="py-4 px-6">Full name</th>
                        <th className="py-4 px-6">Email address</th>
                        <th className="py-4 px-6">Phone</th>
                        <th className="py-4 px-6">Company</th>
                        <th className="py-4 px-6">Date</th>
                        <th className="py-4 px-6 text-right no-print">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((row) => (
                        <tr
                          key={row}
                          style={{ borderTop: '1px solid var(--border)' }}
                        >
                          <td className="py-4 px-6">
                            <div className="h-4 w-32 rounded animate-shimmer" />
                          </td>
                          <td className="py-4 px-6">
                            <div className="h-4 w-44 rounded animate-shimmer" />
                          </td>
                          <td className="py-4 px-6">
                            <div className="h-4 w-28 rounded animate-shimmer" />
                          </td>
                          <td className="py-4 px-6">
                            <div className="h-4 w-20 rounded animate-shimmer" />
                          </td>
                          <td className="py-4 px-6">
                            <div className="h-4 w-24 rounded animate-shimmer" />
                          </td>
                          <td className="py-4 px-6 text-right no-print">
                            <div className="h-8 w-8 rounded ml-auto animate-shimmer" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="text-center py-24 flex flex-col items-center gap-3">
                  <div
                    className="p-4 rounded-2xl"
                    style={{ background: 'var(--primary-soft)' }}
                  >
                    <Inbox
                      className="w-8 h-8"
                      style={{ color: 'var(--primary)' }}
                    />
                  </div>
                  <p
                    className="text-base font-bold"
                    style={{ color: 'var(--ink-900)' }}
                  >
                    No submissions found
                  </p>
                  <p
                    className="text-sm font-normal"
                    style={{ color: 'var(--ink-600)' }}
                  >
                    Try adjusting your search query or filter options.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{
                          background: 'var(--bg)',
                          color: 'var(--ink-600)',
                          borderBottom: '1px solid var(--border)',
                        }}
                      >
                        <th className="py-4 px-6">Full name</th>
                        <th className="py-4 px-6">Email address</th>
                        <th className="py-4 px-6">Phone</th>
                        <th className="py-4 px-6">Company</th>
                        <th className="py-4 px-6">Date</th>
                        <th className="py-4 px-6 text-right no-print">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead) => (
                        <tr
                          key={lead._id}
                          className="group transition-all"
                          style={{ borderTop: '1px solid var(--border)' }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              'var(--primary-soft)')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = 'transparent')
                          }
                        >
                          <td
                            className="py-4 px-6 font-bold"
                            style={{ color: 'var(--ink-900)' }}
                          >
                            {lead.firstName} {lead.surname}
                          </td>
                          <td
                            className="py-4 px-6 font-semibold"
                            style={{ color: 'var(--primary-dark)' }}
                          >
                            {lead.email}
                          </td>
                          <td
                            className="py-4 px-6 font-medium"
                            style={{ color: 'var(--ink-600)' }}
                          >
                            {lead.phone}
                          </td>
                          <td
                            className="py-4 px-6 font-medium"
                            style={{ color: 'var(--ink-600)' }}
                          >
                            {lead.company || '—'}
                          </td>
                          <td
                            className="py-4 px-6 text-xs font-semibold"
                            style={{ color: 'var(--ink-400)' }}
                          >
                            {new Date(lead.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              },
                            )}
                          </td>
                          <td className="py-4 px-6 text-right no-print">
                            <button
                              onClick={() => promptDelete(lead)}
                              title="Delete submission"
                              className="p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-transparent hover:border-red-200"
                              style={{
                                color: 'var(--warn)',
                                background: 'var(--warn-soft)',
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div
            className="rounded-3xl max-w-md w-full p-8 space-y-6 relative border bg-white"
            style={{ borderColor: 'var(--border)' }}
          >
            <button
              onClick={cancelDelete}
              className="absolute top-6 right-6 p-2 rounded-full transition-colors cursor-pointer"
              style={{ color: 'var(--ink-400)' }}
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--warn-soft)', color: 'var(--warn)' }}
            >
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3
                className="text-xl font-extrabold tracking-tight"
                style={{ color: 'var(--ink-900)' }}
              >
                Delete submission?
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--ink-600)' }}
              >
                This will permanently delete records for{' '}
                <span className="font-bold" style={{ color: 'var(--ink-900)' }}>
                  {leadToDelete?.firstName} {leadToDelete?.surname}
                </span>{' '}
                from your database.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={cancelDelete}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-colors cursor-pointer disabled:opacity-50 border bg-white"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--ink-600)',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-colors cursor-pointer disabled:opacity-50 text-white flex items-center justify-center gap-2"
                style={{ background: 'var(--warn)' }}
              >
                {isDeleting ? 'Deleting...' : 'Confirm delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
