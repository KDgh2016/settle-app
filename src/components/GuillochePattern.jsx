// A thin engraved-line pattern, the kind printed on visa stickers and passport
// pages as an anti-forgery measure. Used here purely as a decorative motif.
export default function GuillochePattern({ className = '', opacity = 0.4 }) {
  return (
    <svg className={className} viewBox="0 0 200 16" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="guilloche" width="40" height="16" patternUnits="userSpaceOnUse">
          <path d="M0 8 Q10 0 20 8 T40 8" fill="none" stroke="currentColor" strokeWidth="0.7" opacity={opacity} />
          <path d="M0 8 Q10 16 20 8 T40 8" fill="none" stroke="currentColor" strokeWidth="0.7" opacity={opacity * 0.7} />
        </pattern>
      </defs>
      <rect width="200" height="16" fill="url(#guilloche)" />
    </svg>
  )
}
