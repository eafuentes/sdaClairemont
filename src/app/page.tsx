/**
 * Phase 0 development shell.
 *
 * This is not the church homepage. It exists only to prove that Next renders, both
 * fonts load, Tailwind compiles, and the production build succeeds. The ten-chapter
 * homepage narrative is Phase 1 — see docs/HOMEPAGE-EXPERIENCE.md.
 */
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-6 px-6 py-24">
      <p className="text-xs font-sans tracking-[0.14em] text-ink/60 uppercase">
        Foundation — Phase 0
      </p>

      <h1 className="text-4xl sm:text-5xl font-serif leading-tight font-light">
        San Diego Clairemont Seventh-day Adventist Church
      </h1>

      <p className="text-base max-w-prose font-sans leading-relaxed text-ink/70">
        The technical foundation is in place. The design system, content model and homepage
        experience are built in later phases.
      </p>

      <p className="text-lg max-w-prose font-serif leading-snug text-ink/70 italic">
        There&rsquo;s a place for you here.
      </p>
    </main>
  )
}
