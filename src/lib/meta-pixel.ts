// src/lib/meta-pixel.ts

declare global {
  interface Window {
    fbq: (...args: any[]) => void
  }
}

const safeFbq = (...args: any[]) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq(...args)
  }
}

const saveEventToDB = async (data: {
  eventName: string
  contentName?: string
  contentId?: string
  value?: number
  currency?: string
  location?: string
}) => {
  try {
    await fetch('/api/meta-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        path: typeof window !== 'undefined' ? window.location.pathname : null,
      }),
    })
  } catch (err) {
    console.error('Failed to save event to DB', err)
  }
}

// ===== Standard Events =====
export const trackPageView = () => {
  safeFbq('track', 'PageView')
  saveEventToDB({ eventName: 'PageView' })
}

export const trackViewContent = (data: {
  content_name: string
  content_ids?: string[]
  content_type?: 'product' | 'product_group'
  value?: number
  currency?: string
}) => {
  safeFbq('track', 'ViewContent', {
    content_name: data.content_name,
    content_ids: data.content_ids || [],
    content_type: data.content_type || 'product',
    value: data.value,
    currency: data.currency || 'USD',
  })

  saveEventToDB({
    eventName: 'ViewContent',
    contentName: data.content_name,
    contentId: data.content_ids?.[0],
    value: data.value,
    currency: data.currency,
  })
}

export const trackLead = (data?: {
  content_name?: string
  value?: number
  currency?: string
}) => {
  safeFbq('track', 'Lead', {
    content_name: data?.content_name,
    value: data?.value,
    currency: data?.currency || 'USD',
  })

  saveEventToDB({
    eventName: 'Lead',
    contentName: data?.content_name,
    value: data?.value,
    currency: data?.currency,
  })
}

export const trackContact = () => {
  safeFbq('track', 'Contact')
  saveEventToDB({ eventName: 'Contact' })
}

export const trackCompleteRegistration = () => {
  safeFbq('track', 'CompleteRegistration')
  saveEventToDB({ eventName: 'CompleteRegistration' })
}

export const trackSearch = (search_string: string) => {
  safeFbq('track', 'Search', { search_string })
  saveEventToDB({
    eventName: 'Search',
    contentName: search_string,
  })
}

export const trackInitiateCheckout = (data?: {
  value?: number
  currency?: string
  content_ids?: string[]
  num_items?: number
}) => {
  safeFbq('track', 'InitiateCheckout', {
    value: data?.value,
    currency: data?.currency || 'USD',
    content_ids: data?.content_ids || [],
    num_items: data?.num_items || 1,
  })

  saveEventToDB({
    eventName: 'InitiateCheckout',
    contentId: data?.content_ids?.[0],
    value: data?.value,
    currency: data?.currency,
  })
}

export const trackPurchase = (data: {
  value: number
  currency?: string
  content_ids?: string[]
  content_name?: string
  num_items?: number
}) => {
  safeFbq('track', 'Purchase', {
    value: data.value,
    currency: data.currency || 'USD',
    content_ids: data.content_ids || [],
    content_name: data.content_name,
    content_type: 'product',
    num_items: data.num_items || 1,
  })

  saveEventToDB({
    eventName: 'Purchase',
    contentName: data.content_name,
    contentId: data.content_ids?.[0],
    value: data.value,
    currency: data.currency,
  })
}

// ===== Custom Events =====
export const trackGetStartedClick = (location: string) => {
  safeFbq('trackCustom', 'GetStartedClick', { location })
  saveEventToDB({
    eventName: 'GetStartedClick',
    location,
  })
}

export const trackServiceInterest = (serviceName: string) => {
  safeFbq('trackCustom', 'ServiceInterest', { service_name: serviceName })
  saveEventToDB({
    eventName: 'ServiceInterest',
    contentName: serviceName,
  })
}

export const trackBookConsultation = (service?: string) => {
  safeFbq('trackCustom', 'BookConsultation', {
    service: service || 'general',
  })
  saveEventToDB({
    eventName: 'BookConsultation',
    contentName: service || 'general',
  })
}
