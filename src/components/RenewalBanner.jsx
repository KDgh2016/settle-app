import { daysBetween, fmt, isoDay, parseDate } from '../lib/dateMath'

export default function RenewalBanner({ visaExpiry }) {
  if (!visaExpiry) return null

  const today = parseDate(isoDay(new Date()))
  const exp = parseDate(visaExpiry)
  const daysToExp = daysBetween(today, exp)

  if (daysToExp < 0) {
    return (
      <div className="bg-burgundy-bg border border-[#E3B6BB] text-[#6E2530] rounded-lg px-4.5 py-3.5 text-sm flex gap-2.5">
        <span>⚠</span>
        <span>
          Your recorded leave expired on <strong>{fmt(exp)}</strong>. If this date is out of date, update it on the Visa dates page — otherwise check your status urgently.
        </span>
      </div>
    )
  }

  if (daysToExp <= 90) {
    return (
      <div className="bg-amber-bg border border-[#E4CB94] text-[#6E5419] rounded-lg px-4.5 py-3.5 text-sm flex gap-2.5">
        <span>⏳</span>
        <span>
          Your current leave expires on <strong>{fmt(exp)}</strong> ({daysToExp} days) — this is usually when a visa extension application is due.
        </span>
      </div>
    )
  }

  return null
}
