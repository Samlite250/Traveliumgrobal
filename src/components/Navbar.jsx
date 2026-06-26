import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    Mail, Phone, Globe, Send, Play,
    Plane, GraduationCap, Landmark, Award, Info, PhoneCall,
    User, ArrowRight, Menu, X, ChevronDown, Home,
    BookOpen, Building2, FileText, Briefcase, MapPin, Star
} from 'lucide-react'

const studyAbroadDropdown = [
    { label: 'Find Universities', href: '/study-abroad', icon: <Building2 size={15} /> },
    { label: 'Available Programs', href: '/study-abroad', icon: <BookOpen size={15} /> },
    { label: 'Scholarships', href: '/scholarships', icon: <Star size={15} /> },
    { label: 'Destinations', href: '/study-abroad', icon: <MapPin size={15} /> },
]

const visaServicesDropdown = [
    { label: 'Student Visa', href: '/visa-services', icon: <GraduationCap size={15} /> },
    { label: 'Tourist Visa', href: '/visa-services', icon: <Globe size={15} /> },
    { label: 'Work Visa', href: '/visa-services', icon: <Briefcase size={15} /> },
    { label: 'Document Assistance', href: '/visa-services', icon: <FileText size={15} /> },
]

const workAbroadDropdown = [
    {
        label: 'Dubai',
        href: '/visa-services',
        icon: <MapPin size={15} />,
        tag: 'Hot',
        sub: 'UAE Work Visa'
    },
    {
        label: 'Tokyo',
        href: '/visa-services',
        icon: <MapPin size={15} />,
        tag: 'New',
        sub: 'Japan Work Permit'
    },
    {
        label: 'Germany',
        href: '/visa-services',
        icon: <MapPin size={15} />,
        tag: null,
        sub: 'EU Blue Card'
    },
    {
        label: 'France',
        href: '/visa-services',
        icon: <MapPin size={15} />,
        tag: null,
        sub: 'Talent Passport Visa'
    },
]

const flightsDropdown = [
    { label: 'Buy Ticket', href: 'https://wa.me/250793658206', icon: <Send size={15} /> },
    { label: 'Book Flight', href: '/flights', icon: <Plane size={15} /> },
];
const staticLinks = [
    { label: 'About Us', href: '/about', icon: <Info size={16} /> },
    { label: 'Contact Us', href: '/contact', icon: <PhoneCall size={16} /> },
]

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

function WorkAbroadDropdown() {
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
                Work Abroad
                <ChevronDown size={14} className={`chevron${open ? ' open' : ''}`} />
            </button>
            {open && (
                <div className="work-abroad-mega">
                    <div className="work-abroad-mega-header">
                        <h4>Work Abroad Destinations</h4>
                        <p>Find the right work visa for your dream destination</p>
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
                        <Link to="/visa-services" onClick={() => setOpen(false)} className="work-mega-cta">
                            View All Work Visas <ArrowRight size={13} />
                        </Link>
                    </div>
                </div>
            )}
        </li>
    )
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
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
            <div className="topbar">
                <div className="container">
                    <div className="topbar-left">
                        <a href="mailto:traveliumgrobal@gmail.com" className="topbar-link"><Mail size={12} /> traveliumgrobal@gmail.com</a>
                        <a href="tel:+250782531515" className="topbar-link"><Phone size={12} /> +250 782531515</a>
                    </div>
                    <div className="topbar-right">
                        <a href="#" aria-label="LinkedIn"><Globe size={12} /></a>
                        <a href="#" aria-label="Twitter"><Send size={12} /></a>
                        <a href="#" aria-label="YouTube"><Play size={12} /></a>
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
                                <Home size={16} /> Home
                            </Link>
                        </li>
                        <DropdownLink label="Study Abroad" icon={<GraduationCap size={16} />} items={studyAbroadDropdown} />
                        <DropdownLink label="Visa Services" icon={<Landmark size={16} />} items={visaServicesDropdown} />
                        <WorkAbroadDropdown />
                        <DropdownLink label="Flights" icon={<Plane size={16} />} items={flightsDropdown} />
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
                            <User size={16} /> Login
                        </Link>
                        <Link to="/apply" className="nav-apply">
                            Apply Now <ArrowRight size={16} />
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
                            <Home size={16} /> <span className="mobile-link-text">Home</span>
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
                                <Briefcase size={16} /> <span className="mobile-link-text">Work Abroad</span>
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
                            <User size={16} /> <span className="mobile-link-text">My Dashboard</span>
                        </Link>
                    </li>
                </ul>
                <div className="mobile-actions">
                    <Link to="/login" className="btn btn-navy" onClick={() => setMenuOpen(false)}>Login</Link>
                    <Link to="/apply" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Apply Now <ArrowRight size={16} /></Link>
                </div>
            </div>
        </>
    )
}
