import { useLocation, useNavigate } from 'react-router-dom'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { useEffect, useState } from 'react'

export default function PDFViewer() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [pdfSrc, setPdfSrc] = useState(null)

  useEffect(() => {
    loadPDF()
  }, [])

  const loadPDF = async () => {
    if (state?.isOffline && state?.localPath) {
      try {
        const result = await Filesystem.readFile({
          path: state.localPath,
          directory: Directory.Documents
        })
        setPdfSrc(`data:application/pdf;base64,${result.data}`)
      } catch {
        setPdfSrc(state.url)
      }
    } else {
      setPdfSrc(state?.url)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '52px 20px 16px',
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'transparent', color: '#fb923c', fontSize: '14px', padding: 0 }}
        >
          ← Back
        </button>
        <div style={{ fontSize: '15px', fontWeight: '500', color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {state?.note?.title || 'PDF Viewer'}
        </div>
        {state?.isOffline && (
          <span style={{
            background: 'rgba(251,146,60,0.15)', color: '#fb923c',
            padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600'
          }}>
            OFFLINE
          </span>
        )}
      </div>

      {/* PDF */}
      <div style={{ flex: 1 }}>
        {pdfSrc ? (
          <iframe
            src={pdfSrc}
            style={{ width: '100%', height: 'calc(100vh - 90px)', border: 'none' }}
            title="PDF Viewer"
          />
        ) : (
          <div style={{ color: '#444', textAlign: 'center', padding: '80px 20px' }}>
            Loading PDF...
          </div>
        )}
      </div>
    </div>
  )
}