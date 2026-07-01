import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { computeStats, assessCompliance, exportCsv } from '../lib/dateMath'
import { getRoute } from '../lib/routes'
import { Download, Plus, ChevronDown, ChevronUp, BookOpen, Plane, MapPin, Calendar } from 'lucide-react'

import Header from '../components/Header'
import SetupForm from '../components/SetupForm'
import StatsOverview from '../components/StatsOverview'
import RenewalBanner from '../components/RenewalBanner'
import TripForm from '../components/TripForm'
import TripList from '../components/TripList'
import AbsenceChart from '../components/AbsenceChart'
import InfoPanel from '../components/InfoPanel'
import GuillochePattern from '../components/GuillochePattern'

// Curated Unsplash images — load directly, no hosting needed
const PHOTOS = {
  hero:    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&q=85',   // London skyline night
  thames:  'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=900&q=80',   // Thames at dusk
  travel:  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&q=80',   // Airplane wing
  records: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80',      // Documents / planning
  city:    'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=900&q=80',   // London aerial
}

function PhotoCard({ src, alt, overlay = 'bg-navy/70', children, className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
      <div className={`absolute inset-0 ${overlay}`} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingTrip, setSavingTrip] = useState(false)
  const [editingTrip, setEditingTrip] = useState(null)
  const [toast, setToast] = useState('')
  const [toastType, setToastType] = useState('info')
  const [showForm, setShowForm] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => { loadAll() }, [user.id])

  function showToast(msg, type = 'info') {
    setToast(msg); setToastType(type)
    setTimeout(() => setToast(''), 3500)
  }

  async function loadAll() {
    setLoading(true)
    const [{ data: profileData }, { data: tripsData, error: tripsError }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('trips').select('*').eq('user_id', user.id).order('dep_date', { ascending: false }),
    ])
    setProfile(profileData)
    if (!tripsError) setTrips(tripsData || [])
    setLoading(false)
  }

  async function handleSetupSave(values) {
    setSavingProfile(true)
    const { error } = await supabase.from('profiles').upsert({ id: user.id, ...values })
    setSavingProfile(false)
    if (error) { showToast(`Couldn't save: ${error.message}`, 'error'); return }
    setProfile({ id: user.id, ...values })
    showToast('Profile saved ✓')
  }

  async function handleTripSubmit(form) {
    setSavingTrip(true)
    let error
    if (editingTrip) {
      ;({ error } = await supabase.from('trips').update(form).eq('id', editingTrip.id).eq('user_id', user.id))
    } else {
      ;({ error } = await supabase.from('trips').insert({ ...form, user_id: user.id }))
    }
    setSavingTrip(false)
    if (error) { showToast(`Couldn't save trip: ${error.message}`, 'error'); return }
    setEditingTrip(null); setShowForm(false)
    showToast('Trip saved ✓')
    await loadAll()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this trip from your log?')) return
    const { error } = await supabase.from('trips').delete().eq('id', id).eq('user_id', user.id)
    if (error) { showToast("Couldn't delete — try again", 'error'); return }
    showToast('Trip deleted')
    await loadAll()
  }

  function handleEdit(trip) {
    setEditingTrip(trip); setShowForm(true)
    setTimeout(() => document.getElementById('trip-form-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 relative overflow-hidden bg-navy-deep">
        <img src={PHOTOS.hero} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-sm text-gold-light/70 tracking-widest uppercase">Opening your log…</p>
        </div>
      </div>
    )
  }

  const ToastEl = toast && (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl text-sm shadow-2xl z-50 flex items-center gap-2.5 font-semibold max-w-[90vw]
      ${toastType === 'error' ? 'bg-burgundy text-white' : 'bg-navy text-[#F4F0E6] border border-gold/30'}`}>
      {toast}
    </div>
  )

  // ── First-run setup ──
  if (!profile) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-navy-deep">
        <img src={PHOTOS.hero} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <GuillochePattern className="absolute top-0 left-0 w-full h-4 text-gold-light z-10" opacity={0.3} />
        <Header />
        <div className="relative z-10 max-w-lg mx-auto px-5 py-10">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gold/20">
            <PhotoCard src={PHOTOS.city} alt="London" overlay="bg-navy/85" className="px-8 py-7">
              <GuillochePattern className="absolute top-0 left-0 w-full h-3 text-gold-light" opacity={0.3} />
              <p className="text-gold-light text-[10px] tracking-[0.2em] uppercase font-mono mb-3">Getting started</p>
              <h2 className="font-display font-semibold text-2xl text-[#F4F0E6] mb-1">Set up your log</h2>
              <p className="text-[#9BA3B8] text-sm leading-relaxed">
                Take your route and dates from your visa decision letter or BRP. You can change them later.
              </p>
            </PhotoCard>
            <div className="bg-white p-8">
              <SetupForm onSave={handleSetupSave} saving={savingProfile} />
            </div>
          </div>
        </div>
        {ToastEl}
      </div>
    )
  }

  const route = getRoute(profile.route_id)
  const years = profile.qualifying_years || route.years
  const stats = computeStats(trips, profile.visa_start, years)
  const compliance = assessCompliance(trips, route)

  return (
    <div className="min-h-screen pb-20 bg-[#F0F1F5]">

      {/* ── Hero header with photo ── */}
      <div className="relative overflow-hidden" style={{ minHeight: 220 }}>
        <img
          src={PHOTOS.hero}
          alt="London skyline"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/85 to-[#F0F1F5]" />
        <GuillochePattern className="absolute top-0 left-0 w-full h-4 text-gold-light z-10" opacity={0.3} />
        <div className="relative z-10">
          <Header route={route} />
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-5 space-y-4 -mt-4 relative z-10">

        {/* Stats */}
        <StatsOverview stats={stats} compliance={compliance} tripCount={trips.length} route={route} />

        {/* Renewal banner */}
        <RenewalBanner visaExpiry={profile.visa_expiry} />

        {/* ── Photo banner: motivational strip ── */}
        <PhotoCard
          src={PHOTOS.thames}
          alt="Thames at dusk"
          overlay="bg-navy/75"
          className="shadow-sm"
        >
          <div className="px-7 py-5 flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-gold-light text-[10px] tracking-[0.18em] uppercase font-mono mb-1">Your journey to settlement</p>
              <p className="text-[#F4F0E6] font-display font-semibold text-lg">
                {trips.length === 0
                  ? 'Start logging your trips below'
                  : `${stats.totalDays} days tracked across ${trips.length} trip${trips.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <div className="flex items-center gap-2 text-gold-light/80">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-mono">{route.short}</span>
            </div>
          </div>
        </PhotoCard>

        {/* ── Log a trip ── */}
        <section id="trip-form-section" className="bg-white rounded-2xl overflow-hidden shadow-sm border border-line">
          <button
            onClick={() => { setShowForm(!showForm); if (editingTrip && showForm) setEditingTrip(null) }}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-paper transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm bg-navy">
                <Plane className="w-4 h-4 text-gold" strokeWidth={1.8} />
              </div>
              <div className="text-left">
                <p className="font-display font-semibold text-navy text-base">
                  {editingTrip ? 'Edit trip' : 'Log a trip'}
                </p>
                {!showForm && <p className="text-xs text-ink-soft">Add departure and return dates</p>}
              </div>
            </div>
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition
              ${showForm ? 'bg-navy border-navy' : 'border-line group-hover:border-navy'}`}>
              {showForm
                ? <ChevronUp className="w-3.5 h-3.5 text-white" />
                : <Plus className="w-3.5 h-3.5 text-ink-soft group-hover:text-navy" />}
            </div>
          </button>

          {showForm && (
            <div className="px-6 pb-6 pt-4 border-t border-line bg-[#FAFAFA]">
              <TripForm
                editingTrip={editingTrip}
                onSubmit={handleTripSubmit}
                onCancelEdit={() => { setEditingTrip(null); setShowForm(false) }}
                saving={savingTrip}
              />
            </div>
          )}
        </section>

        {/* ── Travel record ── */}
        <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-line">
          <div className="flex items-center justify-between px-6 py-4 border-b border-line">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl border border-line flex items-center justify-center">
                <Calendar className="w-4 h-4 text-navy" strokeWidth={1.6} />
              </div>
              <div>
                <h2 className="font-display font-semibold text-navy text-base">Travel record</h2>
                <p className="text-xs text-ink-soft">{trips.length} trip{trips.length !== 1 ? 's' : ''} logged</p>
              </div>
            </div>
            <button
              onClick={() => exportCsv(trips)}
              className="flex items-center gap-1.5 border border-line rounded-lg px-3.5 py-2 text-xs font-semibold text-navy hover:bg-navy hover:text-gold-light hover:border-navy transition"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
          <div className="px-6 py-3">
            <TripList trips={trips} onEdit={handleEdit} onDelete={handleDelete} />
          </div>
        </section>

        {/* ── Chart with dark photo header ── */}
        <section className="rounded-2xl overflow-hidden shadow-sm border border-line bg-white">
          <PhotoCard src={PHOTOS.travel} alt="Travel" overlay="bg-navy/82" className="rounded-none">
            <div className="px-6 py-5 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="font-display font-semibold text-[#F4F0E6] text-base">Absence pattern by month</h2>
                <p className="text-[#9BA3B8] text-xs mt-0.5">Days outside the UK, month by month</p>
              </div>
              <div className="flex gap-4 flex-wrap">
                <span className="flex items-center gap-1.5 text-[11px] text-[#C7CCDB]"><i className="w-2.5 h-2.5 rounded-sm bg-leaf inline-block" />With family</span>
                <span className="flex items-center gap-1.5 text-[11px] text-[#C7CCDB]"><i className="w-2.5 h-2.5 rounded-sm bg-amber inline-block" />Partly together</span>
                <span className="flex items-center gap-1.5 text-[11px] text-[#C7CCDB]"><i className="w-2.5 h-2.5 rounded-sm bg-burgundy inline-block" />Alone</span>
              </div>
            </div>
          </PhotoCard>
          <div className="px-6 py-5">
            <AbsenceChart trips={trips} visaStart={stats.visaStart} />
          </div>
        </section>

        {/* ── Info panel ── */}
        <section className="rounded-2xl overflow-hidden shadow-sm border border-line bg-white">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-paper transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl border border-line flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-navy" strokeWidth={1.6} />
              </div>
              <div className="text-left">
                <p className="font-display font-semibold text-navy text-base">How this is assessed</p>
                <p className="text-xs text-ink-soft">The rules that apply to your route</p>
              </div>
            </div>
            {showInfo
              ? <ChevronUp className="w-4 h-4 text-ink-soft" />
              : <ChevronDown className="w-4 h-4 text-ink-soft" />}
          </button>
          {showInfo && (
            <div className="px-6 pb-6 pt-2 border-t border-line">
              <InfoPanel route={route} />
            </div>
          )}
        </section>

        {/* ── Bottom photo strip ── */}
        <PhotoCard src={PHOTOS.records} alt="Settlement documents" overlay="bg-navy/80" className="shadow-sm">
          <div className="px-7 py-6 text-center">
            <p className="text-gold-light text-[10px] tracking-[0.18em] uppercase font-mono mb-2">Keep your record safe</p>
            <p className="text-[#F4F0E6] text-sm leading-relaxed max-w-md mx-auto">
              Use <strong className="text-gold">Export CSV</strong> regularly and keep a copy somewhere safe — your boarding passes, passport stamps and this log are the three things that matter most at renewal and ILR.
            </p>
          </div>
        </PhotoCard>

      </main>

      {ToastEl}
    </div>
  )
}