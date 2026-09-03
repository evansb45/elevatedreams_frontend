import { dbConnect } from '@/lib/dbConnect'
import EbookLead from '@/models/EbookLead'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await dbConnect()

    // Fetch leads sorted by newest first
    const leads = await EbookLead.find({}).sort({ createdAt: -1 }).lean()

    return NextResponse.json({ success: true, data: leads }, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 },
      )
    }

    const deletedLead = await EbookLead.findByIdAndDelete(id)

    if (!deletedLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    return NextResponse.json(
      { success: true, message: 'Lead deleted successfully' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Failed to delete submission:', error)
    return NextResponse.json(
      { error: 'Failed to delete submission' },
      { status: 500 },
    )
  }
}
