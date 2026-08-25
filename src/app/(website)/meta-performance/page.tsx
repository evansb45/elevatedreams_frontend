// src/app/(dashboard)/meta-performance/page.tsx

import { getDb } from '@/lib/mongodb'
import { format } from 'date-fns'
import { Calendar, Eye, MousePointerClick, TrendingUp } from 'lucide-react'

async function getStats() {
  try {
    const db = await getDb()
    const collection = db.collection('meta_events')

    const now = new Date()
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [
      totalEvents,
      last7DaysCount,
      last30DaysCount,
      eventsByType,
      recentEventsRaw,
      topServices,
    ] = await Promise.all([
      collection.countDocuments(),
      collection.countDocuments({ createdAt: { $gte: last7Days } }),
      collection.countDocuments({ createdAt: { $gte: last30Days } }),
      collection
        .aggregate([
          { $group: { _id: '$eventName', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ])
        .toArray(),
      collection.find().sort({ createdAt: -1 }).limit(20).toArray(),
      collection
        .aggregate([
          {
            $match: {
              contentName: { $ne: null },
              eventName: { $in: ['ViewContent', 'ServiceInterest', 'Lead'] },
            },
          },
          { $group: { _id: '$contentName', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 8 },
        ])
        .toArray(),
    ])

    // Convert MongoDB objects to plain objects (important!)
    const recentEvents = recentEventsRaw.map((event: any) => ({
      id: event._id.toString(),
      eventName: event.eventName,
      contentName: event.contentName || null,
      location: event.location || null,
      createdAt: event.createdAt
        ? new Date(event.createdAt).toISOString()
        : null,
    }))

    return {
      totalEvents,
      last7DaysCount,
      last30DaysCount,
      eventsByType,
      recentEvents,
      topServices,
      error: null,
    }
  } catch (error: any) {
    console.error('MongoDB Error:', error.message)
    return {
      totalEvents: 0,
      last7DaysCount: 0,
      last30DaysCount: 0,
      eventsByType: [],
      recentEvents: [],
      topServices: [],
      error: error.message || 'Failed to connect to MongoDB',
    }
  }
}

export default async function MetaPerformancePage() {
  const {
    totalEvents,
    last7DaysCount,
    last30DaysCount,
    eventsByType,
    recentEvents,
    topServices,
    error,
  } = await getStats()

  const getEventColor = (name: string) => {
    const colors: Record<string, string> = {
      PageView: 'bg-blue-100 text-blue-700',
      ViewContent: 'bg-purple-100 text-purple-700',
      Lead: 'bg-green-100 text-green-700',
      GetStartedClick: 'bg-orange-100 text-orange-700',
      ServiceInterest: 'bg-indigo-100 text-indigo-700',
      Purchase: 'bg-emerald-100 text-emerald-700',
      Contact: 'bg-pink-100 text-pink-700',
      BookConsultation: 'bg-cyan-100 text-cyan-700',
    }
    return colors[name] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Meta Pixel Performance
        </h1>
        <p className="text-gray-500 mt-1">
          Track all clicks, leads and conversions from your ads & website
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          <strong>Database connection error:</strong> {error}
          <br />
          <span className="text-red-600/80">
            Check your MONGODB_URI and make sure your IP is allowed in MongoDB
            Atlas → Network Access.
          </span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Events"
          value={totalEvents}
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
          bg="bg-blue-50"
        />
        <StatCard
          title="Last 7 Days"
          value={last7DaysCount}
          icon={<Calendar className="w-6 h-6 text-green-600" />}
          bg="bg-green-50"
        />
        <StatCard
          title="Last 30 Days"
          value={last30DaysCount}
          icon={<Eye className="w-6 h-6 text-purple-600" />}
          bg="bg-purple-50"
        />
        <StatCard
          title="Event Types"
          value={eventsByType.length}
          icon={<MousePointerClick className="w-6 h-6 text-orange-600" />}
          bg="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events by Type */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Events by Type</h2>
          </div>
          <div className="p-4 space-y-2">
            {eventsByType.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                No events yet
              </p>
            ) : (
              eventsByType.map((item: any) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${getEventColor(
                      item._id,
                    )}`}
                  >
                    {item._id}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {item.count.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Top Services</h2>
          </div>
          <div className="p-4 space-y-2">
            {topServices.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                No service data yet
              </p>
            ) : (
              topServices.map((item: any, index: number) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-600 flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-800 truncate max-w-[160px]">
                      {item._id}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {item.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-50 max-h-[420px] overflow-y-auto">
            {recentEvents.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-12">
                No events recorded yet
              </p>
            ) : (
              recentEvents.map((event: any) => (
                <div
                  key={event.id}
                  className="px-5 py-3.5 hover:bg-gray-50/80 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span
                        className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-1 ${getEventColor(
                          event.eventName,
                        )}`}
                      >
                        {event.eventName}
                      </span>
                      {event.contentName && (
                        <p className="text-sm text-gray-800 font-medium truncate max-w-[180px]">
                          {event.contentName}
                        </p>
                      )}
                      {event.location && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          from {event.location}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {event.createdAt
                        ? format(new Date(event.createdAt), 'MMM d, HH:mm')
                        : '—'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  bg,
}: {
  title: string
  value: number
  icon: React.ReactNode
  bg: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {value.toLocaleString()}
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}
