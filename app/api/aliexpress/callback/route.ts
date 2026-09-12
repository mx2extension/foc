import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  
  if (code) {
    // For security, we just display a success message. 
    // You will copy this code from the URL bar to use in your AliExpress token generation step.
    return new NextResponse(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1>Authorization Successful!</h1>
          <p>AliExpress has provided the authorization code.</p>
          <p>Please copy this code and use it to generate your access token:</p>
          <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; word-wrap: break-word;">
            <strong>${code}</strong>
          </div>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } })
  }

  return NextResponse.json({ error: 'No code provided by AliExpress' }, { status: 400 })
}