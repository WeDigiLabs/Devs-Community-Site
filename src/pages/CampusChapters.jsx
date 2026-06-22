import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Award,
  Linkedin,
  Globe,
  Compass,
  Network,
  Star,
} from 'lucide-react'

import PageHero from '../components/PageHero'
import SectionHeader from '../components/SectionHeader'
import Eyebrow from '../components/Eyebrow'
import Reveal from '../components/Reveal'
import FooterCTA from '../components/FooterCTA'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'
import { apiGet } from '../lib/api'

const RESPONSIBILITIES = [
  'Get official college permission to start the chapter',
  'Recruit Core Team (15) + Board Team (15)',
  'Run Geekify U, Devathon, P2P Hub & DevFest',
  'Maintain the DEVS framework & community standard',
  'Represent your college at inter-chapter events',
]

const BENEFITS = [
  {
    icon: Award,
    title: 'Official Certificate',
    body: 'From DEVS Society. Verifiable & shareable.',
  },
  {
    icon: Linkedin,
    title: 'LinkedIn Recognition',
    body: 'Public tag + official Campus Ambassador title.',
  },
  {
    icon: Globe,
    title: 'Listed on Website',
    body: 'Your name and college on the DEVS website.',
  },
  {
    icon: Compass,
    title: 'Founder Mentorship',
    body: 'Direct guidance from the DEVS founding team.',
  },
  {
    icon: Network,
    title: '2500+ Network',
    body: 'Alumni, industry contacts & fellow leads.',
  },
  {
    icon: Star,
    title: 'Priority at DevFest',
    body: 'VIP access to the biggest DEVS event of the year.',
  },
]

const CHECKLIST = [
  'You are a 2nd or 3rd year student (not final year)',
  "You have interest in tech — you don't need to be a coder",
  'You are organized, communicative, and can own a responsibility',
  'You want to build something real — not just hold a title',
  'You believe in peer-learning and lifting others up',
]

const STEPS = [
  {
    number: '01',
    title: 'Fill the Application',
    body: 'Tell us about yourself, your college, and why you want to build DEVS there.',
  },
  {
    number: '02',
    title: 'Interview Call',
    body: 'A 20–30 min call with the DEVS founding team. We want to understand your thinking — not just your CV.',
  },
  {
    number: '03',
    title: "You're In",
    body: 'Get officially onboarded. Receive the DEVS playbook, templates, and direct support to launch your chapter.',
  },
]

const CHAPTERS = [
  {
    code: 'REC',
    name: 'Rajalakshmi Engineering College',
    location: 'Chennai, Tamil Nadu',
    note: 'Founding Chapter',
    lead: { name: 'Swayam Annamalai', initials: 'SA', role: 'Founder · Campus Lead' },
  },
  {
    code: 'VSB',
    name: 'VSB College',
    location: 'Coimbatore, Tamil Nadu',
    note: 'Active Chapter',
    lead: null,
  },
  {
    code: 'NEC',
    name: 'NEC College',
    location: 'Erode, Tamil Nadu',
    note: 'Active Chapter',
    lead: null,
  },
  {
    code: 'RAMCO',
    name: 'Ramco College',
    location: 'Rajapalayam, Tamil Nadu',
    note: 'Active Chapter',
    lead: null,
  },
]

