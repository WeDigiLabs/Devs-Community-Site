import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, Phone, Instagram, Plus } from 'lucide-react'

import PageHero from '../components/PageHero'
import SectionHeader from '../components/SectionHeader'
import Eyebrow from '../components/Eyebrow'
import Reveal from '../components/Reveal'
import BuildersForm from '../components/BuildersForm'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'

const CONTACT_CARDS = [
  {
    icon: Mail,
    label: 'Email',
    value: 'devstechsociety@gmail.com',
    href: 'mailto:devstechsociety@gmail.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 8838023321',
    href: 'tel:+918838023321',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@devs_community',
    href: 'https://www.instagram.com/devs_society/',
  },
]

const FAQS = [
  {
    q: 'Is DEVS only for CS/IT students?',
    a: "No. DEVS is for anyone interested in tech and building things. You don't need to be a coder to join or start a chapter.",
  },
  {
    q: 'Is it free to join?',
    a: 'Yes. Joining the community is completely free.',
  },
  {
    q: 'Can I start a chapter at my college?',
    a: "Yes — if you're a 2nd or 3rd year student with the drive to make it happen. Apply as a Campus Ambassador on the Join page.",
  },
  {
    q: 'Are the outside-college meetups only for students?',
    a: 'Not at all. DEVS Community is open to developers, entrepreneurs, creators — anyone building something. Students welcome too.',
  },
]

function Contact() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <>
      <PageHero
        tag="Contact"
        title={["Let's", 'talk.']}
        subtitle="Questions, collaborations, sponsorships, or just saying hi — we reply fast."
        meta="Reply within 48h"
      />

      {/* ──────────────── CONTACT CARDS ──────────────── */}
      <section className="border-t border-border">
        <div className="container-devs py-20 md:py-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid-hairline sm:grid-cols-3"
          >
            {CONTACT_CARDS.map((card) => (
              <motion.a
                key={card.label}
                href={card.href}
                target={card.label === 'Instagram' ? '_blank' : undefined}
                rel={card.label === 'Instagram' ? 'noreferrer noopener' : undefined}
                variants={fadeUp}
                className="cell group p-8 hover:bg-surface"
              >
                <span className="text-white transition-transform duration-300 group-hover:-translate-y-1">
                  <card.icon size={24} strokeWidth={1.75} />
                </span>
                <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                  {card.label}
                </p>
                <p className="mt-1.5 break-words text-lg font-semibold text-white transition-colors group-hover:text-muted">
                  {card.value}
                </p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────── BUILDERS FORM ──────────────── */}
      <section className="border-t border-border">
        <div className="container-devs max-w-2xl py-24 md:py-28">
          <Reveal>
            <Eyebrow index={1}>Join the Community</Eyebrow>
            <h2 className="mt-6 text-3xl font-bold tracking-tighter text-white md:text-4xl">
              Get in the room.
            </h2>
            <p className="mt-5 text-muted">
              Builders only — entrepreneurs, developers, creators. Leave your
              details and we'll invite you to upcoming events and our official
              WhatsApp group.
            </p>
          </Reveal>

          <Reveal
            delay={0.08}
            className="mt-10 rounded-2xl border border-border bg-surface p-8 md:p-10"
          >
            <BuildersForm />
          </Reveal>
        </div>
      </section>

      {/* ──────────────── FAQ ──────────────── */}
      <section className="border-t border-border">
        <div className="container-devs max-w-3xl py-24 md:py-28">
          <SectionHeader index={2} eyebrow="FAQ" title="Questions, answered." />

          <div className="mt-12">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <Reveal key={faq.q} delay={i * 0.05} className="border-t border-border last:border-b">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : i)}
                      className="flex w-full items-center justify-between gap-4 py-6 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="flex items-center gap-4 text-lg font-semibold text-white">
                        <span className="font-mono text-xs text-muted/60">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {faq.q}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0 text-white"
                        aria-hidden="true"
                      >
                        <Plus size={22} />
                      </motion.span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-6 pl-10 leading-relaxed text-muted">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact
