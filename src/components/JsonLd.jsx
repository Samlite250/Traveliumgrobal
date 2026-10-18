import { useEffect } from 'react'

/**
 * JsonLd — injects a schema.org JSON-LD script into <head> for SEO rich results.
 * Usage: <JsonLd data={{ '@context': 'https://schema.org', '@type': 'JobPosting', ... }} />
 */
export default function JsonLd({ data }) {
    const serialized = data ? JSON.stringify(data) : ''
    useEffect(() => {
        if (!serialized) return undefined
        try {
            const el = document.createElement('script')
            el.type = 'application/ld+json'
            el.setAttribute('data-listing-jsonld', 'true')
            el.textContent = serialized
            document.head.appendChild(el)
            return () => { try { el.remove() } catch { } }
        } catch {
            return undefined
        }
    }, [serialized])
    return null
}
