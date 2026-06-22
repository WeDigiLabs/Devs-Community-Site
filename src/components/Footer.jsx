import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Instagram, Linkedin, Mail, Phone } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Events', to: '/events' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Campus Chapters', to: '/campus-chapters' },
  { label: 'Join', to: '/join' },
  { label: 'Contact', to: '/contact' },
]

const SOCIAL = [
  {
    icon: Instagram,
    label: '@devs_community',
    href: 'https://www.instagram.com/devs_society/',
  },
  {
    icon: Linkedin,
    label: 'DEVS Community',
    href: 'https://www.linkedin.com/company/devs-society/',
  },
  {
    icon: Mail,
    label: 'devstechsociety@gmail.com',
    href: 'mailto:devstechsociety@gmail.com',
  },
  {
    icon: Phone,
    label: '+91 8838023321',
    href: 'tel:+918838023321',
  },
]

function Footer() {
  const wordmarkRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: wordmarkRef,
    offset: ['start end', 'end end'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['38%', '0%'])

  return (
    <footer className="border-t border-border bg-black">
      {/* Giant outlined wordmark — rises with scroll as the page ends */}
      <div
        ref={wordmarkRef}
        className="overflow-hidden border-b border-border"
        aria-hidden="true"
      >
        <motion.p
          style={{ y }}
          className="select-none whitespace-nowrap text-center text-[24vw] font-bold leading-[0.78] tracking-tighter will-change-transform"
        >
          <span className="text-stroke">DEVS</span>
          <span className="text-white">.</span>
        </motion.p>
      </div>

      <div className="container-devs py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link
              to="/"
              className="text-4xl font-bold tracking-tighter text-white"
              aria-label="DEVS Community — home"
            >
              DEVS<span className="text-muted">.</span>
            </Link>
            <p className="mt-5 font-mono text-sm uppercase tracking-[0.15em] text-muted">
              Code. Coffee. Repeat.
            </p>
            <p className="mt-2 text-sm text-muted/60">Chennai, Tamil Nadu</p>
          </div>

          {/* Quick links */}
          <nav className="md:col-span-3" aria-label="Footer">
            <h2 className="eyebrow">Index</h2>
            <ul className="mt-6 space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="link-underline text-sm text-muted transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div className="md:col-span-4">
            <h2 className="eyebrow">Connect</h2>
            <ul className="mt-6 space-y-3.5">
              {SOCIAL.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                    className="inline-flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-white"
                    aria-label={item.label}
                  >
                    <item.icon size={16} className="shrink-0" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-3 border-t border-border pt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-muted/60 md:flex-row md:items-center md:justify-between">
          <p>© 2025 DEVS Community. All rights reserved.</p>
          <p>Built for builders, by builders.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
