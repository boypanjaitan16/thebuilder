import { useEffect, useMemo, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export function AdminGuard() {
  const location = useLocation()
  const [session, setSession] = useState<Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']>(null)
  const [checking, setChecking] = useState(true)

  const isAuthenticated = useMemo(() => Boolean(session), [session])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  if (checking) {
    return (
      <div className="container-page">
        <section className="glass-panel px-8 py-6 text-sm text-slate-700">Checking session…</section>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
