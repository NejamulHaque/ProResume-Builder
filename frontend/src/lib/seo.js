import { useEffect } from 'react'

/**
 * useSeo — Dynamically updates page title, description, and canonical URL
 */
export function useSeo({ title, description, canonical }) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | ProResume Builder`
    }

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
