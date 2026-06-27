import { Heart, Briefcase, Sparkles, Building2, Globe, Compass } from 'lucide-react'

const ICONS = { Heart, Briefcase, Sparkles, Building2, Globe, Compass }

export default function RouteIcon({ name, className }) {
  const Icon = ICONS[name] || Compass
  return <Icon className={className} strokeWidth={1.6} />
}
