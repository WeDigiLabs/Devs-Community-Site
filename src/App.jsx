import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import { pageTransition } from './lib/motion'

import Home from './pages/Home'
import About from './pages/About'
import Events from './pages/Events'
import Gallery from './pages/Gallery'
import CampusChapters from './pages/CampusChapters'
import Join from './pages/Join'
import StartChapter from './pages/StartChapter'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

function App() {
  const location = useLocation()

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col bg-black">
        <ScrollToTop />
        <Preloader />
        <Cursor />
        <Navbar />

        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={location.pathname}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-1 pt-16 md:pt-20"
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/campus-chapters" element={<CampusChapters />} />
              <Route path="/join" element={<Join />} />
              <Route path="/start-a-chapter" element={<StartChapter />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.main>
        </AnimatePresence>

        <Footer />
      </div>
    </MotionConfig>
  )
}

export default App
