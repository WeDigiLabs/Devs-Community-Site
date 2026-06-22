import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { staggerContainer, fadeUp } from '../lib/motion'

function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="container-devs relative text-center"
      >
        <motion.p
          variants={fadeUp}
          className="text-7xl font-bold tracking-tighter text-accent md:text-8xl"
        >
          404
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className="mt-4 text-3xl font-bold tracking-tighter text-white md:text-4xl"
        >
          This page hasn't been built yet.
        </motion.h1>
        <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-md text-muted">
          The page you're looking for doesn't exist — but plenty of real ones
          do. Head back and keep building.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-9">
          <Link to="/" className="btn-primary text-base">
            Back to Home
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default NotFound
