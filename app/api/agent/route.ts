import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

// Helper function to extract keywords from natural language
function extractCriteria(query: string) {
  const lowerQuery = query.toLowerCase()
  
  // Known locations (can be expanded)
  const locations = ['abuja', 'lagos', 'kano', 'port harcourt', 'bauchi', 'jos', 'enugu', 'ibadan']
  let location = null
  for (const loc of locations) {
    if (lowerQuery.includes(loc)) {
      location = loc
      break
    }
  }

  // Known categories/services
  const services = [
    'graphic designer', 'web developer', 'photographer', 'plumber', 'fashion designer', 
    'social media manager', 'accountant', 'makeup artist', 'interior designer', 'writer'
  ]
  let service = null
  for (const svc of services) {
    if (lowerQuery.includes(svc)) {
      service = svc
      break
    }
  }

  // Fallback: if no specific service is matched, use the whole query minus the location
  let generalSearch = lowerQuery
  if (location) generalSearch = generalQuery.replace(location, '').trim()
  generalSearch = generalSearch.replace(/i need a |i need an |looking for /g, '').trim()

  return { location, service, generalSearch }
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

    const { location, service, generalSearch } = extractCriteria(message)

    // Build Supabase query
    let query = supabase
      .from('providers')
      .select('*')
      .eq('is_approved', true)

    // Apply location filter if found
    if (location) {
      query = query.or(`city.ilike.%${location}%,country.ilike.%${location}%`)
    }

    // Apply service filter if found
    if (service) {
      query = query.or(`profession.ilike.%${service}%,category.ilike.%${service}%,skills.cs.{${service}}`)
    } else if (generalSearch) {
      // Fallback to general text search across multiple fields
      query = query.or(`profession.ilike.%${generalSearch}%,category.ilike.%${generalSearch}%,skills.cs.{${generalSearch}}`)
    }

    // Limit results for MVP (return top 5)
    const { data: providers, error } = await query.limit(5)

    if (error) throw error

    // Sort in code: Verified (2) > Pro (1) > Free (0)
    const sortedProviders = (providers || []).sort((a, b) => {
      const aScore = (a.verification_status === 'verified' ? 2 : 0) + (a.membership === 'pro' ? 1 : 0)
      const bScore = (b.verification_status === 'verified' ? 2 : 0) + (b.membership === 'pro' ? 1 : 0)
      return bScore - aScore
    })

    return NextResponse.json({ 
      providers: sortedProviders, 
      count: sortedProviders.length 
    })

  } catch (error) {
    console.error('Agent API Error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}