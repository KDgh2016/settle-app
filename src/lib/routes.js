// Source of truth for how each route's continuous-residence requirement works.
// "hardCap"   -> Appendix Continuous Residence: a strict, legally enforced 180-day
//                limit in any rolling 12 months. Exceeding it breaks continuous
//                residence and resets the qualifying clock.
// "qualitative" -> Appendix FM 5-year partner route: no fixed day cap. Assessed on
//                reasons for absence, length, and whether the relationship/UK base
//                stayed genuine — captured here via the companion split.
// "euss"      -> EU Settlement Scheme: a different framework entirely (Appendix EU).
//                Two alternative ways to qualify, tracked separately in stats.
// "unknown"   -> fallback for "not sure" — shown cautiously, pointing to gov.uk.

export const ROUTES = [
  {
    id: 'partner-5yr',
    label: 'Spouse / partner (5-year route)',
    short: 'Partner route',
    years: 5,
    rule: 'qualitative',
    capDays: 180,
    icon: 'Heart',
    summary: 'Appendix FM. No fixed day cap — assessed on genuineness of your relationship and UK base.',
  },
  {
    id: 'skilled-worker',
    label: 'Skilled Worker / Health & Care Worker',
    short: 'Skilled Worker',
    years: 5,
    rule: 'hardCap',
    capDays: 180,
    icon: 'Briefcase',
    summary: 'Appendix Continuous Residence. Strict 180-day limit in any rolling 12 months.',
  },
  {
    id: 'scale-up',
    label: 'Scale-up Worker',
    short: 'Scale-up',
    years: 5,
    rule: 'hardCap',
    capDays: 180,
    icon: 'Briefcase',
    summary: 'Appendix Continuous Residence. Strict 180-day limit in any rolling 12 months.',
  },
  {
    id: 'global-talent',
    label: 'Global Talent',
    short: 'Global Talent',
    years: 3,
    rule: 'hardCap',
    capDays: 180,
    icon: 'Sparkles',
    summary: 'Appendix Continuous Residence, 3-year qualifying period. Some research absences may be disregarded.',
  },
  {
    id: 'innovator-founder',
    label: 'Innovator Founder',
    short: 'Innovator Founder',
    years: 3,
    rule: 'hardCap',
    capDays: 180,
    icon: 'Sparkles',
    summary: 'Appendix Continuous Residence, 3-year qualifying period. Strict 180-day limit in any rolling 12 months.',
  },
  {
    id: 'family-10yr',
    label: 'Family life (10-year route)',
    short: '10-year family route',
    years: 10,
    rule: 'hardCap-exceptions',
    capDays: 180,
    icon: 'Heart',
    summary: 'Appendix Settlement Family Life. 180-day limit, but work/study/family absences since 20 June 2022 may be disregarded if your UK base stayed genuine.',
  },
  {
    id: 'long-residence',
    label: 'Long residence (10-year, any combination)',
    short: 'Long residence',
    years: 10,
    rule: 'hardCap',
    capDays: 180,
    icon: 'Building2',
    summary: 'Aligned with the standard 180-day rule since 11 April 2024. Older absences may fall under different transitional limits — get this checked.',
  },
  {
    id: 'euss',
    label: 'EU Settlement Scheme (pre-settled → settled)',
    short: 'EU Settlement Scheme',
    years: 5,
    rule: 'euss',
    capDays: 180,
    icon: 'Globe',
    summary: 'Appendix EU. Two ways to qualify: 6 months present in every 12, or 30 months total in your last 5 years.',
  },
  {
    id: 'other',
    label: "Other / not sure yet",
    short: 'Your route',
    years: 5,
    rule: 'unknown',
    capDays: 180,
    icon: 'Compass',
    summary: "We'll show the common 180-day reference, but check gov.uk or an adviser for your specific category.",
  },
]

export function getRoute(id) {
  return ROUTES.find((r) => r.id === id) || ROUTES[ROUTES.length - 1]
}
