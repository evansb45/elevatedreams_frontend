'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { linksData } from '.'
import LinkButton from '../button/link-button'
import MobileNavbar from './mobile/navbar'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null) // To store the timeout ID
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
    if (timeoutId) clearTimeout(timeoutId) // Clear any existing timeout when mouse enters
    setDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    const id = setTimeout(() => setDropdownOpen(false), 300) // Delay before hiding the dropdown
    setTimeoutId(id) // Save timeout ID to clear it if mouse enters before timeout completes
  }

  return (
    <nav className={`fixed bg-white top-0 w-full z-50 shadow-lg`}>
      <div className="def-contain">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <Image
              src={'/images/logo.png'}
              alt={'blog'}
              width={1200}
              height={900}
              className="w-32 object-cover"
            />
          </Link>
          <div className="hidden lg:flex space-x-8 items-center">
            {linksData.map((el, index) => {
              if (el.name === 'Services') {
                return (
                  <div
                    key={index}
                    className="relative flex items-center"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Clicking this navigates to /services */}
                    <Link
                      href={el.url}
                      className={`${
                        pathname === el.url ? 'text-primary' : 'text-gray-500'
                      } hover:text-gray-700 text-sm`}
                    >
                      {el.name}
                    </Link>

                    {/* Clicking the down arrow toggles the dropdown */}
                    <span
                      className="ml-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation() // Prevent navigation when clicking the arrow
                        setDropdownOpen(!dropdownOpen)
                      }}
                    >
                      ▼
                    </span>

                    {dropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border rounded w-48">
                        <Link
                          href="/immigration"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-primary"
                        >
                          Immigration
                        </Link>
                        <Link
                          href="/international-business-formation"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-primary"
                        >
                          International Business Formation
                        </Link>
                        <Link
                          href="/intellectual-Property"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-primary"
                        >
                          Intellectual Property Protection
                        </Link>
                      </div>
                    )}
                  </div>
                )
              }
              return (
                <Link
                  key={index}
                  href={el.url}
                  className={`${
                    pathname === el.url ? 'text-primary' : 'text-gray-500'
                  } hover:text-gray-700 text-sm`}
                >
                  {el.name}
                </Link>
              )
            })}
            {/* <Image
              src={'/icons/whatsapp.svg'}
              alt={'blog'}
              width={1200}
              height={900}
              className="h-6 w-6 object-cover"
            /> */}
            <div className="flex-center gap-3">
              <LinkButton
                url={'/login'}
                label={'Log in'}
                className="border border-primary bg-transparent text-primary hover:text-white py-3"
              ></LinkButton>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded">
                <a
                  href="https://www.experthubllc.com/book/Elevate-Dreams"
                  target="_blank"
                >
                  Get Started
                </a>
              </button>
            </div>
          </div>
          <div className="lg:hidden flex space-x-5 items-center">
            {/* <Image
              src={'/icons/whatsapp.svg'}
              alt={'blog'}
              width={1200}
              height={900}
              className="h-6 w-6 object-cover"
            /> */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-gray-600 hover:text-gray-300 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
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
