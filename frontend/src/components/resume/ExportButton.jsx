import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { api } from '../../lib/api.js'

export default function ExportButton({ title = 'resume' }) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async (e) => {
    // If Shift is pressed or if user selects server PDF
    const el = document.getElementById('resume-print-target')
    if (!el) {
      toast.error('Preview target not found')
      return
    }

    // Try server-side Chromium PDF rendering first
    setExporting(true)
    const toastId = toast.loading('Generating vector PDF via Chromium…')

    try {
      const sanitizedTitle = (title || 'resume').replace(/[^a-zA-Z0-9_-]/g, '_')
      const blob = await api.resumes.renderPdf({
        title: sanitizedTitle,
        html: el.innerHTML
      })

      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `${sanitizedTitle}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(blobUrl)
      a.remove()

      toast.success('Vector PDF downloaded successfully!', { id: toastId, icon: '📄' })
    } catch (err) {
      // Graceful fallback to client-side native print
      toast.dismiss(toastId)
      toast.success(
        'Opening browser print dialog…\nTip: Select "Save as PDF" & check "Background graphics"',
        { duration: 6000, icon: '📄' }
      )
      window.print()
    } finally {
      setExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      data-export-btn="true"
      className="btn btn-secondary btn-sm"
      title="Download high-DPI vector PDF (Puppeteer Chromium / Native Print)"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      {exporting ? 'Rendering…' : 'PDF'}
    </button>
  )
}
