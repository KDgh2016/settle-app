import { daysBetween, fmt, isoDay, parseDate } from '../lib/dateMath'
import ComplianceCard from './ComplianceCard'
import RouteIcon from './RouteIcon'

export default function StatsOverview({ stats, compliance, tripCount, route }) {
  const today = parseDate(isoDay(new Date()))
  const daysToEligible = daysBetween(today, stats.eligibleDate)

  const tot = stats.withFamily + stats.alone + stats.partial
  const pF = tot ? Math.round((stats.withFamily / tot) * 100) : 0
  const pA = tot ? Math.round((stats.alone / tot) * 100) : 0
  const pP = Math.max(0, 100 - pF - pA)

  const FamilySplitCard = (
    <div className="bg-white border border-line rounded-xl p-5">
      <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-soft mb-2">Travelled with family vs. alone</p>
      <div className="h-2.5 rounded-full overflow-hidden flex bg-line mt-2.5">
        <div className="bg-leaf" style={{ width: `${pF}%` }} />
        <div className="bg-amber" style={{ width: `${pP}%` }} />
        <div className="bg-burgundy" style={{ width: `${pA}%` }} />
      </div>
      <div className="flex gap-3.5 mt-2 flex-wrap text-[11.5px] text-ink-soft">
        <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-leaf inline-block" />With family <b>{pF}%</b></span>
        <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-burgundy inline-block" />Alone <b>{pA}%</b></span>
      </div>
    </div>
  )

  const wide = compliance.kind === 'euss'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      <div className="relative bg-white border border-line rounded-xl p-5">
        <div className="absolute top-3.5 right-3.5 w-12 h-12 rounded-full border-[1.6px] border-gold flex items-center justify-center opacity-85">
          <RouteIcon name={route.icon} className="w-5 h-5 text-gold" />
        </div>
        <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-soft mb-2">{route.short}</p>
        <div className="font-mono text-2xl font-semibold text-navy">
          {daysToEligible > 0 ? `${daysToEligible}d` : 'Reached'}
        </div>
        <p className="text-xs text-ink-soft mt-1">Est. eligible {fmt(stats.eligibleDate)}</p>
      </div>

      <div className="bg-white border border-line rounded-xl p-5">
        <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-soft mb-2">Days outside the UK so far</p>
        <div className="font-mono text-2xl font-semibold text-navy">{stats.totalDays}</div>
        <p className="text-xs text-ink-soft mt-1">{tripCount} trip{tripCount === 1 ? '' : 's'} logged</p>
      </div>

      {!wide && FamilySplitCard}
      <ComplianceCard compliance={compliance} />
      {wide && FamilySplitCard}
    </div>
  )
}
