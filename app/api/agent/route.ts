import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { searchProviders } from '@/lib/agent'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

    const lowerQuery = message.toLowerCase()

    // 1. Check Knowledge Base First
    const { data: kbData } = await supabase
      .from('agent_knowledge_base')
      .select('answer')
      .or(`keywords.ilike.%${lowerQuery}%,question.ilike.%${lowerQuery}%`)
      .limit(1)

    if (kbData && kbData.length > 0) {
      return NextResponse.json({ answer: kbData[0].answer })
    }

    // 2. If no KB match, search Providers
    const providers = await searchProviders(message)

    if (providers.length > 0) {
      return NextResponse.json({ providers, count: providers.length })
    }

    // 3. Fallback
    return NextResponse.json({ answer: "I couldn't find specific information or a provider for that. Try asking 'What is FindOneCampus?' or 'I need a graphic designer in Abuja'." })

  } catch (error) {
    console.error('Agent API Error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}