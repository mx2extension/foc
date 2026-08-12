// Server-side Paystack initialization
export async function initializePaystackTransaction(email: string, amount: number, reference: string, metadata: object) {
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: amount * 100, // Paystack expects kobo
      reference,
      metadata,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/verify`,
    }),
  })
  return response.json()
}

// Generate unique reference
export function generateReference(prefix: string = 'FOC') {
  return `${prefix}_${Math.random().toString(36).substring(2, 15)}${Date.now()}`
}

// Profession-based avatar mapping
export function getProfessionAvatar(profession: string, name: string): string {
  // Use DiceBear to generate a premium, unique monogram avatar based on the provider's name
  // This ensures every provider has a distinct, professional-looking avatar without user uploads.
  const seed = encodeURIComponent(name || profession || 'FindOneCampus');
  
  // We use the 'initials' style for a clean, corporate look
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=C1121F,D4A017,1A1A1A&textColor=ffffff&fontWeight=600`;
}