function CampusChapters() {
  const [chapters, setChapters] = useState(CHAPTERS)

  // Live chapters from the API; the static array is the offline fallback.
  useEffect(() => {
    apiGet('/api/chapters')
      .then((rows) => {
        if (!rows.length) return
        setChapters(
          rows.map((r) => ({
            id: r.id,
            code: r.code,
            name: r.name,
            location: r.location,
            note: r.note,
            lead: r.lead_name
              ? {
                  name: r.lead_name,
                  initials:
                    r.lead_initials ||
                    r.lead_name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase(),
                  role: r.lead_role || 'Campus Lead',
                  image: r.lead_image,
                }
              : null,
          })),
        )
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <PageHero
        tag="Campus Chapters"
        title={['Bring DEVS', 'to your college.']}
        subtitle="Start a DEVS Technical Society chapter at your college. Become the person who makes it happen."
        meta={`${chapters.length} active chapters`}
      />

      {/* ───────── WHAT IS A CAMPUS AMBASSADOR ───────── */}
      <section className="border-t border-border">
        <div className="container-devs grid grid-cols-1 items-center gap-x-12 gap-y-14 py-24 lg:grid-cols-2 md:py-32">
          <Reveal>
            <Eyebrow index={1}>The Role</Eyebrow>
            <h2 className="mt-6 text-3xl font-bold tracking-tighter text-white md:text-4xl">
              What is a Campus Ambassador?
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              A Campus Ambassador is the official founder of DEVS at their
              college. Not just a member — the person who makes it happen.
            </p>

            <ul className="mt-8 space-y-3.5">
              {RESPONSIBILITIES.map((item, i) => (
                <li key={item} className="flex items-start gap-4">
                  <span className="mt-1 font-mono text-xs text-muted/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-muted">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Credential mockup */}
          <Reveal delay={0.1} className="flex justify-center">
            <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold tracking-tighter text-white">
                  DEVS<span className="text-muted">.</span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  CA / 2025
                </span>
              </div>
              <div
                className="mt-10 flex h-20 w-20 items-center justify-center rounded-xl bg-white text-3xl font-bold text-black"
                aria-hidden="true"
              >
                CA
              </div>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                Campus Ambassador
              </p>
              <p className="mt-1.5 text-2xl font-bold text-white">Your Name Here</p>
              <p className="mt-1 text-sm text-muted">Your College, Tamil Nadu</p>
              <div className="mt-8 flex items-center justify-between border-t border-border pt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                <span>DEVS Technical Society</span>
                <span className="inline-flex items-center gap-1.5 text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  Verified
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ──────────────── WHAT YOU GET ──────────────── */}
      <section className="border-t border-border">
        <div className="container-devs py-24 md:py-32">
          <SectionHeader
            index={2}
            eyebrow="What You Get"
            title="More than a title."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-14 grid-hairline sm:grid-cols-2 lg:grid-cols-3"
          >
            {BENEFITS.map((benefit, i) => (
              <motion.article
                key={benefit.title}
                variants={fadeUp}
                className="cell group p-8 hover:bg-surface"
              >
                <div className="flex items-start justify-between">
                  <span className="text-white transition-transform duration-300 group-hover:-translate-y-1">
                    <benefit.icon size={24} strokeWidth={1.75} />
                  </span>
                  <span className="font-mono text-xs text-muted/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-bold text-white">
                  {benefit.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted">{benefit.body}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────── WHO SHOULD APPLY ──────────────── */}
      <section className="border-t border-border">
        <div className="container-devs py-24 md:py-32">
          <SectionHeader
            index={3}
            eyebrow="Is This You?"
            title="Who should apply?"
          />

          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-14 grid-hairline"
          >
            {CHECKLIST.map((item) => (
              <motion.li
                key={item}
                variants={fadeUp}
                className="cell flex items-center gap-5 p-6 hover:bg-surface md:px-8"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-black">
                  <Check size={18} strokeWidth={3} />
                </span>
                <span className="text-lg text-white">{item}</span>
              </motion.li>
            ))}
          </motion.ul>

          <Reveal delay={0.1}>
            <p className="mt-8 text-lg text-muted">
              <span className="font-semibold text-white">
                You don't need experience running a club.
              </span>{' '}
              You need the drive to start one.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ──────────────── HOW IT WORKS ──────────────── */}
      <section className="border-t border-border">
        <div className="container-devs py-24 md:py-32">
          <SectionHeader index={4} eyebrow="The Process" title="How it works." />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-14 grid-hairline md:grid-cols-3"
          >
            {STEPS.map((step) => (
              <motion.article
                key={step.number}
                variants={fadeUp}
                className="cell p-8 md:p-10"
              >
                <span className="font-mono text-5xl font-bold tracking-tighter text-white/15">
                  {step.number}
                </span>
                <h3 className="mt-6 text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{step.body}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────── ACTIVE CHAPTERS ──────────────── */}
      <section className="border-t border-border">
        <div className="container-devs py-24 md:py-32">
          <SectionHeader
            index={5}
            eyebrow="Active Chapters"
            title="Where DEVS lives."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {chapters.map((chapter) => (
              <motion.article
                key={chapter.id ?? chapter.code}
                variants={fadeUp}
                className="rounded-2xl border border-border bg-surface p-8 transition-colors hover:border-white/30"
              >
                <div className="flex items-start justify-between">
                  <span className="text-4xl font-bold tracking-tighter text-white">
                    {chapter.code}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    Active
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">
                  {chapter.name}
                </h3>
                <p className="mt-1 text-sm text-muted">{chapter.location}</p>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                  {chapter.note}
                </p>

                {/* Campus lead — uploaded photo (grayscale) or monogram */}
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  {chapter.lead ? (
                    <>
                      {chapter.lead.image ? (
                        <img
                          src={chapter.lead.image}
                          alt={chapter.lead.name}
                          loading="lazy"
                          className="h-11 w-11 shrink-0 rounded-lg object-cover grayscale"
                        />
                      ) : (
                        <span
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-black"
                          aria-hidden="true"
                        >
                          {chapter.lead.initials}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {chapter.lead.name}
                        </p>
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                          {chapter.lead.role}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-dashed border-border font-mono text-xs text-muted"
                        aria-hidden="true"
                      >
                        ··
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-muted">
                          Announcing soon
                        </p>
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted/60">
                          Campus Lead
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <FooterCTA
        title="Ready to start"
        titleAccent="a chapter?"
        subtitle="Apply as a Campus Ambassador and bring DEVS to your college."
        ctaLabel="Apply as Campus Ambassador"
        ctaTo="/start-a-chapter"
      />
    </>
  )
}

export default CampusChapters
