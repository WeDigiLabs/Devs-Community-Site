import { memo, useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

/**
 * Counts up from 0 to `end` once the element scrolls into view.
 * Parses a string like "2500+" into { value: 2500, suffix: "+" } so the
 * suffix is preserved and only the number animates.
 */
function parseTarget(target) {
  const match = String(target).match(/^(\d+)(.*)$/)
  if (!match) return { value: 0, suffix: String(target) }
  return { value: parseInt(match[1], 10), suffix: match[2] || '' }
}

function AnimatedCounter({ target, duration = 1800, className = '' }) {
  const { value, suffix } = parseTarget(target)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return

    if (reduceMotion) {
      setDisplay(value)
      return
    }

    let frame
    let startTime

    const tick = (now) => {
      if (startTime === undefined) startTime = now
      const progress = Math.min((now - startTime) / duration, 1)
      // easeOutCubic for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value, duration, reduceMotion])

  return (
    <span ref={ref} className={className} aria-label={`${value}${suffix}`}>
      {display.toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}

export default memo(AnimatedCounter)
