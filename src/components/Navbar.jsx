import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    Mail, Phone, Clock, Globe, Send, Play,
    Plane, GraduationCap, Landmark, Award, Info, PhoneCall,
    User, ArrowRight, Menu, X, ChevronDown,
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

const staticLinks = [
    { label: 'Scholarships', href: '/scholarships', icon: <Award size={16} /> },
    { label: 'About Us', href: '/about', icon: <Info size={16} /> },
    { label: 'Contact Us', href: '/contact', icon: <PhoneCall size={16} /> },
]

function DropdownLink({ label, icon, items }) {
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

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => { setMenuOpen(false) }, [location])

    return (
        <>
            <div className="topbar">
                <div className="container">
                    <div className="topbar-left">
                        <span><Mail size={12} /> info@traveliumglobal.com</span>
                        <span><Phone size={12} /> +1 (999) 123-4567</span>
                        <span><Clock size={12} /> Mon–Sat: 9AM – 7PM</span>
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
                        TRAVELIUM
                    </Link>
                    <ul className="nav-links">
                        <DropdownLink label="Study Abroad" icon={<GraduationCap size={16} />} items={studyAbroadDropdown} />
                        <DropdownLink label="Visa Services" icon={<Landmark size={16} />} items={visaServicesDropdown} />
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
                    <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
                        <Menu size={24} />
                    </button>
                </div>
            </nav>

            <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
                <div className="mobile-menu-header">
                    <Link to="/" className="nav-logo">
                        <div className="logo-icon"><Plane size={24} transform="rotate(45)" /></div>
                        TRAVELIUM
                    </Link>
                    <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close">
                        <X size={24} />
                    </button>
                </div>
                <ul className="mobile-nav-links">
                    <li><Link to="/study-abroad"><GraduationCap size={16} /> Study Abroad</Link></li>
                    <li><Link to="/visa-services"><Landmark size={16} /> Visa Services</Link></li>
                    {staticLinks.map(l => (
                        <li key={l.href}><Link to={l.href}>{l.icon}{l.label}</Link></li>
                    ))}
                    <li><Link to="/dashboard"><User size={16} /> My Dashboard</Link></li>
                </ul>
                <div className="mobile-actions">
                    <Link to="/login" className="btn btn-navy">Login</Link>
                    <Link to="/apply" className="btn btn-primary">Apply Now <ArrowRight size={16} /></Link>
                </div>
            </div>
        </>
    )
}
