import { motion } from 'framer-motion'
import { viewportOnce } from '../lib/motion'

const lineMask = {
  hidden: { y: '110%' },
  show: {
    y: '0%',
    transition: { duration: 0.9, ease: [0.33, 1, 0.68, 1] },
  },
}

/**
 * Cinematic masked text reveal: each line rises out of an overflow-hidden
 * mask, staggered top to bottom. Pass `lines` as an array of
 * { text, className } so individual lines can be solid or stroked.
 *
 * `inView` switches from mount-triggered (heroes) to scroll-triggered
 * (section statements).
 */
function RevealLines({
  as = 'h1',
  lines = [],
  delay = 0,
  inView = false,
  className = '',
}) {
  const Tag = motion[as] || motion.h1
  const trigger = inView
    ? { whileInView: 'show', viewport: viewportOnce }
    : { animate: 'show' }

  return (
    <Tag
      initial="hidden"
      {...trigger}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.11, delayChildren: delay } },
      }}
      className={className}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            variants={lineMask}
            className={`block will-change-transform ${line.className || ''}`}
          >
            {line.text}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

export default RevealLines
