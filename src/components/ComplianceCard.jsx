function Gauge({ value, limit, hardCap }) {
  const pct = Math.min(100, (value / (limit * 1.2)) * 100)
  const markerPct = (1 / 1.2) * 100
  let color = 'bg-leaf'
  if (value >= limit) color = 'bg-burgundy'
  else if (value >= limit * 0.78) color = 'bg-amber'
  if (!hardCap && value < limit * 0.78) color = 'bg-leaf'

  return (
    <div className="h-2 rounded bg-line relative mt-2.5">
      <div className={`h-full rounded ${color}`} style={{ width: `${pct}%` }} />
      <div className="absolute -top-1 w-0.5 h-4 bg-ink" style={{ left: `${markerPct}%` }} />
    </div>
  )
}

export default function ComplianceCard({ compliance }) {
  if (compliance.kind === 'hardCap' || compliance.kind === 'hardCap-exceptions') {
    const breached = compliance.breached
    return (
      <div className="bg-white border border-line rounded-xl p-5">
        <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-soft mb-2">
          Highest 12-month rolling total
        </p>
        <div className="font-mono text-2xl font-semibold text-navy">
          {compliance.rollingMax} <span className="text-sm font-medium text-ink-soft">/ {compliance.limit} days</span>
        </div>
        <Gauge value={compliance.rollingMax} limit={compliance.limit} hardCap />
        <p className={`text-xs mt-1.5 ${breached ? 'text-burgundy font-semibold' : 'text-ink-soft'}`}>
          {breached
            ? `⚠ This exceeds the ${compliance.limit}-day limit for your route — continuous residence may have broken`
            : 'This is a hard legal limit on your route, not just a guideline'}
        </p>
      </div>
    )
  }

  if (compliance.kind === 'qualitative') {
    return (
      <div className="bg-white border border-line rounded-xl p-5">
        <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-soft mb-2">
          Highest 12-month rolling total
        </p>
        <div className="font-mono text-2xl font-semibold text-navy">
          {compliance.rollingMax} <span className="text-sm font-medium text-ink-soft">days</span>
        </div>
        <Gauge value={compliance.rollingMax} limit={compliance.referenceLimit} hardCap={false} />
        <p className="text-xs text-ink-soft mt-1.5">Reference mark at {compliance.referenceLimit} days — not a fixed limit on your route</p>
      </div>
    )
  }

  if (compliance.kind === 'euss') {
    return (
      <div className="bg-white border border-line rounded-xl p-5 sm:col-span-2">
        <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-soft mb-3">
          EU Settlement Scheme — two ways to qualify
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="font-mono text-xl font-semibold text-navy">
              {compliance.rolling12} <span className="text-sm font-medium text-ink-soft">/ {compliance.sixMonthLimit} days</span>
            </div>
            <p className="text-xs text-ink-soft mt-1">"6/12" rule — highest 12-month total</p>
            <Gauge value={compliance.rolling12} limit={compliance.sixMonthLimit} hardCap />
            <p className={`text-xs mt-1.5 ${compliance.meetsSixTwelve ? 'text-leaf' : 'text-ink-soft'}`}>
              {compliance.meetsSixTwelve ? '✓ Currently met' : 'Not currently met on its own'}
            </p>
          </div>
          <div>
            <div className="font-mono text-xl font-semibold text-navy">
              {compliance.totalIn60} <span className="text-sm font-medium text-ink-soft">/ {compliance.thirtySixtyLimit} days</span>
            </div>
            <p className="text-xs text-ink-soft mt-1">"30/60" rule — total absence in last 5 years</p>
            <Gauge value={compliance.totalIn60} limit={compliance.thirtySixtyLimit} hardCap />
            <p className={`text-xs mt-1.5 ${compliance.meetsThirtySixty ? 'text-leaf' : 'text-ink-soft'}`}>
              {compliance.meetsThirtySixty ? '✓ Currently met' : 'Not currently met on its own'}
            </p>
          </div>
        </div>
        <p className="text-xs text-ink-soft mt-3">
          You only need to satisfy one of these two — the 30/60 rule is generally more forgiving if your time abroad was uneven.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-line rounded-xl p-5">
      <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-soft mb-2">Absence rule</p>
      <p className="text-sm text-ink-soft">
        We don't have a specific rule modelled for this route yet. Check gov.uk or an adviser for the rules that apply to you.
      </p>
    </div>
  )
}
