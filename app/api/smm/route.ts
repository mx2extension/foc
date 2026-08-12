import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action } = body

    const params = new URLSearchParams()
    params.append('key', process.env.SMM_API_KEY || '')
    params.append('action', action)

    // Add parameters based on the action
    if (action === 'add') {
      params.append('service', body.service)
      params.append('link', body.link)
      params.append('quantity', body.quantity)
    } else if (action === 'status') {
      params.append('order', body.order)
    }

    const res = await fetch(process.env.SMM_API_URL || 'https://reallysimplesocial.com/api/v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    })

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('SMM API Error:', error)
    return NextResponse.json({ error: 'Failed to connect to SMM API' }, { status: 500 })
  }
}