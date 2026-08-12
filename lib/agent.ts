import { supabase } from './supabase/client'

export async function searchProviders(message: string) {
  const lowerQuery = message.toLowerCase()
  
  // 1. Extract Location
  const locations = ['abuja', 'lagos', 'kano', 'port harcourt', 'bauchi', 'jos', 'enugu', 'ibadan']
  let location = null
  for (const loc of locations) {
    if (lowerQuery.includes(loc)) { location = loc; break }
  }

  // 2. Extract Service
  const services = ['graphic designer', 'web developer', 'photographer', 'plumber', 'fashion designer', 'social media manager', 'accountant', 'makeup artist', 'interior designer', 'writer']
  let service = null
  for (const svc of services) {
    if (lowerQuery.includes(svc)) { service = svc; break }
  }

  let generalSearch = lowerQuery
  if (location) generalSearch = generalSearch.replace(location, '').trim()
  generalSearch = generalSearch.replace(/i need a |i need an |looking for |find me a /g, '').trim()

  // 3. Query Supabase
  let query = supabase.from('providers').select('*').eq('is_approved', true)
  if (location) query = query.or(`city.ilike.%${location}%,country.ilike.%${location}%`)
  if (service) query = query.or(`profession.ilike.%${service}%,category.ilike.%${service}%,skills.cs.{${service}}`)
  else if (generalSearch) query = query.or(`profession.ilike.%${generalSearch}%,category.ilike.%${generalSearch}%,skills.cs.{${generalSearch}}`)

  const { data: providers } = await query.limit(5)

  // 4. Sort: Verified first, then Pro
  const sortedProviders = (providers || []).sort((a, b) => {
    const aScore = (a.verification_status === 'verified' ? 2 : 0) + (a.membership === 'pro' ? 1 : 0)
    const bScore = (b.verification_status === 'verified' ? 2 : 0) + (b.membership === 'pro' ? 1 : 0)
    return bScore - aScore
  })

  return sortedProviders
}