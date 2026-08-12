import { NextResponse } from 'next/server'
import { searchProviders } from '@/lib/agent'

// Meta WhatsApp Webhook Verification
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN

  console.log('WhatsApp verification request:', {
    mode,
    tokenReceived: token,
    tokenExpected: VERIFY_TOKEN,
    challenge,
  })

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified successfully')
    return new NextResponse(challenge, { status: 200 })
  }

  console.error('WhatsApp webhook verification failed')
  return new NextResponse('Forbidden', { status: 403 })
}

// WhatsApp Incoming Messages
export async function POST(req: Request) {
  try {
    const body = await req.json()

    console.log('WhatsApp webhook received:', JSON.stringify(body))

    if (
      body.object &&
      body.entry &&
      body.entry[0]?.changes &&
      body.entry[0].changes[0]?.value?.messages
    ) {
      const messageObj =
        body.entry[0].changes[0].value.messages[0]

      const from = messageObj.from

      // Only process text messages
      if (messageObj.type !== 'text') {
        return NextResponse.json({ status: 'ok' })
      }

      const text = messageObj.text?.body

      if (!text) {
        return NextResponse.json({ status: 'ok' })
      }

      // Search database
      const providers = await searchProviders(text)

      let replyText = ''

      if (providers.length > 0) {
        replyText =
          `I found ${providers.length} provider(s) matching your request:\n\n`

        providers.forEach((p, index) => {
          const verified =
            p.verification_status === 'verified'
              ? '✓ Verified\n'
              : ''

          replyText += `${index + 1}. ${p.full_name}\n`
          replyText += verified
          replyText += `📍 ${p.city}, ${p.country}\n`
          replyText += `💼 ${p.profession}\n`
          replyText += `View Profile: https://findoncampus.com/providers/${p.id}\n`

          if (p.whatsapp) {
            const waNumber = p.whatsapp.replace(/[^0-9]/g, '')
            replyText += `Contact: https://wa.me/${waNumber}\n`
          }

          replyText += '\n'
        })
      } else {
        replyText =
          "I couldn't find a provider matching your request. " +
          "Try searching for a 'graphic designer in Abuja' " +
          "or a 'web developer in Lagos'."
      }

      // Send response to WhatsApp
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: from,
            type: 'text',
            text: {
              body: replyText,
            },
          }),
        }
      )

      const responseData = await response.json()

      console.log('WhatsApp API response:', responseData)
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('WhatsApp Webhook Error:', error)

    return NextResponse.json(
      { error: 'Failed' },
      { status: 500 }
    )
  }
}