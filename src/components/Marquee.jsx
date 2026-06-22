import { memo } from 'react'

const DEFAULT_ITEMS = [
  'Code',
  'Coffee',
  'Repeat',
  'No Hierarchy',
  'Just Builders',
]

/**
 * Oversized kinetic marquee band — alternating solid and outlined words
 * separated by zine asterisks. Two copies of the sequence make the loop
 * seamless; pauses on hover, freezes under reduced motion.
 */
function Marquee({ items = DEFAULT_ITEMS }) {
  const sequence = [...items, ...items]

  return (
    <div className="overflow-hidden border-y border-border py-5 md:py-7" aria-hidden="true">
      <div className="flex w-max animate-marquee pause-on-hover items-center">
        {sequence.map((item, i) => (
          <span key={i} className="flex items-center">
            <span
              className={`whitespace-nowrap px-5 text-5xl font-bold uppercase leading-none tracking-tighter md:px-8 md:text-7xl ${
                i % 2 === 0 ? 'text-white' : 'text-stroke'
              }`}
            >
              {item}
            </span>
            <span className="text-2xl text-white/30 md:text-3xl">✱</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default memo(Marquee)
