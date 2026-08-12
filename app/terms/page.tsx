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
          <h2 className="serif text-2xl text-ink mb-3">Acceptance of Terms</h2>
          <p>By accessing or using FindOneCampus, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must not use the platform. FindOneCampus is a directory and marketplace connecting learners, professionals, authors, and creators.</p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">Provider Responsibilities</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Providers are responsible for the accuracy of their profiles, skills, and bios.</li>
            <li>Providers handle client interactions directly via WhatsApp. FindOneCampus is not liable for the outcome, quality, or safety of services rendered off-platform.</li>
            <li>Providers must not list prohibited or illegal services.</li>
          </ul>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">Memberships & Verification</h2>
          <p className="mb-3"><strong>Pro Membership:</strong> Paying for a Pro membership grants visibility features (homepage featuring, social links, search priority) for the duration of the selected plan (1 month, 3 months, or 1 year). It does not guarantee client acquisition.</p>
          <p><strong>Verification Badge:</strong> The Verification Review Fee grants a manual review of your background by our team. Payment does not guarantee approval. Verification can be revoked if a provider is found to violate platform rules.</p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">Purchases & Refunds</h2>
          <p>All payments for books, courses, resources, and memberships are processed securely via Paystack. Due to the digital nature of these products, refunds are handled on a case-by-case basis. If you experience a technical issue accessing a purchased book or course, please contact us within 7 days of purchase at <a href="mailto:info5onecampus@gmail.com" className="text-primary font-medium hover:underline">info5onecampus@gmail.com</a>.</p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">Intellectual Property</h2>
          <p>All platform design, code, text, and branding are owned by FindOneCampus. Books, courses, and resource content remain the intellectual property of their respective authors and creators. Users may not download, reproduce, or distribute premium digital content without permission.</p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">Limitation of Liability</h2>
          <p>FindOneCampus is provided "as is". We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform or interactions with other users. We do not guarantee that the platform will be uninterrupted or error-free at all times.</p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">Changes to Terms</h2>
          <p>We reserve the right to update or modify these Terms & Conditions at any time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
        </div>
      </div>
    </div>
  )
}