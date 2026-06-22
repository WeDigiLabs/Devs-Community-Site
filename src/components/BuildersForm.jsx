import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { fadeUp, staggerContainer } from '../lib/motion'
import { apiSend } from '../lib/api'

export const BUILDER_TYPES = [
  'Entrepreneur',
  'Developer – IT Professional',
  'Content Creator',
  'Other',
]

/**
 * Community registration form for builders. Collects type, email, and phone
 * so members can be invited to events and the WhatsApp group. Used on both the
 * Join page and the Contact page. No backend dependency beyond /api/submissions
 * — shows a success state either way.
 */
function BuildersForm({ compact = false }) {
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
          kind: 'builder',
          name: fd.get('name'),
          email: fd.get('email'),
          phone: fd.get('phone'),
          intent: fd.get('builderType'),
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

  if (submitted) {
    return (
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex min-h-[360px] flex-col items-center justify-center py-8 text-center"
        role="status"
        aria-live="polite"
      >
        <motion.div
          variants={fadeUp}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black"
        >
          <Check size={34} strokeWidth={3} />
        </motion.div>
        <motion.h3 variants={fadeUp} className="mt-6 text-2xl font-bold tracking-tighter text-white">
          You're in.
        </motion.h3>
        <motion.p variants={fadeUp} className="mt-3 max-w-sm text-muted">
          We'll invite you to upcoming events and our official WhatsApp group.
          In the meantime —{' '}
          <span className="font-semibold text-white">Code. Coffee. Repeat.</span>
        </motion.p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className={compact ? 'space-y-5' : 'grid grid-cols-1 gap-5 sm:grid-cols-2'}>
        <div className={compact ? '' : 'sm:col-span-2'}>
          <label htmlFor="bf-name" className="label-field">
            Full Name <span className="text-white">*</span>
          </label>
          <input id="bf-name" name="name" type="text" required autoComplete="name" className="input-field" placeholder="Your name" />
        </div>
        <div className={compact ? '' : 'sm:col-span-2'}>
          <label htmlFor="bf-type" className="label-field">
            I am a <span className="text-white">*</span>
          </label>
          <select id="bf-type" name="builderType" required defaultValue="" className="input-field">
            <option value="" disabled>
              Select what you build
            </option>
            {BUILDER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="bf-email" className="label-field">
            Email <span className="text-white">*</span>
          </label>
          <input id="bf-email" name="email" type="email" required autoComplete="email" className="input-field" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="bf-phone" className="label-field">
            Phone Number <span className="text-white">*</span>
          </label>
          <input id="bf-phone" name="phone" type="tel" required autoComplete="tel" className="input-field" placeholder="+91 ..." />
        </div>
      </div>

      <div>
        <label htmlFor="bf-building" className="label-field">
          What are you building or working on?
        </label>
        <textarea id="bf-building" name="building" rows={3} className="input-field resize-y" placeholder="A product, a company, content, a side quest..." />
      </div>

      <button type="submit" disabled={sending} className="btn-primary w-full text-base disabled:opacity-50" aria-label="Join the DEVS builder community">
        {sending ? 'Sending…' : 'Count Me In'}
      </button>
      {error && (
        <p role="alert" className="text-sm text-white">
          ⚠ {error}
        </p>
      )}
    </form>
  )
}

export default BuildersForm
