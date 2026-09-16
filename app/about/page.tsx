export const metadata = {
  title: 'About Us',
  description: 'Discover the story behind FindOnCampus (FindOneCampus) — the global digital marketplace and ecosystem built for lifelong learners, creators, and professionals worldwide.',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-10 py-32">
      <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-primary font-medium mb-6">
        <span className="w-6 h-px bg-primary"></span>
        Our Story & Ecosystem
      </div>
      
      <h1 className="serif mb-10" style={{ fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
        We believe the world<br />is <span className="serif-italic gradient-text">one giant campus.</span>
      </h1>
      
      <div className="space-y-8 text-lg text-ink/75 leading-relaxed">
        <div>
          <p className="mb-4">
            <strong className="text-ink font-medium">FindOnCampus</strong> (also known as <strong className="text-ink font-medium">FindOneCampus</strong>) began with a simple, universal observation: everywhere we look, people are searching. For knowledge, for work, for clients, for books, for online courses, for trusted service providers, and for real global opportunities.
          </p>
          <p>
            We realized that these searches aren't isolated events. They are all expressions of the exact same human drive—the impulse to learn, build, grow, and connect. The world itself, packed with diverse minds and shared wisdom, is already functioning as an interconnected campus. It just needed a unified digital home.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-paper border border-primary/10">
          <h2 className="serif text-3xl text-ink mb-4">What is FindOnCampus?</h2>
          <p className="mb-4">
            FindOnCampus is a next-generation global digital marketplace and community hub designed to break down geographic and economic barriers. We connect talent with opportunity, making professional services, education, and digital assets universally accessible.
          </p>
          <p>
            Think of it as a dynamic quad where every student is a teacher, every professional is a creator, and every seeker finds exactly what they need to level up.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="serif text-3xl text-ink">Pillars of Our Ecosystem</h2>
          <ul className="space-y-3 pl-4 border-l-2 border-primary/20">
            <li>
              <strong className="text-ink">The Professional Directory:</strong> A vetted space where clients can discover, hire, and collaborate with talented freelance service providers, specialists, and digital agencies worldwide.
            </li>
            <li>
              <strong className="text-ink">The Knowledge Library:</strong> A robust marketplace for online courses, educational resources, masterclasses, and ebooks tailored for lifelong learners.
            </li>
            <li>
              <strong className="text-ink">The Creator Hub:</strong> Tools, digital goods, and growth infrastructure designed to help independent builders and creators scale their digital footprint and monetize their expertise.
            </li>
          </ul>
        </div>
        
        <p className="serif-italic text-2xl text-ink">
          "We don't believe in walls; we believe in open worlds. We don't believe in gatekeepers; we believe in guides."
        </p>
        
        <p>
          Whether you are here to market your skills, acquire new knowledge, launch a digital product, or expand your network, FindOnCampus gives you the leverage to succeed on a global stage.
        </p>
        
        <p className="font-medium text-ink">
          Welcome to the campus without walls. Welcome home.
        </p>
      </div>
      
      <div className="mt-16 grid sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-paper">
          <div className="text-4xl serif gradient-text mb-2">2023</div>
          <div className="text-sm text-muted">Year founded</div>
        </div>
        <div className="p-6 rounded-2xl bg-paper">
          <div className="text-4xl serif gradient-text mb-2">64+</div>
          <div className="text-sm text-muted">Countries represented</div>
        </div>
        <div className="p-6 rounded-2xl bg-paper">
          <div className="text-4xl serif gradient-text mb-2">50k+</div>
          <div className="text-sm text-muted">Active community members</div>
        </div>
      </div>
    </div>
  )
}