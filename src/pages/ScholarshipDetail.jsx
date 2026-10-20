import { useState, useEffect, useMemo } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import {
    fallbackScholarships,
    scholarshipSlug,
    buildScholarshipArticle,
    openOfficial,
    isVerifiedListing,
} from '../lib/listings'
import SEOHead from '../components/SEOHead'
import JsonLd from '../components/JsonLd'
import LeadCapture from '../components/LeadCapture'
import AdSenseAd from '../components/AdSenseAd'
import CTABanner from '../components/CTABanner'
import LoadingScreen from '../components/LoadingScreen'
import {
    CalendarDays, ArrowRight, ArrowUpRight, ShieldCheck,
    CheckCircle, ChevronDown, GraduationCap, MapPin,
} from 'lucide-react'

const SITE = 'https://www.traveliumglobal.com'

const hostOf = (url) => {
    try { return new URL(url).hostname.replace(/^www\./, '') } catch { return 'the official site' }
}

const isoDeadline = (value) => {
    if (!value) return undefined
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10)
}

export default function ScholarshipDetail() {
    const { slug } = useParams()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!db) { setItems(fallbackScholarships); setLoading(false); return }
        const q = query(collection(db, 'services'), where('type', '==', 'scholarship'))
        const unsub = onSnapshot(q, (snap) => {
            const all = snap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .filter(s => s.active !== false && (!s.auto || isVerifiedListing(s)))
            setItems(all.length ? all : fallbackScholarships)
            setLoading(false)
        }, () => { setItems(fallbackScholarships); setLoading(false) })
        return unsub
    }, [])

    const s = useMemo(() => items.find(x => scholarshipSlug(x) === slug), [items, slug])
    const sections = useMemo(() => (s ? buildScholarshipArticle(s) : []), [s])

    if (!s) return loading ? <LoadingScreen /> : <Navigate to="/scholarships" replace />

    const title = s.title || s.name || 'Scholarship'
    const amount = s.amount || (s.price ? `$${s.price.toLocaleString()}` : 'Funding available')
    const officialUrl = s.sourceUrl || s.applyUrl || ''
    const canonicalPath = `/scholarships/${slug}`
    const seoDesc = `${amount !== 'Funding available' ? amount + ' — ' : ''}${title}${s.country ? ' in ' + s.country : ''}: eligibility, required documents, step-by-step application guide and the official apply link.${s.deadline ? ' Deadline ' + s.deadline + '.' : ''}`
    const faqSection = sections.find(x => x.faq)
    const related = items.filter(x => x !== s && scholarshipSlug(x) !== slug).slice(0, 3)

    const applyClick = (e) => {
        if (e) e.preventDefault()
        openOfficial({ type: 'scholarship', id: s.id || slug, title, url: officialUrl })
    }

    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
            { '@type': 'ListItem', position: 2, name: 'Scholarships', item: `${SITE}/scholarships` },
            { '@type': 'ListItem', position: 3, name: title, item: `${SITE}${canonicalPath}` },
        ],
    }

    const scholarshipLd = {
        '@context': 'https://schema.org',
        '@type': 'Scholarship',
        name: title,
        description: seoDesc,
        url: `${SITE}${canonicalPath}`,
        ...(isoDeadline(s.deadline) ? { deadline: isoDeadline(s.deadline) } : {}),
        ...(s.sourceName ? { provider: { '@type': 'Organization', name: s.sourceName } } : {}),
    }

    const faqLd = faqSection ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSection.faq.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    } : null

    return (
        <main>
            <SEOHead title={`${title}${s.country ? ' in ' + s.country : ''} — Scholarship Guide & Official Apply Link | Travelium Global`} description={seoDesc} canonical={canonicalPath} />
            <JsonLd data={scholarshipLd} />
            <JsonLd data={breadcrumbLd} />
            {faqLd && <JsonLd data={faqLd} />}

            <div className="page-hero">
                <div className="page-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1600&auto=format&fit=crop)' }} />
                <div className="container page-hero-content">
                    <div className="breadcrumb">
                        <Link to="/">Home</Link><span className="sep">›</span>
                        <Link to="/scholarships">Scholarships</Link><span className="sep">›</span>
                        <span>{title}</span>
                    </div>
                    <div className="listing-hero-badges">
                        {s.country && (
                            <span className="listing-badge">
                                {s.flag && <img src={s.flag} alt="" />}{s.country}
                            </span>
                        )}
                        <span className={`listing-badge gold${amount === 'Full Fund' ? ' full' : ''}`}>{amount}</span>
                        {s.deadline && (
                            <span className="listing-badge deadline"><CalendarDays size={13} /> Deadline {s.deadline}</span>
                        )}
                    </div>
                    <h1>{title}</h1>
                    <p>{s.description || s.desc || ''}</p>
                </div>
            </div>

            <section className="content-section listing-page">
                <div className="container">
                    <div className="listing-grid">
                        <div className="listing-main">
                            <div className="listing-chips" aria-label="Sections">
                                {sections.map(sec => (
                                    <a key={sec.id} href={`#${sec.id}`} className="listing-chip">{sec.label}</a>
                                ))}
                            </div>

                            {sections.map((sec, i) => (
                                <section key={sec.id} id={sec.id} className="listing-section">
                                    <h2>{sec.title}</h2>
                                    {sec.paragraphs?.map((p, idx) => <p key={idx}>{p}</p>)}
                                    {sec.list && (
                                        <ul className="listing-checks">
                                            {sec.list.map((li, idx) => (
                                                <li key={idx}><CheckCircle size={16} /><span>{li}</span></li>
                                            ))}
                                        </ul>
                                    )}
                                    {sec.steps && (
                                        <ol className="listing-steps">
                                            {sec.steps.map((st, idx) => (
                                                <li key={idx}><span className="step-badge">{idx + 1}</span><span>{st}</span></li>
                                            ))}
                                        </ol>
                                    )}
                                    {sec.note && <p className="listing-note">{sec.note}</p>}
                                    {sec.faq && (
                                        <div className="guide-faq">
                                            {sec.faq.map((f, idx) => (
                                                <details key={idx} className="guide-faq-item" open={idx === 0}>
                                                    <summary><span>{f.q}</span><ChevronDown size={16} /></summary>
                                                    <p>{f.a}</p>
                                                </details>
                                            ))}
                                        </div>
                                    )}
                                    {i === 1 && (
                                        <AdSenseAd adSlot="5348613920" adFormat="auto" style={{ margin: '1.5rem 0' }} />
                                    )}
                                </section>
                            ))}

                            <div className="listing-final-cta">
                                <div className="fc-copy">
                                    <span className="section-label">Ready to apply?</span>
                                    <h2>{title}</h2>
                                    <p>Applications are submitted on the official website{officialUrl ? ` (${hostOf(officialUrl)})` : ''}. Deadline: <strong>{s.deadline || 'see official page'}</strong>.</p>
                                </div>
                                {officialUrl ? (
                                    <a href={officialUrl} target="_blank" rel="noopener noreferrer" className="btn btn-navy fc-btn" onClick={applyClick}>
                                        Apply on Official Site <ArrowUpRight size={18} />
                                    </a>
                                ) : (
                                    <Link to="/apply" className="btn btn-navy fc-btn">
                                        Apply through Travelium <ArrowRight size={18} />
                                    </Link>
                                )}
                            </div>
                        </div>

                        <aside className="listing-aside">
                            <div className="listing-apply-card">
                                <div className="ac-head"><GraduationCap size={18} /> At a glance</div>
                                <div className="ac-row"><span>Value</span><strong>{amount}</strong></div>
                                {s.country && <div className="ac-row"><span>Destination</span><strong><MapPin size={13} /> {s.country}</strong></div>}
                                <div className="ac-row"><span>Deadline</span><strong><CalendarDays size={13} /> {s.deadline || 'TBA'}</strong></div>
                                <div className="ac-row"><span>Level</span><strong>Bachelor's / Master's / PhD</strong></div>
                                {officialUrl && (
                                    <div className="ac-source"><ShieldCheck size={13} /> Official site: {s.sourceName || hostOf(officialUrl)}</div>
                                )}
                                {officialUrl ? (
                                    <a href={officialUrl} target="_blank" rel="noopener noreferrer" className="btn btn-navy btn-block" onClick={applyClick}>
                                        Apply on Official Site <ArrowUpRight size={16} />
                                    </a>
                                ) : (
                                    <Link to="/apply" className="btn btn-navy btn-block">
                                        Apply through Travelium <ArrowRight size={16} />
                                    </Link>
                                )}
                                <small className="ac-note">Free access — you never pay to reach an official application link.</small>
                            </div>

                            <LeadCapture source="scholarship" slug={slug} title={title} />

                            {related.length > 0 && (
                                <div className="listing-related">
                                    <h4>More scholarships</h4>
                                    {related.map(r => (
                                        <Link key={r.id || scholarshipSlug(r)} to={`/scholarships/${scholarshipSlug(r)}`} className="related-item">
                                            <span className="ri-amount">{r.amount || (r.price ? `$${r.price.toLocaleString()}` : 'Funding')}</span>
                                            <span className="ri-title">{r.title || r.name}</span>
                                            <ArrowRight size={14} />
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </section>

            <AdSenseAd adSlot="5348613920" adFormat="auto" style={{ margin: '0 auto', maxWidth: '1200px', padding: '8px 20px' }} />
            <CTABanner />
        </main>
    )
}
