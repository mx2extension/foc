export const metadata = {
  title: 'Privacy Policy | FindOnCampus',
  description:
    'Learn how FindOnCampus (FindOneCampus) collects, uses, stores, and protects your personal information across our directory, shop, learning portal, and digital services.',
};

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
          <h2 className="serif text-2xl text-ink mb-3">1. Introduction &amp; Scope</h2>
          <p className="mb-3">
            Welcome to <strong className="text-ink font-medium">FindOnCampus</strong> (also operating as{' '}
            <strong className="text-ink font-medium">FindOneCampus</strong>, &quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;). We are committed to safeguarding the privacy and personal data of every student,
            client, service provider, reader, and shopper who interacts with our digital ecosystem.
          </p>
          <p>
            This Privacy Policy governs how we collect, process, store, share, and protect your personal
            information when you browse our directory, book services, purchase digital books or courses, shop
            for physical merchandise, or use integrated tools such as MX2ViralWorld. By accessing or using
            FindOnCampus, you consent to the data practices outlined in this policy.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">2. Information We Collect</h2>
          <p className="mb-3">
            We collect information strictly necessary to deliver a seamless, secure, and personalized platform
            experience. The exact data collected depends on how you engage with our services:
          </p>
          <ul className="list-disc list-inside space-y-2.5 ml-2">
            <li>
              <strong className="text-ink font-medium">Service Providers:</strong> When you create a provider
              profile, we collect your full name, email address, profession, service category, biography,
              listed skills, active WhatsApp phone number, campus or city location, profile imagery, and
              external social or portfolio links (LinkedIn, X/Twitter, Instagram, TikTok, or personal websites).
            </li>
            <li>
              <strong className="text-ink font-medium">Students, Readers &amp; Learners:</strong> When you
              register or log in to purchase e-books, study materials, or online courses, we collect your name,
              email address, purchase history, and course or reading progress metadata.
            </li>
            <li>
              <strong className="text-ink font-medium">Shop &amp; Physical Goods Buyers:</strong> When you place
              an order in the FindOnCampus Shop, we collect your full name, email address, phone number, and
              physical delivery address to coordinate courier dispatch and order tracking.
            </li>
            <li>
              <strong className="text-ink font-medium">MX2ViralWorld (SMM Panel) Users:</strong> When you place
              social media growth orders, we collect your account identifier, target social media usernames or
              public post URLs required to fulfill the order, and transaction logs. We never ask for or store
              your social media account passwords.
            </li>
            <li>
              <strong className="text-ink font-medium">Payment &amp; Billing Data:</strong> All financial
              transactions—including book/course purchases, shop checkouts, Pro memberships, verification fees,
              and SMM wallet deposits—are processed securely through PCI-DSS compliant payment gateways (
              <strong className="text-ink font-medium">Paystack</strong> and{' '}
              <strong className="text-ink font-medium">Flutterwave</strong>). We receive transaction reference
              codes and payment status confirmations, but we never collect, view, or store your debit/credit
              card numbers, CVV, or bank PINs on our servers.
            </li>
            <li>
              <strong className="text-ink font-medium">Support &amp; Contact Inquiries:</strong> When you reach
              out via contact forms or email, we collect your name, email address, and the contents of your
              correspondence.
            </li>
            <li>
              <strong className="text-ink font-medium">Technical &amp; Usage Logs:</strong> We automatically
              collect basic diagnostic information such as browser type, device type, IP address, and page
              interaction timestamps to maintain platform security, prevent fraud, and optimize load performance.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">3. How We Use Your Information</h2>
          <p className="mb-3">We process your personal data for the following legitimate operational purposes:</p>
          <ul className="list-disc list-inside space-y-2.5 ml-2">
            <li>
              <strong className="text-ink font-medium">Directory Visibility &amp; Lead Generation:</strong> To
              publish and index provider profiles on the FindOnCampus directory so prospective clients can
              discover and connect with you directly via WhatsApp or listed social channels.
            </li>
            <li>
              <strong className="text-ink font-medium">Order &amp; Digital Fulfillment:</strong> To unlock
              purchased books and courses, sync your reading progress across sessions, execute MX2ViralWorld API
              orders, and dispatch physical Shop orders via third-party logistics partners.
            </li>
            <li>
              <strong className="text-ink font-medium">Account &amp; Subscription Management:</strong> To
              verify provider credentials, manage Pro Membership tiers, and authenticate user sessions.
            </li>
            <li>
              <strong className="text-ink font-medium">Customer Support &amp; Safety:</strong> To investigate
              disputes, respond to support tickets, prevent unauthorized scraping or abuse, and enforce our
              Terms &amp; Conditions.
            </li>
            <li>
              <strong className="text-ink font-medium">Service Updates:</strong> To send essential transactional
              notifications such as payment receipts, shipping tracking numbers, and critical platform updates.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">4. Data Sharing &amp; Trusted Third Parties</h2>
          <p className="mb-3">
            We do not sell, rent, or trade your personal data to data brokers or advertising networks. We only
            share necessary data with vetted infrastructure providers and partners required to operate the
            platform:
          </p>
          <ul className="list-disc list-inside space-y-2.5 ml-2">
            <li>
              <strong className="text-ink font-medium">Supabase:</strong> Provides our cloud database
              infrastructure, row-level security, and user authentication storage.
            </li>
            <li>
              <strong className="text-ink font-medium">Paystack &amp; Flutterwave:</strong> Process encrypted
              payments, verify transactions, and handle payouts or refunds.
            </li>
            <li>
              <strong className="text-ink font-medium">Cloudinary:</strong> Hosts, optimizes, and delivers
              provider avatars, book covers, and digital resource assets.
            </li>
            <li>
              <strong className="text-ink font-medium">Logistics &amp; Fulfillment Partners:</strong> Receive
              only your name, phone number, and shipping address when required to deliver physical Shop items.
            </li>
            <li>
              <strong className="text-ink font-medium">Upstream API Providers (MX2ViralWorld):</strong> Receive
              only the public target link/username and service quantity required to execute social media orders.
            </li>
            <li>
              <strong className="text-ink font-medium">Legal &amp; Regulatory Compliance:</strong> We may
              disclose information if required to do so by applicable Nigerian law, valid court order, or law
              enforcement request to protect the rights, property, or safety of FindOnCampus and its users.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">5. Public Profile Visibility</h2>
          <p>
            If you register as a Service Provider, please note that the details you submit for your public
            listing—including your name, profession, bio, location, WhatsApp link, and social handles—are
            intentionally made publicly accessible on our platform so clients can contact you. Do not include
            sensitive personal information (such as your home address or government ID numbers) inside your
            public biography.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">6. Local Storage, Cookies &amp; Session Persistence</h2>
          <p className="mb-3">
            We use browser local storage and essential session tokens to keep you authenticated in your Provider
            Dashboard, Reader Portal, or Shop cart without requiring repeated logins on every page reload.
          </p>
          <p>
            Because local storage is bound to your specific browser and device, clearing your browser cache or
            site data will log you out. If you access FindOnCampus from a shared or public computer (such as a
            campus library or cybercafé), we strongly advise logging out after each session.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">7. Data Security &amp; Retention</h2>
          <p className="mb-3">
            We implement industry-standard administrative and technical safeguards—including HTTPS/TLS encryption
            in transit, encrypted database storage, and strict access controls—to protect your information against
            unauthorized access, alteration, or loss. However, no internet transmission or electronic storage
            system is 100% infallible.
          </p>
          <p>
            We retain your personal data for as long as your account remains active or as needed to provide you
            with access to purchased digital libraries, fulfill ongoing orders, resolve disputes, and satisfy
            legal or accounting obligations.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">8. Age Eligibility</h2>
          <p>
            FindOnCampus is designed for university students, professionals, and general adult consumers. We do
            not knowingly collect personal information from individuals under the age of 16. If you believe a
            minor has provided us with personal data without parental consent, please contact us immediately so
            we can remove the records.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">9. Your Privacy Rights &amp; Contact</h2>
          <p className="mb-3">
            In accordance with applicable data protection standards (including the Nigeria Data Protection
            Regulation), you have the right to request access to the personal data we hold about you, correct
            inaccurate details, withdraw consent for optional public listings, or request permanent deletion of
            your account.
          </p>
          <p>
            Providers can edit or update their profile fields directly inside the Provider Dashboard at any time.
            For formal data access, correction, or account deletion requests, please email our privacy team at{' '}
            <a href="mailto:info5onecampus@gmail.com" className="text-primary font-medium hover:underline">
              info5onecampus@gmail.com
            </a>
            . We aim to respond to all verified requests within 7 to 14 business days.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-ink mb-3">10. Policy Updates</h2>
          <p>
            We may revise this Privacy Policy periodically as we introduce new platform features or respond to
            regulatory changes. When updates occur, we will revise the &quot;Last updated&quot; date at the top
            of this page. Continued use of FindOnCampus after changes are posted constitutes acceptance of the
            updated policy.
          </p>
        </div>
      </div>
    </div>
  );
}