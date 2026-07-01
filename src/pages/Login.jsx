import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import GuillochePattern from '../components/GuillochePattern'

export default function Login() {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/app'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setBusy(true)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate(from, { replace: true })
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setInfo('Account created. Check your email to confirm it, then sign in.')
        setMode('signin')
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) throw error
        setInfo('If that email has an account, a reset link is on its way.')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-navy-deep">

      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1400&q=85"
          alt="London skyline"
          className="w-full h-full object-cover object-center opacity-20"
        />
      </div>

      {/* Guilloche borders */}
      <GuillochePattern className="absolute top-0 left-0 w-full h-4 text-gold-light z-10" opacity={0.35} />
      <GuillochePattern className="absolute bottom-0 left-0 w-full h-4 text-gold-light rotate-180 z-10" opacity={0.35} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm">

        {/* Header */}
        <div className="border border-gold/40 rounded-t-2xl p-8 relative overflow-hidden bg-navy/80 backdrop-blur-sm">
          <div className="absolute inset-2 border border-gold/15 rounded-xl pointer-events-none" />
          <GuillochePattern className="absolute top-0 left-0 w-full h-3 text-gold-light" opacity={0.3} />

          <p className="text-gold-light text-[10px] tracking-[0.2em] uppercase font-mono mb-3 flex items-center gap-2">
            <span className="inline-block w-5 h-px bg-gold-light/60" />
            UK immigration · continuous residence
            <span className="inline-block w-5 h-px bg-gold-light/60" />
          </p>
          <h1 className="font-display font-semibold text-5xl text-[#F4F0E6] mb-2">Settle</h1>
          <p className="text-[#9BA3B8] text-sm leading-relaxed">
            {mode === 'signin' && 'Welcome back. Sign in to your absence log.'}
            {mode === 'signup' && 'Create your private absence log — free forever.'}
            {mode === 'reset' && "We'll send a password reset link to your email."}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-b-2xl p-7 space-y-4 shadow-2xl border border-t-0 border-line"
        >
          <div>
            <label className="block text-xs font-semibold text-ink-soft mb-1.5 tracking-wide">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-line rounded-lg px-3.5 py-3 text-sm bg-[#FAFAFB] focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition"
            />
          </div>

          {mode !== 'reset' && (
            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-1.5 tracking-wide">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-line rounded-lg px-3.5 py-3 text-sm bg-[#FAFAFB] focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition"
              />
            </div>
          )}

          {error && (
            <div className="bg-burgundy-bg border border-[#E3B6BB] rounded-lg px-4 py-3 text-burgundy text-sm">
              {error}
            </div>
          )}
          {info && (
            <div className="bg-leaf-bg border border-[#A8D4B8] rounded-lg px-4 py-3 text-leaf text-sm">
              {info}
            </div>
          )}

          <button
            disabled={busy}
            className="w-full bg-navy text-[#F4F0E6] rounded-lg py-3 font-semibold text-sm hover:bg-navy-deep transition disabled:opacity-60 shadow-sm mt-2"
          >
            {busy
              ? 'Please wait…'
              : mode === 'signin'
              ? 'Sign in'
              : mode === 'signup'
              ? 'Create account'
              : 'Send reset link'}
          </button>

          <div className="text-center text-sm text-ink-soft space-y-2 pt-1">
            {mode === 'signin' && (
              <>
                <p>
                  No account yet?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setError(''); setInfo('') }}
                    className="text-navy font-semibold underline underline-offset-2"
                  >
                    Sign up free
                  </button>
                </p>
                <p>
                  <button
                    type="button"
                    onClick={() => { setMode('reset'); setError(''); setInfo('') }}
                    className="underline underline-offset-2 text-ink-soft"
                  >
                    Forgot your password?
                  </button>
                </p>
              </>
            )}
            {mode !== 'signin' && (
              <p>
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setError(''); setInfo('') }}
                  className="text-navy font-semibold underline underline-offset-2"
                >
                  Back to sign in
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}