import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CTABanner from '../components/CTABanner'
import SEOHead from '../components/SEOHead'
import AdSenseAd from '../components/AdSenseAd'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { fallbackScholarships, scholarshipSlug, slugify, resolveApplyUrl } from '../lib/listings'
import { CalendarDays, ArrowRight, Loader2, ShieldCheck, ExternalLink, Globe, Award } from 'lucide-react'

// Emoji flags for country filter tabs (case-insensitive lookup)
const COUNTRY_FLAGS = {
    'rwanda': '🇷🇼', 'burundi': '🇧🇮', 'uganda': '🇺🇬', 'kenya': '🇰🇪', 'tanzania': '🇹🇿',
    'united kingdom': '🇬🇧', 'uk': '🇬🇧', 'united states': '🇺🇸', 'usa': '🇺🇸', 'canada': '🇨🇦',
    'germany': '🇩🇪', 'australia': '🇦🇺', 'france': '🇫🇷', 'netherlands': '🇳🇱', 'poland': '🇵🇱',
    'japan': '🇯🇵', 'switzerland': '🇨🇭', 'united arab emirates': '🇦🇪', 'uae': '🇦🇪',
    'european union': '🇪🇺', 'china': '🇨🇳', 'norway': '🇳🇴', 'qatar': '🇶🇦', 'oman': '🇴🇲',
    'india': '🇮🇳', 'nigeria': '🇳🇬', 'south africa': '🇿🇦', 'ghana': '🇬🇭', 'egypt': '🇪🇬',
}
const flagFor = (country) => COUNTRY_FLAGS[String(country || '').toLowerCase().trim()] || '🌍'

