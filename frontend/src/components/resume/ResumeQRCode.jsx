import React from 'react'

/**
 * ResumeQRCode — High-contrast, recruiter-ready scannable QR Code
 * Renders an inline SVG QR code linking to the candidate's portfolio/GitHub.
 */
export default function ResumeQRCode({ url, size = 64, color = '#1a1a2e' }) {
  if (!url) return null
  const encoded = encodeURIComponent(url)
  // Use high-availability vector QR endpoint or encoded SVG
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=${size * 2}x${size * 2}&data=${encoded}&margin=0&color=${color.replace('#', '')}&bgcolor=ffffff`

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#fff',
        padding: 4,
        borderRadius: 6,
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        border: '1px solid rgba(0,0,0,0.1)',
        width: size + 8,
        height: size + 8,
        flexShrink: 0
      }}
      title={`Scan to view portfolio: ${url}`}
    >
      <img
        src={qrSrc}
        alt={`QR Code for ${url}`}
        width={size}
        height={size}
        style={{ display: 'block', imageRendering: 'pixelated' }}
        loading="lazy"
      />
    </div>
  )
}
