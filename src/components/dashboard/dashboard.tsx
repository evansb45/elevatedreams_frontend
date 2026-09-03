'use client'

import {
  AlertTriangle,
  Calendar as CalendarIcon,
  Download,
  FileSpreadsheet,
  RefreshCw,
  Search,
  Trash2,
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

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Date filtering states ("all", "today", "7days", "30days")
  const [dateFilter, setDateFilter] = useState('all')

  // Modal State Control & Target Lead for Deletion
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/submissions')
      const result = await res.json()
      if (res.ok) {
        setLeads(result.data || [])
      }
    } catch (err) {
      console.error('Failed to load leads', err)
    } finally {
      setLoading(false)
    }
  }

  // Step 1: Open Modal & Save target ID to LocalStorage
  const promptDelete = (lead: Lead) => {
    setLeadToDelete(lead)
    localStorage.setItem('pending_delete_lead_id', lead._id)
    setIsModalOpen(true)
  }

  // Step 2: Confirm Delete from LocalStorage ID with fallback cleanup
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
      // Always clear localStorage ID and close modal, even if deletion failed
      localStorage.removeItem('pending_delete_lead_id')
      setIsDeleting(false)
      setIsModalOpen(false)
      setLeadToDelete(null)
    }
  }

  // Cancel Modal & Clear LocalStorage
  const cancelDelete = () => {
    localStorage.removeItem('pending_delete_lead_id')
    setIsModalOpen(false)
    setLeadToDelete(null)
  }

  // Export to Excel (.xlsx)
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

  // Export to PDF (Print / Save as PDF view)
  const exportToPDF = () => {
    window.print()
  }

  // Filter leads based on Search and Date filter
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
      className="min-h-screen py-16 px-4 sm:px-8 bg-slate-50 text-slate-900 relative"
      style={{ fontFamily: "'Rethink Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap');
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @media print {
          body { background: white !important; color: black !important; }
          button, input, select, .no-print { display: none !important; }
          table { width: 100% !important; border: 1px solid #cbd5e1 !important; }
          th, td { border: 1px solid #cbd5e1 !important; color: black !important; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              E-book Submissions
            </h1>
            <p
              style={{ color: '#000' }}
              className="text-slate-900 mt-1 text-sm sm:text-base"
            >
              Manage leads, evaluate resource metrics, and export reports
              effortlessly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 no-print">
            {/* Refresh / Reload Button */}
            <button
              onClick={fetchLeads}
              disabled={loading}
              title="Reload submissions"
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold shadow-xs transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              />
            </button>

            {/* Excel Export Button */}
            <button
              onClick={exportToExcel}
              disabled={filteredLeads.length === 0 || loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Excel</span>
            </button>

            {/* PDF Export Button */}
            <button
              onClick={exportToPDF}
              disabled={filteredLeads.length === 0 || loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Submissions
            </span>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              {leads.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Filtered Results
            </span>
            <p className="text-3xl font-extrabold text-teal-600 mt-2">
              {filteredLeads.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Unique Companies
            </span>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              {new Set(leads.map((l) => l.company).filter(Boolean)).size}
            </p>
          </div>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center no-print">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
            />
          </div>

          {/* Date Filter Selection */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <CalendarIcon className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
              Filter:
            </span>
            {[
              { label: 'All Time', value: 'all' },
              { label: 'Today', value: 'today' },
              { label: 'Last 7 Days', value: '7days' },
              { label: 'Last 30 Days', value: '30days' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setDateFilter(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  dateFilter === tab.value
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-400 text-xs uppercase tracking-wider font-bold">
                    <th className="py-3.5 px-5">Full Name</th>
                    <th className="py-3.5 px-5">Email Address</th>
                    <th className="py-3.5 px-5">Phone</th>
                    <th className="py-3.5 px-5">Company</th>
                    <th className="py-3.5 px-5">Date</th>
                    <th className="py-3.5 px-5 text-right no-print">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[1, 2, 3, 4, 5].map((row) => (
                    <tr key={row}>
                      <td className="py-4 px-5">
                        <div className="h-4 w-32 rounded animate-shimmer"></div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="h-4 w-44 rounded animate-shimmer"></div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="h-4 w-28 rounded animate-shimmer"></div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="h-4 w-20 rounded animate-shimmer"></div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="h-4 w-24 rounded animate-shimmer"></div>
                      </td>
                      <td className="py-4 px-5 text-right no-print">
                        <div className="h-8 w-8 rounded ml-auto animate-shimmer"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm font-medium">
              No matching submissions found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-400 text-xs uppercase tracking-wider font-bold">
                    <th className="py-3.5 px-5">Full Name</th>
                    <th className="py-3.5 px-5">Email Address</th>
                    <th className="py-3.5 px-5">Phone</th>
                    <th className="py-3.5 px-5">Company</th>
                    <th className="py-3.5 px-5">Date</th>
                    <th className="py-3.5 px-5 text-right no-print">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead._id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-4 px-5 font-semibold text-slate-900">
                        {lead.firstName} {lead.surname}
                      </td>
                      <td className="py-4 px-5 text-teal-600 font-medium">
                        {lead.email}
                      </td>
                      <td className="py-4 px-5 text-slate-600">{lead.phone}</td>
                      <td className="py-4 px-5 text-slate-600">
                        {lead.company || '—'}
                      </td>
                      <td className="py-4 px-5 text-slate-500 text-xs">
                        {new Date(lead.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-5 text-right no-print">
                        <button
                          onClick={() => promptDelete(lead)}
                          title="Delete submission"
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
      </div>

      {/* BLURRED BACKGROUND CONFIRMATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative">
            {/* Close Icon Button */}
            <button
              onClick={cancelDelete}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Warning Icon Header */}
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-2">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Delete Submission?
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-slate-800">
                  {leadToDelete?.firstName} {leadToDelete?.surname}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={cancelDelete}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all text-sm cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-all text-sm shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
