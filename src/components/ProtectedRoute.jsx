import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-sm text-ink-soft">
        Opening your log…
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return children
}
