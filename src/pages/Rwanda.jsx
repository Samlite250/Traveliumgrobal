import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import CTABanner from '../components/CTABanner'
import SEOHead from '../components/SEOHead'
import { fallbackScholarships, scholarshipSlug, trackOutbound } from '../lib/listings'
import { useToast } from '../context/ToastContext'
import { fetchMifotraJobs, MIFOTRA_PORTAL_URL } from '../lib/mifotraJobs'
import {
    ShieldCheck, TrendingUp, Cpu, Stamp, Plane,
    CalendarDays, ArrowRight, ExternalLink, GraduationCap, MapPin, Briefcase, Star,
    BookOpen, DollarSign, Globe, Landmark, Users, RefreshCw, ChevronDown, Loader2,
    X, Send, UploadCloud, CheckCircle, Search
} from 'lucide-react'

// ── Key facts shown as chips inside the hero ──
const heroFacts = [
    { icon: <ShieldCheck size={16} />, label: 'Africa\'s Safest Country' },
    { icon: <TrendingUp size={16} />, label: '7–8% Annual GDP Growth' },
    { icon: <Stamp size={16} />, label: 'Visa-on-Arrival' },
    { icon: <Cpu size={16} />, label: 'Kigali Innovation City' },
]

// ── Featured jobs in Rwanda (curated from our Rwanda jobs board) ──
const rwandaJobs = [
    { title: 'Software Engineer / Full Stack Developer', company: 'Kigali Innovation City — Tech Startups', location: 'Kigali, Rwanda', salary: 'RWF 1,200,000 – 2,500,000 / month', type: 'Full-Time', tag: 'High Pay', tagClass: 'hp-badge' },
    { title: 'Hospitality & Hotel Operations Manager', company: 'Kigali Serena Hotel & Resort Group', location: 'Kigali, Rwanda', salary: 'RWF 1,500,000 – 2,800,000 / month', type: 'Full-Time', tag: 'High Pay', tagClass: 'hp-badge' },
    { title: 'Financial Analyst & Accountant', company: 'Kigali Financial Services Group', location: 'Kigali, Rwanda', salary: 'RWF 1,100,000 – 1,900,000 / month', type: 'Full-Time', tag: 'High Pay', tagClass: 'hp-badge' },
    { title: 'English–French Bilingual Customer Success Lead', company: 'Rwanda Global Business Hub (GBH)', location: 'Kigali, Rwanda', salary: 'RWF 1,000,000 – 1,600,000 / month', type: 'Full-Time', tag: 'Bilingual', tagClass: 'verified-badge' },
    { title: 'Ride-Hailing Driver Partner', company: 'Yego & Local Mobility Services', location: 'Kigali, Rwanda', salary: 'RWF 150,000 – 350,000 / month', type: 'Part-Time / Flexible', tag: 'Flexible', tagClass: 'verified-badge' },
    { title: 'Digital Marketing & Social Media Assistant', company: 'Kigali Creative Agencies', location: 'Kigali, Rwanda (Hybrid)', salary: 'RWF 100,000 – 200,000 / month', type: 'Part-Time / Remote Option', tag: 'Hybrid', tagClass: 'verified-badge' },
]

// ── Top universities & schools in Rwanda ──
const rwandaUniversities = [
    {
        tag: 'Pan-African', title: 'African Leadership University (ALU)',
        desc: 'Self-leadership-driven degrees in computer science, business and global challenges — campus in the heart of Kigali.',
        img: '/alu-kigali-campus.jpg',
    },
    {
        tag: 'Public', title: 'University of Rwanda',
        desc: 'The nation\'s largest public university — medicine, engineering, business, law and IT across six campuses.',
        img: '/university-of-rwanda.jpg',
    },
    {
        tag: 'Private', title: 'Kigali Independent University (ULK)',
        desc: 'Rwanda\'s leading private university since 1996 — law, business, IT, education and health sciences across Kigali & Gisenyi campuses.',
        img: '/ulk-kigali.jpg',
    },
    {
        tag: 'Global Health', title: 'University of Global Health Equity (UGHE)',
        desc: 'Butaro-based institution training a new generation of global health leaders in equity-centered medicine.',
        img: '/ughe-butaro.jpg',
    },
    {
        tag: 'Engineering', title: 'INES-Ruhengeri',
        desc: 'Leading institute of engineering and applied sciences — water, energy, environment and ICT programs in Musanze.',
        img: '/ines-ruhengeri.jpg',
    },
    {
        tag: 'TVET', title: 'Rwanda Polytechnic (RP)',
        desc: 'Hands-on TVET colleges nationwide — welding, automotive, ICT, hospitality and advanced manufacturing skills.',
        img: '/rwanda-polytechnic.jpg',
    },
]

