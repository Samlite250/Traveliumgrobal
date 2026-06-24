import { Link } from 'react-router-dom'
import { Globe, Mail, Phone, Send, Play, Plane } from 'lucide-react'

const footerLinks = {
    'Quick Links': [
        { label: 'Home', href: '/' },
        { label: 'Study Abroad', href: '/study-abroad' },
        { label: 'Visa Services', href: '/visa-services' },
        { label: 'Scholarships', href: '/scholarships' },
        { label: 'About Us', href: '/about' },
    ],
    'Services': [
        { label: 'Student Visa', href: '/visa-services' },
        { label: 'Tourist Visa', href: '/visa-services' },
        { label: 'Work Visa', href: '/visa-services' },
        { label: 'Document Help', href: '/contact' },
        { label: 'Consultations', href: '/contact' },
    ],
}

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <Link to="/" className="nav-logo">
                                <div className="logo-icon"><Plane size={22} transform="rotate(45)" /></div>
                                <div className="logo-text-stack">
                                    <span className="logo-name">TRAVELIUM</span>
                                    <span className="logo-tagline">Grobal</span>
                                </div>
                            </Link>
                            <p>Your Gateway to Global Education and Travel Opportunities.</p>
                            <div className="footer-social">
                                <a href="#" aria-label="LinkedIn"><Globe size={15} /></a>
                                <a href="#" aria-label="Twitter"><Send size={15} /></a>
                                <a href="#" aria-label="YouTube"><Play size={15} /></a>
                            </div>
                            <div className="footer-contact-inline">
                                <a href="mailto:info@traveliumglobal.com"><Mail size={13} /> info@traveliumglobal.com</a>
                                <a href="tel:+250788207455"><Phone size={13} /> +250 788207455</a>
                            </div>
                        </div>

                        {Object.entries(footerLinks).map(([title, links]) => (
                            <div key={title} className="footer-col">
                                <h4>{title}</h4>
                                <ul>
                                    {links.map(l => (
                                        <li key={l.label}><Link to={l.href}>{l.label}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="footer-bottom">
                    <span>© {new Date().getFullYear()} Travelium Global. All rights reserved.</span>
                    <div className="footer-bottom-links">
                        <Link to="#">Privacy Policy</Link>
                        <Link to="#">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
