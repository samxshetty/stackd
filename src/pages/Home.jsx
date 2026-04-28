import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [activeCycle, setActiveCycle] = useState('P-Cycle')
  const [activeBranch, setActiveBranch] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [cycles, setCycles] = useState([])
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const icons = {
    'Engineering Maths I': '📐',
    'Engineering Physics': '🔬',
    'Engineering Chemistry': '⚗️',
    'Engineering Mechanics': '⚙️',
    'Programming in C': '💻',
    'Basic Electronics': '⚡',
    'Constitution of India': '📜',
    'Kannada': '🅺',
    'Materials Chemistry For Devices and E-Waste Management': '🧪',
    'Linear Algebra and Transform Techniques': '📐',
    'Introduction to Python Programming': '🐍',
    'Applied Digital Logic Design': '🔲',
    'Elements of Electrical Engineering': '⚡',
    'Environmental Science and Sustainability': '🌱',
    'Biology for Engineers': '🧬',
    'Engineering Visualization': '✏️',
  }

  useEffect(() => {
    fetchCycles()
  }, [])

  useEffect(() => {
    if (cycles.length > 0) fetchBranches()
  }, [activeCycle, cycles])

  useEffect(() => {
    if (activeBranch) fetchSubjects()
  }, [activeBranch])

  const fetchCycles = async () => {
    const { data } = await supabase.from('cycles').select('*')
    if (data) setCycles(data)
  }

  const fetchBranches = async () => {
    setActiveBranch(null)
    setSubjects([])
    const cycle = cycles.find(c => c.name === activeCycle)
    if (!cycle) return
    const { data } = await supabase
      .from('branches')
      .select('*')
      .eq('cycle_id', cycle.id)
    if (data) {
      setBranches(data)
      setActiveBranch(data[0])
    }
  }

  const fetchSubjects = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('subjects')
      .select('*')
      .eq('branch_id', activeBranch.id)
    if (data) setSubjects(data)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
      {/* Glow */}
      <div style={{
        position: 'fixed', top: '-100px', right: '-100px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(251,146,60,0.1) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* Header */}
      <div style={{ padding: '52px 20px 16px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#555', marginBottom: '4px' }}>
              NMAMIT First Year
            </div>
            <div style={{ fontSize: '26px', fontWeight: '700', letterSpacing: '-0.5px' }}>
              <span style={{ color: '#fb923c' }}>Stack</span>
              <span style={{ color: '#fff' }}>d</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '8px 14px',
              color: '#666',
              fontSize: '12px'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Cycle Tabs */}
      <div style={{ padding: '0 20px 16px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '11px', color: '#555', fontWeight: '600', letterSpacing: '0.08em', marginBottom: '10px' }}>
          CYCLE
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['P-Cycle', 'C-Cycle'].map(cycle => (
            <button
              key={cycle}
              onClick={() => setActiveCycle(cycle)}
              style={{
                flex: 1, padding: '12px 0',
                borderRadius: '12px', fontSize: '14px', fontWeight: '500',
                transition: 'all 0.2s',
                background: activeCycle === cycle
                  ? 'linear-gradient(135deg, rgba(251,146,60,0.25), rgba(251,146,60,0.1))'
                  : 'rgba(255,255,255,0.04)',
                border: activeCycle === cycle
                  ? '1px solid rgba(251,146,60,0.4)'
                  : '1px solid rgba(255,255,255,0.08)',
                color: activeCycle === cycle ? '#fb923c' : '#555',
              }}
            >
              {cycle}
            </button>
          ))}
        </div>
      </div>

      {/* Branch Selector */}
      <div style={{ padding: '0 20px 16px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '11px', color: '#555', fontWeight: '600', letterSpacing: '0.08em', marginBottom: '10px' }}>
          BRANCH
        </div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {branches.map(branch => (
            <button
              key={branch.id}
              onClick={() => setActiveBranch(branch)}
              style={{
                flexShrink: 0,
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s',
                background: activeBranch?.id === branch.id
                  ? 'rgba(251,146,60,0.15)'
                  : 'rgba(255,255,255,0.04)',
                border: activeBranch?.id === branch.id
                  ? '1px solid rgba(251,146,60,0.4)'
                  : '1px solid rgba(255,255,255,0.08)',
                color: activeBranch?.id === branch.id ? '#fb923c' : '#555',
              }}
            >
              {branch.name}
            </button>
          ))}
        </div>
      </div>

      {/* Subjects */}
      <div style={{ padding: '0 20px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '11px', color: '#555', fontWeight: '600', letterSpacing: '0.08em', marginBottom: '12px' }}>
          SUBJECTS
        </div>

        {loading ? (
          <div style={{ color: '#444', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
            Loading...
          </div>
        ) : subjects.length === 0 ? (
          <div style={{
            color: '#444', fontSize: '14px', textAlign: 'center',
            padding: '40px 20px', lineHeight: '1.6'
          }}>
            No subjects found for {activeBranch?.name} in {activeCycle} yet.{'\n'}
            Check back soon! 🚧
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {subjects.map(subject => (
              <button
                key={subject.id}
                onClick={() => navigate(`/notes/${subject.id}`, { state: { subject } })}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <div style={{
                  width: '42px', height: '42px', borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', flexShrink: 0,
                  background: 'rgba(251,146,60,0.12)',
                  border: '1px solid rgba(251,146,60,0.2)'
                }}>
                  {icons[subject.name] || '📚'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#e5e5e5', marginBottom: '3px' }}>
                    {subject.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#555' }}>
                    {subject.code || 'First Year'}
                  </div>
                </div>
                <div style={{ color: '#444', fontSize: '20px' }}>›</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Tab Bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '430px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '12px 0 24px',
        display: 'flex', justifyContent: 'space-around',
        background: 'rgba(10,10,10,0.9)',
        backdropFilter: 'blur(20px)',
        zIndex: 10
      }}>
        {[
          { label: 'Notes', icon: '📚', active: true },
          { label: 'Saved', icon: '📥', active: false },
          { label: 'Profile', icon: '👤', active: false },
        ].map(tab => (
          <button
            key={tab.label}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '4px',
              background: 'transparent',
              color: tab.active ? '#fb923c' : '#444',
              fontSize: '10px', fontWeight: '500'
            }}
          >
            <span style={{ fontSize: '20px' }}>{tab.icon}</span>
            {tab.label}
            {tab.active && (
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#fb923c' }} />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}