import { Link } from 'react-router-dom'
import { ROUTES } from '../lib/routes'
import RouteIcon from '../components/RouteIcon'
import GuillochePattern from '../components/GuillochePattern'
import { Shield, Smartphone, MapPin } from 'lucide-react'

const FEATURES = [
  {
    icon: MapPin,
    title: 'Built for your specific route',
    body: "Every visa route has its own absence rules. Whether you're on a Spouse visa, Skilled Worker, Global Talent, EU Settlement Scheme, or long residence, Settle applies the rules that match your application.",
    img: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=600&q=80',
    imgAlt: 'London aerial view',
  },
  {
    icon: Shield,
    title: 'Your data, genuinely private',
    body: 'Your trips are protected by row-level security in the database, so only you can access them. This protection is enforced by Postgres itself — not just the app.',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
    imgAlt: 'Secure documents',
  },
  {
    icon: Smartphone,
    title: 'On every device',
    body: 'Log in once and access your travel records from your phone, laptop, or anywhere else. Everything stays securely in sync.',
    img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
    imgAlt: 'Phone and laptop',
  },
]

const STATS = [
  { value: '9', label: 'visa routes covered' },
  { value: '180', label: 'day limit tracked automatically' },
  { value: '100%', label: 'private — only you see your data' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper font-sans">

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&q=85"
            alt="London skyline"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/80 to-navy-deep/95" />
        </div>

        {/* Guilloche top/bottom borders */}
        <GuillochePattern className="absolute top-0 left-0 w-full h-4 text-gold-light z-10" opacity={0.35} />
        <GuillochePattern className="absolute bottom-0 left-0 w-full h-4 text-gold-light rotate-180 z-10" opacity={0.35} />

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">
          <p className="text-gold-light text-[11px] tracking-[0.22em] uppercase font-mono mb-5 flex items-center justify-center gap-2">
            <span className="inline-block w-8 h-px bg-gold-light/60" />
            For any UK visa route
            <span className="inline-block w-8 h-px bg-gold-light/60" />
          </p>

          <h1 className="font-display font-semibold text-6xl sm:text-7xl text-[#F4F0E6] mb-6 tracking-tight">
            Settle
          </h1>

          <p className="text-[#C7CCDB] text-lg sm:text-xl leading-relaxed max-w-xl mx-auto mb-10">
            A private log of every day you spend outside the UK — measured against the
            absence rule that actually applies to your visa, not a generic guess.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/app"
              className="bg-gold text-navy-deep font-semibold text-sm rounded-md px-7 py-3.5 hover:bg-gold-light transition shadow-lg shadow-black/30"
            >
              Get started — it's free
            </Link>
            <Link
              to="/login"
              className="text-gold-light text-sm border border-gold/40 rounded-md px-7 py-3.5 hover:border-gold transition"
            >
              Sign in
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto border-t border-gold/20 pt-10">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-mono text-2xl font-semibold text-gold">{s.value}</div>
                <div className="text-[11px] text-[#8B92A5] mt-1 leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Routes pill strip ── */}
      <section className="bg-white border-y border-line py-8 px-5">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-ink-soft mb-5">
          Routes covered
        </p>
        <div className="flex flex-wrap gap-2 justify-center max-w-3xl mx-auto">
          {ROUTES.filter((r) => r.id !== 'other').map((r) => (
            <span
              key={r.id}
              className="flex items-center gap-1.5 border border-line rounded-full px-3.5 py-1.5 text-xs text-ink-soft hover:border-navy hover:text-navy transition"
            >
              <RouteIcon name={r.icon} className="w-3.5 h-3.5 text-navy" />
              {r.short}
            </span>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-5xl mx-auto px-5 py-20">
        <h2 className="font-display font-semibold text-3xl text-navy text-center mb-2">
          Everything you need to track your time away
        </h2>
        <p className="text-sm text-ink-soft text-center max-w-md mx-auto mb-14">
          Built around the actual Home Office rules, not a simplified approximation.
        </p>

        <div className="space-y-6">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            const isEven = i % 2 === 0
            return (
              <div
                key={f.title}
                className={`flex flex-col ${isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'} gap-0 bg-white border border-line rounded-2xl overflow-hidden shadow-sm`}
              >
                {/* Image */}
                <div className="sm:w-2/5 h-52 sm:h-auto flex-shrink-0 relative overflow-hidden">
                  <img
                    src={f.img}
                    alt={f.imgAlt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-navy/20" />
                </div>

                {/* Text */}
                <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center">
                  <div className="w-10 h-10 rounded-full bg-paper border border-line flex items-center justify-center mb-5">
                    <Icon className="w-4.5 h-4.5 text-navy" strokeWidth={1.6} />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-navy mb-3">{f.title}</h3>
                  <p className="text-sm text-ink-soft leading-relaxed">{f.body}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-white border-y border-line py-20 px-5">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display font-semibold text-3xl text-navy text-center mb-14">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Pick your visa route', body: 'Select from 9 UK settlement routes. Settle automatically loads the right absence rules for you.' },
              { step: '02', title: 'Log each trip', body: 'Add your departure and return dates, who you travelled with, and a quick reason. Takes about 10 seconds.' },
              { step: '03', title: 'See exactly where you stand', body: 'Your rolling totals, settlement countdown, and compliance status update instantly after every entry.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="font-mono text-4xl font-semibold text-gold/40 mb-4">{item.step}</div>
                <h3 className="font-display font-semibold text-lg text-navy mb-2">{item.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-24 px-5 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=1400&q=80"
            alt="Family settled in UK"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-navy/88" />
        </div>
        <GuillochePattern className="absolute top-0 left-0 w-full h-4 text-gold-light z-10" opacity={0.3} />

        <div className="relative z-10 max-w-xl mx-auto text-center">
          <h2 className="font-display font-semibold text-4xl text-[#F4F0E6] mb-4">
            Start tracking today
          </h2>
          <p className="text-[#B9BFD0] text-sm mb-8 leading-relaxed">
            Free to use. No subscription. Your data stays yours — always.
          </p>
          <Link
            to="/app"
            className="bg-gold text-navy-deep font-semibold text-sm rounded-md px-8 py-3.5 hover:bg-gold-light transition inline-block shadow-lg shadow-black/30"
          >
            Get started — it's free
          </Link>
          <p className="text-xs text-[#6B7280] mt-8 leading-relaxed max-w-md mx-auto">
            Settle isn't legal advice and doesn't replace an immigration adviser's review of your case.
            It's a record-keeping tool, built on the published Home Office continuous residence rules.
          </p>
        </div>
      </section>

    </div>
  )
}