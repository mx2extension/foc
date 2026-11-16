export const metadata = {
  title: 'Terms & Conditions | FindOnCampus',
  description:
    'Read the Terms & Conditions for FindOnCampus (FindOneCampus) — outlining user agreements, provider policies, shop purchases, SMM services, and digital content guidelines.',
};

export default function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-10 py-32">
      <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-primary font-medium mb-6">
        <span className="w-6 h-px bg-primary"></span>
        Legal
      </div>

      <h1
        className="serif mb-10"
        style={{ fontSize: 'clamp(40px, 7vw, 80px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}
      >
        Terms &amp; <span className="serif-italic gradient-text">Conditions</span>
      </h1>

      <div className="space-y-8 text-ink/75 leading-relaxed">
        <p className="text-sm text-muted">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">1. Acceptance of Terms &amp; Platform Overview</h2>
          <p className="mb-3">
            Welcome to <strong className="text-ink font-medium">FindOnCampus</strong> (also operating as{' '}
            <strong className="text-ink font-medium">FindOneCampus</strong>, &quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;). These Terms &amp; Conditions (&quot;Terms&quot;) constitute a legally binding
            agreement between you and FindOnCampus governing your access to and use of our website, provider
            directory, digital learning library, online shop, and integrated tools.
          </p>
          <p>
            By accessing, browsing, registering an account, or completing a transaction on FindOnCampus, you
            confirm that you have read, understood, and agreed to be bound by these Terms and our Privacy Policy.
            If you do not agree with any provision herein, you must discontinue use of the platform immediately.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">2. User Eligibility &amp; Account Security</h2>
          <p className="mb-3">
            To register as a Service Provider or purchase products on FindOnCampus, you must be at least 16
            years of age and possess the legal capacity to enter into binding agreements. You agree to provide
            accurate, current, and complete information during registration and checkout.
          </p>
          <p>
            You are solely responsible for maintaining the confidentiality of your login credentials and browser
            sessions. Any activity occurring under your account or local session is your responsibility. You
            agree to notify us promptly at{' '}
            <a href="mailto:info5onecampus@gmail.com" className="text-primary font-medium hover:underline">
              info5onecampus@gmail.com
            </a>{' '}
            if you suspect unauthorized access to your profile or purchased library.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">3. Service Provider Directory &amp; Off-Platform Engagements</h2>
          <p className="mb-3">
            FindOnCampus operates a discovery directory connecting clients and students with independent service
            providers across campuses and cities. Service Providers are independent entities—not employees,
            agents, or contractors of FindOnCampus.
          </p>
          <ul className="list-disc list-inside space-y-2.5 ml-2">
            <li>
              <strong className="text-ink font-medium">Accuracy &amp; Conduct:</strong> Providers are solely
              responsible for the truthfulness of their listed skills, pricing, qualifications, and portfolio
              samples.
            </li>
            <li>
              <strong className="text-ink font-medium">Direct Negotiations:</strong> All project scoping,
              negotiations, and service agreements between clients and providers take place directly off-platform
              (such as via WhatsApp). FindOnCampus is not a party to contracts formed between users and assumes no
              liability for service quality, missed deadlines, payment disputes, or personal safety during
              in-person meetings.
            </li>
            <li>
              <strong className="text-ink font-medium">Pro Memberships &amp; Verification:</strong> Paid Pro
              Memberships and Verified Badges enhance directory visibility and confirm basic identity or profile
              checks, but they do not constitute a guarantee or endorsement of a provider&apos;s workmanship.
              Fees paid for Pro Memberships and verification reviews are non-refundable once activated or
              processed.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">4. FindOnCampus Shop Purchases &amp; Fulfillment</h2>
          <p className="mb-3">
            Items listed in the official FindOnCampus Shop are sold directly by FindOnCampus. All product
            descriptions, images, and prices are subject to availability and may be updated without prior notice.
          </p>
          <ul className="list-disc list-inside space-y-2.5 ml-2">
            <li>
              <strong className="text-ink font-medium">Payments &amp; Dispatch:</strong> Shop transactions are
              processed securely via <strong className="text-ink font-medium">Flutterwave</strong>. Orders are
              processed only after payment confirmation. Estimated delivery timelines depend on destination
              address and third-party courier logistics, and tracking information is shared upon dispatch.
            </li>
            <li>
              <strong className="text-ink font-medium">Returns &amp; Defective Goods:</strong> Due to the nature
              of physical merchandise, returns or exchanges are evaluated on a case-by-case basis and are
              generally restricted to items arriving damaged, defective, or materially different from the order
              placed. You must report any delivery issue within <strong className="text-ink font-medium">7 days</strong>{' '}
              of receipt with clear photographic evidence.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">5. MX2ViralWorld (SMM Panel) Terms</h2>
          <p className="mb-3">
            MX2ViralWorld is our integrated social media marketing and growth panel. Payments are processed
            securely via <strong className="text-ink font-medium">Flutterwave</strong>. By placing an order on
            MX2ViralWorld, you acknowledge and agree to the following conditions:
          </p>
          <ul className="list-disc list-inside space-y-2.5 ml-2">
            <li>
              <strong className="text-ink font-medium">Third-Party Dependencies:</strong> Delivery speeds and
              engagement metrics rely on external upstream APIs and third-party social media platforms. Because
              social networks frequently update their algorithms, delivery times are estimates rather than
              guarantees.
            </li>
            <li>
              <strong className="text-ink font-medium">Order Requirements:</strong> Target accounts or posts must
              remain public and unchanged throughout order execution. FindOnCampus is not liable for failed or
              stalled orders caused by private accounts, deleted posts, or changed usernames.
            </li>
            <li>
              <strong className="text-ink font-medium">Refunds &amp; Credits:</strong> If an order fails to
              deliver due to a verified technical or upstream API fault, a full or partial refund (or equivalent
              platform wallet credit) will be issued. Once an SMM order is marked as completed, no refunds will
              be granted. You agree not to use MX2ViralWorld for unlawful, defamatory, or policy-violating
              campaigns.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">6. Digital Products (E-Books &amp; Online Courses)</h2>
          <p className="mb-3">
            All digital content purchases—including e-books, study guides, templates, and online courses—are
            processed securely via <strong className="text-ink font-medium">Paystack</strong> or{' '}
            <strong className="text-ink font-medium">Flutterwave</strong>. Upon successful payment, you are
            granted a limited, non-exclusive, non-transferable, revocable license to access and view the
            material strictly for personal, non-commercial educational use.
          </p>
          <p>
            Because digital goods grant immediate irrevocable access upon checkout, all digital sales are
            generally final. Refund requests are reviewed solely on a case-by-case basis if a verified technical
            defect prevents access to the purchased material and our support team cannot resolve it within{' '}
            <strong className="text-ink font-medium">7 days</strong> of purchase.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">7. Prohibited Conduct</h2>
          <p className="mb-3">When using FindOnCampus, you agree not to:</p>
          <ul className="list-disc list-inside space-y-2.5 ml-2">
            <li>Post false, misleading, fraudulent, or impersonating provider profiles or reviews.</li>
            <li>
              Use the platform to advertise illegal goods, academic dishonesty services (such as exam fraud),
              adult content, or scams.
            </li>
            <li>
              Scrape, harvest, or bulk-extract provider WhatsApp numbers, emails, or directory data using
              automated bots or scripts.
            </li>
            <li>
              Attempt to bypass payment gateways, reverse-engineer platform source code, or distribute pirated
              copies of paid courses and e-books.
            </li>
          </ul>
          <p className="mt-3">
            We reserve the right to suspend or permanently terminate any account or listing that violates these
            rules, without prior notice or refund.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">8. Intellectual Property Rights</h2>
          <p>
            All platform architecture, source code, UI/UX design, trademarks, logos, and editorial copy are the
            exclusive intellectual property of FindOnCampus. E-books, courses, and downloadable study materials
            remain the copyrighted property of their respective authors, instructors, and creators. Unauthorized
            reproduction, resale, public sharing, or redistribution of any platform or creator content is
            strictly prohibited and may result in civil or criminal liability.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">9. Disclaimer of Warranties &amp; Limitation of Liability</h2>
          <p className="mb-3">
            FindOnCampus is provided on an &quot;as is&quot; and &quot;as available&quot; basis without
            warranties of any kind, whether express or implied, including implied warranties of merchantability,
            fitness for a particular purpose, or uninterrupted availability.
          </p>
          <p>
            To the fullest extent permitted by applicable law, FindOnCampus, its founders, affiliates, and
            partners shall not be liable for any indirect, incidental, special, consequential, or punitive
            damages—including loss of profits, data, goodwill, or off-platform service disputes—arising out of
            your use of or inability to use the platform. In any event, our total aggregate liability for any
            claim relating to a specific transaction shall not exceed the exact amount paid by you to
            FindOnCampus for that specific product or service.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">10. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless FindOnCampus and its team from and against any
            claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of
            your breach of these Terms, your violation of any law or third-party right, or services you render
            or procure through the provider directory.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">11. Governing Law &amp; Dispute Resolution</h2>
          <p>
            These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of the
            Federal Republic of Nigeria. Any dispute, controversy, or claim arising out of or relating to these
            Terms shall first be addressed amicably through good-faith negotiation by contacting our support
            team. If unresolved within 30 days, the dispute shall be submitted to the exclusive jurisdiction of
            the competent courts in Nigeria.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">12. Modifications &amp; Contact Information</h2>
          <p>
            We reserve the right to update or modify these Terms at any time to reflect new services, legal
            requirements, or operational adjustments. Changes take effect immediately upon posting to this page.
            For questions, dispute reports, or legal notices, please contact us at{' '}
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