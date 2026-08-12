export default function PrivacyPolicy() {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-10 py-32">
      <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-primary font-medium mb-6">
        <span className="w-6 h-px bg-primary" />
        Legal
      </div>

      <h1
        className="serif mb-10"
        style={{
          fontSize: 'clamp(40px, 7vw, 80px)',
          lineHeight: 0.95,
          letterSpacing: '-0.02em',
        }}
      >
        Privacy <span className="serif-italic gradient-text">Policy</span>
      </h1>

      <div className="space-y-8 text-ink/75 leading-relaxed">
        <p className="text-sm text-muted">Last updated: {lastUpdated}</p>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">Introduction</h2>
          <p>
            FindOneCampus (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your privacy.
            This policy explains what we collect, why we collect it, and what we do with it.
            By using our platform, you agree to the practices described in this policy.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">Information We Collect</h2>
          <p className="mb-3">We collect different types of information depending on how you use the campus:</p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>
              <strong>Providers:</strong> When you register as a provider, we collect your name,
              email, profession, category, bio, skills, WhatsApp number, location, and social links
              (LinkedIn, Twitter, Instagram, TikTok, Portfolio).
            </li>
            <li>
              <strong>Readers/Students:</strong> When you log in to buy books or courses, we collect
              your name and email address.
            </li>
            <li>
              <strong>Contact Forms:</strong> If you reach out to us, we collect your name, email,
              and message.
            </li>
            <li>
              <strong>Payments:</strong> We process payments securely via Paystack. We do not store
              your credit card information on our servers.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>To display provider profiles publicly on the FindOneCampus directory.</li>
            <li>To facilitate direct contact between clients and providers via WhatsApp.</li>
            <li>To process transactions for books, courses, Pro memberships, and verification fees.</li>
            <li>To remember your reading progress and purchased libraries.</li>
            <li>To respond to your inquiries and provide customer support.</li>
          </ul>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">Data Sharing &amp; Third Parties</h2>
          <p>
            We do not sell your personal data. We share necessary data with third-party services to
            operate the platform:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2 mt-3">
            <li>
              <strong>Supabase:</strong> Used for our database and user authentication storage.
            </li>
            <li>
              <strong>Paystack:</strong> Used for processing secure payments.
            </li>
            <li>
              <strong>Cloudinary:</strong> Used for hosting book covers and resource images.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">Local Storage &amp; Cookies</h2>
          <p>
            We use your browser&apos;s local storage to keep you logged into your Provider Dashboard
            or Reader Portal. This means you don&apos;t have to type your email every time you visit,
            but it also means your session is tied to the specific device and browser you are using.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal data. If you want to
            update your provider profile, you can do so directly from your dashboard. For account
            deletion requests, please email us at{' '}
            <a href="mailto:info5onecampus@gmail.com" className="text-primary font-medium hover:underline">
              info5onecampus@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}