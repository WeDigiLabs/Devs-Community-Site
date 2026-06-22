import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Linkedin, Target, Eye, Heart } from 'lucide-react'

import PageHero from '../components/PageHero'
import SectionHeader from '../components/SectionHeader'
import Eyebrow from '../components/Eyebrow'
import Reveal from '../components/Reveal'
import AnimatedCounter from '../components/AnimatedCounter'
import FooterCTA from '../components/FooterCTA'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'
import { apiGet } from '../lib/api'

const STATS = [
  { value: '100+', label: 'Events Hosted' },
  { value: '1000+', label: 'Developers' },
  { value: '2500+', label: 'Student Network' },
  { value: '10+', label: 'Chapter Leads' },
]

const MVV = [
  {
    icon: Target,
    title: 'Mission',
    body: 'Empower every builder in Tamil Nadu with the community, skills, and connections they need to build something real.',
  },
  {
    icon: Eye,
    title: 'Vision',
    body: 'A Tamil Nadu where every college has an active DEVS chapter and every city has a thriving builder community.',
  },
  {
    icon: Heart,
    title: 'Values',
    body: 'Peer learning over lectures. Builders over spectators. Honesty over polish. Consistency over scale.',
  },
]

const FOUNDERS = [
  {
    name: 'Swayam Annamalai',
    role: 'Founder',
    initials: 'SA',
    linkedin: 'https://linkedin.com/in/devswayam',
  },
  {
    name: 'Rishabh Venkatraman',
    role: 'Co-Founder',
    initials: 'RV',
    linkedin: 'https://linkedin.com/in/rishabh-venkatraman',
  },
]

