import { Link } from 'react-router-dom'
import { ROUTES } from '../lib/routes'
import RouteIcon from '../components/RouteIcon'
import GuillochePattern from '../components/GuillochePattern'

const FEATURES = [
  {
    title: 'Built for your specific route',
    body: "Spouse visa, Skilled Worker, Global Talent, EU Settlement Scheme, long residence — each has its own absence rules. Settle applies the right one to you, not a generic guess.",
  },
  {
    title: 'Your data, genuinely private',
    body: 'Row-level security in the database means nobody — not other users, not us — can see your trips unless you choose to share them. Enforced by Postgres itself.',
  },
  {
    title: 'On every device',
    body: 'Sign in once. Your log follows you to your phone, laptop, or anywhere else you need it — no files to email yourself.',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper">
      <section className="bg-gradient-to-b from-navy to-navy-deep px-5 py-20 sm:py-28 relative overflow-hidden">
        <GuillochePattern className="absolute top-0 left-0 w-full h-3 text-gold-light" opacity={0.25} />
        <GuillochePattern className="absolute bottom-0 left-0 w-full h-3 text-gold-light rotate-180" opacity={0.25} />
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gold-light text-[11px] tracking-[0.2em] uppercase font-mono mb-4">
            For any UK visa route
          </p>
          <h1 className="font-display font-semibold text-5xl sm:text-6xl text-[#F4F0E6] mb-5">Settle</h1>
          <p className="text-[#C7CCDB] text-lg leading-relaxed max-w-lg mx-auto mb-9">
            A private log of every day you spend outside the UK, measured against the absence rule that actually
            applies to your visa, not a generic guess.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/app" className="bg-gold text-navy-deep font-semibold text-sm rounded-md px-6 py-3 hover:bg-gold-light transition">
              Get started, it's free
            </Link>
            <Link to="/login" className="text-gold-light underline text-sm">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-5 py-16">
        <h2 className="font-display font-semibold text-2xl text-navy text-center mb-2">Built for your route</h2>
        <p className="text-sm text-ink-soft text-center max-w-md mx-auto mb-8">
          The absence rule that decides your settlement eligibility is different depending on your visa. Settle knows which one applies to you.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {ROUTES.filter((r) => r.id !== 'other').map((r) => (
            <span key={r.id} className="flex items-center gap-1.5 bg-white border border-line rounded-full px-3.5 py-1.5 text-xs text-ink-soft">
              <RouteIcon name={r.icon} className="w-3.5 h-3.5 text-navy" />
              {r.short}
            </span>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-5 py-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {FEATURES.map((f) => (
          <div key={f.title} className="bg-white border border-line rounded-xl p-6">
            <h3 className="font-display font-semibold text-lg text-navy mb-2">{f.title}</h3>
            <p className="text-sm text-ink-soft leading-relaxed">{f.body}</p>
          </div>
        ))}
      </section>

      <section className="max-w-2xl mx-auto px-5 py-12 text-center">
        <Link to="/app" className="bg-navy text-[#F4F0E6] font-semibold text-sm rounded-md px-6 py-3 hover:bg-navy-deep transition inline-block">
          Start your log
        </Link>
        <p className="text-xs text-ink-soft mt-5 leading-relaxed">
          Settle isn't legal advice and doesn't replace an immigration adviser's review of your case. It's a record-keeping tool, built on the published Home Office continuous residence rules.
        </p>
      </section>
    </div>
  )
}
