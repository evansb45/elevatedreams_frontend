import WidgetScript from '@/components/shared/widget/widget-script'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '../providers'
import LayoutWrapper from './layout-wrapper'
//import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Elevate Dreams - Your Path to Business Success',
  description:
    'Expert guidance in EB1, EB2, and EB5 visa applications, simplifying immigration law for your future success.',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <MetaPixel /> */}
        <Providers>
          {/* <WidgetScript /> */}
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  )
}
