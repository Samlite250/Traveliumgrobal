import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CTABanner from '../components/CTABanner'
import SEOHead from '../components/SEOHead'
import AdSenseAd from '../components/AdSenseAd'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { fallbackScholarships, scholarshipSlug } from '../lib/listings'
import { CalendarDays, ArrowRight, Loader2, ShieldCheck, ExternalLink } from 'lucide-react'

export default function Scholarships() {
    const [scholarships, setScholarships] = useState([])
    const [loading, setLoading] = useState(true)

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

    const display = loading ? fallbackScholarships : scholarships

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
                    {loading && <div className="admin-loading"><Loader2 size={24} className="animate-spin" /><p>Loading scholarships...</p></div>}
                    <div className="scholarships-grid">
                        {display.map(s => {
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
                                        {(s.sourceUrl || s.applyUrl) && (
                                            <div className="scholarship-source">
                                                <ShieldCheck size={12} />
                                                {s.sourceName ? `${s.sourceName} — ` : ''}
                                                <a href={s.sourceUrl || s.applyUrl} target="_blank" rel="noopener noreferrer">Official program page <ExternalLink size={11} /></a>
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
