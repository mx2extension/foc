import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action } = body

    const params = new URLSearchParams()
    params.append('key', process.env.SMM_API_KEY || '')
    params.append('action', action)

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
    return NextResponse.json({ error: 'Failed to connect to SMM API' }, { status: 500 })
  }
}

// NEW: Safe add action that queues if balance is low
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    
    // 1. Try to place the order directly on ReallySimpleSocial
    const params = new URLSearchParams()
    params.append('key', process.env.SMM_API_KEY || '')
    params.append('action', 'add')
    params.append('service', body.service_id)
    params.append('link', body.link)
    params.append('quantity', String(body.quantity))

    const res = await fetch(process.env.SMM_API_URL || 'https://reallysimplesocial.com/api/v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    })

    const data = await res.json()

    // 2. If successful, return the order ID immediately
    if (data.order) {
      return NextResponse.json({ status: 'success', order: data.order })
    }

    // 3. If it failed (e.g., insufficient balance), save to Supabase pending_smm_orders
    const { error } = await supabase.from('pending_smm_orders').insert({
      reader_email: body.email,
      service_id: body.service_id,
      service_name: body.service_name,
      link: body.link,
      quantity: body.quantity,
      amount_paid: body.amount_paid,
      payment_reference: body.reference
    })

    if (error) throw error

    // 4. Return a "queued" status so the frontend knows it's processing
    return NextResponse.json({ status: 'queued', message: 'Order is in the processing queue.' })

  } catch (error) {
    console.error('Safe SMM Add Error:', error)
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 })
  }
}