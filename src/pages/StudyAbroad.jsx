import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CTABanner from '../components/CTABanner'
import SEOHead from '../components/SEOHead'
import AdSenseAd from '../components/AdSenseAd'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { fallbackScholarships, scholarshipSlug } from '../lib/listings'
import {
    FlaskConical, HeartPulse, Briefcase, Scale, Palette, BookOpen,
    MapPin, ArrowRight, Globe, Search, GraduationCap, Award, SlidersHorizontal, X,
    Check, CalendarDays
} from 'lucide-react'

const programs = [
    {
        icon: <FlaskConical size={24} />,
        tag: 'Science & Tech', title: 'STEM Programs',
        desc: 'Engineering, Computer Science, Data Science, and more at top global universities.',
        img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
        programType: 'study',
        keywords: ['stem', 'engineer', 'computer', 'science', 'data', 'technolog', 'tech', 'mathematic', 'cyber', 'robotic'],
    },
    {
        icon: <HeartPulse size={24} />,
        tag: 'Health', title: 'Medicine & Health Sciences',
        desc: 'Medical degrees, nursing, pharmacy from internationally recognized institutions.',
        img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
        programType: 'student_visa',
        keywords: ['medic', 'health', 'nurs', 'pharmac', 'clinical', 'public health', 'dentist'],
    },
    {
        icon: <Briefcase size={24} />,
        tag: 'Business', title: 'Business & Management',
        desc: 'MBA, finance, marketing at leading business schools worldwide.',
        img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
        programType: 'study',
        keywords: ['business', 'mba', 'finance', 'management', 'econom', 'market', 'account', 'entrepreneur', 'leader'],
    },
    {
        icon: <Scale size={24} />,
        tag: 'Law', title: 'Law & Political Science',
        desc: 'LLB, LLM, international law programs in USA, UK, Canada and beyond.',
        img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop',
        programType: 'study',
        keywords: ['law', 'legal', 'politic', 'governance', 'human rights', 'diplomacy', 'policy'],
    },
    {
        icon: <Palette size={24} />,
        tag: 'Arts', title: 'Arts & Design',
        desc: 'Creative degrees in graphic design, architecture, film, and fine arts.',
        img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop',
        programType: 'study',
        keywords: ['art', 'design', 'architect', 'film', 'media', 'fashion', 'music', 'creative', 'animation'],
    },
    {
        icon: <BookOpen size={24} />,
        tag: 'Humanities', title: 'Social Sciences',
        desc: 'Psychology, sociology, international relations from top-ranking universities.',
        img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop',
        programType: 'study',
        keywords: ['social', 'psycholog', 'sociolog', 'relation', 'anthropolog', 'journalism', 'communicat', 'development'],
    },
    {
        icon: <Globe size={24} />,
        tag: 'Environment', title: 'Environmental Science',
        desc: 'Climate change, sustainability, and environmental policy programs at world-leading institutions.',
        img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop',
        programType: 'study',
        keywords: ['environment', 'climate', 'sustainab', 'energy', 'geograph', 'ecolog', 'agricultur', 'conservation'],
    },
    {
        icon: <MapPin size={24} />,
        tag: 'Education', title: 'Teaching & Education',
        desc: 'PGCE, education leadership, and curriculum development at top teacher training colleges.',
        img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop',
        programType: 'study',
        keywords: ['educat', 'teach', 'pedagog', 'pgce', 'curriculum', 'school'],
    },
]

const destinations = [
    { name: 'Canada', flag: 'https://flagcdn.com/w40/ca.png' },
    { name: 'United States', flag: 'https://flagcdn.com/w40/us.png' },
    { name: 'United Kingdom', flag: 'https://flagcdn.com/w40/gb.png' },
    { name: 'Australia', flag: 'https://flagcdn.com/w40/au.png' },
    { name: 'Germany', flag: 'https://flagcdn.com/w40/de.png' },
    { name: 'New Zealand', flag: 'https://flagcdn.com/w40/nz.png' },
]

const DESTINATION_ALIASES = {
    usa: 'united states', 'u.s.a.': 'united states', us: 'united states', america: 'united states',
    uk: 'united kingdom', england: 'united kingdom', britain: 'united kingdom',
}

const normalizeCountry = (v) => {
    const c = String(v || '').toLowerCase().trim()
    return DESTINATION_ALIASES[c] || c
}

const searchable = (s) => [
    s.title, s.name, s.country, s.description, s.desc, s.sourceName, s.amount,
].filter(Boolean).join(' ').toLowerCase()

