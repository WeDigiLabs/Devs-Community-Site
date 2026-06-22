import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  Wrench,
  Handshake,
  Users,
  Rocket,
  Calendar,
  Clock,
  MapPin,
  Play,
} from 'lucide-react'

import AnimatedCounter from '../components/AnimatedCounter'
import Eyebrow from '../components/Eyebrow'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import RevealLines from '../components/RevealLines'
import Marquee from '../components/Marquee'
import FooterCTA from '../components/FooterCTA'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'
import { INTRO_HERO_DELAY, isIntroPending } from '../lib/intro'
import { apiGet } from '../lib/api'

const STATS = [
  { value: '100+', label: 'Events' },
  { value: '2500+', label: 'Students' },
  { value: '1000+', label: 'Developers' },
  { value: '10+', label: 'Chapter Leads' },
]

const WHY_CARDS = [
  {
    icon: Wrench,
    title: 'Build Together',
    body: 'Meetups and build nights where work actually happens. Bring what you are making, leave with momentum.',
  },
  {
    icon: Handshake,
    title: 'Real Connections',
    body: 'Founders, developers, and creators in one room. No badges, no gatekeeping — just people worth knowing.',
  },
  {
    icon: Users,
    title: 'Honest Feedback',
    body: 'Show your work and hear the truth. The community sharpens what you build before the market does.',
  },
  {
    icon: Rocket,
    title: 'Reasons to Ship',
    body: 'Accountability, collaborators, and a community that expects you to make things — not just talk about them.',
  },
]

const EVENT_DETAILS = [
  { icon: Calendar, label: 'Date', value: 'Saturday Morning' },
  { icon: Clock, label: 'Time', value: '9:00 AM – 1:00 PM' },
  { icon: MapPin, label: 'Venue', value: 'Chennai (TBA)' },
  { icon: Users, label: 'Size', value: '50 Builders' },
]

const TESTIMONIALS = [
  {
    quote:
      'DEVS gave me my first real technical network before I even graduated.',
    author: 'REC Student',
    role: '3rd Year CSE',
  },
  {
    quote:
      'The kind of room where a startup founder and a first-year student are having the same conversation.',
    author: 'Student Entrepreneur',
    role: 'Building in public',
  },
  {
    quote:
      "Finally a community in Chennai that's not just another college fest.",
    author: 'Developer',
    role: '2 years exp',
  },
]

