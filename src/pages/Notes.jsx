import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Preferences } from '@capacitor/preferences'

export default function Notes() {
  const { subjectId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const subject = state?.subject

  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [savedNotes, setSavedNotes] = useState({})
  const [downloading, setDownloading] = useState({})

  useEffect(() => {
    fetchNotes()
    loadSavedNotes()
  }, [])

  const fetchNotes = async () => {
    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('subject_id', subjectId)
      .order('uploaded_at', { ascending: false })
    if (data) setNotes(data)
    setLoading(false)
  }

  const loadSavedNotes = async () => {
    const { value } = await Preferences.get({ key: 'savedNotes' })
    if (value) setSavedNotes(JSON.parse(value))
  }

  const getPublicUrl = (filePath) => {
    const { data } = supabase.storage.from('notes').getPublicUrl(filePath)
    return data.publicUrl
  }

  const downloadNote = async (note) => {
    setDownloading(prev => ({ ...prev, [note.id]: true }))
    try {
      const url = getPublicUrl(note.file_url)
      const response = await fetch(url)
      const blob = await response.blob()
      const base64 = await blobToBase64(blob)

      await Filesystem.writeFile({
        path: `stackd/${note.id}.pdf`,
        data: base64,
        directory: Directory.Documents,
        recursive: true
      })

      const newSaved = { 
        ...savedNotes, 
        [note.id]: { ...note, localPath: `stackd/${note.id}.pdf` } 
      }
      setSavedNotes(newSaved)
      await Preferences.set({ key: 'savedNotes', value: JSON.stringify(newSaved) })
    } catch (err) {
      console.error('Download failed:', err)
    }
    setDownloading(prev => ({ ...prev, [note.id]: false }))
  }

  const blobToBase64 = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })

  const openNote = (note) => {
    const isDownloaded = savedNotes[note.id]
    const url = getPublicUrl(note.file_url)
    navigate('/pdf', {
      state: {
        note,
        isOffline: !!isDownloaded,
        localPath: isDownloaded?.localPath,
        url
      }
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{
        padding: '52px 20px 20px',
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'transparent', color: '#fb923c', fontSize: '14px', marginBottom: '12px', padding: 0 }}
        >
          ← Back
        </button>
        <div style={{ fontSize: '20px', fontWeight: '600', color: '#fff' }}>
          {subject?.name || 'Notes'}
        </div>
        <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>
          {subject?.code || 'First Year'}
        </div>
      </div>

      {/* Notes List */}
      <div style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ color: '#444', textAlign: 'center', padding: '40px 0' }}>Loading notes...</div>
        ) : notes.length === 0 ? (
          <div style={{ color: '#444', textAlign: 'center', padding: '40px 0' }}>No notes uploaded yet</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notes.map(note => {
              const isDownloaded = !!savedNotes[note.id]
              const isDownloadingNow = downloading[note.id]
              return (
                <div
                  key={note.id}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '10px',
                    background: 'rgba(251,146,60,0.12)',
                    border: '1px solid rgba(251,146,60,0.2)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '20px', flexShrink: 0
                  }}>
                    📄
                  </div>

                  <div style={{ flex: 1 }} onClick={() => openNote(note)}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#e5e5e5', marginBottom: '3px' }}>
                      {note.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#555', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {isDownloaded && (
                        <span style={{
                          background: 'rgba(251,146,60,0.15)',
                          color: '#fb923c',
                          padding: '2px 7px',
                          borderRadius: '6px',
                          fontSize: '9px',
                          fontWeight: '600'
                        }}>
                          SAVED
                        </span>
                      )}
                      <span>Tap to open</span>
                    </div>
                  </div>

                  <button
                    onClick={() => isDownloaded ? openNote(note) : downloadNote(note)}
                    style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: isDownloaded ? 'rgba(251,146,60,0.15)' : 'rgba(255,255,255,0.06)',
                      border: isDownloaded ? '1px solid rgba(251,146,60,0.3)' : '1px solid rgba(255,255,255,0.1)',
                      color: isDownloaded ? '#fb923c' : '#666',
                      fontSize: '16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    {isDownloadingNow ? '⏳' : isDownloaded ? '✓' : '↓'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}