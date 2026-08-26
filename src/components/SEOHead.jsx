import { useEffect } from 'react'

/**
 * SEOHead — sets per-page document title, meta description & canonical URL.
 * Usage:  <SEOHead title="..." description="..." canonical="/path" />
 */
export default function SEOHead({ title, description, canonical }) {
    useEffect(() => {
        // Title
        if (title) document.title = title

        // Description
        let desc = document.querySelector('meta[name="description"]')
        if (desc && description) desc.setAttribute('content', description)

        // Canonical
        let can = document.querySelector('link[rel="canonical"]')
        if (can && canonical) can.setAttribute('href', `https://www.traveliumglobal.com${canonical}`)

        // OG title + description
        const ogTitle = document.querySelector('meta[property="og:title"]')
        const ogDesc = document.querySelector('meta[property="og:description"]')
        const ogUrl = document.querySelector('meta[property="og:url"]')
        if (ogTitle && title) ogTitle.setAttribute('content', title)
        if (ogDesc && description) ogDesc.setAttribute('content', description)
        if (ogUrl && canonical) ogUrl.setAttribute('content', `https://www.traveliumglobal.com${canonical}`)

        // Twitter title + description
        const twTitle = document.querySelector('meta[name="twitter:title"]')
        const twDesc = document.querySelector('meta[name="twitter:description"]')
        if (twTitle && title) twTitle.setAttribute('content', title)
        if (twDesc && description) twDesc.setAttribute('content', description)

        // Cleanup: restore defaults when unmounting
        return () => {
            document.title = 'Travelium Global | International Travel Agency — Study Abroad, Work Visas & Global Jobs'
            if (can) can.setAttribute('href', 'https://www.traveliumglobal.com/')
        }
    }, [title, description, canonical])

    return null
}
