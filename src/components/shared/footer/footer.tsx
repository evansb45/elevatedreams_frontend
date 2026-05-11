'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import {
  FaClock,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaRegEnvelope,
  FaTiktok,
  FaXTwitter,
} from 'react-icons/fa6'
import FooterLinks from './footer-links'
import SocialLinks from './footer-social-links'

const footerLinks = [
  { label: 'About Us', href: '/about-us' },
  { label: 'Services', href: '/services' },
  { label: 'Our Team', href: '/our-team' },
  { label: 'Blogs', href: '/' },
  { label: 'Contact Us', href: '/contact-us' },
]

export const socialLinks = [
  {
    icon: <FaXTwitter className="text-lg" />,
    href: 'https://x.com/elgdreams55370?s=21&t=fUwimDHibflD8nGOhBheyQ',
  },
  {
    icon: <FaInstagram className="text-lg" />,
    href: 'https://www.instagram.com/elevatedreamselg/profilecard/?igsh=YWdmbXkxaGVxdms=',
  },
  {
    icon: <FaLinkedin className="text-lg" />,
    href: 'https://www.linkedin.com/company/elevatedreamselg/',
  },
  {
    icon: <FaFacebook className="text-lg" />,
    href: 'https://www.facebook.com/share/S7YuBQZYZZjVx5Ky/?mibextid=LQQJ4d',
  },
  {
    icon: <FaTiktok className="text-lg" />,
    href: 'https://www.tiktok.com/@elevatedreamselg?_t=8s4QSRW6Pgk&_r=1',
  },
]

export const Footer = () => {
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

  return (
    <div className={`md:def-contain`}>
      <motion.div
        initial={{ opacity: 0, translateY: 100 }}
        whileInView={{ opacity: [0, 1], translateY: [100, 0] }}
        animate={{ opacity: [0, 1], translateY: [100, 0] }}
        transition={{ delay: 0.4, duration: 1, ease: 'easeInOut' }}
        viewport={{ once: true }}
        className=" bg-footer md:rounded-[40px] p-8 lg:p-12 2xl:p-24 mb-8 w-full"
      >
        <div>
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
            {/* Logo and address */}
            <div className=" w-full  md:col-span-2">
              <Link href={'/'}>
                <Image
                  src="/images/logo.png"
                  width={116}
                  height={52}
                  alt="logo"
                />
              </Link>

              <p className="mt-8 max-w-xs lg:max-w-none w-full md:w-96 text-footerText font-medium text-medium ">
                <h3 className="text-secondary">Dallas Office:</h3>
                <p>
                  910 S. Pearl Expy, Dallas, <br /> TX 75201, USA
                </p>{' '}
                <p> Phone: 214-432-3113 </p>
              </p>

              <p className="mt-8 max-w-xs lg:max-w-none w-full md:w-96 text-footerText font-medium text-medium ">
                <h3 className="text-secondary">Houston Office:</h3>
                <p>4201 Main St Suite 200, Houston, TX 77002, USA</p>
                <p>Phone: 713-244-6695</p>
              </p>

              <p className="mt-8 max-w-xs lg:max-w-none w-full md:w-96 text-footerText font-medium text-medium ">
                <h3 className="text-secondary">Port Harcourt Office:</h3>
                ExpertHub Tank, Rumukwurusi, Port Harcourt, Rivers State,
                Nigeria
              </p>
              <p className=" text-footerText font-medium text-medium">
                Phone: +234 811 848 4516{' '}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5  col-span-3">
              {/* Pages */}
              <div className="flex flex-col w-full sm:w-1/2 lg:w-auto">
                <h2 className="font-bold ml-0 mb-6 text-xl text-secondary">
                  Pages
                </h2>
                <FooterLinks links={footerLinks} />
              </div>

              {/* Contact Us */}
              <div className="w-full sm:w-1/2 lg:w-auto ">
                <h2 className="font-bold mb-6 text-xl text-secondary">
                  Contact Us
                </h2>
                <div className="grid gap-5">
                  <div className="flex-center gap-2">
                    <div className="bg-primary/5 p-3 rounded-full">
                      <FaRegEnvelope
                        color="#006965"
                        size={16}
                        className="text-2xl"
                      />
                    </div>
                    <p className="text-footerText text-sm md:text-lg">
                      assist@elevatedreams.com
                    </p>
                  </div>
                  <div className="flex-center gap-2">
                    <div className="bg-primary/5 p-3 rounded-full">
                      <FaPhone color="#006965" size={16} className="text-2xl" />
                    </div>
                    <p className="text-footerText text-sm md:text-lg">
                      +234 811 848 4516
                    </p>
                  </div>
                  <div className="flex-center gap-2">
                    <div className="bg-primary/5 p-3 rounded-full">
                      <FaClock color="#006965" size={16} className="text-2xl" />
                    </div>
                    <p className="text-footerText text-sm md:text-lg">
                      Mon - Fri: 8:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer Bottom: Social Links and Copyright */}
        <div className="flex flex-col items-center mt-16">
          <SocialLinks links={socialLinks} />
          <p className="text-center mt-4">
            © {new Date().getFullYear()} Built by Elevate Dreams. All rights
            reserved.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Footer
