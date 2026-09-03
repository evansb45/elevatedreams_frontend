'use client'

import Footer from '@/components/shared/footer/footer'
import Navbar from '@/components/shared/navbar/navbar'
import { usePathname } from 'next/navigation'

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Array of paths where Navbar and Footer should NOT be displayed
  const excludedRoutes = ['/ebook', '/overview']

  // Checks exact matches and sub-routes (e.g., /dashboard/subpage)
  const isExcluded = excludedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )

  return (
    <>
      {!isExcluded && <Navbar />}
      {children}
      {!isExcluded && <Footer />}
    </>
  )
}
