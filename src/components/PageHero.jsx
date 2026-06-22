import { motion } from 'framer-motion'
import Eyebrow from './Eyebrow'
import RevealLines from './RevealLines'
import { fadeUp } from '../lib/motion'

/**
 * Interior-page hero — brutalist editorial. A mono meta row up top, then a
 * massive uppercase title rising line-by-line out of masks, then subtitle.
 * `title` is a string or array of strings (explicit line breaks). The last
 * line is rendered outlined for contrast.
 */
function PageHero({ tag, title, subtitle, meta }) {
  const titleLines = Array.isArray(title) ? title : [title]
  const lines = titleLines.map((text, i) => ({
    text,
    className: i === titleLines.length - 1 && titleLines.length > 1 ? 'text-stroke' : 'text-white',
  }))

  return (
    <section className="relative">
      <div className="container-devs pb-16 pt-20 md:pb-24 md:pt-28">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex items-center justify-between gap-4 border-b border-border pb-5"
        >
          <Eyebrow>{tag}</Eyebrow>
          {meta && (
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-muted sm:block">
              {meta}
            </span>
          )}
        </motion.div>

        <RevealLines
          as="h1"
          lines={lines}
          delay={0.15}
          className="mt-10 text-[clamp(2.6rem,8.5vw,6rem)] font-bold uppercase leading-[0.94] tracking-tighter"
        />

        {subtitle && (
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.55 }}
            className="mt-10 max-w-2xl text-lg leading-relaxed text-muted md:text-xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  )
}

export default PageHero