const levelTabs = [
    { id: 'all', label: 'All Levels', education: '' },
    { id: 'bachelor', label: 'Bachelor', education: "Bachelor's Degree" },
    { id: 'master', label: 'Master', education: "Master's Degree" },
    { id: 'phd', label: 'PhD', education: 'PhD' },
]

export default function StudyAbroad() {
    const [searchParams] = useSearchParams()
    const view = searchParams.get('view') || ''

    const [scholarships, setScholarships] = useState([])
    const [loadingScholarships, setLoadingScholarships] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [level, setLevel] = useState('all')
    const [destination, setDestination] = useState('')

    const scrollTo = (selector) => {
        document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    useEffect(() => {
        if (!view) return
        const timer = setTimeout(() => {
            if (view === 'destinations') {
                scrollTo('#destinations')
                return
            }
            scrollTo('#programs')
            if (view === 'search') {
                document.querySelector('.program-search input')?.focus({ preventScroll: true })
            }
        }, 200)
        return () => clearTimeout(timer)
    }, [view])

    useEffect(() => {
        if (!db) { setScholarships(fallbackScholarships); setLoadingScholarships(false); return }
        const q = query(collection(db, 'services'), where('type', '==', 'scholarship'))
        const unsub = onSnapshot(q, (snap) => {
            const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
            const data = all.filter(s => s.active !== false)
            setScholarships(data.length ? data : fallbackScholarships)
            setLoadingScholarships(false)
        }, () => { setScholarships(fallbackScholarships); setLoadingScholarships(false) })
        return unsub
    }, [])

    const matchesFor = useMemo(() => {
        const pool = scholarships.length ? scholarships : fallbackScholarships
        const wanted = destination ? normalizeCountry(destination) : ''
        return (program) => pool.filter((s) => {
            const country = normalizeCountry(s.country)
            if (wanted && country && country !== wanted) return false
            const haystack = searchable(s)
            return program.keywords.some(k => haystack.includes(k))
        })
    }, [scholarships, destination])

    const visiblePrograms = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        if (!term) return programs
        return programs.filter(p =>
            [p.title, p.tag, p.desc, ...p.keywords].join(' ').toLowerCase().includes(term)
        )
    }, [searchTerm])

    const totalMatches = useMemo(
        () => programs.reduce((sum, p) => sum + matchesFor(p).length, 0),
        [matchesFor]
    )

    const scholarshipPool = useMemo(
        () => (scholarships.length ? scholarships : fallbackScholarships),
        [scholarships]
    )

    const countryCounts = useMemo(() => {
        const map = new Map()
        for (const s of scholarshipPool) {
            const c = normalizeCountry(s.country)
            if (!c) continue
            map.set(c, (map.get(c) || 0) + 1)
        }
        return map
    }, [scholarshipPool])

    const destinationMatches = useMemo(() => {
        if (!destination) return []
        const wanted = normalizeCountry(destination)
        return scholarshipPool.filter(s => normalizeCountry(s.country) === wanted)
    }, [scholarshipPool, destination])

    const activeLevel = levelTabs.find(t => t.id === level) || levelTabs[0]

    const applyHref = (program) => {
        const params = new URLSearchParams({ program: program.programType, field: program.title })
        if (destination) params.set('destination', destination)
        if (activeLevel.education) params.set('education_level', activeLevel.education)
        return `/apply?${params.toString()}`
    }

    const scholarshipHref = (program) => {
        const params = new URLSearchParams({ program: program.tag })
        if (destination) params.set('country', destination)
        return `/scholarships?${params.toString()}`
    }

    return (
        <main>
            <SEOHead
                title="Study Abroad 2026 — Apply for University Programs Worldwide | Travelium Global"
                description="Apply to study abroad at top universities in Canada, UK, USA, Germany, Australia & more. Travelium Global guides students from East Africa and worldwide through the full application process."
                canonical="/study-abroad"
            />
            <div className="page-hero page-hero--study">
                <div className="page-hero-bg" style={{ backgroundImage: 'url(/study-abroad-hero.jpg)' }} />
                <div className="container page-hero-content">
                    <div className="breadcrumb">
                        <Link to="/">Home</Link><span className="sep">›</span><span>Study Abroad</span>
                    </div>
                    <h1>Study Abroad Programs</h1>
                    <p>Discover world-class universities and programs tailored to your academic goals and career aspirations.</p>
                </div>
            </div>

            <section className="content-section programs-section" id="programs">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">Fields of Study</div>
                        <h2 className="section-title">Choose Your Program</h2>
                        <p className="section-sub">Explore programs across all major disciplines at partner universities worldwide.</p>
                    </div>

                    <div className="program-stats">
                        <div className="program-stat">
                            <GraduationCap size={18} />
                            <div>
                                <strong>{programs.length}</strong>
                                <span>Fields of study</span>
                            </div>
                        </div>
                        <div className="program-stat">
                            <Award size={18} />
                            <div>
                                <strong>{loadingScholarships ? '—' : totalMatches}</strong>
                                <span>{destination ? `Matched scholarships in ${destination}` : 'Matched scholarships'}</span>
                            </div>
                        </div>
                        <div className="program-stat">
                            <Globe size={18} />
                            <div>
                                <strong>{destinations.length}</strong>
                                <span>Top destinations</span>
                            </div>
                        </div>
                    </div>

                    <div className="program-toolbar">
                        <form
                            className="program-search"
                            role="search"
                            onSubmit={(e) => {
                                e.preventDefault()
                                if (!searchTerm.trim()) {
                                    e.currentTarget.querySelector('input')?.focus()
                                    return
                                }
                                const target = document.querySelector('.programs-grid, .program-empty')
                                target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                            }}
                        >
                            <Search size={18} className="program-search-icon" />
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Search a field, program or keyword (e.g. computer, nursing, MBA)"
                                aria-label="Search fields of study"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm('')}
                                    className="program-search-clear"
                                    aria-label="Clear search"
                                >
                                    <X size={15} />
                                </button>
                            )}
                            <button type="submit" className="program-search-btn">
                                <Search size={16} />
                                <span>Search</span>
                            </button>
                        </form>
                        <div className="program-levels" role="tablist" aria-label="Degree level">
                            <span className="program-levels-label"><SlidersHorizontal size={14} /> Level</span>
                            {levelTabs.map(t => (
                                <button
                                    key={t.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={level === t.id}
                                    className={`program-level-tab${level === t.id ? ' active' : ''}`}
                                    onClick={() => setLevel(t.id)}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                        <div className="program-destinations" role="group" aria-label="Preferred destination">
                            <span className="program-levels-label"><Globe size={14} /> Destination</span>
                            <button
                                type="button"
                                className={`dest-chip${destination === '' ? ' active' : ''}`}
                                onClick={() => setDestination('')}
                            >
                                Any
                            </button>
                            {destinations.map(d => (
                                <button
                                    key={d.name}
                                    type="button"
                                    className={`dest-chip${destination === d.name ? ' active' : ''}`}
                                    onClick={() => setDestination(destination === d.name ? '' : d.name)}
                                >
                                    <img src={d.flag} alt="" loading="lazy" />
                                    {d.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {visiblePrograms.length === 0 ? (
                        <div className="program-empty">
                            <Search size={28} />
                            <h3>No field matches “{searchTerm}”</h3>
                            <p>Try another keyword, or explore our matched scholarships instead.</p>
                            <div className="program-empty-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setSearchTerm('')}>Reset search</button>
                                <Link to="/scholarships" className="btn btn-primary">Browse scholarships <ArrowRight size={16} /></Link>
                            </div>
                        </div>
                    ) : (
                        <div className="programs-grid">
                            {visiblePrograms.map(p => {
                                const matched = matchesFor(p)
                                const preview = matched.slice(0, 2)
                                return (
                                    <div key={p.title} className="program-card">
                                        <div className="program-card-img">
                                            <img src={p.img} alt={p.title} loading="lazy" />
                                            <span className="program-tag">{p.tag}</span>
                                            <span className="program-match-badge">
                                                <Award size={12} />
                                                {matched.length} {matched.length === 1 ? 'scholarship' : 'scholarships'}
                                            </span>
                                        </div>
                                        <div className="program-card-body">
                                            <div className="program-icon">{p.icon}</div>
                                            <h3>{p.title}</h3>
                                            <p>{p.desc}</p>

                                            {preview.length > 0 && (
                                                <div className="program-matches">
                                                    <span className="program-matches-label">
                                                        <Award size={13} /> Matching funding
                                                    </span>
                                                    <ul>
                                                        {preview.map(s => (
                                                            <li key={s.id || scholarshipSlug(s)}>
                                                                <Link to={`/scholarships/${scholarshipSlug(s)}`}>
                                                                    {s.title || s.name}
                                                                </Link>
                                                                {s.amount && <em>{s.amount}</em>}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            <div className="program-actions">
                                                <Link to={applyHref(p)} className="btn btn-primary program-apply">
                                                    Apply Now <ArrowRight size={15} />
                                                </Link>
                                                <Link to={scholarshipHref(p)} className="program-secondary-link">
                                                    {matched.length > 0 ? `See ${matched.length} scholarship${matched.length === 1 ? '' : 's'}` : 'Find funding'}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {destination && (
                        <p className="program-note">
                            Showing funding matched to <strong>{destination}</strong>.
                            <button type="button" onClick={() => setDestination('')}>Clear destination</button>
                        </p>
                    )}
                </div>
            </section>

            {/* ── AdSense Banner Ad ── */}
            <AdSenseAd adSlot="5348613920" adFormat="auto" style={{ margin: '0 auto', maxWidth: '1200px', padding: '8px 20px' }} />

            <section className="content-section destinations-strip" id="destinations">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">Top Destinations</div>
                        <h2 className="section-title">Where Can You Study?</h2>
                        <p className="section-sub">
                            Tap a country to instantly filter the matched funding and programs above — counts update
                            live from our scholarship database.
                        </p>
                    </div>

                    <div className="destination-cards">
                        {destinations.map(d => {
                            const count = countryCounts.get(normalizeCountry(d.name)) || 0
                            const active = destination === d.name
                            return (
                                <button
                                    key={d.name}
                                    type="button"
                                    aria-pressed={active}
                                    className={`destination-card${active ? ' active' : ''}`}
                                    onClick={() => setDestination(active ? '' : d.name)}
                                >
                                    <span className="destination-card-flag">
                                        <img src={d.flag} alt="" loading="lazy" />
                                    </span>
                                    <span className="destination-card-body">
                                        <strong>{d.name}</strong>
                                        <small>
                                            {count > 0
                                                ? `${count} ${count === 1 ? 'scholarship' : 'scholarships'} matched`
                                                : 'Programs available'}
                                        </small>
                                    </span>
                                    <span className="destination-card-state">
                                        {active ? <Check size={16} /> : <ArrowRight size={16} />}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    {destination && (
                        <div className="destination-panel">
                            <div className="destination-panel-head">
                                <div className="destination-panel-title">
                                    <span className="destination-panel-icon"><Globe size={18} /></span>
                                    <div>
                                        <strong>{destination}</strong>
                                        <small>
                                            {destinationMatches.length} matched {destinationMatches.length === 1 ? 'scholarship' : 'scholarships'}
                                            {' · '}{programs.length} fields of study
                                        </small>
                                    </div>
                                </div>
                                <button type="button" className="destination-panel-clear" onClick={() => setDestination('')}>
                                    <X size={14} /> Clear
                                </button>
                            </div>

                            {destinationMatches.length > 0 ? (
                                <ul className="destination-panel-list">
                                    {destinationMatches.slice(0, 4).map(s => (
                                        <li key={s.id || scholarshipSlug(s)}>
                                            <Link to={`/scholarships/${scholarshipSlug(s)}`}>
                                                {s.title || s.name}
                                            </Link>
                                            <span className="destination-panel-meta">
                                                {s.amount && <em>{s.amount}</em>}
                                                {s.deadline && (
                                                    <small><CalendarDays size={12} /> {s.deadline}</small>
                                                )}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="destination-panel-empty">
                                    No funding recorded for {destination} yet — our advisors can still match you with
                                    suitable programs. <Link to="/contact">Talk to an advisor</Link>
                                </p>
                            )}

                            <div className="destination-panel-actions">
                                <Link to={`/scholarships?country=${encodeURIComponent(destination)}`} className="btn btn-primary">
                                    See all {destination} scholarships <ArrowRight size={15} />
                                </Link>
                                <button
                                    type="button"
                                    className="btn btn-outline-navy"
                                    onClick={() => document.querySelector('.programs-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                >
                                    Back to matching programs
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="destinations-cta">
                        <Link to="/apply" className="btn btn-primary" style={{ fontSize: '1rem' }}>
                            Apply for Study Abroad <ArrowRight size={18} />
                        </Link>
                        <Link to="/scholarships" className="btn btn-outline-navy" style={{ fontSize: '1rem' }}>
                            Browse All Scholarships
                        </Link>
                    </div>
                </div>
            </section>

            <CTABanner />
        </main >
    )
}