// ── Steps to live, work or study in Rwanda ──
const moveSteps = [
    { step: '01', icon: <Briefcase size={22} />, title: 'Find Your Opportunity', desc: 'Browse Rwanda jobs on our board, apply for local scholarships, or enroll at a Kigali university.' },
    { step: '02', icon: <Stamp size={22} />, title: 'Secure Visa & Permits', desc: 'We guide you through e-visas, work permits, residence permits and student permits with Immigration Rwanda.' },
    { step: '03', icon: <MapPin size={22} />, title: 'Land & Settle in Kigali', desc: 'Airport pickup, accommodation help, RWANDAIR ticketing and on-the-ground support from our Kigali team.' },
]

const formatMifotraDate = (iso) => {
    if (!iso) return '—'
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Rwanda() {
    const toast = useToast()
    const [searchParams] = useSearchParams()

    // ── Jobs tabs: live MIFOTRA vacancies + curated featured jobs ──
    const [jobTab, setJobTab] = useState('mifotra') // 'mifotra' | 'featured'
    const [mifotraJobs, setMifotraJobs] = useState([])
    const [mifotraStatus, setMifotraStatus] = useState({ loading: false, error: '', source: '', fetchedAt: '' })
    const [expandedDesc, setExpandedDesc] = useState(null)
    const mifotraLoadedRef = useRef(false)

    // ── Travelium application modal ──
    const [selectedJob, setSelectedJob] = useState(null)
    const [isApplying, setIsApplying] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [form, setForm] = useState({
        fullName: '', email: '', phone: '', experienceYears: '1-2 years', coverNote: '', fileName: ''
    })

    const rwandaScholarships = fallbackScholarships.filter(s => String(s.country || '').toLowerCase() === 'rwanda')

    useEffect(() => {
        const tab = searchParams.get('tab')
        if (tab === 'mifotra' || tab === 'featured') setJobTab(tab)
    }, [searchParams])

    const loadMifotraJobs = async (force = false) => {
        setMifotraStatus(prev => ({ ...prev, loading: true, error: '' }))
        try {
            const res = await fetchMifotraJobs({ force })
            setMifotraJobs(res.jobs)
            setMifotraStatus({ loading: false, error: '', source: res.source, fetchedAt: res.fetched_at })
            mifotraLoadedRef.current = true
        } catch (err) {
            setMifotraStatus(prev => ({
                ...prev,
                loading: false,
                error: err?.message || 'Unable to reach the MIFOTRA recruitment portal right now.'
            }))
        }
    }

    useEffect(() => {
        if (jobTab === 'mifotra' && !mifotraLoadedRef.current && !mifotraStatus.loading && !mifotraStatus.error) {
            loadMifotraJobs()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobTab, mifotraStatus.loading, mifotraStatus.error])

    const handleApplyClick = (job) => {
        setSelectedJob(job)
        setIsApplying(true)
        setSubmitted(false)
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        if (!form.fullName || !form.email || !form.phone) {
            toast('Please fill out all required fields', 'error')
            return
        }

        const newAppRecord = {
            applicant_name: form.fullName,
            name: form.fullName,
            email: form.email,
            phone: form.phone,
            service_type: 'work',
            service_title: `${selectedJob.title} (Rwanda • MIFOTRA)`,
            jobId: selectedJob.id || '',
            jobTitle: selectedJob.title || '',
            country: 'Rwanda',
            salary: selectedJob.salary || '',
            company: selectedJob.company || '',
            experienceYears: form.experienceYears || 'Entry Level',
            coverNote: form.coverNote || '',
            fileName: form.fileName || '',
            source: 'mifotra',
            official_portal: MIFOTRA_PORTAL_URL,
            status: 'pending',
            created_at: new Date().toISOString(),
            created_at_str: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }

        if (db) {
            try {
                await addDoc(collection(db, 'applications'), {
                    ...newAppRecord,
                    created_at: serverTimestamp()
                })
            } catch (err) {
                console.error('Firestore application error:', err)
            }
        }

        try {
            const adminApps = JSON.parse(localStorage.getItem('travelium_applications_admin') || '[]')
            adminApps.unshift({ id: `mifotra-${Date.now()}`, ...newAppRecord })
            localStorage.setItem('travelium_applications_admin', JSON.stringify(adminApps))
        } catch (err) { }

        setSubmitted(true)
        toast('Application received! Our Rwanda officer will review it and help you apply on the MIFOTRA portal.', 'success')

        setTimeout(() => {
            setIsApplying(false)
            setSubmitted(false)
            setForm({ fullName: '', email: '', phone: '', experienceYears: '1-2 years', coverNote: '', fileName: '' })
        }, 2400)
    }

    return (
        <main>
            <SEOHead
                title="Rwanda Hub — Jobs, Scholarships, Universities & Life in Rwanda | Travelium Global"
                description="Everything Rwanda in one place: high-paying jobs in Kigali, Rwanda government & university scholarships, top universities, work visas and relocation support from Travelium Global."
                canonical="/rwanda"
            />

            {/* ── Hero ── */}
            <div className="page-hero">
                <div className="page-hero-bg" style={{ backgroundImage: 'url(/kigali-convention-centre.jpg)' }} />
                <div className="container page-hero-content">
                    <div className="breadcrumb">
                        <Link to="/">Home</Link><span className="sep">›</span><span>Rwanda</span>
                    </div>
                    <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                            <img src="https://flagcdn.com/w80/rw.png" alt="Rwanda flag" width="44" height="44" loading="eager" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', display: 'block', border: '2px solid rgba(255,255,255,0.55)', boxShadow: '0 2px 10px rgba(0,0,0,0.28)' }} />
                        Discover Rwanda
                    </h1>
                    <p>East Africa's fastest-growing tech, hospitality & services hub — safe, clean, connected and hungry for talent. Browse local jobs, scholarships, universities and relocation support, all in one place.</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1.25rem' }}>
                        {heroFacts.map(f => (
                            <span key={f.label} style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                padding: '0.4rem 0.85rem', borderRadius: '999px',
                                border: '1px solid rgba(255,255,255,0.28)', background: 'rgba(255,255,255,0.10)',
                                color: '#fff', fontSize: '0.8rem', fontWeight: 600, backdropFilter: 'blur(6px)',
                            }}>
                                <span style={{ color: 'var(--gold)', display: 'inline-flex' }}>{f.icon}</span>
                                {f.label}
                            </span>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem', justifyContent: 'center' }}>
                        <Link to="/jobs?country=Rwanda" className="btn btn-primary">
                            <Briefcase size={16} /> Browse Rwanda Jobs
                        </Link>
                        <Link to="/apply" className="btn btn-navy">
                            Apply Now <ArrowRight size={16} />
                        </Link>
                        <Link to="/contact" className="btn btn-outline">
                            <ShieldCheck size={16} /> Free Consultation
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Rwanda Jobs (tabs: MIFOTRA Hot Jobs + Featured) ── */}
            <section className="content-section" id="rwanda-jobs">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label"><Briefcase size={16} /> Work in Rwanda</div>
                        <h2 className="section-title">
                            {jobTab === 'mifotra' ? 'MIFOTRA Hot Jobs — Rwanda' : 'Featured Jobs in Rwanda'}
                        </h2>
                        <p className="section-sub">
                            {jobTab === 'mifotra'
                                ? 'Live vacancies published by Rwanda\'s Ministry of Public Service & Labour (MIFOTRA) — fetched straight from the official e-recruitment portal.'
                                : 'High-paying and flexible roles from Kigali\'s tech, finance, hospitality & creative sectors — updated daily.'}
                        </p>
                    </div>

                    {/* ── Tabs ── */}
                    <div className="rwanda-tabs" role="tablist" aria-label="Rwanda jobs">
                        <button
                            role="tab"
                            aria-selected={jobTab === 'mifotra'}
                            className={`rwanda-tab ${jobTab === 'mifotra' ? 'active' : ''}`}
                            onClick={() => setJobTab('mifotra')}
                        >
                            <Landmark size={16} /> MIFOTRA Hot Jobs
                            <span className="rwanda-tab-live"><span className="live-dot" aria-hidden="true"></span> Live</span>
                        </button>
                        <button
                            role="tab"
                            aria-selected={jobTab === 'featured'}
                            className={`rwanda-tab ${jobTab === 'featured' ? 'active' : ''}`}
                            onClick={() => setJobTab('featured')}
                        >
                            <Star size={16} /> Featured Jobs
                        </button>
                    </div>

                    {jobTab === 'mifotra' ? (
                        <div className="rwanda-tab-panel">
                            <div className="mifotra-toolbar">
                                <span className="mifotra-count">
                                    <Users size={15} /> {mifotraStatus.loading && !mifotraJobs.length
                                        ? 'Loading live vacancies…'
                                        : `${mifotraJobs.length} open ${mifotraJobs.length === 1 ? 'vacancy' : 'vacancies'}`}
                                </span>
                                <div className="mifotra-toolbar-right">
                                    {mifotraStatus.fetchedAt && (
                                        <span className="mifotra-updated">
                                            Updated {new Date(mifotraStatus.fetchedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    )}
                                    <button
                                        className="mifotra-refresh-btn"
                                        onClick={() => loadMifotraJobs(true)}
                                        disabled={mifotraStatus.loading}
                                    >
                                        <RefreshCw size={14} className={mifotraStatus.loading ? 'mif-spin' : ''} />
                                        {mifotraStatus.loading ? 'Refreshing…' : 'Refresh'}
                                    </button>
                                </div>
                            </div>

                            {mifotraStatus.loading && !mifotraJobs.length ? (
                                <div className="jobs-grid">
                                    {[0, 1, 2].map(i => (
                                        <div key={i} className="job-card mifotra-card mifotra-skeleton">
                                            <Loader2 size={26} className="mif-spin" />
                                            <p>Loading live MIFOTRA vacancies…</p>
                                        </div>
                                    ))}
                                </div>
                            ) : mifotraStatus.error ? (
                                <div className="no-jobs-card">
                                    <Landmark size={40} />
                                    <p>{mifotraStatus.error}</p>
                                    <button className="mifotra-refresh-btn" onClick={() => loadMifotraJobs(true)}>
                                        <RefreshCw size={14} /> Try again
                                    </button>
                                </div>
                            ) : mifotraJobs.length === 0 ? (
                                <div className="no-jobs-card">
                                    <Search size={40} />
                                    <p>No MIFOTRA vacancies are open right now. Check back soon.</p>
                                </div>
                            ) : (
                                <div className="jobs-grid">
                                    {mifotraJobs.map(job => (
                                        <div key={job.id} className="job-card mifotra-card">
                                            <div className="job-card-top">
                                                <div className="job-badge mifotra-badge"><Landmark size={13} /> MIFOTRA Hot Job</div>
                                                <span className="job-country-tag">🇷🇼 Rwanda</span>
                                            </div>

                                            <h4 className="job-title">{job.title}</h4>

                                            <div className="job-meta-row">
                                                <span className="job-company"><Briefcase size={14} /> {job.company}</span>
                                                <span className="job-location"><MapPin size={14} /> Rwanda • Public Service</span>
                                            </div>

                                            <div className="mifotra-chips">
                                                {job.grade && <span className="mif-chip">Grade {job.grade}</span>}
                                                <span className="mif-chip"><Users size={12} /> {job.posts} {job.posts === 1 ? 'post' : 'posts'}</span>
                                                <span className="mif-chip">{job.type}</span>
                                            </div>

                                            <div className="job-salary-box mifotra-deadline">
                                                <CalendarDays size={18} />
                                                <span className="salary-text">Closes {formatMifotraDate(job.closingDate)}</span>
                                                <span className="hours-sub">
                                                    {job.daysLeft === null ? '' :
                                                        job.daysLeft > 1 ? `${job.daysLeft} days left` :
                                                            job.daysLeft === 1 ? 'Last day' : 'Closing today'}
                                                </span>
                                            </div>

                                            <div className="mifotra-desc">
                                                <p className={expandedDesc === job.id ? 'expanded' : ''}>
                                                    {job.description || 'No further description was published for this vacancy.'}
                                                </p>
                                                {job.description && job.description.length > 180 && (
                                                    <button
                                                        className="desc-toggle"
                                                        onClick={() => setExpandedDesc(expandedDesc === job.id ? null : job.id)}
                                                    >
                                                        {expandedDesc === job.id ? 'Show less' : 'Read full job description'}
                                                        <ChevronDown size={14} className={expandedDesc === job.id ? 'rotated' : ''} />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="job-card-footer mifotra-footer">
                                                <a
                                                    className="btn-apply-job portal"
                                                    href={MIFOTRA_PORTAL_URL}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    title="Complete your application on the official MIFOTRA e-recruitment portal"
                                                >
                                                    Official Portal <ExternalLink size={14} />
                                                </a>
                                                <button className="btn-apply-job primary" onClick={() => handleApplyClick(job)}>
                                                    Apply Now <ArrowRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mifotra-disclaimer">
                                <ShieldCheck size={15} />
                                <span>
                                    Listings are fetched directly from the MIFOTRA e-recruitment portal. Submit your details here for
                                    free Travelium support, then complete the official application on the MIFOTRA portal.
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="rwanda-tab-panel">
                            <div className="jobs-grid">
                                {rwandaJobs.map(job => (
                                    <div key={job.title} className="job-card">
                                        <div className="job-card-top">
                                            <div className={`job-badge ${job.tagClass}`}>{job.tag}</div>
                                            <span className="job-country-tag"><MapPin size={13} /> Rwanda</span>
                                        </div>

                                        <h4 className="job-title">{job.title}</h4>

                                        <div className="job-meta-row">
                                            <span className="job-company"><Briefcase size={14} /> {job.company}</span>
                                            <span className="job-location"><MapPin size={14} /> {job.location}</span>
                                        </div>

                                        <div className="job-salary-box">
                                            <TrendingUp size={18} />
                                            <span className="salary-text">{job.salary}</span>
                                        </div>

                                        <div className="job-card-footer">
                                            <span className="exp-badge">{job.type}</span>
                                            <Link to="/jobs?country=Rwanda" className="btn-apply-job primary">
                                                View &amp; Apply <ArrowRight size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                                <Link to="/jobs?country=Rwanda" className="btn btn-primary" style={{ fontSize: '1rem' }}>
                                    Browse All Rwanda Jobs & Careers <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Rwanda Scholarships ── */}
            <section className="content-section" style={{ background: 'var(--bg-light, #f7f9fc)' }}>
                <div className="container">
                    <div className="section-header">
                        <div className="section-label"><GraduationCap size={16} /> Fund Your Future</div>
                        <h2 className="section-title">Scholarships to Study in Rwanda</h2>
                        <p className="section-sub">Government and university-funded scholarships for Rwandan and international students.</p>
                    </div>
                    <div className="scholarships-grid">
                        {rwandaScholarships.map(s => {
                            const displayTitle = s.title || s.name || 'Scholarship'
                            const detailPath = `/scholarships/${scholarshipSlug(s)}`
                            return (
                                <div key={displayTitle} className="scholarship-card">
                                    <div className={`scholarship-amount${s.amount === 'Full Fund' ? ' full-fund' : ''}`}>{s.amount}</div>
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
                                        {s.sourceUrl && (
                                            <div className="scholarship-source">
                                                <ShieldCheck size={12} />
                                                {s.sourceName ? `${s.sourceName} — ` : ''}
                                                <a
                                                    href={s.sourceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => trackOutbound({ type: 'scholarship', id: displayTitle, title: displayTitle, url: s.sourceUrl })}
                                                >
                                                    Official program page <ExternalLink size={11} />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                        <Link to="/scholarships?country=Rwanda" className="btn btn-primary" style={{ fontSize: '1rem' }}>
                            View All Rwanda Scholarships <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Universities ── */}
            <section className="content-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label"><GraduationCap size={16} /> Study in Rwanda</div>
                        <h2 className="section-title">Top Universities & Schools</h2>
                        <p className="section-sub">World-class degrees and hands-on training — from pan-African leadership campuses to global health medicine.</p>
                    </div>
                    <div className="programs-grid">
                        {rwandaUniversities.map(u => (
                            <div key={u.title} className="program-card">
                                <div className="program-card-img">
                                    <img src={u.img} alt={u.title} loading="lazy" />
                                    <span className="program-tag">{u.tag}</span>
                                </div>
                                <div className="program-card-body">
                                    <div className="program-icon"><GraduationCap size={24} /></div>
                                    <h3>{u.title}</h3>
                                    <p>{u.desc}</p>
                                    <Link to="/apply" className="service-link">
                                        Apply Now <ArrowRight size={15} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Plan Your Move + Rwanda at a Glance ── */}
            <section className="content-section rwanda-move-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label"><Plane size={16} /> Relocation Support</div>
                        <h2 className="section-title">Plan Your Move to Rwanda</h2>
                        <p className="section-sub">From your first application to your first day in Kigali — our team walks with you every step.</p>
                    </div>

                    <div className="rwanda-move-grid">
                        <ol className="rwanda-steps">
                            {moveSteps.map(s => (
                                <li key={s.step} className="rwanda-step">
                                    <span className="rwanda-step-num">{s.step}</span>
                                    <div>
                                        <h4>{s.icon} {s.title}</h4>
                                        <p>{s.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>

                        <aside className="rwanda-glance">
                            <h3><TrendingUp size={17} /> Rwanda at a Glance</h3>
                            <ul className="rwanda-glance-list">
                                {[
                                    { icon: <MapPin size={17} />, label: 'Capital', value: 'Kigali — clean, safe & tech-forward, home to 1.2M+ residents.' },
                                    { icon: <BookOpen size={17} />, label: 'Languages', value: 'Kinyarwanda, English, French & Swahili — English widely spoken.' },
                                    { icon: <DollarSign size={17} />, label: 'Currency', value: 'Rwandan Franc (RWF); USD widely accepted in Kigali.' },
                                    { icon: <Globe size={17} />, label: 'Region', value: 'East African Community (EAC) — free movement for EAC citizens.' },
                                ].map(f => (
                                    <li key={f.label}>
                                        <span className="rwanda-glance-icon">{f.icon}</span>
                                        <div>
                                            <strong>{f.label}</strong>
                                            <span>{f.value}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </aside>
                    </div>

                    <div className="rwanda-move-cta">
                        <Link to="/visa-services" className="btn btn-navy">
                            <Stamp size={16} /> Visa & Work Permit Guide
                        </Link>
                        <Link to="/flights" className="btn btn-primary">
                            <Plane size={16} /> Flights to Kigali
                        </Link>
                        <Link to="/contact" className="btn btn-outline-navy">
                            <Star size={16} /> Talk to Our Kigali Team
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── MIFOTRA JOB APPLICATION MODAL ── */}
            {isApplying && selectedJob && (
                <div className="job-modal-overlay" onClick={() => setIsApplying(false)}>
                    <div className="job-modal-card" onClick={(e) => e.stopPropagation()}>
                        <button className="job-modal-close" onClick={() => setIsApplying(false)}>
                            <X size={20} />
                        </button>

                        {submitted ? (
                            <div className="job-modal-success">
                                <CheckCircle size={56} className="success-icon" />
                                <h3>Application Submitted!</h3>
                                <p>You have applied for <strong>{selectedJob.title}</strong> in <strong>Rwanda</strong>.</p>
                                <p className="sub-text">Our Kigali employment officer will verify your credentials and guide you through the official MIFOTRA application.</p>
                            </div>
                        ) : (
                            <>
                                <div className="job-modal-header">
                                    <div className="jm-flag-icon"><Landmark size={22} /></div>
                                    <div>
                                        <span className="jm-cat-tag">MIFOTRA Hot Job</span>
                                        <h3>Apply for {selectedJob.title}</h3>
                                        <p>{selectedJob.company} • Rwanda</p>
                                    </div>
                                </div>

                                <div className="job-modal-summary">
                                    <div className="jms-item">
                                        <DollarSign size={16} /> <span>{selectedJob.salary}</span>
                                    </div>
                                    <div className="jms-item">
                                        <Briefcase size={16} /> <span>{selectedJob.type}</span>
                                    </div>
                                    {selectedJob.closingDate && (
                                        <div className="jms-item">
                                            <CalendarDays size={16} /> <span>Closes {formatMifotraDate(selectedJob.closingDate)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mifotra-modal-note">
                                    <Landmark size={15} />
                                    <span>
                                        Official Rwanda civil service vacancy. Applying here gets you free Travelium support;
                                        the final application must be submitted on the MIFOTRA portal.
                                    </span>
                                    <a href={MIFOTRA_PORTAL_URL} target="_blank" rel="noreferrer">
                                        MIFOTRA portal <ExternalLink size={13} />
                                    </a>
                                </div>

                                <form onSubmit={handleFormSubmit} className="job-apply-form">
                                    <div className="form-group-custom">
                                        <label>Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Aline Uwase"
                                            value={form.fullName}
                                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-row-custom">
                                        <div className="form-group-custom">
                                            <label>Email Address *</label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="you@example.com"
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            />
                                        </div>

                                        <div className="form-group-custom">
                                            <label>Phone / WhatsApp *</label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="+250 78... or digits"
                                                value={form.phone}
                                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group-custom">
                                        <label>Relevant Experience</label>
                                        <select
                                            value={form.experienceYears}
                                            onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                                        >
                                            <option value="No experience (Entry level)">No experience (Entry level / Student)</option>
                                            <option value="1-2 years">1-2 years experience</option>
                                            <option value="3-5 years">3-5 years experience</option>
                                            <option value="5+ years">5+ years senior experience</option>
                                        </select>
                                    </div>

                                    <div className="form-group-custom">
                                        <label>Attach CV / Resume / NID Copy (Optional)</label>
                                        <div className="file-upload-box">
                                            <input
                                                type="file"
                                                id="mifotra-cv-upload"
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                onChange={(e) => setForm({ ...form, fileName: e.target.files[0]?.name || '' })}
                                            />
                                            <label htmlFor="mifotra-cv-upload" className="file-upload-label">
                                                <UploadCloud size={20} />
                                                <span>{form.fileName ? `Selected: ${form.fileName}` : 'Upload CV, Resume, or NID (PDF, DOCX, IMG)'}</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="form-group-custom">
                                        <label>Cover Note / Short Message (Optional)</label>
                                        <textarea
                                            rows="3"
                                            placeholder="Tell us briefly why you are interested in this job..."
                                            value={form.coverNote}
                                            onChange={(e) => setForm({ ...form, coverNote: e.target.value })}
                                        />
                                    </div>

                                    <div className="modal-trust-seal">
                                        <ShieldCheck size={16} /> <span>Free Application Support • Kigali-Based Team • Official MIFOTRA Vacancies</span>
                                    </div>

                                    <div className="form-actions-row">
                                        <button type="button" className="btn-cancel" onClick={() => setIsApplying(false)}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn-submit-apply">
                                            Submit Application <Send size={16} />
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}

            <CTABanner />
        </main>
    )
}
