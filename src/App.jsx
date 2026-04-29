import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Home from './pages/Home'
import Notes from './pages/Notes'
import PDFViewer from './pages/PDFViewer'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    const setupDeepLink = async () => {
      try {
        const CapApp = window.Capacitor?.Plugins?.App
        const Browser = window.Capacitor?.Plugins?.Browser
        if (!CapApp) return
        CapApp.addListener('appUrlOpen', async ({ url }) => {
          if (url.includes('access_token') || url.includes('code=')) {
            if (Browser) await Browser.close()
            const { data } = await supabase.auth.getSessionFromUrl({ url })
            if (data?.session) setSession(data.session)
          }
        })
      } catch (e) {
        console.log('Not native:', e)
      }
    }

    setupDeepLink()

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#0a0a0a'
    }}>
      <div style={{ fontSize: '28px', fontWeight: '700' }}>
        <span style={{ color: '#fb923c' }}>Stack</span>
        <span style={{ color: '#fff' }}>d</span>
      </div>
    </div>
  )

  return (
    <Routes>
      <Route path="/" element={!session ? <Login /> : <Home />} />
      <Route path="/home" element={session ? <Home /> : <Login />} />
      <Route path="/notes/:subjectId" element={session ? <Notes /> : <Login />} />
      <Route path="/pdf" element={session ? <PDFViewer /> : <Login />} />
    </Routes>
  )
}

export default App