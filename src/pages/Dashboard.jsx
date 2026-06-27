import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { computeStats, assessCompliance, exportCsv } from '../lib/dateMath'
import { getRoute } from '../lib/routes'

import Header from '../components/Header'
import SetupForm from '../components/SetupForm'
import StatsOverview from '../components/StatsOverview'
import RenewalBanner from '../components/RenewalBanner'
import TripForm from '../components/TripForm'
import TripList from '../components/TripList'
import AbsenceChart from '../components/AbsenceChart'
import InfoPanel from '../components/InfoPanel'

export default function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingTrip, setSavingTrip] = useState(false)
  const [editingTrip, setEditingTrip] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    loadAll()
  }, [user.id])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3200)
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
    if (error) {
      showToast("Couldn't save — try again")
      return
    }
    setProfile({ id: user.id, ...values })
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
    if (error) {
      showToast("Couldn't save that trip — try again")
      return
    }
    setEditingTrip(null)
    await loadAll()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this trip from your log?')) return
    const { error } = await supabase.from('trips').delete().eq('id', id).eq('user_id', user.id)
    if (error) {
      showToast("Couldn't delete — try again")
      return
    }
    await loadAll()
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-mono text-sm text-ink-soft">Opening your log…</div>
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-paper">
        <Header />
        <div className="max-w-md mx-auto px-5 py-8">
          <div className="bg-white border border-line rounded-xl p-6">
            <h2 className="font-display font-semibold text-lg text-navy mb-1">A couple of things to start</h2>
            <p className="text-sm text-ink-soft mb-5">Take your route and dates from your visa decision letter or BRP. You can change them later.</p>
            <SetupForm onSave={handleSetupSave} saving={savingProfile} />
          </div>
        </div>
      </div>
    )
  }

  const route = getRoute(profile.route_id)
  const years = profile.qualifying_years || route.years
  const stats = computeStats(trips, profile.visa_start, years)
  const compliance = assessCompliance(trips, route)

  return (
    <div className="min-h-screen bg-paper pb-16">
      <Header route={route} />

      <main className="max-w-3xl mx-auto px-5 space-y-5 -mt-2">
        <StatsOverview stats={stats} compliance={compliance} tripCount={trips.length} route={route} />

        <RenewalBanner visaExpiry={profile.visa_expiry} />

        <section className="bg-white border border-line rounded-xl p-6">
          <h2 className="font-display font-semibold text-lg text-navy mb-4">
            {editingTrip ? 'Edit trip' : 'Log a trip'}
          </h2>
          <TripForm
            editingTrip={editingTrip}
            onSubmit={handleTripSubmit}
            onCancelEdit={() => setEditingTrip(null)}
            saving={savingTrip}
          />
        </section>

        <section className="bg-white border border-line rounded-xl p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-display font-semibold text-lg text-navy">Travel record</h2>
            <button onClick={() => exportCsv(trips)} className="border border-line rounded-md px-4 py-2 text-sm font-semibold text-navy hover:border-navy">
              Export CSV
            </button>
          </div>
          <TripList trips={trips} onEdit={setEditingTrip} onDelete={handleDelete} />
        </section>

        <section className="bg-white border border-line rounded-xl p-6">
          <h2 className="font-display font-semibold text-lg text-navy mb-4">Absence pattern by month</h2>
          <AbsenceChart trips={trips} visaStart={stats.visaStart} />
        </section>

        <section className="bg-white border border-line rounded-xl p-6">
          <h2 className="font-display font-semibold text-lg text-navy mb-4">How this is actually assessed</h2>
          <InfoPanel route={route} />
        </section>
      </main>

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-navy text-[#F4F0E6] px-5 py-2.5 rounded-md text-sm shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  )
}
