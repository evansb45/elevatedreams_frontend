// src/app/api/meta-events/route.ts

import { getDb } from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      eventName,
      contentName,
      contentId,
      value,
      currency,
      location,
      path,
    } = body

    if (!eventName) {
      return NextResponse.json(
        { error: 'eventName is required' },
        { status: 400 },
      )
    }

    const db = await getDb()

    const event = {
      eventName,
      contentName: contentName || null,
      contentId: contentId || null,
      value: value ? Number(value) : null,
      currency: currency || 'USD',
      location: location || null,
      path: path || null,
      userAgent: req.headers.get('user-agent') || null,
      ip:
        req.headers.get('x-forwarded-for') ||
        req.headers.get('x-real-ip') ||
        null,
      createdAt: new Date(),
    }

    await db.collection('meta_events').insertOne(event)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save meta event:', error)
    return NextResponse.json({ error: 'Failed to save event' }, { status: 500 })
  }
}
