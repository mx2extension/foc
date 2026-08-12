import Link from 'next/link'
import Image from 'next/image'

export default function CommunityPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Orb */}
      <div className="orb" style={{ width: '800px', height: '800px', background: 'rgba(193,18,31,0.05)', top: '10%', left: '50%', transform: 'translate(-50%, 0)' }}></div>

      {/* HERO SECTION */}
      <section className="relative max-w-5xl mx-auto px-6 lg:px-10 pt-32 pb-20 text-center z-10">
        <div className="section-label justify-center mb-6 inline-flex reveal">The FindOneCampus Community</div>
        <h1 className="serif mb-8 reveal reveal-delay-1" style={{ fontSize: 'clamp(40px, 7vw, 88px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
          A place where <span className="serif-italic gradient-text">purpose</span> meets people.
        </h1>
        <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto leading-relaxed reveal reveal-delay-2">
          We are bringing together a group of individuals who deeply understand our purpose. A community designed to link clients directly to trusted providers and skilled professionals—straight to their WhatsApp. We connect business partners, giving them a direct line to whoever they are working with.
        </p>
        
        <div className="mt-10 reveal reveal-delay-3">
          <a href="https://whatsapp.com/channel/0029Vb75uej0wajzyNM1hN2k" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-white font-medium hover:scale-105 transition-transform shadow-lg">
            <i className="fa-brands fa-whatsapp text-xl"></i>
            <span>Join the WhatsApp Channel</span>
          </a>
        </div>
      </section>

      {/* YOUTUBE VIDEO SECTION */}
      <section className="relative max-w-5xl mx-auto px-6 lg:px-10 py-20 z-10">
        <div className="premium-card p-2 md:p-4 reveal">
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-ink">
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/En46t6DIdmo?autoplay=1" 
              title="FindOneCampus Community Video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>
        </div>

        {/* YouTube Call to Action */}
        <div className="mt-8 text-center reveal">
          <p className="text-muted mb-4">Enjoyed this glimpse into our community?</p>
          <a 
            href="https://www.youtube.com/@findonecampus" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-md"
          >
            <i className="fa-brands fa-youtube text-lg"></i>
            <span>Follow us on YouTube for updates</span>
          </a>
        </div>
      </section>

      {/* THINGS WE'VE BUILT */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 z-10">
        <div className="text-center mb-16">
          <div className="section-label justify-center mb-6 inline-flex reveal">Our Portfolio</div>
          <h2 className="serif reveal reveal-delay-1" style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1 }}>
            Things we've <span className="serif-italic gradient-text">built.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Used & Useful */}
          <div className="premium-card p-8 md:p-10 reveal">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <i className="fa-solid fa-recycle text-xl"></i>
            </div>
            <h3 className="serif text-3xl mb-3">Used & Useful</h3>
            <p className="text-muted leading-relaxed mb-6">
              A marketplace connecting people who want to sell already-used products to people who are interested in buying them. It drives sustainability while making commerce accessible. Through Used & Useful, we have facilitated hundreds of successful sales and counting.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <span className="text-sm font-medium text-primary inline-flex items-center gap-2">
                <i className="fa-solid fa-chart-line"></i> Hundreds of sales facilitated
              </span>
              <a href="https://whatsapp.com/channel/0029VbAvYdq89inqcjfuGP23" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#25D366] inline-flex items-center gap-2 hover:underline">
                <i className="fa-brands fa-whatsapp"></i> Join Channel
              </a>
            </div>
          </div>

          {/* BDI */}
          <div className="premium-card p-8 md:p-10 reveal reveal-delay-1">
            <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center text-accent mb-6">
              <i className="fa-solid fa-hand-holding-dollar text-xl"></i>
            </div>
            <h3 className="serif text-3xl mb-3">BDI Initiative</h3>
            <p className="text-muted leading-relaxed mb-6">
              The Bauchi State Development Initiative (BDI) is a development-based project to position Bauchi State as Africa’s leading spot for investors. Spanning across all sectors, BDI aims to bring permanent, infrastructural, and economic change to the state.
            </p>
            <a href="https://mx2bdi.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary inline-flex items-center gap-2 hover:underline">
              Visit mx2bdi.com <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            </a>
          </div>
        </div>
      </section>

      {/* ELI7 FOUNDATION SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 z-10">
        <div className="premium-card p-10 md:p-14 bg-paper reveal">
          <div className="text-center mb-10">
            <div className="section-label justify-center mb-6 inline-flex">Our Foundation</div>
            <h2 className="serif mb-4" style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1 }}>
              Eli7 <span className="serif-italic gradient-text">Foundation.</span>
            </h2>
            <p className="text-muted max-w-2xl mx-auto text-lg leading-relaxed">
              Supporting communities, uplifting the vulnerable, and driving meaningful social impact.
            </p>
            <div className="mt-6">
              <a href="https://www.bdi.com/eli7foundation#support" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                <i className="fa-solid fa-heart"></i> Support the Foundation
              </a>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {[
              "https://res.cloudinary.com/drnrbfltr/image/upload/v1782108619/WhatsApp_Image_2026-05-27_at_1.57.51_PM_as7i9h.jpg",
              "https://res.cloudinary.com/drnrbfltr/image/upload/v1782108616/WhatsApp_Image_2026-05-27_at_2.24.02_PM_jmfh65.jpg",
              "https://res.cloudinary.com/drnrbfltr/image/upload/v1785748645/763fe4e1-c177-4876-9c97-61ef78955af3.png",
              "https://res.cloudinary.com/drnrbfltr/image/upload/v1785749310/48446060-cd21-4fb3-b8d2-87ed3c00f07a.png"
            ].map((imgUrl, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-md aspect-square relative bg-slate-100">
                <Image 
                  src={imgUrl}
                  alt={`Eli7 Foundation impact ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE FUTURE WE ENVISION */}
      <section className="relative max-w-4xl mx-auto px-6 lg:px-10 py-20 z-10 text-center">
        <div className="section-label justify-center mb-6 inline-flex reveal">The Vision</div>
        <h2 className="serif mb-10 reveal reveal-delay-1" style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1, letterSpacing: '-0.02em' }}>
          The future we <span className="serif-italic gradient-text">envision.</span>
        </h2>
        <div className="space-y-6 text-lg text-ink/75 leading-relaxed reveal reveal-delay-2">
          <p>
            We envision a future where people who are intellectually bright, and those who are willing to bring about change, can easily achieve their dreams. We are building a community that brings out amazing people capable of bringing permanent change to Nigeria.
          </p>
          <p>
            For too long, Nigeria has been seen as a place to run away from. We are changing that narrative. Even in Bauchi State, where we operate full-time, we realize that we can bring changes, and we have been able to impact the community for the longest.
          </p>
          <p className="serif-italic text-2xl text-ink pt-4">
            We are building the future, right here at home.
          </p>
        </div>
      </section>

      {/* THE TEAM */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 z-10">
        <div className="text-center mb-16">
          <div className="section-label justify-center mb-6 inline-flex reveal">The Leaders</div>
          <h2 className="serif reveal reveal-delay-1" style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1 }}>
            Meet the <span className="serif-italic gradient-text">team.</span>
          </h2>
          <p className="text-muted mt-4 reveal reveal-delay-2 max-w-xl mx-auto">The minds leading the FindOneCampus community and building the campus without walls.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 max-w-3xl mx-auto gap-8">
          {[
            { 
              name: 'Apex', 
              role: 'Co Founder & President', 
              linkedin: 'https://www.linkedin.com/in/kingmunachi/', 
              img: 'https://res.cloudinary.com/drnrbfltr/image/upload/v1786076508/b27ea232-3f0b-4a6e-a6da-7f80928c47c5.png' 
            },
            { 
              name: 'BestBreedX', 
              role: 'Product manager', 
              linkedin: 'https://www.linkedin.com/in/chinemerem-king-67a982248/', 
              img: 'https://res.cloudinary.com/drnrbfltr/image/upload/v1785143771/64c94b8b-93f5-4ea1-b7f6-a76fcca3b1d9.png' 
            }
          ].map((member, i) => (
            <div key={i} className={`premium-card p-8 text-center reveal reveal-delay-${i+1}`}>
              <div className="w-full h-72 mx-auto mb-6 bg-slate-100 rounded-2xl overflow-hidden relative shadow-sm border border-black/5">
                <Image 
                  src={member.img}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                />
              </div>
              <h3 className="font-semibold text-xl">{member.name}</h3>
              <p className="text-sm text-muted mb-4">{member.role}</p>
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-black/10 hover:bg-primary hover:text-white hover:border-primary transition">
                <i className="fa-brands fa-linkedin text-lg"></i>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* WHO WE'RE LOOKING FOR */}
      <section className="relative max-w-4xl mx-auto px-6 lg:px-10 py-20 z-10">
        <div className="premium-card p-10 md:p-14 bg-paper text-center reveal">
          <div className="section-label justify-center mb-6 inline-flex">Join the mission</div>
          <h2 className="serif mb-6" style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1 }}>
            Who we're <span className="serif-italic gradient-text">looking for.</span>
          </h2>
          <p className="text-lg text-muted leading-relaxed mb-8 max-w-2xl mx-auto">
            We are looking for people interested in making something out of their lives. People who are ready to work hard for the future and bring permanent change to their society—a change that influences others to become changers too.
          </p>
          <p className="text-lg text-muted leading-relaxed mb-10 max-w-2xl mx-auto">
            If you are someone who wants to influence your world for good, and you are ready to learn, we want you on the team.
          </p>
          <a 
            href="https://wa.me/2348149193063?text=Hello%20FindOneCampus,%20I%20am%20interested%20in%20joining%20the%20team." 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary inline-flex items-center gap-2"
          >
            <i className="fa-brands fa-whatsapp text-xl"></i>
            <span>Message Us: 0814 919 3063</span>
          </a>
        </div>
      </section>

      {/* SOCIAL MEDIA GROWTH & SUPPORT */}
      <section className="relative max-w-4xl mx-auto px-6 lg:px-10 py-12 z-10 text-center">
        <div className="reveal">
          <i className="fa-solid fa-rocket text-3xl text-primary mb-4"></i>
          <h3 className="serif text-2xl mb-3">Want to grow your social media?</h3>
          <p className="text-muted mb-6 max-w-xl mx-auto">
            If you want to boost or learn how to grow your social media presence, you can reach out to us or our support team directly via the contact page.
          </p>
          <Link href="/contact" className="btn-secondary !py-3 !px-6 text-sm inline-flex items-center gap-2">
            Contact Support <i className="fa-solid fa-arrow-right text-xs"></i>
          </Link>
        </div>
      </section>

      {/* SHARE & SUPPORT */}
      <section className="relative max-w-4xl mx-auto px-6 lg:px-10 py-20 z-10 text-center border-t border-black/5 mt-10">
        <div className="reveal">
          <h2 className="serif text-4xl mb-4">Support the <span className="gradient-text">Campus.</span></h2>
          <p className="text-muted mb-8 max-w-xl mx-auto">
            We encourage you to support us by pushing the things we are doing. Share FindOneCampus with someone who needs it today.
          </p>
          <div className="flex items-center justify-center gap-4">
            {/* Modern X Logo (Using Inline SVG) */}
            <a href="https://twitter.com/intent/tweet?text=Check%20out%20FindOneCampus%20-%20The%20World%20Is%20One%20Big%20Campus!%20https://findonecampus.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-ink hover:text-white transition" title="Share on X">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com/findonecampus" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-ink hover:text-white transition" title="Instagram">
              <i className="fa-brands fa-instagram text-lg"></i>
            </a>
            {/* TikTok */}
            <a href="https://tiktok.com/@findonecampus" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-ink hover:text-white transition" title="TikTok">
              <i className="fa-brands fa-tiktok text-lg"></i>
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://findonecampus.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-ink hover:text-white transition" title="Share on LinkedIn">
              <i className="fa-brands fa-linkedin text-lg"></i>
            </a>
            {/* WhatsApp */}
            <a href="https://wa.me/?text=Check%20out%20FindOneCampus%20-%20The%20World%20Is%20One%20Big%20Campus!%20https://findonecampus.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition" title="Share on WhatsApp">
              <i className="fa-brands fa-whatsapp text-lg"></i>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}