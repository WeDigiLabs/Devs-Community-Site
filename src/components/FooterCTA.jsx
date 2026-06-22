import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import RevealLines from './RevealLines'
import { fadeUp, viewportOnce } from '../lib/motion'

/**
 * Full-width closing statement above the footer. Two massive uppercase lines
 * (solid, then outlined) rise out of masks on scroll.
 */
function FooterCTA({
  title = 'Ready to build',
  titleAccent = 'something real?',
  subtitle = "Join DEVS — Chennai's community for builders.",
  ctaLabel = 'Join Now',
  ctaTo = '/join',
}) {
  return (
    <section className="border-t border-border">
      <div className="container-devs flex flex-col items-center py-24 text-center md:py-32">
        <RevealLines
          as="h2"
          inView
          lines={[
            { text: title, className: 'text-white' },
            { text: titleAccent, className: 'text-stroke' },
          ]}
          className="max-w-5xl text-[clamp(2.6rem,8vw,6.5rem)] font-bold uppercase leading-[0.95] tracking-tighter"
        />
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          transition={{ delay: 0.35 }}
          className="mt-8 max-w-md text-lg text-muted"
        >
          {subtitle}
        </motion.p>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          transition={{ delay: 0.45 }}
        >
          <Link to={ctaTo} className="group btn-primary mt-10 text-base">
            {ctaLabel}
            <ArrowRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default FooterCTA
