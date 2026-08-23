import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import {
    Mail, Phone, Globe, Send, Play,
    Plane, GraduationCap, Landmark, Award, Info, PhoneCall,
    User, ArrowRight, Menu, X, ChevronDown, Home,
    BookOpen, Building2, FileText, Briefcase, MapPin, Star
} from 'lucide-react'



function DropdownLink({ label, icon, items, megaHint }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <li className="dropdown" ref={ref}>
            <button
                className="dropdown-trigger"
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
            >
                {icon}
                {label}
                <ChevronDown size={14} className={`chevron${open ? ' open' : ''}`} />
            </button>
            {open && (
                <ul className="dropdown-menu">
                    {items.map(item => (
                        <li key={item.label}>
                            <Link to={item.href} onClick={() => setOpen(false)}>
                                {item.icon}
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    )
}

function WorkAbroadDropdown({ t, workAbroadDropdown }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <li className="dropdown work-abroad-dropdown" ref={ref}>
            <button
                className="dropdown-trigger work-abroad-trigger"
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
            >
                <Briefcase size={16} />
                {t('navbar.jobsCareers', 'Jobs & Careers')}
                <ChevronDown size={14} className={`chevron${open ? ' open' : ''}`} />
            </button>
            {open && (
                <div className="work-abroad-mega">
                    <div className="work-abroad-mega-header">
                        <h4>{t('navbar.globalJobsHub', 'Global Jobs & Careers Hub')}</h4>
                        <p>{t('navbar.globalJobsSub', 'Browse high-payable & part-time jobs across top global destinations')}</p>
                    </div>
                    <ul className="work-abroad-list">
                        {workAbroadDropdown.map(item => (
                            <li key={item.label}>
                                <Link to={item.href} onClick={() => setOpen(false)} className="work-abroad-item">
                                    <span className="work-abroad-flag">{item.icon}</span>
                                    <span className="work-abroad-info">
                                        <strong>{item.label} {item.tag && <span className="work-tag">{item.tag}</span>}</strong>
                                        <small>{item.sub}</small>
                                    </span>
                                    <ArrowRight size={13} className="work-abroad-arrow" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="work-abroad-mega-footer">
                        <Link to="/jobs" onClick={() => setOpen(false)} className="work-mega-cta">
                            {t('navbar.browseAllJobs', 'Browse All Country Jobs & Work Visas')} <ArrowRight size={13} />
                        </Link>
                    </div>
                </div>
            )}
        </li>
    )
}

export default function Navbar() {
    const { t, i18n } = useTranslation();

    const studyAbroadDropdown = [
        { label: t('navbar.findUniversities', 'Find Universities'), href: '/study-abroad', icon: <Building2 size={15} /> },
        { label: t('navbar.programs', 'Available Programs'), href: '/study-abroad', icon: <BookOpen size={15} /> },
        { label: t('navbar.scholarships', 'Scholarships'), href: '/scholarships', icon: <Star size={15} /> },
        { label: t('navbar.destinations', 'Destinations'), href: '/study-abroad', icon: <MapPin size={15} /> },
    ]

    const visaServicesDropdown = [
        { label: t('navbar.studentVisa', 'Student Visa'), href: '/visa-services', icon: <GraduationCap size={15} /> },
        { label: t('navbar.touristVisa', 'Tourist Visa'), href: '/visa-services', icon: <Globe size={15} /> },
        { label: t('navbar.workVisa', 'Work Visa'), href: '/visa-services', icon: <Briefcase size={15} /> },
        { label: t('navbar.docAssist', 'Document Assistance'), href: '/visa-services', icon: <FileText size={15} /> },
    ]

    const workAbroadDropdown = [
        { label: 'Dubai', href: '/jobs?country=Dubai', icon: <MapPin size={15} />, tag: 'Hot', sub: t('navbar.jobsWorkVisas', 'Jobs & Work Visas') },
        { label: 'Canada', href: '/jobs?country=Canada', icon: <MapPin size={15} />, tag: 'Hot', sub: t('navbar.jobsExpress', 'Jobs & Express Entry') },
        { label: 'USA', href: '/jobs?country=USA', icon: <MapPin size={15} />, tag: 'Trending', sub: t('navbar.jobsH1B', 'Jobs & H-1B Visa') },
        { label: 'UK', href: '/jobs?country=UK', icon: <MapPin size={15} />, tag: null, sub: t('navbar.jobsSkilledWorker', 'Jobs & Skilled Worker') },
        { label: 'Germany', href: '/jobs?country=Germany', icon: <MapPin size={15} />, tag: null, sub: t('navbar.jobsEU', 'Jobs & EU Blue Card') },
        { label: 'France', href: '/jobs?country=France', icon: <MapPin size={15} />, tag: null, sub: t('navbar.jobsTalent', 'Jobs & Talent Visa') },
        { label: 'Oman', href: '/jobs?country=Oman', icon: <MapPin size={15} />, tag: 'New', sub: t('navbar.jobsWorkPermit', 'Jobs & Work Permits') },
        { label: 'China', href: '/jobs?country=China', icon: <MapPin size={15} />, tag: 'New', sub: t('navbar.jobsZ', 'Jobs & Z-Visa') },
        { label: 'Japan', href: '/jobs?country=Japan', icon: <MapPin size={15} />, tag: 'New', sub: t('navbar.jobsWorkPermit', 'Jobs & Work Permits') },
        { label: 'Netherlands', href: '/jobs?country=Netherlands', icon: <MapPin size={15} />, tag: null, sub: t('navbar.jobsSkilledMigrant', 'Jobs & Skilled Migrant') },
    ]

    const flightsDropdown = [
        { label: t('navbar.buyTicket', 'Buy Ticket'), href: '/buy-ticket', icon: <Send size={15} /> },
        { label: t('navbar.bookFlight', 'Book Flight'), href: '/flights', icon: <Plane size={15} /> },
    ]

    const staticLinks = [
        { label: t('navbar.aboutUs', 'About Us'), href: '/about', icon: <Info size={16} /> },
        { label: t('navbar.contactUs', 'Contact Us'), href: '/contact', icon: <PhoneCall size={16} /> },
    ]

    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [siteSettings, setSiteSettings] = useState(null)

    useEffect(() => {
        if (!db) return
        const unsub = onSnapshot(doc(db, 'settings', 'site'), (snap) => {
            if (snap.exists()) setSiteSettings(snap.data())
        })
        return unsub
    }, [])
    const [studyAbroadOpen, setStudyAbroadOpen] = useState(false)
    const [visaServicesOpen, setVisaServicesOpen] = useState(false)
    const [workAbroadOpen, setWorkAbroadOpen] = useState(false)
    const [flightsOpen, setFlightsOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        setMenuOpen(false)
        setStudyAbroadOpen(false)
        setVisaServicesOpen(false)
        setWorkAbroadOpen(false)
        setFlightsOpen(false)
    }, [location])

    useEffect(() => {
        if (menuOpen) {
            document.documentElement.style.overflow = 'hidden'
            document.body.style.overflow = 'hidden'
        } else {
            document.documentElement.style.overflow = ''
            document.body.style.overflow = ''
        }
        return () => {
            document.documentElement.style.overflow = ''
            document.body.style.overflow = ''
        }
    }, [menuOpen])

    return (
        <>
            <header className="site-header">
                <div className="topbar">
                    <div className="container">
                        <div className="topbar-left">
                            <a href={`mailto:${siteSettings?.supportEmail || 'traveliumgrobal@gmail.com'}`} className="topbar-link"><Mail size={12} /> {siteSettings?.supportEmail || 'traveliumgrobal@gmail.com'}</a>
                            <a href={`tel:${siteSettings?.supportPhone?.replace(/\s/g, '') || '+250786189460'}`} className="topbar-link"><Phone size={12} /> {siteSettings?.supportPhone || '+250 786 189 460'}</a>
                        </div>
                        <div className="topbar-right">
                            <LanguageSwitcher />
                            {siteSettings?.linkedin && <a href={siteSettings.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Globe size={12} /></a>}
                            {siteSettings?.twitter && <a href={siteSettings.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter"><Send size={12} /></a>}
                            {siteSettings?.youtube && <a href={siteSettings.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Play size={12} /></a>}
                            {siteSettings?.instagram && <a href={siteSettings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Send size={12} /></a>}
                            {siteSettings?.facebook && <a href={siteSettings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Globe size={12} /></a>}
                        </div>
                    </div>
                </div>

                <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
                    <div className="container">
                        <Link to="/" className="nav-logo">
                            <div className="logo-icon"><Plane size={24} transform="rotate(45)" /></div>
                            <div className="logo-text-stack">
                                <span className="logo-name">TRAVELIUM</span>
                                <span className="logo-tagline">Grobal</span>
                            </div>
                        </Link>
                        <ul className="nav-links">
                            <li>
                                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                                    <Home size={16} /> {t('navbar.home')}
                                </Link>
                            </li>
                            <DropdownLink label={t('navbar.studyAbroad', 'Study Abroad')} icon={<GraduationCap size={16} />} items={studyAbroadDropdown} />
                            <DropdownLink label={t('navbar.visaServices', 'Visa Services')} icon={<Landmark size={16} />} items={visaServicesDropdown} />
                            <WorkAbroadDropdown t={t} workAbroadDropdown={workAbroadDropdown} />
                            <DropdownLink label={t('navbar.flights', 'Flights')} icon={<Plane size={16} />} items={flightsDropdown} />
                            {staticLinks.map(l => (
                                <li key={l.href}>
                                    <Link to={l.href} className={location.pathname === l.href ? 'active' : ''}>
                                        {l.icon}
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="nav-actions">
                            <Link to="/login" className="nav-login">
                                <User size={16} /> {t('navbar.login')}
                            </Link>
                            <Link to="/apply" className="nav-apply">
                                {t('navbar.applyNow')} <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div className="nav-mobile-btns">
                            <Link to="/" className="mobile-home-btn" aria-label="Go to Home">
                                <Home size={20} />
                            </Link>
                            <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
                                <Menu size={24} />
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
                <div className="mobile-menu-header">
                    <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
                        <div className="logo-icon"><Plane size={24} transform="rotate(45)" /></div>
                        <div className="logo-text-stack">
                            <span className="logo-name">TRAVELIUM</span>
                            <span className="logo-tagline">Grobal</span>
                        </div>
                    </Link>
                    <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close">
                        <X size={24} />
                    </button>
                </div>
                <ul className="mobile-nav-links">
                    <li>
                        <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
                            <Home size={16} /> <span className="mobile-link-text">{t('navbar.home')}</span>
                        </Link>
                    </li>

                    <li className={`mobile-accordion ${studyAbroadOpen ? 'open' : ''}`}>
                        <button className="mobile-accordion-trigger" onClick={() => setStudyAbroadOpen(!studyAbroadOpen)}>
                            <span className="trigger-label">
                                <GraduationCap size={16} /> <span className="mobile-link-text">Study Abroad</span>
                            </span>
                            <ChevronDown size={14} className="chevron" />
                        </button>
                        <ul className="mobile-accordion-menu">
                            {studyAbroadDropdown.map(item => (
                                <li key={item.label}>
                                    <Link to={item.href} onClick={() => setMenuOpen(false)}>
                                        {item.icon} <span className="mobile-link-text">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>

                    <li className={`mobile-accordion ${visaServicesOpen ? 'open' : ''}`}>
                        <button className="mobile-accordion-trigger" onClick={() => setVisaServicesOpen(!visaServicesOpen)}>
                            <span className="trigger-label">
                                <Landmark size={16} /> <span className="mobile-link-text">Visa Services</span>
                            </span>
                            <ChevronDown size={14} className="chevron" />
                        </button>
                        <ul className="mobile-accordion-menu">
                            {visaServicesDropdown.map(item => (
                                <li key={item.label}>
                                    <Link to={item.href} onClick={() => setMenuOpen(false)}>
                                        {item.icon} <span className="mobile-link-text">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>

                    {/* Work Abroad accordion - shares Visa Services page */}
                    <li className={`mobile-accordion ${workAbroadOpen ? 'open' : ''}`}>
                        <button className="mobile-accordion-trigger" onClick={() => setWorkAbroadOpen(!workAbroadOpen)}>
                            <span className="trigger-label">
                                <Briefcase size={16} /> <span className="mobile-link-text">{t('navbar.jobsCareers', 'Jobs & Careers')}</span>
                            </span>
                            <ChevronDown size={14} className="chevron" />
                        </button>
                        <ul className="mobile-accordion-menu">
                            {workAbroadDropdown.map(item => (
                                <li key={item.label}>
                                    <Link to={item.href} onClick={() => setMenuOpen(false)}>
                                        {item.icon}
                                        <span className="mobile-link-text">
                                            {item.label}
                                            {item.tag && <span className="work-tag-mobile">{item.tag}</span>}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link to="/visa-services" onClick={() => setMenuOpen(false)} className="mobile-visa-link">
                                    <FileText size={15} /> <span className="mobile-link-text">View All Work Visas</span>
                                </Link>
                            </li>
                        </ul>
                    </li>

                    <li className={`mobile-accordion ${flightsOpen ? 'open' : ''}`}>
                        <button className="mobile-accordion-trigger" onClick={() => setFlightsOpen(!flightsOpen)}>
                            <span className="trigger-label">
                                <Plane size={16} /> <span className="mobile-link-text">Flights</span>
                            </span>
                            <ChevronDown size={14} className="chevron" />
                        </button>
                        <ul className="mobile-accordion-menu">
                            {flightsDropdown.map(item => (
                                <li key={item.label}>
                                    {item.href.startsWith('http') ? (
                                        <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>
                                            {item.icon} <span className="mobile-link-text">{item.label}</span>
                                        </a>
                                    ) : (
                                        <Link to={item.href} onClick={() => setMenuOpen(false)}>
                                            {item.icon} <span className="mobile-link-text">{item.label}</span>
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </li>

                    {staticLinks.map(l => (
                        <li key={l.href}>
                            <Link to={l.href} className={location.pathname === l.href ? 'active' : ''} onClick={() => setMenuOpen(false)}>
                                {l.icon} <span className="mobile-link-text">{l.label}</span>
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
                            <User size={16} /> <span className="mobile-link-text">{t('navbar.dashboard')}</span>
                        </Link>
                    </li>
                </ul>
                <div className="mobile-actions">
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '0.6rem 1rem',
                        background: 'var(--navy)',
                        borderRadius: '8px',
                        marginBottom: '0.5rem',
                    }}>
                        <Globe size={14} style={{ color: 'rgba(255,255,255,0.8)' }} />
                        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                            {t('navbar.language', 'Language')}:
                        </span>
                        <select
                            value={i18n.resolvedLanguage || 'en'}
                            onChange={e => i18n.changeLanguage(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                fontFamily: 'inherit',
                                cursor: 'pointer',
                                outline: 'none',
                                appearance: 'none',
                                WebkitAppearance: 'none',
                            }}
                        >
                            <option value="en" style={{ background: '#1a2b5e' }}>English (EN)</option>
                            <option value="fr" style={{ background: '#1a2b5e' }}>Français (FR)</option>
                            <option value="rw" style={{ background: '#1a2b5e' }}>Kinyarwanda (RW)</option>
                        </select>
                    </div>
                    <Link to="/login" className="btn btn-navy" onClick={() => setMenuOpen(false)}>{t('navbar.login')}</Link>
                    <Link to="/apply" className="btn btn-primary" onClick={() => setMenuOpen(false)}>{t('navbar.applyNow')} <ArrowRight size={16} /></Link>
                </div>
            </div>
        </>
    )
}
