import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import SetupForm from '../components/SetupForm'

export default function Settings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setProfile(data)
        setLoading(false)
      })
  }, [user.id])

  async function handleSave(values) {
    setSaving(true)
    await supabase.from('profiles').upsert({ id: user.id, ...values })
    setSaving(false)
    navigate('/app')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-mono text-sm text-ink-soft">Loading…</div>
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-md mx-auto px-5 py-10">
        <h1 className="font-display font-semibold text-2xl text-navy mb-1">Your visa details</h1>
        <p className="text-sm text-ink-soft mb-6">These power your settlement estimate and renewal reminder.</p>
        <div className="bg-white border border-line rounded-xl p-6">
          <SetupForm initial={profile} onSave={handleSave} saving={saving} />
        </div>
        <button onClick={() => navigate('/app')} className="text-sm text-ink-soft underline mt-5">
          Back to dashboard
        </button>
      </div>
    </div>
  )
}
