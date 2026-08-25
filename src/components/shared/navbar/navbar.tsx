'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { linksData } from '.'
import MobileNavbar from './mobile/navbar'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const pathname = usePathname()

  const hideFooterPaths = [
    '/login',
    '/register',
    '/reset-password',
    '/verify-otp',
    '/forgot-password',
  ]

  if (hideFooterPaths.includes(pathname)) {
    return null
  }

  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId)
    setDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    const id = setTimeout(() => setDropdownOpen(false), 200)
    setTimeoutId(id)
  }

  const services = [
    {
      href: '/immigration',
      title: 'Immigration',
      description: 'Visas, green cards & citizenship support',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
          />
        </svg>
      ),
    },
    {
      href: '/international-business-formation',
      title: 'International Business Formation',
      description: 'Company setup & global expansion',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
          />
        </svg>
      ),
    },
    {
      href: '/intellectual-Property',
      title: 'Intellectual Property Protection',
      description: 'Trademarks, patents & copyrights',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
      ),
    },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="def-contain px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <Image
              src="/images/logo.png"
              alt="logo"
              width={1200}
              height={900}
              className="w-24 sm:w-28 md:w-32 object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {linksData.map((el, index) => {
              if (el.name === 'Services') {
                return (
                  <div
                    key={index}
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="flex items-center">
                      <Link
                        href={el.url}
                        className={`relative px-3 xl:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          pathname === el.url ||
                          pathname.startsWith('/immigration') ||
                          pathname.startsWith('/international-business') ||
                          pathname.startsWith('/intellectual')
                            ? 'text-primary bg-primary/5'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {el.name}
                      </Link>

                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          setDropdownOpen(!dropdownOpen)
                        }}
                        className={`-ml-0.5 p-1.5 rounded-lg transition-all duration-200 ${
                          dropdownOpen
                            ? 'bg-gray-100 text-gray-700'
                            : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                        }`}
                        aria-label="Toggle services menu"
                      >
                        <svg
                          className={`w-4 h-4 transition-transform duration-300 ease-out ${
                            dropdownOpen ? 'rotate-180' : ''
                          }`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>
                    </div>

                    {/* Mega Menu Dropdown */}
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[680px] origin-top transition-all duration-200 ease-out ${
                        dropdownOpen
                          ? 'opacity-100 scale-100 translate-y-0'
                          : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
                      }`}
                    >
                      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex">
                        {/* Left Panel */}
                        <div className="w-[240px] bg-primary/5 p-6 flex flex-col">
                          <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center mb-5">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                              />
                            </svg>
                          </div>

                          <p className="text-xs font-semibold tracking-wider text-primary uppercase mb-2">
                            Our Services
                          </p>
                          <h3 className="text-xl font-bold text-gray-900 leading-snug mb-3">
                            Expert solutions for your goals
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed mb-6">
                            From immigration to business formation and IP
                            protection — we guide you every step of the way.
                          </p>

                          <Link
                            href="/services"
                            className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4"
                          >
                            View all services
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                              />
                            </svg>
                          </Link>
                        </div>

                        {/* Right Panel - Links */}
                        <div className="flex-1 p-4">
                          {services.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`flex items-start gap-4 p-3 rounded-xl transition-all duration-150 group ${
                                pathname === item.href
                                  ? 'bg-primary/5'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <div
                                className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                  pathname === item.href
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-gray-100 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary'
                                }`}
                              >
                                {item.icon}
                              </div>
                              <div>
                                <p
                                  className={`text-sm font-semibold ${
                                    pathname === item.href
                                      ? 'text-primary'
                                      : 'text-gray-900 group-hover:text-primary'
                                  }`}
                                >
                                  {item.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <Link
                  key={index}
                  href={el.url}
                  className={`relative px-3 xl:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    pathname === el.url
                      ? 'text-primary bg-primary/5'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {el.name}
                </Link>
              )
            })}

            {/* CTA Button */}
            <a
              href="https://www.experthubllc.com/book/Elevate-Dreams"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 xl:ml-3 inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-full shadow-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-md hover:scale-[1.03] active:scale-[0.98]"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 focus:outline-none transition-all duration-200"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && <MobileNavbar isOpen setIsOpen={setIsOpen} path={pathname} />}
    </nav>
  )
}

export default Navbar
