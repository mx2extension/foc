export const metadata = {
  title: 'Terms & Conditions',
  description: 'Read the Terms & Conditions for FindOnCampus (FindOneCampus) — outlining user agreements, provider policies, shop purchases, and digital service guidelines.',
}

export default function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-10 py-32">
      <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-primary font-medium mb-6">
        <span className="w-6 h-px bg-primary"></span>
        Legal
      </div>
      
      <h1 className="serif mb-10" style={{ fontSize: 'clamp(40px, 7vw, 80px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
        Terms & <span className="serif-italic gradient-text">Conditions</span>
      </h1>
      
      <div className="space-y-8 text-ink/75 leading-relaxed">
        <p className="text-sm text-muted">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        
        <div>
          <h2 className="serif text-2xl text-ink mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using <strong className="text-ink font-medium">FindOnCampus</strong> (also known as FindOneCampus), you agree to these Terms & Conditions. If you do not agree with any part of these terms, you must not use the platform. FindOnCampus is a comprehensive digital ecosystem connecting seekers with providers, learners with courses, readers with books, and shoppers with premium goods.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">2. Provider Responsibilities</h2>
          <p>
            Providers are responsible for the accuracy of their profiles, the quality of their services, and their interactions with clients. Providers handle client communications directly via WhatsApp. FindOnCampus is not liable for the outcome, quality, or safety of services rendered off-platform. Pro Memberships and Verified Badges are platform features and do not constitute an endorsement of a provider's individual work.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">3. Shop Purchases & Fulfillment</h2>
          <p>
            When you purchase items from the FindOnCampus Shop, you are purchasing from FindOnCampus directly. Payments are processed securely via Flutterwave. Orders are fulfilled by our team, and shipping times vary based on location and courier logistics. Tracking details will be provided once an item has been dispatched. Due to the nature of physical goods, returns are handled on a case-by-case basis. Please contact us within 7 days of delivery for any issues.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">4. MX2ViralWorld (SMM Panel)</h2>
          <p>
            MX2ViralWorld is our integrated social media growth panel. Payments for SMM services are processed securely via Flutterwave. Because these services rely on external third-party APIs, delivery times may fluctuate. If an order fails to deliver due to technical or API issues, a refund or platform credit will be issued to your account. No refunds are provided for successfully completed SMM orders.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">5. Digital Products (Books & Courses)</h2>
          <p>
            All digital purchases (including e-books and online courses) are processed securely via Paystack or Flutterwave. Due to the immediate access nature of digital products, refund requests are evaluated case-by-case. If you experience any technical issues accessing a purchased book or course, please contact support within 7 days of purchase.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">6. Intellectual Property</h2>
          <p>
            All platform design, codebase elements, interface text, and custom branding are owned by FindOnCampus. Books, courses, and resource content remain the exclusive intellectual property of their respective authors and creators. Users may not download, reproduce, or distribute premium digital content without prior explicit authorization.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">7. Limitation of Liability</h2>
          <p>
            FindOnCampus is provided on an "as is" and "as available" basis. We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform or interactions with other users. We do not guarantee that the platform will operate uninterrupted or error-free at all times.
          </p>
        </div>
      </div>
    </div>
  )
}