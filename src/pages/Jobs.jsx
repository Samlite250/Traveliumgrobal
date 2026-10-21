import React, { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { collection, addDoc, doc, onSnapshot, serverTimestamp, query, where } from 'firebase/firestore'
import { db } from '../lib/firebase'
import SEOHead from '../components/SEOHead'
import AdSenseAd from '../components/AdSenseAd'
import {
    Briefcase, DollarSign, Clock, MapPin, Building, Search, Filter,
    CheckCircle, ArrowRight, ShieldCheck, Star, Send, X, Globe, UserCheck, Gem, Award, UploadCloud, FileText, ExternalLink
} from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { jobSlug, isVerifiedListing } from '../lib/listings'
import EmailGate from '../components/EmailGate'

// Country metadata for the job board. Actual listings are loaded live from the
// admin-approved Firestore pipeline (jobs collection). No hardcoded demo jobs.
export const JOBS_DATA = [
    {
        "id": "uae",
        "country": "Dubai (UAE)",
        "code": "UAE",
        "flag": "🇦🇪",
        "tagline": "Tax-Free Income & Luxury Living",
        "highPayableJobs": [],
        "partTimeJobs": []
    },
    {
        "id": "canada",
        "country": "Canada",
        "code": "CAN",
        "flag": "🇨🇦",
        "tagline": "High Standard of Living & PR Pathways",
        "highPayableJobs": [],
        "partTimeJobs": []
    },
    {
        "id": "uk",
        "country": "United Kingdom",
        "code": "UK",
        "flag": "🇬🇧",
        "tagline": "Skilled Worker Visas & Global Hub",
        "highPayableJobs": [],
        "partTimeJobs": []
    },
    {
        "id": "germany",
        "country": "Germany",
        "code": "DE",
        "flag": "🇩🇪",
        "tagline": "EU Blue Card & Strong Industrial Economy",
        "highPayableJobs": [],
        "partTimeJobs": []
    },
    {
        "id": "usa",
        "country": "United States",
        "code": "USA",
        "flag": "🇺🇸",
        "tagline": "High Pay & Career Opportunities",
        "highPayableJobs": [],
        "partTimeJobs": []
    },
    {
        "id": "australia",
        "country": "Australia",
        "code": "AUS",
        "flag": "🇦🇺",
        "tagline": "High Minimum Wages & Great Quality of Life",
        "highPayableJobs": [],
        "partTimeJobs": []
    },
    {
        "id": "qatar",
        "country": "Qatar",
        "code": "QAT",
        "flag": "🇶🇦",
        "tagline": "Tax-Free Salaries & World Cup Legacy Projects",
        "highPayableJobs": [],
        "partTimeJobs": []
    },
    {
        "id": "norway",
        "country": "Norway",
        "code": "NOR",
        "flag": "🇳🇴",
        "tagline": "Top Salaries, Work-Life Balance & Nordic Stability",
        "highPayableJobs": [],
        "partTimeJobs": []
    },
    {
        "id": "poland",
        "country": "Poland",
        "code": "POL",
        "flag": "🇵🇱",
        "tagline": "Growing Tech Hub & EU National Visa Opportunities",
        "highPayableJobs": [],
        "partTimeJobs": []
    },
    {
        "id": "rwanda",
        "country": "Rwanda",
        "code": "RWA",
        "flag": "🇷🇼",
        "tagline": "East Africa's Fastest-Growing Tech & Service Hub",
        "highPayableJobs": [],
        "partTimeJobs": []
    }
]

// ── Live auto-imported jobs (admin-approved via Cloud Function pipeline) ──
const COUNTRY_GROUP_MAP = {
    'United Arab Emirates': 'uae', 'UAE': 'uae', 'Dubai': 'uae',
    'Canada': 'canada', 'United Kingdom': 'uk', 'UK': 'uk',
    'Germany': 'germany', 'United States': 'usa', 'USA': 'usa', 'US': 'usa',
    'Australia': 'australia', 'Qatar': 'qatar', 'Norway': 'norway', 'Poland': 'poland',
    'Rwanda': 'rwanda', 'Kigali': 'rwanda',
}
const ISO2_CODES = {
    'United States': 'us', 'United Kingdom': 'gb', 'Germany': 'de', 'Canada': 'ca',
    'Australia': 'au', 'France': 'fr', 'Netherlands': 'nl', 'Poland': 'pl',
    'Japan': 'jp', 'Switzerland': 'ch', 'United Arab Emirates': 'ae', 'Qatar': 'qa',
    'Norway': 'no', 'European Union': 'eu', 'China': 'cn', 'Oman': 'om',
    'Rwanda': 'rw', 'Burundi': 'bi',
}

const isoToEmoji = (cc) => (cc && cc.length === 2)
    ? String.fromCodePoint(...[...cc.toUpperCase()].map(ch => 127397 + ch.charCodeAt()))
    : ''

const toRequirements = (desc) => {
    const sentences = String(desc || '')
        .split(/(?:\.\s+|\n|•)/)
        .map(s => s.trim().replace(/\s+/g, ' '))
        .filter(s => s.length > 15)
        .slice(0, 3)
        .map(s => (s.length > 90 ? s.slice(0, 87).trim() + '…' : s))
    return sentences.length ? sentences : ['View the original posting for the full role description.']
}

// Merge cloud/localStorage job groups with the hardcoded defaults so newly
// added country tabs (e.g. Rwanda) never disappear when an older cloud doc
// loads. Cloud groups always win for matching ids; default-only groups append.
export function mergeWithDefaults(cloud, defaults = JOBS_DATA) {
    if (!Array.isArray(cloud) || cloud.length === 0) return defaults
    const cloudIds = new Set(cloud.map(g => g?.id).filter(Boolean))
    const missing = defaults.filter(g => !cloudIds.has(g.id))
    return missing.length ? [...cloud, ...missing] : cloud
}

export function mergeLiveJobs(curated, live) {
    const groups = curated.map(c => ({
        ...c,
        highPayableJobs: [...(c.highPayableJobs || [])],
        partTimeJobs: [...(c.partTimeJobs || [])],
    }))
    const byId = Object.fromEntries(groups.map(g => [g.id, g]))
    for (const lj of live) {
        const groupName = lj.country || 'Remote'
        const gid = COUNTRY_GROUP_MAP[groupName] || `auto-${String(groupName).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
        let group = byId[gid]
        if (!group) {
            const iso2 = ISO2_CODES[groupName] || ''
            group = {
                id: gid,
                country: groupName,
                code: (iso2 || groupName).toUpperCase().slice(0, 3),
                flag: isoToEmoji(iso2) || '🌍',
                tagline: 'Verified listings from official sources',
                highPayableJobs: [],
                partTimeJobs: [],
                autoCountry: true,
            }
            byId[gid] = group
            groups.push(group)
        }
        const job = {
            id: `auto-${lj.id}`,
            title: lj.title || 'Untitled role',
            company: lj.company || 'Verified employer',
            location: lj.location || groupName,
            salary: lj.salary || 'Competitive salary',
            type: /part/i.test(lj.jobType || '') ? 'Part-Time' : 'Full-Time',
            experience: 'Verified listing',
            requirements: toRequirements(lj.description),
            auto: true,
            sourceName: lj.sourceName || lj.source || '',
            sourceUrl: lj.sourceUrl || lj.applyUrl || '',
            applyUrl: lj.applyUrl || lj.sourceUrl || '',
        }
        if (/part/i.test(lj.jobType || '')) group.partTimeJobs.push(job)
        else group.highPayableJobs.push(job)
    }
    return groups
}

export default function Jobs() {
    const toast = useToast()
    const [searchParams] = useSearchParams()
    const [activeCountry, setActiveCountry] = useState(JOBS_DATA[0].id)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState('all') // 'all', 'highPayable', 'partTime'
    const [selectedJob, setSelectedJob] = useState(null)
    const [isApplying, setIsApplying] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        experienceYears: '1-2 years',
        coverNote: ''
    })

    // Always start with hardcoded JOBS_DATA as the fallback baseline.
    // Cloud data (from admin) will override this as soon as Firestore responds.
    const [allJobsData, setAllJobsData] = useState(JOBS_DATA)

    useEffect(() => {
        let unsubFirestore = null
        if (db) {
            try {
                unsubFirestore = onSnapshot(doc(db, 'settings', 'jobs'), (snap) => {
                    if (snap.exists() && snap.data()?.jobs) {
                        // Cloud data from admin wins per-group, but groups that only
                        // exist in the hardcoded defaults (e.g. rwanda) are appended
                        // so new tabs survive an older settings/jobs document.
                        const cloudJobs = mergeWithDefaults(snap.data().jobs, JOBS_DATA)
                        setAllJobsData(cloudJobs)
                        try { localStorage.setItem('travelium_jobs_config', JSON.stringify(cloudJobs)) } catch { }
                    }
                    // If Firestore doc doesn't exist yet, keep showing hardcoded fallback.
                }, (err) => console.warn("Jobs Firestore sync notice:", err))
            } catch { }
        }

        const handleUpdate = () => {
            try {
                const saved = localStorage.getItem('travelium_jobs_config')
                if (saved) setAllJobsData(mergeWithDefaults(JSON.parse(saved), JOBS_DATA))
            } catch { }
        }

        window.addEventListener('storage', handleUpdate)
        window.addEventListener('travelium_jobs_updated', handleUpdate)

        let bc = null
        if (window.BroadcastChannel) {
            bc = new BroadcastChannel('travelium_admin_sync')
            bc.onmessage = (e) => {
                if (e.data?.type === 'JOBS_UPDATED' && e.data?.payload) {
                    setAllJobsData(mergeWithDefaults(e.data.payload, JOBS_DATA))
                }
            }
        }

        return () => {
            if (unsubFirestore) unsubFirestore()
            window.removeEventListener('storage', handleUpdate)
            window.removeEventListener('travelium_jobs_updated', handleUpdate)
            if (bc) bc.close()
        }
    }, [])

    // Live listings from the auto-import pipeline (approved by admin)
    const [liveJobs, setLiveJobs] = useState([])
    useEffect(() => {
        if (!db) return
        const q = query(collection(db, 'jobs'), where('status', '==', 'active'))
        const unsub = onSnapshot(q, (snap) => {
            const now = Date.now()
            setLiveJobs(snap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .filter(j => {
                    if (!j.expires_at) return true
                    const exp = j.expires_at.toDate ? j.expires_at.toDate().getTime() : new Date(j.expires_at).getTime()
                    return !Number.isNaN(exp) && exp > now
                })
                // Auto-imported listings must have a real apply URL and no scam signals.
                // Admin-curated listings (auto !== true) always pass — they use the Travelium form.
                .filter(j => !j.auto || isVerifiedListing(j)))
        }, (err) => console.warn('Live jobs notice:', err?.message))
        return unsub
    }, [])

    const displayJobsData = useMemo(() => mergeLiveJobs(allJobsData, liveJobs), [allJobsData, liveJobs])
    const currentCountryData = displayJobsData.find(c => c.id === activeCountry) || displayJobsData[0]

    // Auto-select country from URL query parameter if present
    // (searches the merged list so default-only tabs like Rwanda and
    // auto-created live-job groups are deep-linkable too)
    useEffect(() => {
        const queryCountry = searchParams.get('country')
        if (queryCountry) {
            const q = queryCountry.toLowerCase()
            const found = displayJobsData.find(c =>
                c.country?.toLowerCase().includes(q) || c.id?.toLowerCase().includes(q)
            )
            if (found) {
                setActiveCountry(found.id)
            }
        }
    }, [searchParams, displayJobsData])

    // Filter jobs based on search & filterType
    const filterJobList = (jobs) => {
        return jobs.filter(job => {
            const matchesSearch = !searchQuery ||
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.location.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesSearch
        })
    }

    const filteredHighPayable = filterType === 'partTime' ? [] : filterJobList(currentCountryData.highPayableJobs)
    const filteredPartTime = filterType === 'highPayable' ? [] : filterJobList(currentCountryData.partTimeJobs)

    // Email-gate: first 5 jobs free, everything after requires free signup
    const FREE_JOB_LIMIT = 5
    const freeHighPayable = filteredHighPayable.slice(0, FREE_JOB_LIMIT)
    const gatedHighPayable = filteredHighPayable.slice(FREE_JOB_LIMIT)
    const gatedCount = gatedHighPayable.length + filteredPartTime.length
    const showGate = gatedCount > 0

    const handleApplyClick = (job, categoryLabel) => {
        setSelectedJob({ ...job, countryName: currentCountryData.country, flag: currentCountryData.flag, categoryLabel })
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
            service_title: selectedJob ? `${selectedJob.title} (${selectedJob.countryName})` : 'Work Visa & Job Placement',
            jobId: selectedJob?.id || '',
            jobTitle: selectedJob?.title || '',
            country: selectedJob?.countryName || '',
            salary: selectedJob?.salary || '',
            company: selectedJob?.company || '',
            experienceYears: form.experienceYears || 'Entry Level',
            coverNote: form.coverNote || '',
            fileName: form.fileName || '',
            status: 'pending',
            created_at: new Date().toISOString(),
            created_at_str: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }

        // 1. Submit to Firestore if connected
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

        // 2. Local Storage Admin Sync Backup
        try {
            const adminApps = JSON.parse(localStorage.getItem('travelium_applications_admin') || '[]')
            adminApps.unshift({ id: `job-${Date.now()}`, ...newAppRecord })
            localStorage.setItem('travelium_applications_admin', JSON.stringify(adminApps))

            const existingJobApps = JSON.parse(localStorage.getItem('travelium_job_applications') || '[]')
            existingJobApps.unshift({ id: `job-${Date.now()}`, ...newAppRecord })
            localStorage.setItem('travelium_job_applications', JSON.stringify(existingJobApps))
        } catch (err) { }

        setSubmitted(true)
        toast('Application submitted directly to central admin! Our team will review and contact you.', 'success')

        setTimeout(() => {
            setIsApplying(false)
            setSubmitted(false)
            setForm({ fullName: '', email: '', phone: '', experienceYears: '1-2 years', coverNote: '', fileName: '' })
        }, 2200)
    }

    return (
        <div className="jobs-page">
            <SEOHead
                title="Jobs Abroad 2026 — Rwanda, Dubai, Canada, UK, Germany & More | Travelium Global"
                description="Find jobs in Rwanda, Dubai, Canada, UK, Germany, Qatar, Norway & Australia. Travelium Global connects East African professionals to local Kigali roles and global career opportunities."
                canonical="/jobs"
            />
            {/* ── Hero Banner ── */}
            <section className="jobs-hero">
                <div className="jobs-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop)' }} />
                <div className="container">
                    <div className="jobs-hero-badge">
                        <Globe size={16} /> Global Career Hub
                    </div>
                    <h1>Verified International Jobs &amp; Work Visas</h1>
                    <p>
                        Browse curated <strong>High Payable Careers</strong> and flexible <strong>Part-Time Opportunities</strong> across top global destinations.
                        Apply directly to start your visa and job placement process today.
                    </p>

                    {/* Search & Filter Bar */}
                    <div className="jobs-search-bar">
                        <div className="search-input-group">
                            <Search size={20} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search by job title, industry, or city..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className="clear-btn" onClick={() => setSearchQuery('')}><X size={16} /></button>
                            )}
                        </div>

                        <div className="filter-pills">
                            <button
                                className={`filter-pill ${filterType === 'all' ? 'active' : ''}`}
                                onClick={() => setFilterType('all')}
                            >
                                All Jobs
                            </button>
                            <button
                                className={`filter-pill ${filterType === 'highPayable' ? 'active' : ''}`}
                                onClick={() => setFilterType('highPayable')}
                            >
                                <Gem size={14} /> High Payable Only
                            </button>
                            <button
                                className={`filter-pill ${filterType === 'partTime' ? 'active' : ''}`}
                                onClick={() => setFilterType('partTime')}
                            >
                                <Clock size={14} /> Part-Time Only
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── AdSense Banner Ad ── */}
            <AdSenseAd adSlot="5348613920" adFormat="auto" style={{ margin: '0 auto', maxWidth: '1200px', padding: '8px 20px' }} />

            {/* ── Main Country Tabs & Jobs Section ── */}
            <section className="jobs-main-section">
                <div className="container">
                    {/* Country Selector Tabs */}
                    <div className="country-tabs-wrapper">
                        <div className="country-tabs-header">
                            <Globe size={18} /> Select Destination Country:
                        </div>
                        <div className="country-tabs-scroll">
                            {displayJobsData.map((c) => (
                                <button
                                    key={c.id}
                                    className={`country-tab-btn ${activeCountry === c.id ? 'active' : ''}`}
                                    onClick={() => setActiveCountry(c.id)}
                                >
                                    <span className="c-code">{c.code}</span>
                                    <span className="c-name">{c.country}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Country Banner Header */}
                    <div className="active-country-banner">
                        <div className="ac-title-wrap">
                            <div className="ac-badge-icon">
                                <Globe size={22} />
                                <span>{currentCountryData.code}</span>
                            </div>
                            <div>
                                <h2>Available Jobs in {currentCountryData.country}</h2>
                                <p className="ac-tagline">{currentCountryData.tagline}</p>
                            </div>
                        </div>
                        <div className="ac-stats-badge">
                            <UserCheck size={16} /> Verified Work Visa &amp; Permit Placement
                        </div>
                    </div>

                    {/* ── SECTION 1: HIGH PAYABLE JOBS (first 5 free) ── */}
                    {filterType !== 'partTime' && (
                        <div className="job-category-section">
                            <div className="category-header hp-header">
                                <div className="cat-title">
                                    <span className="cat-icon-badge hp"><Gem size={20} /></span>
                                    <div>
                                        <h3>High Payable Jobs ({filteredHighPayable.length})</h3>
                                        <p>Full-time, high-salary &amp; sponsored career roles</p>
                                    </div>
                                </div>
                                <span className="cat-pill hp">Full-Time / Executive</span>
                            </div>

                            {freeHighPayable.length === 0 ? (
                                <div className="no-jobs-card">
                                    <Briefcase size={40} />
                                    <p>No high payable jobs matching your search in {currentCountryData.country}.</p>
                                </div>
                            ) : (
                                <div className="jobs-grid">
                                    {freeHighPayable.map((job) => (
                                        <div key={job.id} className="job-card hp-card">
                                            <div className="job-card-top">
                                                <div className="job-badge hp-badge"><Gem size={13} /> High Salary</div>
                                                {job.auto && <div className="job-badge verified-badge"><ShieldCheck size={13} /> Verified Source</div>}
                                                <span className="job-country-tag"><MapPin size={13} /> {currentCountryData.country}</span>
                                            </div>

                                            <h4 className="job-title"><Link to={`/jobs/${jobSlug(job, currentCountryData.country)}`} className="job-title-link">{job.title}</Link></h4>

                                            <div className="job-meta-row">
                                                <span className="job-company"><Building size={14} /> {job.company}</span>
                                                <span className="job-location"><MapPin size={14} /> {job.location}</span>
                                            </div>

                                            <div className="job-salary-box">
                                                <DollarSign size={18} />
                                                <span className="salary-text">{job.salary}</span>
                                            </div>

                                            <div className="job-req-list">
                                                <span className="req-label">Requirements:</span>
                                                <ul>
                                                    {job.requirements.map((req, idx) => (
                                                        <li key={idx}><CheckCircle size={12} /> {req}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="job-card-footer">
                                                <span className="exp-badge">{job.experience}</span>
                                                {(job.applyUrl || job.sourceUrl) && (
                                                    <a className="job-source-link" href={job.applyUrl || job.sourceUrl} target="_blank" rel="noopener noreferrer" title={`Original posting — ${job.sourceName || 'Official'}`}>
                                                        Official posting <ExternalLink size={12} />
                                                    </a>
                                                )}
                                                <Link
                                                    to={`/jobs/${jobSlug(job, currentCountryData.country)}`}
                                                    className="btn-apply-job primary"
                                                >
                                                    View &amp; Apply <ArrowRight size={16} />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── EMAIL GATE: remaining high-payable + all part-time jobs ── */}
                    {showGate && (
                        <EmailGate count={gatedCount} source="jobs">
                            {gatedHighPayable.length > 0 && (
                                <div className="job-category-section">
                                    <div className="jobs-grid">
                                        {gatedHighPayable.map((job) => (
                                            <div key={job.id} className="job-card hp-card">
                                                <div className="job-card-top">
                                                    <div className="job-badge hp-badge"><Gem size={13} /> High Salary</div>
                                                    {job.auto && <div className="job-badge verified-badge"><ShieldCheck size={13} /> Verified Source</div>}
                                                    <span className="job-country-tag"><MapPin size={13} /> {currentCountryData.country}</span>
                                                </div>

                                                <h4 className="job-title"><Link to={`/jobs/${jobSlug(job, currentCountryData.country)}`} className="job-title-link">{job.title}</Link></h4>

                                                <div className="job-meta-row">
                                                    <span className="job-company"><Building size={14} /> {job.company}</span>
                                                    <span className="job-location"><MapPin size={14} /> {job.location}</span>
                                                </div>

                                                <div className="job-salary-box">
                                                    <DollarSign size={18} />
                                                    <span className="salary-text">{job.salary}</span>
                                                </div>

                                                <div className="job-req-list">
                                                    <span className="req-label">Requirements:</span>
                                                    <ul>
                                                        {job.requirements.map((req, idx) => (
                                                            <li key={idx}><CheckCircle size={12} /> {req}</li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="job-card-footer">
                                                    <span className="exp-badge">{job.experience}</span>
                                                    {(job.applyUrl || job.sourceUrl) && (
                                                        <a className="job-source-link" href={job.applyUrl || job.sourceUrl} target="_blank" rel="noopener noreferrer" title={`Original posting — ${job.sourceName || 'Official'}`}>
                                                            Official posting <ExternalLink size={12} />
                                                        </a>
                                                    )}
                                                    <Link
                                                        to={`/jobs/${jobSlug(job, currentCountryData.country)}`}
                                                        className="btn-apply-job primary"
                                                    >
                                                        View &amp; Apply <ArrowRight size={16} />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── SECTION 2: PART TIME JOBS ── */}
                            {filterType !== 'highPayable' && (
                                <div className="job-category-section" style={{ marginTop: '3.5rem' }}>
                                    <div className="category-header pt-header">
                                        <div className="cat-title">
                                            <span className="cat-icon-badge pt"><Clock size={20} /></span>
                                            <div>
                                                <h3>Part-Time Jobs ({filteredPartTime.length})</h3>
                                                <p>Student-friendly, shift &amp; hourly flexible opportunities</p>
                                            </div>
                                        </div>
                                        <span className="cat-pill pt">Part-Time / Hourly</span>
                                    </div>

                                    {filteredPartTime.length === 0 ? (
                                        <div className="no-jobs-card">
                                            <Clock size={40} />
                                            <p>No part-time jobs matching your search in {currentCountryData.country}.</p>
                                        </div>
                                    ) : (
                                        <div className="jobs-grid">
                                            {filteredPartTime.map((job) => (
                                                <div key={job.id} className="job-card pt-card">
                                                    <div className="job-card-top">
                                                        <div className="job-badge pt-badge"><Clock size={13} /> Flexible Hours</div>
                                                        {job.auto && <div className="job-badge verified-badge"><ShieldCheck size={13} /> Verified Source</div>}
                                                        <span className="job-country-tag"><MapPin size={13} /> {currentCountryData.country}</span>
                                                    </div>

                                                    <h4 className="job-title"><Link to={`/jobs/${jobSlug(job, currentCountryData.country)}`} className="job-title-link">{job.title}</Link></h4>

                                                    <div className="job-meta-row">
                                                        <span className="job-company"><Building size={14} /> {job.company}</span>
                                                        <span className="job-location"><MapPin size={14} /> {job.location}</span>
                                                    </div>

                                                    <div className="job-salary-box pt-salary">
                                                        <Clock size={18} />
                                                        <span className="salary-text">{job.salary}</span>
                                                        {job.hours && <span className="hours-sub">({job.hours})</span>}
                                                    </div>

                                                    <div className="job-req-list">
                                                        <span className="req-label">Requirements:</span>
                                                        <ul>
                                                            {job.requirements.map((req, idx) => (
                                                                <li key={idx}><CheckCircle size={12} /> {req}</li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div className="job-card-footer">
                                                        <span className="exp-badge pt-exp">{job.type}</span>
                                                        <Link
                                                            to={`/jobs/${jobSlug(job, currentCountryData.country)}`}
                                                            className="btn-apply-job secondary"
                                                        >
                                                            View &amp; Apply <ArrowRight size={16} />
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </EmailGate>
                    )}
                </div>
            </section>

            {/* ── JOB APPLICATION MODAL ── */}
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
                                <p>You have applied for <strong>{selectedJob.title}</strong> in <strong>{selectedJob.countryName}</strong>.</p>
                                <p className="sub-text">Our employment officer will reach out to verify your credentials and assist with your work permit.</p>
                            </div>
                        ) : (
                            <>
                                <div className="job-modal-header">
                                    <div className="jm-flag-icon"><Globe size={22} /></div>
                                    <div>
                                        <span className="jm-cat-tag">{selectedJob.categoryLabel}</span>
                                        <h3>Apply for {selectedJob.title}</h3>
                                        <p>{selectedJob.company} • {selectedJob.location}</p>
                                    </div>
                                </div>

                                <div className="job-modal-summary">
                                    <div className="jms-item">
                                        <DollarSign size={16} /> <span>{selectedJob.salary}</span>
                                    </div>
                                    <div className="jms-item">
                                        <Briefcase size={16} /> <span>{selectedJob.type}</span>
                                    </div>
                                </div>

                                <form onSubmit={handleFormSubmit} className="job-apply-form">
                                    <div className="form-group-custom">
                                        <label>Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Jean Claude"
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
                                        <label>Attach CV / Resume / Passport Copy (Optional)</label>
                                        <div className="file-upload-box">
                                            <input
                                                type="file"
                                                id="job-cv-upload"
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                onChange={(e) => setForm({ ...form, fileName: e.target.files[0]?.name || '' })}
                                            />
                                            <label htmlFor="job-cv-upload" className="file-upload-label">
                                                <UploadCloud size={20} />
                                                <span>{form.fileName ? `Selected: ${form.fileName}` : 'Upload CV, Resume, or Passport (PDF, DOCX, IMG)'}</span>
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
                                        <ShieldCheck size={16} /> <span>100% Direct Agency Recruitment • Verified Employers Only</span>
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
        </div>
    )
}
