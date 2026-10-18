import { useState, useEffect, useMemo } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { JOBS_DATA, mergeLiveJobs } from './Jobs'
import { jobSlug, buildJobArticle, openOfficial } from '../lib/listings'
import SEOHead from '../components/SEOHead'
import JsonLd from '../components/JsonLd'
import LeadCapture from '../components/LeadCapture'
import AdSenseAd from '../components/AdSenseAd'
import CTABanner from '../components/CTABanner'
import LoadingScreen from '../components/LoadingScreen'
import { useToast } from '../context/ToastContext'
import {
    MapPin, Building2, DollarSign, Clock, ArrowRight, ArrowUpRight,
    ShieldCheck, CheckCircle, ChevronDown, Briefcase, Loader2, Send,
} from 'lucide-react'

const SITE = 'https://www.traveliumglobal.com'

const hostOf = (url) => {
    try { return new URL(url).hostname.replace(/^www\./, '') } catch { return 'the official site' }
}

export default function JobDetail() {
    const { slug } = useParams()
    const toast = useToast()
    const [allJobsData, setAllJobsData] = useState(JOBS_DATA)
    const [liveJobs, setLiveJobs] = useState([])
    const [loading, setLoading] = useState(true)

    const [form, setForm] = useState({ fullName: '', email: '', phone: '', experienceYears: '1-2 years', coverNote: '' })
    const [saving, setSaving] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        try {
            const saved = localStorage.getItem('travelium_jobs_config')
            if (saved) setAllJobsData(JSON.parse(saved))
        } catch { }

        if (!db) { setLoading(false); return }

        let unsubSettings = null
        try {
            unsubSettings = onSnapshot(doc(db, 'settings', 'jobs'), (snap) => {
                if (snap.exists() && snap.data()?.jobs) {
                    setAllJobsData(snap.data().jobs)
                    try { localStorage.setItem('travelium_jobs_config', JSON.stringify(snap.data().jobs)) } catch { }
                }
            }, () => { })
        } catch { }

        const q = query(collection(db, 'jobs'), where('status', '==', 'active'))
        const unsubJobs = onSnapshot(q, (snap) => {
            const now = Date.now()
            setLiveJobs(snap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .filter(j => {
                    if (!j.expires_at) return true
                    const exp = j.expires_at.toDate ? j.expires_at.toDate().getTime() : new Date(j.expires_at).getTime()
                    return !Number.isNaN(exp) && exp > now
                }))
            setLoading(false)
        }, () => setLoading(false))

        return () => { if (unsubSettings) unsubSettings(); unsubJobs() }
    }, [])

    const listings = useMemo(() => {
        const groups = mergeLiveJobs(Array.isArray(allJobsData) ? allJobsData : JOBS_DATA, Array.isArray(liveJobs) ? liveJobs : [])
        return groups.flatMap(g => [
            ...(g.highPayableJobs || []).map(j => ({ ...j, countryName: g.country, flag: g.flag, categoryLabel: 'High Payable Job' })),
            ...(g.partTimeJobs || []).map(j => ({ ...j, countryName: g.country, flag: g.flag, categoryLabel: 'Part-Time Job' })),
        ])
    }, [allJobsData, liveJobs])

    const job = useMemo(() => listings.find(j => jobSlug(j, j.countryName) === slug), [listings, slug])
    const sections = useMemo(() => (job ? buildJobArticle(job) : []), [job])

    if (!job) return loading ? <LoadingScreen /> : <Navigate to="/jobs" replace />

    const title = job.title || 'Job Opening'
    const company = job.company || 'Verified employer'
    const countryName = job.countryName || job.location || ''
    const officialUrl = job.applyUrl || job.sourceUrl || ''
    const canonicalPath = `/jobs/${slug}`
    const seoDesc = `${title} at ${company}${countryName ? ' — ' + countryName : ''}. ${job.salary || 'Competitive salary'}. Requirements, benefits, visa notes and how to apply. Travelium Global verified international job posting.`

    const applyClick = (e) => {
        if (e) e.preventDefault()
        openOfficial({ type: 'job', id: job.id || slug, title, url: officialUrl })
    }

    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
            { '@type': 'ListItem', position: 2, name: 'Jobs', item: `${SITE}/jobs` },
            { '@type': 'ListItem', position: 3, name: title, item: `${SITE}${canonicalPath}` },
        ],
    }

    const jobLd = {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title,
        description: seoDesc,
        url: `${SITE}${canonicalPath}`,
        employmentType: /part/i.test(job.type || '') ? 'PART_TIME' : 'FULL_TIME',
        hiringOrganization: { '@type': 'Organization', name: company },
        jobLocation: {
            '@type': 'Place',
            address: { '@type': 'PostalAddress', addressLocality: job.location || countryName, addressCountry: countryName },
        },
        directApply: !!officialUrl,
    }

    const faqSection = sections.find(x => x.faq)
    const faqLd = faqSection ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSection.faq.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    } : null

    const submitApplication = async (e) => {
        e.preventDefault()
        if (!form.fullName || !form.email || !form.phone) {
            toast('Please fill out all required fields', 'error')
            return
        }
        setSaving(true)
        const record = {
            applicant_name: form.fullName,
            name: form.fullName,
            email: form.email,
            phone: form.phone,
            service_type: 'work',
            service_title: `${title} (${countryName})`,
            jobId: job.id || slug,
            jobTitle: title,
            country: countryName,
            salary: job.salary || '',
            company,
            experienceYears: form.experienceYears || 'Entry Level',
            coverNote: form.coverNote || '',
            status: 'pending',
            created_at: new Date().toISOString(),
            created_at_str: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            applied_from: canonicalPath,
        }
        if (db) {
            try {
                await addDoc(collection(db, 'applications'), { ...record, created_at: serverTimestamp() })
            } catch (err) {
                console.error('Firestore application error:', err)
            }
        }
        try {
            const adminApps = JSON.parse(localStorage.getItem('travelium_applications_admin') || '[]')
            adminApps.unshift({ id: `job-${Date.now()}`, ...record })
            localStorage.setItem('travelium_applications_admin', JSON.stringify(adminApps))
            const jobApps = JSON.parse(localStorage.getItem('travelium_job_applications') || '[]')
            jobApps.unshift({ id: `job-${Date.now()}`, ...record })
            localStorage.setItem('travelium_job_applications', JSON.stringify(jobApps))
        } catch { }
        setSaving(false)
        setSubmitted(true)
        toast('Application submitted to central admin — our team will review and contact you.', 'success')
    }

    return (
        <main>
            <SEOHead title={`${title} ${countryName ? 'in ' + countryName : ''} — ${job.salary || 'Job'} | Travelium Global Jobs`} description={seoDesc} canonical={canonicalPath} />
            <JsonLd data={jobLd} />
            <JsonLd data={breadcrumbLd} />
            {faqLd && <JsonLd data={faqLd} />}

            <div className="page-hero">
                <div className="page-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop)' }} />
                <div className="container page-hero-content">
                    <div className="breadcrumb">
                        <Link to="/">Home</Link><span className="sep">›</span>
                        <Link to="/jobs">Jobs</Link><span className="sep">›</span>
                        <span>{title}</span>
                    </div>
                    <div className="listing-hero-badges">
                        <span className="listing-badge"><Briefcase size={13} /> {job.categoryLabel || 'International Job'}</span>
                        {countryName && <span className="listing-badge"><MapPin size={13} /> {countryName}</span>}
                        {job.salary && <span className="listing-badge gold"><DollarSign size={13} /> {job.salary}</span>}
                        {job.type && <span className="listing-badge"><Clock size={13} /> {job.type}</span>}
                    </div>
                    <h1>{title}</h1>
                    <p><strong>{company}</strong>{job.location ? ` — ${job.location}` : ''}</p>
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
                                    {sec.facts && (
                                        <div className="listing-facts">
                                            {sec.facts.map((f, idx) => (
                                                <div key={idx} className="lf-item"><span>{f.k}</span><strong>{f.v}</strong></div>
                                            ))}
                                        </div>
                                    )}
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

                            {!officialUrl && (
                                <div className="listing-internal-apply" id="apply-form">
                                    <span className="section-label">Apply through Travelium</span>
                                    <h2>Send your application</h2>
                                    <p>This role is handled by our recruitment desk — fill the form and we forward your profile to the employer.</p>
                                    {submitted ? (
                                        <div className="internal-applied">
                                            <CheckCircle size={22} />
                                            <div>
                                                <strong>Application received</strong>
                                                <p>Our officers will review your profile and contact you within 3–5 working days.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <form className="internal-apply-form" onSubmit={submitApplication}>
                                            <div className="iaf-row">
                                                <label>
                                                    Full name *
                                                    <input type="text" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="e.g. Aline Uwase" />
                                                </label>
                                                <label>
                                                    Email *
                                                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
                                                </label>
                                            </div>
                                            <div className="iaf-row">
                                                <label>
                                                    Phone / WhatsApp *
                                                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+250 ..." />
                                                </label>
                                                <label>
                                                    Experience
                                                    <select value={form.experienceYears} onChange={e => setForm({ ...form, experienceYears: e.target.value })}>
                                                        <option>Entry Level</option>
                                                        <option>1-2 years</option>
                                                        <option>3-5 years</option>
                                                        <option>5+ years</option>
                                                    </select>
                                                </label>
                                            </div>
                                            <label>
                                                Cover note
                                                <textarea rows={4} value={form.coverNote} onChange={e => setForm({ ...form, coverNote: e.target.value })} placeholder="Briefly tell us why you are a great fit..." />
                                            </label>
                                            <button type="submit" className="btn btn-navy" disabled={saving}>
                                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                                Submit application
                                            </button>
                                            <small className="iaf-note">Free service — we never charge candidates to apply.</small>
                                        </form>
                                    )}
                                </div>
                            )}

                            <div className="listing-final-cta">
                                <div className="fc-copy">
                                    <span className="section-label">Ready to apply?</span>
                                    <h2>{title}</h2>
                                    <p>{officialUrl
                                        ? <>Apply on the official posting ({hostOf(officialUrl)}). {job.salary ? <>Salary: <strong>{job.salary}</strong>.</> : null}</>
                                        : 'Apply directly through Travelium Global — our team handles the rest.'}
                                    </p>
                                </div>
                                {officialUrl ? (
                                    <a href={officialUrl} target="_blank" rel="noopener noreferrer" className="btn btn-navy fc-btn" onClick={applyClick}>
                                        Apply on Official Site <ArrowUpRight size={18} />
                                    </a>
                                ) : (
                                    <a href="#apply-form" className="btn btn-navy fc-btn">
                                        Apply through Travelium <ArrowRight size={18} />
                                    </a>
                                )}
                            </div>
                        </div>

                        <aside className="listing-aside">
                            <div className="listing-apply-card">
                                <div className="ac-head"><Briefcase size={18} /> Job snapshot</div>
                                <div className="ac-row"><span>Position</span><strong>{title}</strong></div>
                                <div className="ac-row"><span>Employer</span><strong><Building2 size={13} /> {company}</strong></div>
                                {countryName && <div className="ac-row"><span>Location</span><strong><MapPin size={13} /> {countryName}</strong></div>}
                                {job.salary && <div className="ac-row"><span>Salary</span><strong><DollarSign size={13} /> {job.salary}</strong></div>}
                                {job.type && <div className="ac-row"><span>Type</span><strong><Clock size={13} /> {job.type}</strong></div>}
                                {officialUrl && (
                                    <div className="ac-source"><ShieldCheck size={13} /> Official posting: {job.sourceName || hostOf(officialUrl)}</div>
                                )}
                                {officialUrl ? (
                                    <a href={officialUrl} target="_blank" rel="noopener noreferrer" className="btn btn-navy btn-block" onClick={applyClick}>
                                        Apply on Official Site <ArrowUpRight size={16} />
                                    </a>
                                ) : (
                                    <a href="#apply-form" className="btn btn-navy btn-block">
                                        Apply through Travelium <ArrowRight size={16} />
                                    </a>
                                )}
                                <small className="ac-note">Free access — you never pay to reach an official job posting.</small>
                            </div>

                            {officialUrl && (
                                <LeadCapture source="job" slug={slug} title={title} />
                            )}

                            <div className="listing-related">
                                <h4>Browse more jobs</h4>
                                <Link to="/jobs" className="related-item">
                                    <span className="ri-title">All international jobs</span>
                                    <ArrowRight size={14} />
                                </Link>
                                {countryName && (
                                    <Link to={`/jobs?country=${encodeURIComponent(countryName)}`} className="related-item">
                                        <span className="ri-title">More jobs in {countryName}</span>
                                        <ArrowRight size={14} />
                                    </Link>
                                )}
                                <Link to="/visa-services" className="related-item">
                                    <span className="ri-title">Work visa services</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <AdSenseAd adSlot="5348613920" adFormat="auto" style={{ margin: '0 auto', maxWidth: '1200px', padding: '8px 20px' }} />
            <CTABanner />
        </main>
    )
}
