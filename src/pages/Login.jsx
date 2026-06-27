import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import GuillochePattern from '../components/GuillochePattern'

export default function Login() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup' | 'reset'
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
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="bg-gradient-to-b from-navy to-navy-deep rounded-t-xl p-7 border border-gold/30 relative overflow-hidden">
          <div className="absolute inset-2 border border-gold/15 rounded-md pointer-events-none" />
          <GuillochePattern className="absolute top-0 left-0 w-full h-3 text-gold-light" opacity={0.3} />
          <p className="text-gold-light text-[11px] tracking-[0.16em] uppercase font-mono mb-2">
            UK immigration · continuous residence
          </p>
          <h1 className="font-display font-semibold text-4xl text-[#F4F0E6]">Settle</h1>
          <p className="text-[#B9BFD0] text-sm mt-2">Your private absence log, for any UK visa route.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-line rounded-b-xl p-6 space-y-4 shadow-sm">
          <div>
            <label className="block text-xs font-semibold text-ink-soft mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-line rounded-md px-3 py-2.5 text-sm bg-[#FAFAFB] focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
            />
          </div>

          {mode !== 'reset' && (
            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-line rounded-md px-3 py-2.5 text-sm bg-[#FAFAFB] focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
              />
            </div>
          )}

          {error && <p className="text-burgundy text-sm">{error}</p>}
          {info && <p className="text-leaf text-sm">{info}</p>}

          <button
            disabled={busy}
            className="w-full bg-navy text-[#F4F0E6] rounded-md py-2.5 font-semibold text-sm hover:bg-navy-deep transition disabled:opacity-60"
          >
            {busy
              ? 'Please wait…'
              : mode === 'signin'
              ? 'Sign in'
              : mode === 'signup'
              ? 'Create account'
              : 'Send reset link'}
          </button>

          <div className="text-center text-sm text-ink-soft space-y-1.5">
            {mode === 'signin' && (
              <>
                <p>
                  No account yet?{' '}
                  <button type="button" onClick={() => { setMode('signup'); setError(''); setInfo('') }} className="text-navy font-semibold underline">
                    Sign up
                  </button>
                </p>
                <p>
                  <button type="button" onClick={() => { setMode('reset'); setError(''); setInfo('') }} className="underline">
                    Forgot your password?
                  </button>
                </p>
              </>
            )}
            {mode !== 'signin' && (
              <p>
                <button type="button" onClick={() => { setMode('signin'); setError(''); setInfo('') }} className="text-navy font-semibold underline">
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
