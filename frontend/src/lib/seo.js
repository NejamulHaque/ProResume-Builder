import { useEffect } from 'react'

/**
 * useSeo — Dynamically updates page title, description, and canonical URL
 */
export function useSeo({ title, description, canonical }) {
  useEffect(() => {
    const fullTitle = !title || title === 'ProResume Builder' 
      ? 'ProResume Builder' 
      : `${title} - ProResume Builder`
    
    document.title = fullTitle

    let metaTitle = document.querySelector('meta[name="title"]')
    if (metaTitle) metaTitle.setAttribute('content', fullTitle)

    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', fullTitle)

    let twTitle = document.querySelector('meta[name="twitter:title"]')
    if (twTitle) twTitle.setAttribute('content', fullTitle)

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]')
      if (!metaDesc) {
        metaDesc = document.createElement('meta')
        metaDesc.setAttribute('name', 'description')
        document.head.appendChild(metaDesc)
      }
      metaDesc.setAttribute('content', description)
    }

    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]')
      if (!linkCanonical) {
        linkCanonical = document.createElement('link')
        linkCanonical.setAttribute('rel', 'canonical')
        document.head.appendChild(linkCanonical)
      }
      linkCanonical.setAttribute('href', canonical)
    }
  }, [title, description, canonical])
}
