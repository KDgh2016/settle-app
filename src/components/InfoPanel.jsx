const COPY = {
  qualitative: (
    <>
      <p>
        <strong className="text-ink">Your route doesn't use a fixed day cap.</strong> The strict 180-day rolling
        limit (Appendix Continuous Residence) applies to work routes, EUSS, the 10-year family route, and similar —
        but not to the 5-year partner route. Instead, the Home Office looks at the <em>reasons</em> for your time
        abroad, how long each absence was, and whether you and your partner travelled and lived together during it,
        as part of assessing whether your relationship is genuine and you both intend to live together permanently
        in the UK.
      </p>
      <p>
        That's why the "with family vs. alone" split matters more here than a strict day count. Extended solo
        absences are more likely to invite questions; absences taken together are generally easier to explain.
      </p>
      <p>
        The 180-day mark shown above is a useful benchmark, not a legal limit for your route — keep it for
        perspective, not as a hard ceiling.
      </p>
    </>
  ),
  'hardCap-exceptions': (
    <>
      <p>
        <strong className="text-ink">The 10-year family route also carries the 180-day rolling limit</strong> — but
        with a meaningful difference: since 20 June 2022, absences for work, study, or supporting family overseas
        can be disregarded, as long as you maintained a genuine family life and the UK remained your place of
        permanent residence throughout.
      </p>
      <p>
        That makes the "with family vs. alone" split worth watching here too, alongside the day count — an absence
        that would otherwise breach the limit may still be fine if it falls under one of these exceptions, but it
        needs to be clearly evidenced.
      </p>
    </>
  ),
  euss: (
    <>
      <p>
        <strong className="text-ink">The EU Settlement Scheme runs on its own framework</strong> (Appendix EU), not
        the standard Appendix Continuous Residence rules. From 16 July 2025, pre-settled status holders moving to
        settled status can qualify either way: the original "6/12" rule (no more than ~6 months absent in any
        rolling 12 months), or the newer, often more forgiving "30/60" rule (no more than 30 months absent across
        your most recent 5 years, however that time was spread out).
      </p>
      <p>
        Single absences of up to 12 months for an "important reason" (childbirth, serious illness, study, an
        overseas work posting, and similar) can also be disregarded under the 6/12 rule with the right evidence —
        not modelled automatically here.
      </p>
    </>
  ),
  unknown: (
    <>
      <p>
        We don't have a specific absence rule modelled for this route, or you're not yet on one that leads directly
        to settlement. Many continuous-residence rules only start applying once you're on a settlement-track visa —
        so it's worth revisiting this once your circumstances are clearer.
      </p>
      <p>
        In the meantime, this is still useful as a plain record of your time abroad — handy for visa applications,
        tax residency questions, or just your own reference.
      </p>
    </>
  ),
}

export default function InfoPanel({ route }) {
  const cap = route.capDays || 180
  return (
    <div className="space-y-3.5 text-sm text-ink-soft leading-relaxed">
      <p className="text-ink font-medium">{route.summary}</p>
      {route.rule === 'hardCap' ? (
        <>
          <p>
            <strong className="text-ink">Your route carries a hard limit:</strong> you must not be outside the UK
            for more than {cap} days in any rolling 12-month window during your qualifying period. This is checked
            at every possible 12-month window, not by calendar year — so two separate trips months apart can still
            combine to breach it.
          </p>
          <p>
            Exceeding it breaks continuous residence and can reset your qualifying clock, unless a specific
            exception applies (for example, certain sponsor-approved research absences, humanitarian work, or
            compelling personal circumstances such as a close family member's life-threatening illness). Those
            exceptions need to be clearly evidenced — this tool doesn't try to apply them automatically.
          </p>
          <p>
            Watch the rolling total above closely if you travel often; it's easy to miscalculate by thinking in
            calendar years instead of any 12-month window.
          </p>
        </>
      ) : (
        COPY[route.rule] || COPY.unknown
      )}
      <p>
        Source:{' '}
        <a
          href="https://www.gov.uk/government/publications/continuous-residence/continuous-residence-guidance-accessible-version"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          gov.uk continuous residence guidance
        </a>
        . This tool is for your own record-keeping. It isn't legal advice, and it doesn't replace your boarding
        passes, passport stamps, or an adviser's review of your specific case.
      </p>
    </div>
  )
}
