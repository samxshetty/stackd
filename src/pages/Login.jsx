import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const native = !!(window.Capacitor?.isNativePlatform?.())
      if (native) {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: 'https://stackd-rose.vercel.app/home',
            queryParams: { hd: 'nmamit.in' },
            skipBrowserRedirect: true
          }
        })
        if (error) throw error
        window.open(data.url, '_system')
      } else {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/home`,
            queryParams: { hd: 'nmamit.in' }
          }
        })
        if (error) throw error
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '32px 24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Glow effects */}
      <div style={{
        position: 'absolute', top: '-80px', right: '-80px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(251,146,60,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-80px', left: '-80px',
        width: '250px', height: '250px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(251,146,60,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Logo */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ fontSize: '52px', fontWeight: '700', letterSpacing: '-1px' }}>
          <span style={{ color: '#fb923c' }}>Stack</span>
          <span style={{ color: '#fff' }}>d</span>
        </div>
        <div style={{ fontSize: '14px', color: '#555', marginTop: '6px' }}>
          NMAMIT Student Resource App
        </div>
      </div>

      {/* Welcome text */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>
          Welcome 👋
        </div>
        <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
          Sign in with your NMAMIT college Google account to access notes
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          color: '#f87171', fontSize: '13px',
          marginBottom: '16px', padding: '10px 14px',
          background: 'rgba(248,113,113,0.1)',
          borderRadius: '8px', border: '1px solid rgba(248,113,113,0.2)'
        }}>
          {error}
        </div>
      )}

      {/* Google Button */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        style={{
          width: '100%',
          background: loading ? '#1a1a1a' : 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '14px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          color: '#fff',
          fontSize: '15px',
          fontWeight: '500',
          transition: 'all 0.2s'
        }}
      >
        {!loading && (
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        {loading ? 'Signing in...' : 'Continue with Google'}
      </button>

      <div style={{ fontSize: '12px', color: '#333', textAlign: 'center', marginTop: '24px', lineHeight: '1.6' }}>
        Only @nmamit.in college accounts are allowed
      </div>
    </div>
  )
}