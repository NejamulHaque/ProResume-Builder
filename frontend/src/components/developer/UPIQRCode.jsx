import { useEffect, useRef, useState } from 'react'

/**
 * Renders a UPI payment QR code using the qrcodejs CDN library.
 * The QR encodes a upi:// deep-link that opens any UPI app.
 */
export default function UPIQRCode({ upiId = 'developer@upi', name = 'Developer', amount = '' }) {
  const containerRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const upiUrl = [
      `upi://pay`,
      `?pa=${encodeURIComponent(upiId)}`,
      `&pn=${encodeURIComponent(name)}`,
      amount ? `&am=${amount}` : '',
      `&cu=INR`,
      `&tn=${encodeURIComponent('Support ProResume Developer')}`,
    ].join('')

    const generate = () => {
      if (!containerRef.current) return
      containerRef.current.innerHTML = ''
      // eslint-disable-next-line no-new
      new window.QRCode(containerRef.current, {
        text:         upiUrl,
        width:        164,
        height:       164,
        colorDark:    '#7c6fff',
        colorLight:   '#14141e',
        correctLevel: window.QRCode.CorrectLevel.H,
      })
      setLoaded(true)
    }

    if (window.QRCode) {
      generate()
    } else {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
      script.onload  = generate
      script.onerror = () => console.warn('[UPIQRCode] Failed to load qrcodejs')
      document.head.appendChild(script)
    }
  }, [upiId, name, amount])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      {/* QR canvas container */}
      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: 14,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      }}>
        {!loaded && (
          <div style={{
            width: 164, height: 164,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-card)', borderRadius: 8,
          }}>
            <div className="spinner" />
          </div>
        )}
        <div
          ref={containerRef}
          style={{
            borderRadius: 8, overflow: 'hidden',
            display: loaded ? 'block' : 'none',
          }}
        />
        <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
          Scan with PhonePe · GPay · Paytm · BHIM
        </div>
      </div>

      {/* UPI ID chip */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 7,
        padding: '5px 13px',
        fontFamily: 'var(--font-mono)',
        fontSize: 12, color: 'var(--accent)',
        letterSpacing: '0.02em',
      }}>
        {upiId}
      </div>
    </div>
  )
}
