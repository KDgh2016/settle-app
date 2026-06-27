import { COMPANION_LABELS, REASON_LABELS, fmt, parseDate, tripDuration } from '../lib/dateMath'

const STAMP_COLOR = {
  with_family: 'text-leaf',
  alone: 'text-burgundy',
  partial: 'text-amber',
}

export default function TripList({ trips, onEdit, onDelete }) {
  if (trips.length === 0) {
    return <div className="py-8 text-center text-sm text-ink-soft">No trips logged yet. Add your first one above.</div>
  }

  const sorted = [...trips].sort((a, b) => b.dep_date.localeCompare(a.dep_date))

  return (
    <div>
      {sorted.map((t) => {
        const d = tripDuration(t)
        const metaParts = [REASON_LABELS[t.reason] || t.reason]
        if (t.destination) metaParts.unshift(t.destination)
        if (t.notes) metaParts.push(t.notes)

        return (
          <div key={t.id} className="flex items-center gap-3.5 py-3.5 border-t border-line first:border-t-0">
            <div className={`stamp-in flex-shrink-0 w-[50px] h-[50px] rounded-full border-2 flex flex-col items-center justify-center font-mono ${STAMP_COLOR[t.companion]}`} style={{ borderColor: 'currentColor' }}>
              <span className="text-[15px] font-bold leading-none">{d}</span>
              <span className="text-[7px] uppercase tracking-wide">days</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-ink">
                {fmt(parseDate(t.dep_date))} → {fmt(parseDate(t.ret_date))} · {COMPANION_LABELS[t.companion]}
              </div>
              <div className="text-xs text-ink-soft mt-0.5 truncate">{metaParts.join(' · ')}</div>
            </div>
            <div className="flex gap-2.5 flex-shrink-0 text-xs">
              <button onClick={() => onEdit(t)} className="underline text-ink-soft hover:text-navy">Edit</button>
              <button onClick={() => onDelete(t.id)} className="underline text-ink-soft hover:text-navy">Delete</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
