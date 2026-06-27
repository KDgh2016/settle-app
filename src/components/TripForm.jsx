import { useEffect, useState } from 'react'

const COMPANION_OPTIONS = [
  { val: 'with_family', label: 'With family' },
  { val: 'alone', label: 'Alone' },
  { val: 'partial', label: 'Partly together' },
]
const REASON_OPTIONS = [
  { val: 'holiday', label: 'Holiday' },
  { val: 'family', label: 'Visiting family' },
  { val: 'work', label: 'Work' },
  { val: 'study', label: 'Study' },
  { val: 'medical', label: 'Medical' },
  { val: 'other', label: 'Other' },
]

const emptyForm = { dep_date: '', ret_date: '', companion: 'with_family', destination: '', reason: 'holiday', notes: '' }

export default function TripForm({ editingTrip, onSubmit, onCancelEdit, saving }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingTrip) {
      setForm({
        dep_date: editingTrip.dep_date,
        ret_date: editingTrip.ret_date,
        companion: editingTrip.companion,
        destination: editingTrip.destination || '',
        reason: editingTrip.reason || 'holiday',
        notes: editingTrip.notes || '',
      })
    } else {
      setForm(emptyForm)
    }
  }, [editingTrip])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.dep_date || !form.ret_date) {
      setError('Both dates are required.')
      return
    }
    if (form.ret_date <= form.dep_date) {
      setError('Return date must be after the departure date.')
      return
    }
    setError('')
    onSubmit(form)
    if (!editingTrip) setForm(emptyForm)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1.5">Left the UK</label>
          <input
            type="date"
            required
            value={form.dep_date}
            onChange={(e) => update('dep_date', e.target.value)}
            className="w-full border border-line rounded-md px-3 py-2.5 text-sm bg-[#FAFAFB] focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1.5">Returned to the UK</label>
          <input
            type="date"
            required
            value={form.ret_date}
            onChange={(e) => update('ret_date', e.target.value)}
            className="w-full border border-line rounded-md px-3 py-2.5 text-sm bg-[#FAFAFB] focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink-soft mb-1.5">Who travelled?</label>
        <div className="flex gap-2 flex-wrap">
          {COMPANION_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.val}
              onClick={() => update('companion', opt.val)}
              className={`flex-1 min-w-[110px] border rounded-md px-2.5 py-2 text-sm transition ${
                form.companion === opt.val
                  ? 'border-navy text-navy bg-[#F2F3F7] font-semibold'
                  : 'border-line text-ink-soft'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1.5">
            Destination <span className="font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={form.destination}
            onChange={(e) => update('destination', e.target.value)}
            placeholder="e.g. Lahore"
            className="w-full border border-line rounded-md px-3 py-2.5 text-sm bg-[#FAFAFB] focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1.5">Reason</label>
          <select
            value={form.reason}
            onChange={(e) => update('reason', e.target.value)}
            className="w-full border border-line rounded-md px-3 py-2.5 text-sm bg-[#FAFAFB] focus:outline-none focus:ring-2 focus:ring-gold"
          >
            {REASON_OPTIONS.map((r) => (
              <option key={r.val} value={r.val}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink-soft mb-1.5">
          Notes <span className="font-normal">(optional — e.g. document references)</span>
        </label>
        <input
          type="text"
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="e.g. visiting family, sponsor approved this absence"
          className="w-full border border-line rounded-md px-3 py-2.5 text-sm bg-[#FAFAFB] focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>

      {error && <p className="text-burgundy text-sm">{error}</p>}

      <div className="flex gap-2.5">
        <button
          type="submit"
          disabled={saving}
          className="bg-navy text-[#F4F0E6] rounded-md px-5 py-2.5 font-semibold text-sm hover:bg-navy-deep transition disabled:opacity-60"
        >
          {saving ? 'Saving…' : editingTrip ? 'Save changes' : 'Save trip'}
        </button>
        {editingTrip && (
          <button type="button" onClick={onCancelEdit} className="border border-line rounded-md px-5 py-2.5 font-semibold text-sm text-navy">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