export default function Scholarships() {
    const [scholarships, setScholarships] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams()
    const [activeTab, setActiveTab] = useState(() => searchParams.get('country') || 'All')

    useEffect(() => {
        if (!db) { setLoading(false); return }
        // Query all scholarship services — filter active client-side so both `active: true`
        // and documents without the active field (older records) are included.
        const q = query(collection(db, 'services'), where('type', '==', 'scholarship'))
        const unsub = onSnapshot(q, (snap) => {
            const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
            // Exclude only if explicitly set to false
            const data = all.filter(s => s.active !== false)
            setScholarships(data.length ? data : fallbackScholarships)
            setLoading(false)
        }, () => { setScholarships(fallbackScholarships); setLoading(false) })
        return unsub
    }, [])

    const display = useMemo(() => {
        const raw = loading ? fallbackScholarships : scholarships
        const STOP = new Set(['program', 'programme', 'scholarship', 'scholarships', 'the', 'of', 'for', 'and', 'a', 'an'])
        const dupKey = (s) => slugify(s.title || s.name || '').split('-').filter(t => t && !STOP.has(t)).join(' ')
        const COUNTRY_ALIASES = {
            usa: 'us', 'u.s.a.': 'us', 'u.s.': 'us', 'united states': 'us', 'united states of america': 'us', america: 'us',
            uk: 'uk', 'united kingdom': 'uk', england: 'uk', britain: 'uk', 'great britain': 'uk',
            uae: 'ae', 'united arab emirates': 'ae',
        }
        const sameCountry = (a, b) => {
            const norm = (v) => {
                const c = String(v || '').toLowerCase().trim()
                return COUNTRY_ALIASES[c] || c
            }
            const ca = norm(a?.country)
            const cb = norm(b?.country)
            return !ca || !cb || ca === cb
        }
        const isDuplicate = (a, b) => {
            if (!a || !b) return false
            if (!sameCountry(a, b)) return false
            if (a === b) return true
            const [short, long] = a.length <= b.length ? [a, b] : [b, a]
            return short.length >= 8 && long.startsWith(short)
        }

        const kept = []
        const keptKeys = []
        for (const s of raw) {
            const key = dupKey(s)
            if (key && keptKeys.some(k => isDuplicate(k, key))) continue
            if (key) keptKeys.push(key)
            kept.push(s)
        }

        if (kept.length < raw.length) {
            for (const f of fallbackScholarships) {
                if (kept.length >= raw.length) break
                const key = dupKey(f)
                if (key && keptKeys.some(k => isDuplicate(k, key))) continue
                if (kept.some(s => (s.id && f.id && s.id === f.id))) continue
                if (key) keptKeys.push(key)
                kept.push(f)
            }
        }
        return kept
    }, [loading, scholarships])

    // Country tabs derived from the data: All + Rwanda first, then the rest A–Z
    const countryTabs = useMemo(() => {
        const seen = new Map()
        for (const s of display) {
            const raw = String(s.country || '').trim()
            if (!raw) continue
            const key = raw.toLowerCase()
            if (!seen.has(key)) seen.set(key, raw)
        }
        const names = [...seen.values()]
        const rwanda = names.filter(n => n.toLowerCase() === 'rwanda')
        const others = names.filter(n => n.toLowerCase() !== 'rwanda').sort((a, b) => a.localeCompare(b))
        return ['All', ...rwanda, ...others]
    }, [display])

    // Keep tab in sync with URL (deep links like /scholarships?country=Rwanda)
    useEffect(() => {
        const urlCountry = searchParams.get('country')
        if (urlCountry) {
            const match = countryTabs.find(c => c.toLowerCase() === urlCountry.toLowerCase())
            setActiveTab(match || 'All')
        } else {
            setActiveTab('All')
        }
    }, [searchParams, countryTabs])

    const selectTab = (name) => {
        setActiveTab(name)
        if (name === 'All') setSearchParams({}, { replace: true })
        else setSearchParams({ country: name }, { replace: true })
    }

    const filtered = useMemo(() => {
        const keyword = (searchParams.get('program') || '').trim().toLowerCase()
        let list = display
        if (activeTab !== 'All') {
            const q = activeTab.toLowerCase()
            list = list.filter(s => String(s.country || '').toLowerCase().includes(q))
        }
        if (keyword) {
            const words = keyword.split(/[^a-z0-9]+/).filter(w => w.length > 2)
            list = list.filter(s => {
                const haystack = [s.title, s.name, s.country, s.description, s.desc, s.sourceName, s.amount]
                    .filter(Boolean).join(' ').toLowerCase()
                return words.length === 0 || words.some(w => haystack.includes(w))
            })
        }
        return list
    }, [display, activeTab, searchParams])

    return (
        <main>
            <SEOHead
                title="Scholarships 2026 for African Students — Apply Now | Travelium Global"
                description="Discover fully funded scholarships for students in Rwanda, East Africa & worldwide. Chevening, Fulbright, DAAD, Commonwealth & more — Travelium Global helps you apply and win."
                canonical="/scholarships"
            />
            <div className="page-hero">
                <div className="page-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1600&auto=format&fit=crop)' }} />
                <div className="container page-hero-content">
                    <div className="breadcrumb">
                        <Link to="/">Home</Link><span className="sep">›</span><span>Scholarships</span>
                    </div>
                    <h1>Scholarships & Funding</h1>
                    <p>Discover scholarships that can fund your global education. We help you find the right opportunity and prepare a winning application.</p>
                </div>
            </div>

            <section className="content-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">Available Scholarships</div>
                        <h2 className="section-title">Find Your Scholarship</h2>
                        <p className="section-sub">Browse top scholarships available for international students across the globe.</p>
                    </div>

                    {/* Country filter tabs — same styling as the Jobs page */}
                    {countryTabs.length > 1 && (
                        <div className="country-tabs-wrapper">
                            <div className="country-tabs-header">
                                <Globe size={18} /> Filter by Country:
                            </div>
                            <div className="country-tabs-scroll">
                                {countryTabs.map((name) => (
                                    <button
                                        key={name}
                                        className={`country-tab-btn ${activeTab === name ? 'active' : ''}`}
                                        onClick={() => selectTab(name)}
                                    >
                                        <span className="c-code">{name === 'All' ? '🌍' : flagFor(name)}</span>
                                        <span className="c-name">{name === 'All' ? 'All Countries' : name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {searchParams.get('program') && (
                        <div className="filter-notice">
                            <Award size={16} />
                            Showing funding matched to <strong>{searchParams.get('program')}</strong>
                            <Link to={`/scholarships${activeTab !== 'All' ? `?country=${encodeURIComponent(activeTab)}` : ''}`} className="filter-notice-clear">
                                Clear
                            </Link>
                        </div>
                    )}

                    {loading && <div className="admin-loading"><Loader2 size={24} className="animate-spin" /><p>Loading scholarships...</p></div>}                    {!loading && filtered.length === 0 && (
                        <p style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-light)' }}>
                            No scholarships match {activeTab !== 'All' ? activeTab : 'your filter'} yet — check back soon
                            {searchParams.get('program') && (
                                <> or <Link to="/scholarships" style={{ fontWeight: 700, textDecoration: 'underline' }}>clear the field filter</Link></>
                            )}.
                        </p>
                    )}
                    <div className="scholarships-grid">
                        {filtered.map(s => {
                            const amount = s.amount || (s.price ? `$${s.price.toLocaleString()}` : 'Contact us')
                            const displayTitle = s.title || s.name || 'Scholarship'
                            const detailPath = `/scholarships/${scholarshipSlug(s)}`
                            return (
                                <div key={s.id || displayTitle} className="scholarship-card">
                                    <div className={`scholarship-amount${amount === 'Full Fund' ? ' full-fund' : ''}`}>{amount}</div>
                                    <div className="scholarship-body">
                                        <h3><Link to={detailPath} className="scholarship-title-link">{displayTitle}</Link></h3>
                                        {s.country && <div className="scholarship-country">
                                            {s.flag && <img src={s.flag} alt={s.country} />}
                                            {s.country}
                                        </div>}
                                        <p>{s.description || s.desc || ''}</p>
                                        <div className="scholarship-footer">
                                            {s.deadline && <span className="scholarship-deadline">
                                                <CalendarDays size={14} />
                                                Deadline: <strong>{s.deadline}</strong>
                                            </span>}
                                            <Link to={detailPath} className="btn btn-navy scholarship-apply-btn">
                                                View &amp; Apply <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                        {resolveApplyUrl(s) && (
                                            <div className="scholarship-source">
                                                <ShieldCheck size={12} />
                                                {s.sourceName ? `${s.sourceName} — ` : ''}
                                                <a href={resolveApplyUrl(s)} target="_blank" rel="noopener noreferrer">Apply on official site <ExternalLink size={11} /></a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ── AdSense Banner Ad ── */}
            <AdSenseAd adSlot="5348613920" adFormat="auto" style={{ margin: '0 auto', maxWidth: '1200px', padding: '8px 20px' }} />

            <CTABanner />
        </main>
    )
}
