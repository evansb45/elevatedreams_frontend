import AdminDashboard from '@/components/dashboard/dashboard'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Admin Dashboard | E-book Submissions & Analytics',
  description:
    'Monitor incoming e-book leads, track landing page traffic, and analyze conversion metrics in real-time.',
  openGraph: {
    title: 'Admin Dashboard | E-book Submissions & Analytics',
    description:
      'Monitor incoming e-book leads, track landing page traffic, and analyze conversion metrics in real-time.',
    type: 'website',
  },
}

type Props = {}

const EbookDashboard = (props: Props) => {
  return (
    <div>
      <AdminDashboard />
    </div>
  )
}

export default EbookDashboard
