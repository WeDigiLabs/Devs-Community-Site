import { Link } from 'react-router-dom'
import { Mail, Phone, Instagram } from 'lucide-react'

import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import BuildersForm from '../components/BuildersForm'

const PERKS = [
  'Invites to every DEVS meetup & build night',
  'Access to the official WhatsApp builder group',
  'A room of founders, developers & creators',
  'First to know about workshops and events',
]

function Join() {
  return (
    <>
      <PageHero
        tag="Join the Community"
        title={['For builders.', 'By builders.']}
        subtitle="Developers, entrepreneurs, creators — anyone making something real in Chennai. Drop your details and we'll bring you into the room."
        meta="Free to join"
      />

      <section className="border-t border-border">
        <div className="container-devs grid grid-cols-1 gap-8 py-20 md:py-28 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          {/* Info panel */}
          <Reveal
            as="aside"
            className="h-fit rounded-2xl border border-border bg-surface p-8 lg:sticky lg:top-28"
          >
            <h2 className="text-2xl font-bold tracking-tight text-white">
              What you get
            </h2>
            <ul className="mt-7 space-y-4">
              {PERKS.map((perk, i) => (
                <li key={perk} className="flex items-start gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border font-mono text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-muted">{perk}</span>
                </li>
              ))}
            </ul>

            <div className="my-8 h-px w-full bg-border" />

            <h3 className="eyebrow">Reach us directly</h3>
            <ul className="mt-5 space-y-4">
              <li>
                <a href="mailto:devstechsociety@gmail.com" className="inline-flex items-center gap-3 text-muted transition-colors hover:text-white">
                  <Mail size={18} className="text-white" />
                  devstechsociety@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+918838023321" className="inline-flex items-center gap-3 text-muted transition-colors hover:text-white">
                  <Phone size={18} className="text-white" />
                  +91 8838023321
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/devs_society/" target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-3 text-muted transition-colors hover:text-white">
                  <Instagram size={18} className="text-white" />
                  @devs_community on Instagram
                </a>
              </li>
            </ul>

            <p className="mt-8 border-t border-border pt-6 text-sm text-muted">
              Want to start a DEVS chapter at your college instead?{' '}
              <Link to="/start-a-chapter" className="font-semibold text-white link-underline">
                Apply as a Campus Ambassador →
              </Link>
            </p>
          </Reveal>

          {/* Builders form */}
          <Reveal delay={0.08} className="rounded-2xl border border-border bg-surface p-8 md:p-10">
            <BuildersForm />
          </Reveal>
        </div>
      </section>
    </>
  )
}

export default Join
