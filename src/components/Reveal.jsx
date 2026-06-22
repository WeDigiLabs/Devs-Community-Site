import { motion } from 'framer-motion'
import { fadeUp, viewportOnce } from '../lib/motion'

/**
 * Scroll-triggered reveal. Animates with fadeUp the first time it enters the
 * viewport. Accepts an `as` prop so it can render semantic elements
 * (section, article, li, etc.) while keeping the motion behaviour.
 */
function Reveal({ as = 'div', delay = 0, variants = fadeUp, className = '', children, ...rest }) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={delay ? { delay } : undefined}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

export default Reveal
