'use client'

import countries from '@/components/pages/contact-us/countries'
import emailjs from '@emailjs/browser'
import React, { useState } from 'react'
import { FaLocationDot, FaPhone, FaRegEnvelope } from 'react-icons/fa6'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    service: '',
    message: '',
  })

  const [isSending, setIsSending] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Handle input changes
  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handle form submission
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsSending(true)
    setSuccessMessage('')
    setErrorMessage('')

    // EmailJS credentials
    const serviceId = 'service_58p9tmg' // Your Gmail service ID
    const templateId = 'template_ktn1fwf' // Your template ID
    const userId = 'Wo1ApL4O8WllAjl4h' // Correct User ID from EmailJS dashboard

    // Initialize EmailJS with your User ID
    emailjs.init(userId)

    // Send the email using EmailJS
    emailjs
      .send(serviceId, templateId, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        service: formData.service,
        message: formData.message,
      })
      .then((response) => {
        setSuccessMessage('Your message has been sent successfully!')
        setIsSending(false)
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          country: '',
          service: '',
          message: '',
        })
      })
      .catch((error) => {
        setErrorMessage('Something went wrong. Please try again.')
        setIsSending(false)
        console.error('EmailJS error:', error)
        if (error.text) {
          console.error('Error details:', error.text)
        }
      })
  }

  return (
    <div className="def-contain mb-8 lg:mt-16">
      <div className="grid 2xl:gap-8 lg:grid-cols-2">
        {/* Contact Info Section */}
        <div className="flex flex-col justify-center items-center lg:items-start font-jakarta">
          <h1 className="text-5xl font-semibold pb-8">Get in Touch with Us</h1>
          <div className="grid gap-5">
            <div className="flex items-start gap-3">
              <div className="bg-primary/5 p-3 rounded-full mt-0.5">
                <FaLocationDot color="#006965" size={22} />
              </div>
              <div>
                <p className="text-footerText text-sm font-semibold uppercase tracking-wide mb-0.5">
                  Houston Office
                </p>
                <p className="text-footerText text-lg font-thin">
                  4201 Main St Suite 200,
                </p>
                <p className="text-footerText text-lg font-thin">
                  Houston, TX 77002, USA
                </p>
                <p className="text-footerText text-lg font-thin">
                  Phone: 713-244-6695
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary/5 p-3 rounded-full mt-0.5">
                <FaLocationDot color="#006965" size={22} />
              </div>
              <div>
                <p className="text-footerText text-sm font-semibold uppercase tracking-wide mb-0.5">
                  Dallas Office
                </p>
                <p className="text-footerText text-lg font-thin">
                  910 S. Pearl Expy, Dallas,
                </p>
                <p className="text-footerText text-lg font-thin">
                  TX 75201, USA
                </p>
                <p className="text-footerText text-lg font-thin">
                  Phone: 214-432-3113
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary/5 p-3 rounded-full mt-0.5">
                <FaLocationDot color="#006965" size={22} />
              </div>
              <div>
                <p className="text-footerText text-sm font-semibold uppercase tracking-wide mb-0.5">
                  Port Harcourt Office
                </p>
                <p className="text-footerText text-lg font-thin">
                  ExpertHub Tank, Rumukwurusi,
                </p>
                <p className="text-footerText text-lg font-thin">
                  Port Harcourt, Rivers State, Nigeria
                </p>
                <p className="text-footerText text-lg font-thin">
                  Phone: +234 811 848 4516
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/5 p-3 rounded-full">
                <FaRegEnvelope color="#006965" size={22} />
              </div>
              <p className="text-footerText text-lg font-thin">
                assist@elevatedreams.com
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-base rounded-3xl p-5 lg:px-8 lg:py-16">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
              className="p-5 rounded-lg w-full"
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <input
              className="p-5 rounded-lg w-full"
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              className="p-5 rounded-lg w-full"
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <select
              className="p-5 rounded-lg w-full"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="">Select Country of Residence</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <select
              className="p-5 rounded-lg w-full"
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value="">What Services are you interested in?</option>
              <option value="eb1-eb2">
                Immigration (EB1 & EB2 Visa Pathways)
              </option>
              <option value="eb5">Immigration (EB5 Visa Pathway)</option>
              <option value="business">International Business Formation</option>
              <option value="intellectual">Intellectual Property</option>
              <option value="inquiries">Just Making Inquiries</option>
            </select>
            <textarea
              placeholder="Brief Description of Your Situation or Goals"
              className="p-5 rounded-lg h-40 w-full"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="mt-10 w-full text-lg bg-primary text-white py-3 rounded-lg"
              disabled={isSending}
            >
              {isSending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
          {successMessage && (
            <p className="text-green-600 mt-3">{successMessage}</p>
          )}
          {errorMessage && <p className="text-red-600 mt-3">{errorMessage}</p>}
        </div>
      </div>
    </div>
  )
}

export default ContactForm
