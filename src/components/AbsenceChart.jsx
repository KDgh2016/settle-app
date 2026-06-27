import { addMonths, daysBetween, parseDate } from '../lib/dateMath'

export default function AbsenceChart({ trips, visaStart }) {
  const today = new Date()
  const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1))

  let monthsSpan =
    (todayUTC.getUTCFullYear() - visaStart.getUTCFullYear()) * 12 +
    (todayUTC.getUTCMonth() - visaStart.getUTCMonth()) +
    1
  monthsSpan = Math.max(1, Math.min(24, monthsSpan))

  const months = []
  for (let i = monthsSpan - 1; i >= 0; i--) {
    months.push(addMonths(todayUTC, -i))
  }

  return (
    <div className="overflow-x-auto pb-1.5">
      <div className="flex items-end gap-1.5 min-w-max pt-2.5" style={{ height: 150 }}>
        {months.map((mStart, idx) => {
          const mEnd = addMonths(mStart, 1)
          let together = 0, solo = 0, mixed = 0
          trips.forEach((t) => {
            const s = parseDate(t.dep_date)
            const e = parseDate(t.ret_date)
            const os = s > mStart ? s : mStart
            const oe = e < mEnd ? e : mEnd
            if (oe > os) {
              const d = daysBetween(os, oe)
              if (t.companion === 'with_family') together += d
              else if (t.companion === 'alone') solo += d
              else mixed += d
            }
          })
          const totalDaysInMonth = daysBetween(mStart, mEnd)
          const scale = 120 / totalDaysInMonth
          const hT = Math.round(together * scale)
          const hS = Math.round(solo * scale)
          const hM = Math.round(mixed * scale)
          const label = mStart.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })

          return (
            <div key={idx} className="flex flex-col items-center w-[26px]">
              <div className="w-4 bg-[#F2F3F6] rounded overflow-hidden flex flex-col-reverse justify-start" style={{ height: 120 }}>
                <div className="bg-burgundy w-full" style={{ height: hS }} />
                <div className="bg-amber w-full" style={{ height: hM }} />
                <div className="bg-leaf w-full" style={{ height: hT }} />
              </div>
              <div className="text-[9.5px] text-ink-soft mt-1.5" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', height: 34 }}>
                {label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
