import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Mail, Phone } from 'lucide-react'

import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import { fadeUp, staggerContainer } from '../lib/motion'
import { apiSend } from '../lib/api'

const YEAR_OPTIONS = ['1st', '2nd', '3rd', '4th']

const STEPS = [
  'Fill this application — takes 2 minutes',
  'A 20–30 min call with the founding team',
  'Get onboarded with the DEVS playbook',
  'Launch your chapter',
]

function StartChapter() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    setSending(true)
    setError('')
    try {
      await apiSend('/api/submissions', {
        body: {
          kind: 'chapter',
          name: fd.get('name'),
          email: fd.get('email'),
          phone: fd.get('phone'),
          college: fd.get('college'),
          year: fd.get('year'),
          why: fd.get('why'),
          building: fd.get('building'),
        },
      })
      setSubmitted(true)
    } catch {
      setError("Couldn't send right now — please try again, or email devstechsociety@gmail.com directly.")
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <PageHero
        tag="Start a Chapter"
        title={['Lead DEVS at', 'your college.']}
        subtitle="Apply to become a Campus Ambassador — the official founder of DEVS at your college. 2nd or 3rd year students with the drive to make it happen."
        meta="Founding team reviews each one"
      />

      <section className="border-t border-border">
        <div className="container-devs grid grid-cols-1 gap-8 py-20 md:py-28 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          {/* Info panel */}
          <Reveal
            as="aside"
            className="h-fit rounded-2xl border border-border bg-surface p-8 lg:sticky lg:top-28"
          >
            <h2 className="text-2xl font-bold tracking-tight text-white">How it works</h2>
            <ol className="mt-7 space-y-5">
              {STEPS.map((step, i) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border font-mono text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-muted">{step}</span>
                </li>
              ))}
            </ol>

            <div className="my-8 h-px w-full bg-border" />

            <h3 className="eyebrow">Questions?</h3>
            <ul className="mt-5 space-y-4">
              <li>
                <a href="mailto:devstechsociety@gmail.com" className="inline-flex items-center gap-3 text-muted transition-colors hover:text-white">
                  <Mail size={18} className="text-white" />
                  devstechsociety@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+918838023321" className="inline-flex items-center gap-3 text-muted transition-colors hover:text-white">
                  <Phone size={18} className="text-white" />
                  +91 8838023321
                </a>
              </li>
            </ul>
          </Reveal>

          {/* Chapter application */}
          <Reveal delay={0.08} className="rounded-2xl border border-border bg-surface p-8 md:p-10">
            {submitted ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="flex min-h-[420px] flex-col items-center justify-center py-10 text-center"
                role="status"
                aria-live="polite"
              >
                <motion.div variants={fadeUp} className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-black">
                  <Check size={40} strokeWidth={3} />
                </motion.div>
                <motion.h3 variants={fadeUp} className="mt-7 text-3xl font-bold tracking-tighter text-white">
                  Application in.
                </motion.h3>
                <motion.p variants={fadeUp} className="mt-4 max-w-sm text-lg text-muted">
                  We'll reach out within 48 hours to set up your call. In the
                  meantime — <span className="font-semibold text-white">Code. Coffee. Repeat.</span>
                </motion.p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="sc-name" className="label-field">
                      Full Name <span className="text-white">*</span>
                    </label>
                    <input id="sc-name" name="name" type="text" required autoComplete="name" className="input-field" placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="sc-email" className="label-field">
                      Email <span className="text-white">*</span>
                    </label>
                    <input id="sc-email" name="email" type="email" required autoComplete="email" className="input-field" placeholder="you@example.com" />
                  </div>
                  <div>
                    <label htmlFor="sc-phone" className="label-field">
                      Phone Number <span className="text-white">*</span>
                    </label>
                    <input id="sc-phone" name="phone" type="tel" required autoComplete="tel" className="input-field" placeholder="+91 ..." />
                  </div>
                  <div>
                    <label htmlFor="sc-college" className="label-field">
                      College Name <span className="text-white">*</span>
                    </label>
                    <input id="sc-college" name="college" type="text" required className="input-field" placeholder="Your college" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="sc-year" className="label-field">
                      Year of Study <span className="text-white">*</span>
                    </label>
                    <select id="sc-year" name="year" required defaultValue="" className="input-field">
                      <option value="" disabled>
                        Select year
                      </option>
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="sc-why" className="label-field">
                    Why do you want to start DEVS at your college?{' '}
                    <span className="text-white">*</span>
                  </label>
                  <textarea id="sc-why" name="why" required rows={3} className="input-field resize-y" placeholder="What's your motivation? What would you build?" />
                </div>

                <div>
                  <label htmlFor="sc-building" className="label-field">
                    What are you currently building or working on?
                  </label>
                  <textarea id="sc-building" name="building" rows={3} className="input-field resize-y" placeholder="Projects, clubs, anything you've led." />
                </div>

                <button type="submit" disabled={sending} className="btn-primary w-full text-base disabled:opacity-50" aria-label="Submit your chapter application">
                  {sending ? 'Sending…' : 'Apply to Lead'}
                </button>
                {error && (
                  <p role="alert" className="text-sm text-white">
                    ⚠ {error}
                  </p>
                )}
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  )
}

export default StartChapter
