import { motion } from 'framer-motion'
import Eyebrow from './Eyebrow'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'

/**
 * Editorial section header. Title sits on the left, an optional description
 * is baseline-aligned to the right — an asymmetric magazine layout. Animates
 * in with a stagger the first time it enters the viewport.
 */
function SectionHeader({ index, eyebrow, title, description, className = '' }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={`grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-12 ${className}`}
    >
      <div className={description ? 'lg:col-span-7' : 'lg:col-span-12'}>
        <motion.div variants={fadeUp}>
          <Eyebrow index={index}>{eyebrow}</Eyebrow>
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="mt-5 text-4xl font-bold uppercase leading-[0.98] tracking-tighter text-white md:text-[3.4rem]"
        >
          {title}
        </motion.h2>
      </div>

      {description && (
        <motion.p
          variants={fadeUp}
          className="text-lg leading-relaxed text-muted lg:col-span-4 lg:col-start-9 lg:self-end"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  )
}

export default SectionHeader
