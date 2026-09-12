import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')
  const keywords = searchParams.get('keywords') || ''
  const productId = searchParams.get('product_id') || ''

  const APP_KEY = process.env.ALIEXPRESS_APP_KEY
  const APP_SECRET = process.env.ALIEXPRESS_APP_SECRET

  // 1. If keys aren't set yet, return mock data so the UI still works for development
  if (!APP_KEY || !APP_SECRET) {
    if (action === 'search') {
      return NextResponse.json({
        products: [
          { product_id: '1', product_title: 'AliExpress Product (API Pending)', product_main_image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', target_sale_price: '20.00', target_sale_price_currency: 'USD' }
        ]
      })
    }
    return NextResponse.json({ error: 'Missing AliExpress credentials' })
  }

  // 2. Helper function to generate the MD5 signature AliExpress requires
  const generateSign = (params: Record<string, string>) => {
    const sortedKeys = Object.keys(params).sort()
    let query = ''
    for (const key of sortedKeys) {
      query += key + params[key]
    }
    const stringToSign = APP_SECRET + query + APP_SECRET
    return crypto.createHash('md5').update(stringToSign).digest('hex').toUpperCase()
  }

  const baseParams = {
    app_key: APP_KEY,
    timestamp: Date.now().toString(),
    sign_method: 'md5'
  }

  try {
    if (action === 'search') {
      const apiParams = {
        ...baseParams,
        method: 'aliexpress.solution.product.query', // Dropshipping product query
        keywords: keywords,
        page_size: '20'
      }
      const sign = generateSign(apiParams)
      const queryString = new URLSearchParams({ ...apiParams, sign }).toString()
      const response = await fetch(`https://api-sg.aliexpress.com/sync?${queryString}`)
      const data = await response.json()
      return NextResponse.json(data)

    } else if (action === 'detail') {
      const apiParams = {
        ...baseParams,
        method: 'aliexpress.solution.product.detail.get', // Dropshipping detail
        product_id: productId
      }
      const sign = generateSign(apiParams)
      const queryString = new URLSearchParams({ ...apiParams, sign }).toString()
      const response = await fetch(`https://api-sg.aliexpress.com/sync?${queryString}`)
      const data = await response.json()
      return NextResponse.json(data)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch from AliExpress' }, { status: 500 })
  }
}

// Handle Admin Order Placement (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, orderId } = body

    if (action === 'place_aliexpress_order') {
      // In a real production environment, this is where you would call 
      // aliexpress.solution.order.create with the user's shipping details.
      // Because AliExpress Dropshipping APIs are highly restricted and often 
      // require complex XML/JSON payloads for order creation, we simulate 
      // the success response here to allow the admin workflow to function.
      
      // Mock response from AliExpress API:
      const mockAliExpressOrderId = 'AE' + Date.now()
      
      return NextResponse.json({ 
        success: true, 
        aliexpress_order_id: mockAliExpressOrderId,
        message: 'Order successfully sent to AliExpress (Simulated).'
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process AliExpress order' }, { status: 500 })
  }
}