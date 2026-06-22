import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Calendar, Clock, MapPin, Users, Layers } from 'lucide-react'

import PageHero from '../components/PageHero'
import Eyebrow from '../components/Eyebrow'
import Reveal from '../components/Reveal'
import FooterCTA from '../components/FooterCTA'
import { PATTERNS } from '../lib/patterns'
import { apiGet } from '../lib/api'

/* Offline fallback — mirrors the seeded DB row so the page works without
   the API server. */
const FALLBACK_EVENTS = [
  {
    id: 0,
    title: 'DEVS Meetup #001',
    type: 'Community Meetup',
    description:
      "Chennai's first outside-college builder meetup. A room of 50 developers, entrepreneurs, creators, and students. Three story sparks. Open tables. Chai. Real conversations. No stage. No hierarchy.",
    date_text: 'Saturday Morning',
    time_text: '9:00 AM – 1:00 PM',
    venue: 'Chennai (To be announced)',
    capacity: '50 builders max',
    format: 'Stories → Open Tables → Open Mic → Chai',
    register_link: '',
    image_url: null,
    status: 'upcoming',
  },
]

function Events() {
  const [upcoming, setUpcoming] = useState(FALLBACK_EVENTS)

  useEffect(() => {
    apiGet('/api/events')
      .then((rows) => {
        const live = rows.filter((e) => e.status === 'upcoming')
        if (live.length) setUpcoming(live)
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <PageHero
        tag="What We Run"
        title={['Events built', 'for builders.']}
        subtitle="From guided hackathons to builder meetups — every DEVS event is designed so you leave with more than you came with."
        meta="100+ events hosted"
      />

      {/* ──────────────────── UPCOMING ──────────────────── */}
      <section className="border-t border-border">
        <div className="container-devs py-24 md:py-32">
          <Reveal>
            <Eyebrow index={1}>Upcoming</Eyebrow>
          </Reveal>

          <div className="mt-8 space-y-8">
            {upcoming.map((event, i) => (
              <UpcomingEventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        </div>
      </section>

      <FooterCTA
        title="Don't miss"
        titleAccent="the next one."
        subtitle="Get notified about DEVS Meetup #001 and everything after."
        ctaLabel="Get Notified"
      />
    </>
  )
}

/* Featured upcoming-event card. Content comes from the admin dashboard:
   poster image (rendered grayscale), metadata strip, and an external
   register link when one is set. */
function UpcomingEventCard({ event, index }) {
  const details = [
    { icon: Calendar, label: 'Date', value: event.date_text },
    { icon: Clock, label: 'Time', value: event.time_text },
    { icon: MapPin, label: 'Venue', value: event.venue },
    { icon: Users, label: 'Size', value: event.capacity },
    { icon: Layers, label: 'Format', value: event.format, wide: true },
  ].filter((d) => d.value)

  return (
    <Reveal
      as="article"
      delay={0.05}
      className="overflow-hidden rounded-2xl border border-border"
    >
      <div className="grid lg:grid-cols-[1.5fr_1fr]">
        <div className="p-8 md:p-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              {event.type}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-white" />
              {event.register_link ? 'Registrations Open' : 'Coming Soon'}
            </span>
          </div>

          <h2 className="mt-6 text-4xl font-bold tracking-tighter text-white md:text-6xl">
            {event.title}
          </h2>
          {event.description && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              {event.description}
            </p>
          )}
          {event.register_link ? (
            <a
              href={event.register_link}
              target="_blank"
              rel="noreferrer noopener"
              className="group btn-primary mt-9"
            >
              Register Now
              <ArrowUpRight
                size={18}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          ) : (
            <Link to="/join" className="group btn-primary mt-9">
              Get Notified
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          )}
        </div>

        {/* Poster panel — uploaded image or numbered pattern slot */}
        <div className="relative min-h-[240px] overflow-hidden border-t border-border lg:border-l lg:border-t-0">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover grayscale"
            />
          ) : (
            <>
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.09]"
                style={PATTERNS.dots}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                  {event.type?.split(' ')[1] || 'Event'}
                </span>
                <span
                  aria-hidden="true"
                  className="text-stroke text-8xl font-bold tracking-tighter md:text-9xl"
                >
                  {String(index + 1).padStart(3, '0')}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                  Chennai · TN
                </span>
              </div>
            </>
          )}
          <span aria-hidden="true" className="absolute left-3 top-3 font-mono text-xs text-white/40">+</span>
          <span aria-hidden="true" className="absolute right-3 top-3 font-mono text-xs text-white/40">+</span>
          <span aria-hidden="true" className="absolute bottom-3 left-3 font-mono text-xs text-white/40">+</span>
          <span aria-hidden="true" className="absolute bottom-3 right-3 font-mono text-xs text-white/40">+</span>
        </div>
      </div>

      {details.length > 0 && (
        <dl className="grid gap-px border-t border-border bg-border sm:grid-cols-2">
          {details.map((detail) => (
            <div
              key={detail.label}
              className={`bg-black p-6 ${detail.wide ? 'sm:col-span-2' : ''}`}
            >
              <dt className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                <detail.icon size={14} /> {detail.label}
              </dt>
              <dd className="mt-2 font-medium text-white">{detail.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </Reveal>
  )
}

export default Events
