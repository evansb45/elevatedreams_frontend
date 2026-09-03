import { dbConnect } from '@/lib/dbConnect'
import { ButtonClick, PageView } from '@/models/Analytics'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Analytics API GET: Connecting to database...')
    await dbConnect()

    const pageViews = await PageView.find({})
    const buttonClicks = await ButtonClick.find({}).sort({ createdAt: -1 })

    // Aggregate the numbers the dashboard expects
    const visits = pageViews.reduce((sum, pv) => sum + (pv.count || 0), 0)
    const clicks = buttonClicks.length
    const conversionRate =
      visits > 0 ? ((clicks / visits) * 100).toFixed(1) + '%' : '0%'

    console.log('Analytics API GET Success:', {
      pageViewsCount: pageViews.length,
      buttonClicksCount: buttonClicks.length,
      visits,
      clicks,
      conversionRate,
    })

    return NextResponse.json(
      {
        success: true,
        visits,
        clicks,
        conversionRate,
        data: { pageViews, buttonClicks },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('API error fetching analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Server Error' },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    console.log('Analytics API POST: Connecting to database...')
    await dbConnect()

    const body = await req.json()
    console.log('Analytics API POST Request Body:', body)

    const { type, payload } = body

    if (type === 'page_view') {
      const path = payload || '/ebook'
      console.log(`Analytics API POST: Upserting page_view for path: ${path}`)
      const updatedPageView = await PageView.findOneAndUpdate(
        { path },
        { $inc: { count: 1 } },
        { upsert: true, new: true },
      )
      console.log('PageView updated successfully:', updatedPageView)
    } else if (type === 'button_click') {
      const buttonName = payload || 'Unknown Button'
      console.log(
        `Analytics API POST: Creating button_click record for button: ${buttonName}`,
      )
      const newClick = await ButtonClick.create({
        buttonName,
        path: '/ebook',
      })
      console.log('ButtonClick created successfully:', newClick)
    } else {
      console.warn(
        'Analytics API POST Warning: Unrecognized event type received:',
        type,
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('API error recording analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Server Error' },
      { status: 500 },
    )
  }
}