function Home() {
  const reduceMotion = useReducedMotion()
  // Captured once at mount: on first load the hero waits for the preloader
  // curtain; on later route visits (or reduced motion) it animates instantly.
  const [introDelay] = useState(() =>
    isIntroPending() && !reduceMotion ? INTRO_HERO_DELAY : 0,
  )

  // Live testimonials (with videos) from the API; the static list is fallback.
  const [testimonials, setTestimonials] = useState(TESTIMONIALS)
  useEffect(() => {
    apiGet('/api/testimonials')
      .then((rows) => {
        if (rows.length) {
          setTestimonials(
            rows.map((r) => ({
              quote: r.quote,
              author: r.author,
              role: r.role,
              video: r.video_url,
            })),
          )
        }
      })
      .catch(() => {})
  }, [])

  return (
    <>
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative flex min-h-[calc(100vh-4rem)] flex-col md:min-h-[calc(100vh-5rem)]">
        {/* Animated dotted grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 animate-grid-move opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '38px 38px',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#000000_92%)]"
        />

        <div className="relative flex flex-1 flex-col justify-center">
          <div className="container-devs w-full py-14 md:py-16">
            {/* Edge metadata row */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: introDelay }}
              className="flex items-center justify-between border-b border-border pb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted"
            >
              <span className="inline-flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-white" />
                Chennai's Builder Community
              </span>
              <span className="hidden md:block">13.0827° N / 80.2707° E</span>
              <span className="hidden sm:block">Est. 2023</span>
            </motion.div>

            {/* Massive stacked headline */}
            <RevealLines
              as="h1"
              delay={introDelay + 0.15}
              lines={[
                { text: 'Built by', className: 'text-white' },
                { text: 'builders.', className: 'text-white' },
                { text: 'For builders.', className: 'text-stroke' },
              ]}
              className="mt-10 text-[clamp(2.6rem,12vw,8.75rem)] font-bold uppercase leading-[0.92] tracking-tighter"
            />

            {/* Sub + CTAs — asymmetric row */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              transition={{ delayChildren: introDelay + 0.7, staggerChildren: 0.12 }}
              className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
            >
              <motion.div
                variants={fadeUp}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <Link to="/join" className="group btn-primary w-full text-base sm:w-auto">
                  Join the Community
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
                <Link to="/events" className="btn-ghost w-full text-base sm:w-auto">
                  See What We Run
                </Link>
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="max-w-sm leading-relaxed text-muted md:text-right"
              >
                DEVS is where developers, entrepreneurs, and creators in Chennai
                come together — to learn, build, and grow. No hierarchy. Just
                people making things.
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Full-bleed hairline stat band */}
        <motion.dl
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: introDelay + 1 }}
          className="relative grid grid-cols-2 divide-x divide-y divide-border border-y border-border sm:grid-cols-4 sm:divide-y-0"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="px-6 py-8 text-center md:py-10">
              <dd className="text-4xl font-bold tracking-tighter text-white md:text-5xl">
                <AnimatedCounter target={stat.value} />
              </dd>
              <dt className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                {stat.label}
              </dt>
            </div>
          ))}
        </motion.dl>
      </section>

      {/* ─────────────────────── MARQUEE ─────────────────────── */}
      <Marquee />

      {/* ─────────────────────── MANIFESTO ─────────────────────── */}
      <section className="container-devs py-24 md:py-32">
        <Reveal>
          <Eyebrow index={1}>Who It's For</Eyebrow>
        </Reveal>

        <RevealLines
          as="h2"
          inView
          lines={[
            { text: 'Entrepreneurs', className: 'text-white' },
            { text: 'build companies.', className: 'text-stroke' },
            { text: 'Developers', className: 'text-white' },
            { text: 'build products.', className: 'text-stroke' },
            { text: 'Creators', className: 'text-white' },
            { text: 'build identity.', className: 'text-stroke' },
          ]}
          className="mt-10 text-[clamp(2.2rem,8vw,6.5rem)] font-bold uppercase leading-[0.95] tracking-tighter"
        />

        <Reveal
          delay={0.2}
          className="mt-12 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between"
        >
          <p className="max-w-xl text-xl font-medium text-white md:text-2xl">
            This community is for builders.
          </p>
          <Link
            to="/join"
            className="group inline-flex items-center gap-2 font-semibold text-white"
          >
            Join the Community
            <ArrowRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </Reveal>
      </section>

      {/* ─────────────────────── WHY DEVS ─────────────────────── */}
      <section className="border-t border-border">
        <div className="container-devs py-24 md:py-32">
        <SectionHeader
          index={2}
          eyebrow="Why We Exist"
          title="Where Chennai's builders find their people."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-14 grid-hairline sm:grid-cols-2"
        >
          {WHY_CARDS.map((card, i) => (
            <motion.article
              key={card.title}
              variants={fadeUp}
              className="cell group p-8 hover:bg-surface md:p-10"
            >
              <div className="flex items-start justify-between">
                <span className="text-white transition-transform duration-300 group-hover:-translate-y-1">
                  <card.icon size={26} strokeWidth={1.75} />
                </span>
                <span className="font-mono text-xs text-muted/60">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-10 text-xl font-bold text-white">{card.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{card.body}</p>
            </motion.article>
          ))}
        </motion.div>
        </div>
      </section>

      {/* ────────────────────── TWO WORLDS ────────────────────── */}
      <section className="border-t border-border">
        <div className="container-devs py-24 md:py-32">
          <SectionHeader
            index={3}
            eyebrow="One Community · Two Worlds"
            title="Outside campus. Inside campus. Always DEVS."
          />

          <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Outside campus — inverted, leads the pair */}
            <Reveal
              as="article"
              className="flex flex-col rounded-2xl bg-white p-8 text-black md:p-10"
            >
              <Eyebrow light>Outside Campus</Eyebrow>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-black md:text-3xl">
                DEVS Community
              </h3>
              <p className="mt-4 flex-1 leading-relaxed text-black/60">
                A builder community in Chennai open to everyone making something
                real. Developers, entrepreneurs, creators. Monthly meetups,
                build nights, and honest conversations. No titles needed.
              </p>
              <Link
                to="/join"
                className="group mt-8 inline-flex items-center gap-2 font-semibold text-black"
              >
                Join the Community
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </Reveal>

            {/* On campus */}
            <Reveal
              as="article"
              delay={0.08}
              className="flex flex-col rounded-2xl border border-border bg-surface p-8 md:p-10"
            >
              <Eyebrow>On Campus</Eyebrow>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
                DEVS Technical Society
              </h3>
              <p className="mt-4 flex-1 leading-relaxed text-muted">
                A structured technical society running inside colleges across
                Tamil Nadu. Students form Core Teams, run workshops, hackathons,
                and DevFest. Campus Ambassadors start and lead their own
                chapters.
              </p>
              <Link
                to="/campus-chapters"
                className="group mt-8 inline-flex items-center gap-2 font-semibold text-white"
              >
                Start a Chapter
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────────── UPCOMING EVENT TEASER ─────────────── */}
      <section className="border-t border-border">
        <div className="container-devs py-24 md:py-32">
          <Reveal>
            <Eyebrow index={4}>Next Up</Eyebrow>
          </Reveal>

          <Reveal
            as="article"
            delay={0.05}
            className="mt-8 overflow-hidden rounded-2xl border border-border"
          >
            <div className="p-8 md:p-12">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h3 className="text-3xl font-bold tracking-tighter text-white md:text-5xl">
                  DEVS Meetup #001
                </h3>
                <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white">
                  <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-white" />
                  Coming Soon
                </span>
              </div>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
                Chennai's first mixed builder meetup. Developers, entrepreneurs,
                creators, and students — one room, honest stories, real
                conversations. No stage. No hierarchy. Just builders.
              </p>
              <Link to="/events" className="group btn-primary mt-9">
                Get Notified
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Metadata strip */}
            <dl className="grid grid-cols-2 divide-x divide-y divide-border border-t border-border sm:grid-cols-4 sm:divide-y-0">
              {EVENT_DETAILS.map((detail) => (
                <div key={detail.label} className="p-6">
                  <dt className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                    <detail.icon size={14} /> {detail.label}
                  </dt>
                  <dd className="mt-2 font-medium text-white">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────── TESTIMONIALS ───────────────────── */}
      <section className="border-t border-border">
        <div className="container-devs py-24 md:py-32">
          <SectionHeader
            index={5}
            eyebrow="From the Community"
            title="What builders say."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-14 grid-hairline md:grid-cols-3"
          >
            {testimonials.map((item, i) => (
              <motion.figure
                key={item.author + i}
                variants={fadeUp}
                className="cell flex flex-col"
              >
                {item.video ? (
                  <TestimonialVideo src={item.video} author={item.author} />
                ) : (
                  <div className="flex flex-1 flex-col p-8 md:p-10">
                    <span
                      aria-hidden="true"
                      className="font-serif text-6xl leading-none text-white/15"
                    >
                      &ldquo;
                    </span>
                    <blockquote className="-mt-4 flex-1 text-lg leading-relaxed text-white">
                      {item.quote}
                    </blockquote>
                  </div>
                )}
                <figcaption className="border-t border-border px-8 py-6">
                  {item.video && item.quote && (
                    <p className="mb-3 text-sm leading-relaxed text-muted">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  )}
                  <p className="font-semibold text-white">{item.author}</p>
                  <p className="mt-0.5 font-mono text-xs uppercase tracking-[0.15em] text-muted">
                    {item.role}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </section>

      <FooterCTA />
    </>
  )
}

/* Square, click-to-play testimonial video. No autoplay; the poster frame sits
   in grayscale to match the theme and turns full-colour once it's playing. */
function TestimonialVideo({ src, author }) {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  return (
    <div className="relative aspect-square overflow-hidden bg-black">
      <video
        ref={ref}
        src={src}
        preload="metadata"
        playsInline
        controls={started}
        onPlay={() => setStarted(true)}
        className={`h-full w-full object-cover transition-[filter] duration-500 ${started ? '' : 'grayscale'}`}
      />
      {!started && (
        <button
          type="button"
          onClick={() => ref.current?.play()}
          aria-label={`Play ${author}'s video testimonial`}
          className="group absolute inset-0 flex items-center justify-center bg-black/25 transition-colors hover:bg-black/10"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white bg-black/40 text-white backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
            <Play size={22} className="ml-0.5" fill="currentColor" />
          </span>
        </button>
      )}
    </div>
  )
}

export default Home
