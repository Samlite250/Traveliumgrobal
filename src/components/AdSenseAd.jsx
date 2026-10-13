import { useEffect, useRef } from 'react'

/**
 * AdSenseAd — Reusable Google AdSense ad unit component.
 *
 * Props:
 *  adSlot    – The ad unit slot ID from AdSense (e.g. "1234567890")
 *  adFormat  – "auto" (responsive banner) | "rectangle" | "horizontal" (default: "auto")
 *  fullWidth – if true, sets data-full-width-responsive="true" (default: true)
 *  style     – extra inline styles for the outer wrapper
 */
export default function AdSenseAd({
    adSlot,
    adFormat = 'auto',
    fullWidth = true,
    style = {}
}) {
    const insRef = useRef(null)
    const pushed = useRef(false)

    useEffect(() => {
        if (pushed.current) return
        try {
            if (insRef.current && insRef.current.offsetWidth > 0) {
                ;(window.adsbygoogle = window.adsbygoogle || []).push({})
                pushed.current = true
            }
        } catch (e) {
            console.warn('AdSense push error:', e)
        }
    }, [])

    return (
        <div className="adsense-wrapper" style={style}>
            <ins
                ref={insRef}
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-3075988056435842"
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidth ? 'true' : 'false'}
            />
        </div>
    )
}
