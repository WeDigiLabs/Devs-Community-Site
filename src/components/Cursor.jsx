import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

const INTERACTIVE = 'a, button, input, textarea, select, [role="button"], label'

/**
 * Custom cursor: a solid dot that tracks the pointer 1:1 and a trailing ring
 * on a spring. Both use mix-blend-difference so they invert over white
 * surfaces. The ring grows over interactive elements and tightens on press.
 * Renders only for fine pointers (desktop) and never for reduced motion.
 */
function Cursor() {
  const reduceMotion = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [pressed, setPressed] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 400, damping: 35, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 400, damping: 35, mass: 0.6 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)')
    const update = () => setEnabled(fine.matches && !reduceMotion)
    update()
    fine.addEventListener('change', update)
    return () => fine.removeEventListener('change', update)
  }, [reduceMotion])

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove('cursor-hidden')
      return
    }

    document.documentElement.classList.add('cursor-hidden')

    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const onOver = (e) => setHovering(!!e.target.closest(INTERACTIVE))
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      document.documentElement.classList.remove('cursor-hidden')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <div aria-hidden="true">
      {/* Dot — tracks 1:1. Centered via negative margins because framer's
          x/y transform would override a CSS translate. */}
      <motion.div
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[10001] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
      />
      {/* Trailing ring */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        animate={{ scale: pressed ? 0.75 : hovering ? 1.8 : 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        className="pointer-events-none fixed left-0 top-0 z-[10001] -ml-[18px] -mt-[18px] h-9 w-9 rounded-full border border-white mix-blend-difference"
      />
    </div>
  )
}

export default Cursor
