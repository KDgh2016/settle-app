// All dates are stored/compared as UTC midnight to avoid timezone drift.

export function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

export function isoDay(date) {
  return date.toISOString().slice(0, 10)
}

export function addDays(date, n) {
  return new Date(date.getTime() + n * 86400000)
}

export function addMonths(date, n) {
  const d = new Date(date.getTime())
  d.setUTCMonth(d.getUTCMonth() + n)
  return d
}

export function daysBetween(a, b) {
  return Math.round((b - a) / 86400000)
}

export function fmt(date, opts) {
  return date.toLocaleDateString('en-GB', opts || { day: 'numeric', month: 'short', year: 'numeric' })
}

export function tripDuration(t) {
  return daysBetween(parseDate(t.dep_date), parseDate(t.ret_date))
}

export const REASON_LABELS = {
  holiday: 'Holiday',
  family: 'Visiting family',
  work: 'Work',
  study: 'Study',
  medical: 'Medical',
  other: 'Other',
}

export const COMPANION_LABELS = {
  alone: 'Alone',
  with_family: 'With family',
  partial: 'Partly together',
}

// Highest sum of absence days within any trailing N-day window, checked at
// every trip boundary plus today — a good practical approximation, since the
// true maximum of a sum of intervals always occurs at one of these points.
function rollingMax(trips, windowDays) {
  const checkpoints = new Set()
  trips.forEach((t) => {
    checkpoints.add(t.dep_date)
    checkpoints.add(t.ret_date)
  })
  checkpoints.add(isoDay(new Date()))

  let max = 0
  checkpoints.forEach((cpStr) => {
    const cp = parseDate(cpStr)
    const windowStart = addDays(cp, -windowDays)
    let sum = 0
    trips.forEach((t) => {
      const s = parseDate(t.dep_date)
      const e = parseDate(t.ret_date)
      const os = s > windowStart ? s : windowStart
      const oe = e < cp ? e : cp
      if (oe > os) sum += daysBetween(os, oe)
    })
    if (sum > max) max = sum
  })
  return max
}

export function computeStats(trips, visaStartStr, qualifyingYears) {
  const visaStart = parseDate(visaStartStr)

  let totalDays = 0, withFamily = 0, alone = 0, partial = 0
  trips.forEach((t) => {
    const s = parseDate(t.dep_date) < visaStart ? visaStart : parseDate(t.dep_date)
    const e = parseDate(t.ret_date)
    if (e <= s) return
    const d = daysBetween(s, e)
    totalDays += d
    if (t.companion === 'with_family') withFamily += d
    else if (t.companion === 'alone') alone += d
    else partial += d
  })

  const eligibleDate = addMonths(visaStart, Math.round(qualifyingYears * 12))

  return { totalDays, withFamily, alone, partial, eligibleDate, visaStart }
}

// Route-specific compliance assessment. `route` comes from lib/routes.js.
// Returns a discriminated shape the UI can render regardless of rule type.
export function assessCompliance(trips, route) {
  const rule = route.rule

  if (rule === 'hardCap' || rule === 'hardCap-exceptions') {
    const max = rollingMax(trips, 365)
    return {
      kind: rule,
      rollingMax: max,
      limit: route.capDays || 180,
      breached: max >= (route.capDays || 180),
    }
  }

  if (rule === 'qualitative') {
    const max = rollingMax(trips, 365)
    return { kind: 'qualitative', rollingMax: max, referenceLimit: route.capDays || 180 }
  }

  if (rule === 'euss') {
    // Pathway 1 ("6/12"): must not exceed ~6 months absence in any rolling 12 months.
    const rolling12 = rollingMax(trips, 365)
    const sixMonthLimit = 183

    // Pathway 2 ("30/60", available since 16 July 2025 for pre-settled holders
    // moving to settled status): must not exceed 30 months absence in the most
    // recent 60 months — i.e. at most half that trailing window.
    const windowDays = 1826 // ~60 months
    const totalIn60 = (() => {
      const today = parseDate(isoDay(new Date()))
      const windowStart = addDays(today, -windowDays)
      let sum = 0
      trips.forEach((t) => {
        const s = parseDate(t.dep_date)
        const e = parseDate(t.ret_date)
        const os = s > windowStart ? s : windowStart
        const oe = e < today ? e : today
        if (oe > os) sum += daysBetween(os, oe)
      })
      return sum
    })()
    const thirtySixtyLimit = Math.round(windowDays / 2)

    return {
      kind: 'euss',
      rolling12,
      sixMonthLimit,
      meetsSixTwelve: rolling12 <= sixMonthLimit,
      totalIn60,
      thirtySixtyLimit,
      meetsThirtySixty: totalIn60 <= thirtySixtyLimit,
    }
  }

  return { kind: 'unknown' }
}

export function exportCsv(trips) {
  const rows = [['Departure', 'Return', 'Days abroad', 'Companion', 'Destination', 'Reason', 'Notes']]
  ;[...trips]
    .sort((a, b) => a.dep_date.localeCompare(b.dep_date))
    .forEach((t) => {
      rows.push([
        t.dep_date,
        t.ret_date,
        tripDuration(t),
        COMPANION_LABELS[t.companion] || t.companion,
        t.destination || '',
        REASON_LABELS[t.reason] || t.reason || '',
        t.notes || '',
      ])
    })
  const csv = rows
    .map((r) =>
      r
        .map((v) => {
          const s = String(v).replace(/"/g, '""')
          return /[",\n]/.test(s) ? `"${s}"` : s
        })
        .join(',')
    )
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'settle-absence-record.csv'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
