import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const reference = searchParams.get('reference')

  if (!reference) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/error`)

  // 1. Verify transaction with Paystack server-side
  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()

  // 2. If successful, update database
  if (data.status && data.data.status === 'success') {
    const { metadata, amount } = data.data
    
    // Update payment record to success
    await supabase.from('payments').update({ status: 'success' }).eq('reference', reference)

    // Handle specific item types based on metadata
    if (metadata.item_type === 'verification') {
      // Set provider status to 'pending_verification_review'
      await supabase
        .from('providers')
        .update({ verification_status: 'pending_verification_review' })
        .eq('email', metadata.email)
      
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/success?type=verification`)
    }

    // Note: For books and courses, you would typically generate a signed Supabase Storage URL 
    // or email the download link here. For MVP, we redirect to a success page.
    if (metadata.item_type === 'book') {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/success?type=book`)
    }
    
    if (metadata.item_type === 'course') {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/success?type=course`)
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/success`)
  }

  // If failed
  await supabase.from('payments').update({ status: 'failed' }).eq('reference', reference)
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/error`)
}