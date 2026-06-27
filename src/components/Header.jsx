import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import GuillochePattern from './GuillochePattern'
import RouteIcon from './RouteIcon'

export default function Header({ route }) {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-gradient-to-b from-navy to-navy-deep px-5 py-8 sm:py-10">
      <div className="max-w-3xl mx-auto">
        <div className="border border-gold/40 rounded-md p-6 relative overflow-hidden">
          <div className="absolute inset-2 border border-gold/15 rounded-sm pointer-events-none" />
          <GuillochePattern className="absolute top-0 left-0 w-full h-3 text-gold-light" opacity={0.25} />
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-gold-light text-[11px] tracking-[0.16em] uppercase font-mono mb-2 flex items-center gap-1.5">
                <RouteIcon name={route?.icon} className="w-3.5 h-3.5" />
                {route?.short || 'UK settlement'} · continuous residence
              </p>
              <h1 className="font-display font-semibold text-4xl sm:text-5xl text-[#F4F0E6]">Settle</h1>
              <p className="text-[#B9BFD0] text-sm mt-1.5 max-w-md">
                A travel log for your visa — for your renewal, your settlement application, and everything in between.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 text-sm">
              <span className="text-[#B9BFD0] text-xs truncate max-w-[160px]">{user?.email}</span>
              <div className="flex gap-3">
                <Link to="/settings" className="text-gold-light underline text-xs">Visa details</Link>
                <button onClick={signOut} className="text-gold-light underline text-xs">Sign out</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
