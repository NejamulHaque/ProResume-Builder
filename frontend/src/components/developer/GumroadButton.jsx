/**
 * GumroadButton — links to the developer's Gumroad product page.
 * Renders a styled CTA with the Gumroad brand colours.
 */
export default function GumroadButton({
  href  = 'https://gumroad.com',
  label = 'Buy Premium Templates',
  sub   = 'on Gumroad',
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 7,
        padding: '16px 14px',
        borderRadius: 12,
        background: 'linear-gradient(135deg, rgba(255,144,104,0.16), rgba(255,82,82,0.10))',
        border: '1px solid rgba(255,144,104,0.28)',
        color: '#ff9068',
        textDecoration: 'none',
        transition: 'all 0.18s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Gumroad-style icon */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
      </svg>
      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.01em' }}>{label}</span>
      <span style={{ fontSize: 10.5, opacity: 0.75 }}>{sub}</span>
    </a>
  )
}
