import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Events', to: '/events' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Campus Chapters', to: '/campus-chapters' },
  { label: 'Join', to: '/join' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'border-b border-border bg-black/95 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      {/* Reading-progress hairline */}
      <motion.span
        aria-hidden="true"
        style={{ scaleX: scrollYProgress }}
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-white/50"
      />
      <nav
        className="container-devs flex h-16 items-center justify-between md:h-20"
        aria-label="Primary"
      >
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tighter text-white"
          aria-label="DEVS Community — home"
        >
          DEVS<span className="text-muted">.</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-5 md:flex lg:gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-muted hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-accent"
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <Link to="/join" className="btn-primary hidden md:inline-flex">
          Join DEVS
        </Link>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile full-screen slide-down menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'calc(100vh - 4rem)' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden bg-black md:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
              }}
              className="container-devs flex flex-col gap-1 pt-6"
            >
              {NAV_LINKS.map((link) => (
                <motion.li
                  key={link.to}
                  variants={{
                    hidden: { opacity: 0, x: -16 },
                    show: { opacity: 1, x: 0 },
                  }}
                >
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `block border-b border-border py-4 text-2xl font-semibold transition-colors ${
                        isActive ? 'text-accent' : 'text-white'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.li>
              ))}
              <motion.li
                variants={{
                  hidden: { opacity: 0, x: -16 },
                  show: { opacity: 1, x: 0 },
                }}
                className="pt-6"
              >
                <Link to="/join" className="btn-primary w-full">
                  Join DEVS
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
