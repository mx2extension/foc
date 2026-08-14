import Hero from '@/components/Hero'
import Globe from '@/components/Globe'
import HomeSearch from '@/components/HomeSearch'
import ProviderCard from '@/components/ProviderCard'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

export default async function Home() {
  // 1. Run database queries concurrently (only what we actually need to display)
  const [providersRes, newsRes] = await Promise.all([
    supabase.from('providers').select('*').eq('is_approved', true),
    supabase.from('news_updates').select('*').order('created_at', { ascending: false }).limit(3)
  ])

  // 2. Extract data safely — no counts, no quantities shown
  const allProviders = providersRes.data || []
  const latestNews = newsRes.data || []

  // 3. Sort providers to prioritize Pro & Verified on the homepage safely
  const featuredProviders = [...allProviders].sort((a: any, b: any) => {
    const aScore = (a.verification_status === 'verified' ? 2 : 0) + (a.membership === 'pro' ? 1 : 0)
    const bScore = (b.verification_status === 'verified' ? 2 : 0) + (b.membership === 'pro' ? 1 : 0)
    return bScore - aScore
  }).slice(0, 6)

  return (
    <>
      {/* HERO WITH FULL-COVER LOGO BACKGROUND WATERMARK */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.07] select-none">
          <img 
            src="https://res.cloudinary.com/drnrbfltr/image/upload/v1782561824/5b840287-582b-4833-a671-b7701bc87206.png" 
            alt="" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="relative z-10">
          <Hero />
        </div>
      </div>
      
      {/* MARQUEE */}
      <section className="py-8 border-y border-black/5 overflow-hidden bg-paper relative">
        <div className="flex animate-marquee whitespace-nowrap">
          <div className="flex items-center gap-12 px-6 text-2xl md:text-3xl serif text-ink/40">
            <span>knowledge</span><span className="text-primary">•</span>
            <span>professionals</span><span className="text-primary">•</span>
            <span>books</span><span className="text-primary">•</span>
            <span>courses</span><span className="text-primary">•</span>
            <span>opportunities</span><span className="text-primary">•</span>
            <span>answers</span><span className="text-primary">•</span>
            <span>growth</span><span className="text-primary">•</span>
          </div>
          <div className="flex items-center gap-12 px-6 text-2xl md:text-3xl serif text-ink/40">
            <span>knowledge</span><span className="text-primary">•</span>
            <span>professionals</span><span className="text-primary">•</span>
            <span>books</span><span className="text-primary">•</span>
            <span>courses</span><span className="text-primary">•</span>
            <span>opportunities</span><span className="text-primary">•</span>
            <span>answers</span><span className="text-primary">•</span>
            <span>growth</span><span className="text-primary">•</span>
          </div>
        </div>
      </section>

      {/* SEARCH SECTION */}
      <section className="relative py-32 overflow-hidden">
        <div className="orb" style={{ width: '600px', height: '600px', background: 'rgba(193,18,31,0.06)', top: '20%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
        
        <div className="relative max-w-5xl mx-auto px-6 lg:px-10 text-center z-10">
          <div className="section-label justify-center mb-6 inline-flex reveal">Start your search</div>
          <h2 className="serif mb-6 reveal reveal-delay-1" style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1, letterSpacing: '-0.02em' }}>
            What are you looking for <span className="serif-italic gradient-text">today?</span>
          </h2>
          <p className="text-lg text-muted mb-12 max-w-2xl mx-auto reveal reveal-delay-2">
            Type a name, a skill, a book title, a course topic, or a question. The campus is listening.
          </p>
          <HomeSearch />
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="py-32 bg-paper relative overflow-hidden">
        <div className="orb" style={{ width: '500px', height: '500px', background: 'rgba(212,160,23,0.05)', bottom: '0', right: '-100px' }}></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="section-label mb-6 reveal">Explore the campus</div>
              <h2 className="serif reveal reveal-delay-1" style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                Featured <span className="serif-italic gradient-text">Categories</span>
              </h2>
            </div>
            <p className="text-muted max-w-md text-lg reveal reveal-delay-2">
              Six doorways into the campus. Each one a different way to find what — or who — you're looking for.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: 'fa-user-tie', title: 'Professionals', desc: 'Find trusted experts across every field.', meta: 'Verified experts • Global network', color: 'bg-primary/10 text-primary', link: '/providers' },
              { icon: 'fa-book-open', title: 'Books', desc: 'A curated digital bookstore of independent titles.', meta: 'Curated titles • Instant download', color: 'bg-accent/15 text-accent', link: '/books' },
              { icon: 'fa-graduation-cap', title: 'Courses', desc: 'Live and self-paced courses taught by practitioners.', meta: 'Live & self-paced • Taught by doers', color: 'bg-ink/10 text-ink', link: '/courses' },
              { icon: 'fa-microphone-lines', title: 'Podcasts', desc: 'Conversations with builders and thinkers.', meta: 'Curated weekly • Fresh episodes', color: 'bg-primary/10 text-primary', link: '/resources' },
              { icon: 'fa-toolbox', title: 'Resources', desc: 'Tools, articles, and movies for the lifelong learner.', meta: 'Hand-picked • Updated regularly', color: 'bg-accent/15 text-accent', link: '/resources' },
              { icon: 'fa-compass', title: 'Community', desc: 'Get-To-Know About the Campus to Stay Involved', meta: 'Weekly drops • Community-curated', color: 'bg-ink/10 text-ink', link: '/community' },
            ].map((cat, i) => (
              <Link href={cat.link} key={i} className={`premium-card p-8 lg:p-10 group cursor-pointer reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="flex items-start justify-between mb-12">
                  <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-[-5deg]`}>
                    <i className={`fas ${cat.icon} text-xl`}></i>
                  </div>
                  <i className="fas fa-arrow-up-right text-muted text-sm"></i>
                </div>
                <h3 className="serif text-3xl mb-2">{cat.title}</h3>
                <p className="text-muted leading-relaxed mb-6">{cat.desc}</p>
                <div className="flex items-center gap-2 text-sm text-primary font-medium">
                  <span>{cat.meta.split('•')[0]}</span>
                  <span className="w-1 h-1 rounded-full bg-muted"></span>
                  <span>{cat.meta.split('•')[1]}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY FINDONECAMPUS */}
      <section className="py-32 relative overflow-hidden">
        <div className="orb" style={{ width: '700px', height: '700px', background: 'rgba(212,160,23,0.05)', top: '20%', right: '-200px' }}></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <div className="section-label mb-6 reveal">Our philosophy</div>
              <h2 className="serif mb-10 reveal reveal-delay-1" style={{ fontSize: 'clamp(40px, 6vw, 80px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
                Why <span className="serif-italic gradient-text">FindOneCampus?</span>
              </h2>
              <div className="space-y-6 text-lg text-ink/75 leading-relaxed reveal reveal-delay-2">
                <p>The world is one giant campus.</p>
                <p>In classrooms, in markets, in studios, in offices, in homes — people are teaching each other, building with each other, and searching for what comes next.</p>
                <p>FindOneCampus exists to make that search simpler. To connect the learner with the teacher. The builder with the client. The reader with the book. The dreamer with the opportunity.</p>
                <p className="serif-italic text-2xl text-ink">We don't believe in walls. We believe in worlds.</p>
              </div>

              <div className="mt-12 grid sm:grid-cols-3 gap-6 reveal reveal-delay-3">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <i className="fas fa-infinity"></i>
                  </div>
                  <h4 className="font-semibold mb-2">Learning never ends</h4>
                  <p className="text-sm text-muted leading-relaxed">The campus has no graduation date.</p>
                </div>
                <div>
                  <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent mb-4">
                    <i className="fas fa-arrows-left-right"></i>
                  </div>
                  <h4 className="font-semibold mb-2">Everyone teaches & learns</h4>
                  <p className="text-sm text-muted leading-relaxed">We all have something to offer.</p>
                </div>
                <div>
                  <div className="w-10 h-10 rounded-xl bg-ink/10 flex items-center justify-center text-ink mb-4">
                    <i className="fas fa-link"></i>
                  </div>
                  <h4 className="font-semibold mb-2">Connection is the curriculum</h4>
                  <p className="text-sm text-muted leading-relaxed">Growth happens through people.</p>
                </div>
              </div>
            </div>
            
            <div className="relative reveal reveal-delay-2">
              <Globe />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROVIDERS */}
      <section id="providers" className="py-32 bg-paper relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="section-label mb-6 reveal">Meet the people</div>
              <h2 className="serif reveal reveal-delay-1" style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                Featured <span className="serif-italic gradient-text">Providers</span>
              </h2>
            </div>
            <Link href="/providers" className="btn-secondary !py-3 !px-5 text-sm whitespace-nowrap reveal reveal-delay-2">
              View all <i className="fas fa-arrow-right text-xs"></i>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProviders && featuredProviders.length > 0 ? (
              featuredProviders.map((provider: any) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-muted">
                No approved providers yet. Be the first to join!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section id="community" className="py-32 relative overflow-hidden bg-ink text-white">
        <div className="orb" style={{ width: '600px', height: '600px', background: 'rgba(193,18,31,0.2)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>

        <div className="relative max-w-5xl mx-auto px-6 lg:px-10 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8 reveal">
            <i className="fab fa-whatsapp text-green-400"></i>
            <span className="text-sm">Join the community</span>
          </div>
          <h2 className="serif mb-8 reveal reveal-delay-1" style={{ fontSize: 'clamp(40px, 7vw, 88px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
            Opportunities don't live on websites.<br />
            <span className="serif-italic" style={{ background: 'linear-gradient(135deg, #D4A017, #C1121F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>They live in conversations.</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed reveal reveal-delay-2">
            We share daily opportunities in our WhatsApp Community. Jobs, scholarships, fellowships, grants, and internships — straight to your phone.
          </p>
          <a href="https://chat.whatsapp.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-5 rounded-full bg-[#25D366] text-white font-medium hover:scale-105 transition-transform reveal reveal-delay-3" style={{ boxShadow: '0 20px 50px -15px rgba(37,211,102,0.5)' }}>
            <i className="fab fa-whatsapp text-2xl"></i>
            <span>Join FindOneCampus WhatsApp Community</span>
            <i className="fas fa-arrow-right text-sm"></i>
          </a>
        </div>
      </section>

      {/* NEWS & UPDATES */}
      <section className="py-32 relative overflow-hidden bg-paper">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="section-label mb-6 reveal">Campus Bulletin</div>
              <h2 className="serif reveal reveal-delay-1" style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                News & <span className="serif-italic gradient-text">Updates.</span>
              </h2>
            </div>
            <Link href="/news" className="btn-secondary !py-3 !px-5 text-sm whitespace-nowrap reveal reveal-delay-2">
              View all news <i className="fas fa-arrow-right text-xs"></i>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {latestNews.map((article: any, i: number) => (
              <Link href={`/news/${article.id}`} key={article.id} className={`premium-card overflow-hidden group reveal reveal-delay-${i+1} flex flex-col`}>
                <div className="aspect-video w-full overflow-hidden relative bg-black/5">
                  <img 
                    src={article.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop'} 
                    alt={article.title} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 absolute inset-0"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-xs text-muted mb-3">
                    <span>{new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    <span className="w-1 h-1 rounded-full bg-muted"></span>
                    <span>{article.author}</span>
                  </div>
                  <h3 className="serif text-2xl mb-2 leading-tight group-hover:text-primary transition">{article.title}</h3>
                  <p className="text-sm text-muted leading-relaxed line-clamp-2">{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
          
          {latestNews.length === 0 && (
            <div className="text-center py-20 text-muted">No news articles yet.</div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="relative p-12 lg:p-20 text-center rounded-[28px] border border-black/5 overflow-hidden reveal">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-paper -z-10"></div>
            <div className="absolute inset-0 rounded-[28px] p-[1px] bg-gradient-to-br from-primary/40 to-accent/40 -z-10"></div>
            
            <h2 className="serif mb-8" style={{ fontSize: 'clamp(36px, 6vw, 80px)', lineHeight: 1, letterSpacing: '-0.02em' }}>
              Find what you're<br />
              <span className="serif-italic gradient-text">searching for.</span>
            </h2>
            <p className="text-lg text-muted max-w-xl mx-auto mb-10">
              Whether it's a person, a book, a course, an opportunity, or simply your next step — the campus is here, and the doors are open.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/providers" className="btn-primary">
                <span>Start searching</span>
                <i className="fas fa-arrow-right text-xs"></i>
              </Link>
              <Link href="/become-a-provider" className="btn-secondary">
                <span>Become a provider</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}