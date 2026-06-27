import { useState } from 'react'
import { ROUTES, getRoute } from '../lib/routes'
import RouteIcon from './RouteIcon'

export default function SetupForm({ initial, onSave, saving }) {
  const [routeId, setRouteId] = useState(initial?.route_id || ROUTES[0].id)
  const [visaStart, setVisaStart] = useState(initial?.visa_start || '')
  const [visaExpiry, setVisaExpiry] = useState(initial?.visa_expiry || '')
  const [qualifyingYears, setQualifyingYears] = useState(
    initial?.qualifying_years ?? getRoute(initial?.route_id || ROUTES[0].id).years
  )
  const [error, setError] = useState('')

  function handleRouteChange(id) {
    setRouteId(id)
    setQualifyingYears(getRoute(id).years)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!visaStart) {
      setError('Start date is required.')
      return
    }
    if (!qualifyingYears || qualifyingYears <= 0) {
      setError('Qualifying period must be a positive number of years.')
      return
    }
    setError('')
    onSave({
      route_id: routeId,
      visa_start: visaStart,
      visa_expiry: visaExpiry || null,
      qualifying_years: Number(qualifyingYears),
    })
  }

  const route = getRoute(routeId)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-ink-soft mb-1.5">What's your visa route?</label>
        <div className="relative">
          <RouteIcon name={route.icon} className="w-4 h-4 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={routeId}
            onChange={(e) => handleRouteChange(e.target.value)}
            className="w-full border border-line rounded-md pl-9 pr-3 py-2.5 text-sm bg-[#FAFAFB] focus:outline-none focus:ring-2 focus:ring-gold appearance-none"
          >
            {ROUTES.map((r) => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
        </div>
        <p className="text-xs text-ink-soft mt-1.5">{route.summary}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1.5">
            When did your continuous residence start?
          </label>
          <input
            type="date"
            value={visaStart}
            onChange={(e) => setVisaStart(e.target.value)}
            className="w-full border border-line rounded-md px-3 py-2.5 text-sm bg-[#FAFAFB] focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1.5">
            Qualifying period (years)
          </label>
          <input
            type="number"
            min="1"
            max="10"
            step="0.5"
            value={qualifyingYears}
            onChange={(e) => setQualifyingYears(e.target.value)}
            className="w-full border border-line rounded-md px-3 py-2.5 text-sm bg-[#FAFAFB] focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink-soft mb-1.5">
          When does your current leave/status expire? <span className="font-normal">(optional — for a renewal reminder)</span>
        </label>
        <input
          type="date"
          value={visaExpiry}
          onChange={(e) => setVisaExpiry(e.target.value)}
          className="w-full border border-line rounded-md px-3 py-2.5 text-sm bg-[#FAFAFB] focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>

      {error && <p className="text-burgundy text-sm">{error}</p>}
      <button disabled={saving} className="bg-navy text-[#F4F0E6] rounded-md px-5 py-2.5 font-semibold text-sm hover:bg-navy-deep transition disabled:opacity-60">
        {saving ? 'Saving…' : 'Save'}
      </button>
    </form>
  )
}
