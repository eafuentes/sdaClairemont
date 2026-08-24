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
      <p className="font-sans text-xs tracking-[0.14em] text-ink/60 uppercase">
        Foundation — Phase 0
      </p>

      <h1 className="font-serif text-4xl leading-tight font-light sm:text-5xl">
        San Diego Clairemont Seventh-day Adventist Church
      </h1>

      <p className="max-w-prose font-sans text-base leading-relaxed text-ink/70">
        The technical foundation is in place. The design system, content model and homepage
        experience are built in later phases.
      </p>

      <p className="max-w-prose font-serif text-lg leading-snug text-ink/70 italic">
        There&rsquo;s a place for you here.
      </p>
    </main>
  )
}
