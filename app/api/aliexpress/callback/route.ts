import { NextResponse } from 'next/server'

// AliExpress sends a POST request to this URL to verify your webhook
export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('AliExpress Callback Received:', body)
    
    // AliExpress expects a 200 OK response to confirm your server is alive
    return NextResponse.json({ code: 200, msg: 'success', data: body })
  } catch (error) {
    return NextResponse.json({ code: 200, msg: 'success' }) // Still return 200 to pass the test
  }
}

// Handle GET requests just in case AliExpress pings it
export async function GET(req: Request) {
  return NextResponse.json({ status: 'ok', message: 'FindOneCampus AliExpress Callback is live.' })
}