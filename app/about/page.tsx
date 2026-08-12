export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-10 py-32">
      <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-primary font-medium mb-6">
        <span className="w-6 h-px bg-primary"></span>
        Our story
      </div>
      <h1 className="serif mb-10" style={{ fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
        We believe the world<br />is <span className="serif-italic gradient-text">one giant campus.</span>
      </h1>
      <div className="space-y-6 text-lg text-ink/75 leading-relaxed">
        <p>FindOneCampus began with a simple observation: everywhere we looked, people were searching. For knowledge. For work. For clients. For books. For courses. For trusted professionals. For opportunities. For answers. For growth.</p>
        <p>We noticed that these searches weren't separate. They were all part of the same human impulse — the impulse to learn, to build, to grow, to connect. And we realized that the world itself, with all its people and resources and knowledge, was already functioning as a kind of campus. Just without the walls.</p>
        <p className="serif-italic text-2xl text-ink">So we built FindOneCampus to honor that truth.</p>
        <p>FindOneCampus is a platform for the lifelong learner, the builder, the teacher, the searcher. A place where professionals offer their services, where authors publish their books, where practitioners teach their crafts, and where every resource is curated with intention.</p>
        <p>We don't believe in walls. We believe in worlds. We don't believe in gatekeepers. We believe in guides. We don't believe in finishing school. We believe in forever learning.</p>
        <p>Welcome to the campus without walls. Welcome home.</p>
      </div>
      
      <div className="mt-16 grid sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-paper">
          <div className="text-4xl serif gradient-text mb-2">2023</div>
          <div className="text-sm text-muted">Year founded</div>
        </div>
        <div className="p-6 rounded-2xl bg-paper">
          <div className="text-4xl serif gradient-text mb-2">64</div>
          <div className="text-sm text-muted">Countries</div>
        </div>
        <div className="p-6 rounded-2xl bg-paper">
          <div className="text-4xl serif gradient-text mb-2">50k+</div>
          <div className="text-sm text-muted">Searchers</div>
        </div>
      </div>
    </div>
  )
}