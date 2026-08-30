import { toast } from 'react-hot-toast'

export default function ExportButton({ title = 'resume' }) {
  const handleExport = () => {
    const el = document.getElementById('resume-print-target')
    if (!el) {
      toast.error('Preview not available')
      return
    }

    // NATIVE PRINT ENGINE (The Industry Standard Fix for Blank PDFs)
    // This uses the browser's native renderer which is 100% reliable.
    toast.success(
      'Opening print dialog...\n1. Select "Save as PDF"\n2. Important: Check "Background graphics" for full color!',
      { duration: 8000, icon: '📄' }
    )

    window.print()
  }

  return (
    <button
      onClick={handleExport}
      data-export-btn="true"
      className="btn btn-secondary btn-sm"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      PDF
    </button>
  )
}