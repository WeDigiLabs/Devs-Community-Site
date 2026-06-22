import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import PageHero from '../components/PageHero'
import FooterCTA from '../components/FooterCTA'
import { PATTERNS } from '../lib/patterns'
import { apiGet } from '../lib/api'

const FRAMES = [
  {
    id: 'meetup-001',
    title: 'DEVS Meetup #001',
    category: 'Meetups',
    meta: 'Chennai · 50 builders',
    pattern: 'dots',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 'geekify-u',
    title: 'Geekify U',
    category: 'Workshops',
    meta: 'Multi-domain bootcamp',
    pattern: 'diag',
    aspect: 'aspect-square',
  },
  {
    id: 'devathon',
    title: 'Devathon',
    category: 'Hackathons',
    meta: 'Guided hackathon',
    pattern: 'grid',
    aspect: 'aspect-[3/2]',
  },
  {
    id: 'symposium',
    title: 'The 800+ Symposium',
    category: 'Community',
    meta: 'Record turnout',
    pattern: 'rings',
    aspect: 'aspect-square',
  },
  {
    id: 'p2p-hub',
    title: 'P2P Hub Sessions',
    category: 'Workshops',
    meta: 'Students teach students',
    pattern: 'lines',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 'devfest',
    title: 'DevFest',
    category: 'DevFest',
    meta: 'Annual mega event',
    pattern: 'cross',
    aspect: 'aspect-[3/2]',
  },
  {
    id: 'build-night',
    title: 'Build Nights',
    category: 'Meetups',
    meta: 'Late hours, real work',
    pattern: 'grid',
    aspect: 'aspect-square',
  },
  {
    id: 'chapter-launch',
    title: 'Chapter Launches',
    category: 'Community',
    meta: 'New colleges, new crews',
    pattern: 'diag',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 'open-mic',
    title: 'Open Mic Rounds',
    category: 'Meetups',
    meta: 'No stage. No script.',
    pattern: 'rings',
    aspect: 'aspect-[3/2]',
  },
  {
    id: 'workshops',
    title: 'Domain Workshops',
    category: 'Workshops',
    meta: 'AI/ML · Cyber · UI/UX',
    pattern: 'dots',
    aspect: 'aspect-square',
  },
  {
    id: 'devfest-night',
    title: 'DevFest After Hours',
    category: 'DevFest',
    meta: 'Networking floor',
    pattern: 'lines',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 'core-team',
    title: 'The Core Team',
    category: 'Community',
    meta: 'The people behind it',
    pattern: 'cross',
    aspect: 'aspect-square',
  },
]

function Gallery() {
  const [active, setActive] = useState('All')
  const [frames, setFrames] = useState(FRAMES)

  // Live frames from the API; the static set above is the offline fallback.
  useEffect(() => {
    apiGet('/api/gallery')
      .then((rows) => {
        if (rows.length) setFrames(rows)
      })
      .catch(() => {})
  }, [])

  const categories = ['All', ...new Set(frames.map((f) => f.category).filter(Boolean))]
  const filtered =
    active === 'All' ? frames : frames.filter((f) => f.category === active)

  return (
    <>
      <PageHero
        tag="Gallery"
        title={['Proof of', 'work.']}
        subtitle="Meetups, workshops, hackathons, late nights — the community in frames. Shot by builders, of builders. Photos drop here after every event."
        meta="Contact Sheet / 001"
      />

      <section className="border-t border-border">
        <div className="container-devs py-16 md:py-24">
          {/* Filter row — horizontal scroll on mobile */}
          <div
            className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 pb-2 md:mx-0 md:px-0"
            role="tablist"
            aria-label="Filter gallery by event type"
          >
            {categories.map((cat) => {
              const isActive = active === cat
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(cat)}
                  className={`shrink-0 rounded-full border px-5 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-200 ${
                    isActive
                      ? 'border-white bg-white text-black'
                      : 'border-border text-muted hover:border-white/40 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Frame count readout */}
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            {String(filtered.length).padStart(2, '0')} frames /{' '}
            {active === 'All' ? 'every event' : active}
          </p>

          {/* Contact sheet */}
          <motion.div
            layout
            className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((frame, i) => (
                <motion.article
                  layout
                  key={frame.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                  className="group overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-300 hover:border-white/40"
                >
                  {/* Exposure area — real photo (grayscale) or pattern slot */}
                  <div className={`relative ${frame.aspect} overflow-hidden`}>
                    {frame.image_url ? (
                      <img
                        src={frame.image_url}
                        alt={frame.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover grayscale transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-[0.08] transition-all duration-500 group-hover:scale-110 group-hover:opacity-[0.16]"
                        style={PATTERNS[frame.pattern]}
                      />
                    )}
                    {/* Crop marks */}
                    <span aria-hidden="true" className="absolute left-3 top-3 font-mono text-xs text-white/25">+</span>
                    <span aria-hidden="true" className="absolute right-3 top-3 font-mono text-xs text-white/25">+</span>
                    <span aria-hidden="true" className="absolute bottom-3 left-3 font-mono text-xs text-white/25">+</span>
                    <span aria-hidden="true" className="absolute bottom-3 right-3 font-mono text-xs text-white/25">+</span>
                    {/* Ghost frame number */}
                    <span
                      aria-hidden="true"
                      className="absolute bottom-2 right-4 font-mono text-6xl font-bold tracking-tighter text-white/[0.07] transition-colors duration-300 group-hover:text-white/15"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {/* Status chip — only while the slot is empty */}
                    {!frame.image_url && (
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-border bg-black/70 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted backdrop-blur-sm">
                        <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-white align-middle" />
                        Awaiting upload
                      </span>
                    )}
                  </div>

                  {/* Caption strip */}
                  <div className="flex items-end justify-between gap-3 border-t border-border px-5 py-4">
                    <div>
                      <h3 className="font-semibold text-white">{frame.title}</h3>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                        {frame.category} · {frame.meta}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted/60">
                      F-{String(i + 1).padStart(3, '0')}
                    </span>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Honest note */}
          <p className="mt-10 border-t border-border pt-6 font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-muted/60">
            Frames fill as events happen — first drop lands after DEVS Meetup
            #001.
          </p>
        </div>
      </section>

      <FooterCTA
        title="Be in the"
        titleAccent="next frame."
        subtitle="Show up, build something, end up on this wall."
        ctaLabel="Join the Community"
      />
    </>
  )
}

export default Gallery