function About() {
  const [team, setTeam] = useState(FOUNDERS)

  // Live founders from the API (with uploaded photos); FOUNDERS is the fallback.
  useEffect(() => {
    apiGet('/api/team')
      .then((rows) => {
        if (rows.length) {
          setTeam(
            rows.map((r) => ({
              name: r.name,
              role: r.role,
              initials:
                r.initials ||
                r.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
              linkedin: r.linkedin,
              image: r.image_url,
            })),
          )
        }
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <PageHero
        tag="Our Story"
        title={['Born in college.', 'Built for builders.', 'Going statewide.']}
        subtitle="From a single college club to a city-wide builder community — with students starting DEVS chapters in colleges across Tamil Nadu."
        meta="Est. Chennai, TN"
      />

      {/* ───────────────────── ORIGIN STORY ───────────────────── */}
      <section className="border-t border-border">
        <div className="container-devs grid grid-cols-1 gap-x-10 gap-y-12 py-24 lg:grid-cols-12 md:py-32">
          <Reveal className="lg:col-span-7">
            <Eyebrow index={1}>The Origin</Eyebrow>
            <p className="mt-7 text-2xl font-medium leading-snug tracking-tight text-white md:text-[2rem]">
              DEVS started in college as a small group of students who believed
              students could teach students better than anyone else.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              We hosted 100+ events and built a 2500+ student network — all
              driven by peer learning, hands-on building, and the refusal to
              wait for permission to start.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Today that club has grown into{' '}
              <span className="font-semibold text-white">DEVS Community</span> —
              a home for builders across Chennai — while students across Tamil
              Nadu start their own DEVS chapters in their colleges.
            </p>
          </Reveal>

          <motion.dl
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid-hairline grid-cols-2 lg:col-span-4 lg:col-start-9"
          >
            {STATS.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="cell p-6">
                <dd className="text-3xl font-bold tracking-tighter text-white md:text-4xl">
                  <AnimatedCounter target={stat.value} />
                </dd>
                <dt className="mt-2 font-mono text-[10px] uppercase leading-tight tracking-[0.12em] text-muted">
                  {stat.label}
                </dt>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </section>

      {/* ───────────── MISSION / VISION / VALUES ───────────── */}
      <section className="border-t border-border">
        <div className="container-devs py-24 md:py-32">
          <SectionHeader
            index={2}
            eyebrow="What Drives Us"
            title="Mission, vision & values."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-14 grid-hairline md:grid-cols-3"
          >
            {MVV.map((item) => (
              <motion.article
                key={item.title}
                variants={fadeUp}
                className="cell group p-8 hover:bg-surface md:p-10"
              >
                <span className="inline-block text-white transition-transform duration-300 group-hover:-translate-y-1">
                  <item.icon size={26} strokeWidth={1.75} />
                </span>
                <h3 className="mt-8 text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────────────── THE PIVOT ───────────────────── */}
      <section className="border-t border-border">
        <div className="container-devs py-24 md:py-32">
          <Reveal className="mx-auto max-w-3xl text-center">
            <div className="flex justify-center">
              <Eyebrow index={3}>The Next Chapter</Eyebrow>
            </div>
            <h2 className="mt-6 text-4xl font-bold tracking-tighter text-white md:text-5xl">
              From campus to community.
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-muted">
              DEVS started inside colleges — and that's not changing. Students can
              still register as Campus Ambassadors and start a DEVS chapter at
              their college. But we're expanding beyond campus now. Entrepreneurs
              building companies. Creators building their identity. Developers
              building products. These people need a community too. That's exactly
              what DEVS is becoming.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────── THE TEAM ───────────────────── */}
      <section className="border-t border-border">
        <div className="container-devs py-24 md:py-32">
          <SectionHeader index={4} eyebrow="The People" title="Meet the team." />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:max-w-3xl"
          >
            {team.map((person, i) => (
              <motion.article
                key={person.name}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-300 hover:border-white/40"
              >
                {/* Spec header row */}
                <div className="flex items-center justify-between border-b border-border px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  <span>{String(i + 1).padStart(2, '0')} / Founding Team</span>
                  <span className="text-white">{person.role}</span>
                </div>

                {/* Portrait — uploaded photo (grayscale) or giant outlined monogram */}
                <div className="relative flex h-56 items-center justify-center overflow-hidden md:h-64">
                  {person.image ? (
                    <img
                      src={person.image}
                      alt={person.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <>
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-[0.07] transition-opacity duration-300 group-hover:opacity-[0.12]"
                        style={{
                          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                          backgroundSize: '14px 14px',
                        }}
                      />
                      <span
                        aria-hidden="true"
                        className="text-stroke relative text-[6.5rem] font-bold tracking-tighter transition-colors duration-300 group-hover:text-white md:text-[8rem]"
                      >
                        {person.initials}
                      </span>
                    </>
                  )}
                  {/* Print crop marks */}
                  <span aria-hidden="true" className="absolute left-3 top-3 font-mono text-xs text-white/40">+</span>
                  <span aria-hidden="true" className="absolute right-3 top-3 font-mono text-xs text-white/40">+</span>
                  <span aria-hidden="true" className="absolute bottom-3 left-3 font-mono text-xs text-white/40">+</span>
                  <span aria-hidden="true" className="absolute bottom-3 right-3 font-mono text-xs text-white/40">+</span>
                </div>

                {/* Identity footer */}
                <div className="border-t border-border px-6 py-5">
                  <h3 className="text-xl font-bold tracking-tight text-white">
                    {person.name}
                  </h3>
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-2.5 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-white"
                    aria-label={`${person.name} on LinkedIn`}
                  >
                    <Linkedin size={14} /> LinkedIn
                    <ArrowUpRight
                      size={13}
                      className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </div>
              </motion.article>
            ))}
          </motion.div>

          <Reveal className="mt-5 lg:max-w-3xl" delay={0.1}>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                Core Team — Coming Soon
              </p>
              <p className="mt-2 text-sm text-muted/60">
                The people building DEVS across Tamil Nadu will be featured here.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <FooterCTA
        title="Want to be"
        titleAccent="part of the story?"
        subtitle="Join the community or start a chapter at your college."
        ctaLabel="Get Involved"
      />
    </>
  )
}

export default About
