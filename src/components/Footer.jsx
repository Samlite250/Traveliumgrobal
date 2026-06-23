import { Link } from 'react-router-dom'
import {
    Award, ShieldCheck, Zap, Lock, Globe, TrendingUp, Mail, Phone, MapPin, Clock,
    Send, Play, Plane
} from 'lucide-react'

const badges = [
    { icon: <Award size={20} />, title: 'Expert Guidance', sub: 'Experienced Advisors' },
    { icon: <ShieldCheck size={20} />, title: 'Trusted Support', sub: '24/7 Assistance' },
    { icon: <Zap size={20} />, title: 'Fast Processing', sub: 'Quick & Easy Process' },
    { icon: <Lock size={20} />, title: 'Secure Platform', sub: 'Your Data is Safe' },
    { icon: <Globe size={20} />, title: 'Global Opportunities', sub: 'Study, Work, Travel' },
    { icon: <TrendingUp size={20} />, title: 'High Success Rate', sub: 'Proven Track Record' },
]

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
        <>
            <div className="trust-badges">
                <div className="container">
                    {badges.map(b => (
                        <div key={b.title} className="badge-item">
                            <div className="badge-icon">{b.icon}</div>
                            <div className="badge-text">
                                <strong>{b.title}</strong>
                                <span>{b.sub}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="footer">
                <div className="footer-top">
                    <div className="container">
                        <div className="footer-grid">
                            <div className="footer-brand">
                                <Link to="/" className="nav-logo">
                                    <div className="logo-icon"><Plane size={24} transform="rotate(45)" /></div>
                                    TRAVELIUM
                                </Link>
                                <p>Your Gateway to Global Education and Travel Opportunities. We help you achieve your international dreams with expert guidance.</p>
                                <div className="footer-social">
                                    <a href="#" aria-label="LinkedIn"><Globe size={16} /></a>
                                    <a href="#" aria-label="Twitter"><Send size={16} /></a>
                                    <a href="#" aria-label="YouTube"><Play size={16} /></a>
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

                            <div className="footer-col">
                                <h4>Contact Us</h4>
                                <div className="footer-contact-item">
                                    <MapPin size={16} className="icon" />
                                    <span>123 Global Avenue, Suite 400, New York, NY 10001</span>
                                </div>
                                <div className="footer-contact-item">
                                    <Phone size={16} className="icon" />
                                    <a href="tel:+19991234567">+1 (999) 123-4567</a>
                                </div>
                                <div className="footer-contact-item">
                                    <Mail size={16} className="icon" />
                                    <a href="mailto:info@traveliumglobal.com">info@traveliumglobal.com</a>
                                </div>
                                <div className="footer-contact-item">
                                    <Clock size={16} className="icon" />
                                    <span>Mon–Sat: 9AM – 7PM</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="footer-bottom">
                        <span>© {new Date().getFullYear()} Travelium Global. All rights reserved.</span>
                        <div className="footer-bottom-links">
                            <Link to="#">Privacy Policy</Link>
                            <Link to="#">Terms of Service</Link>
                            <Link to="#">Cookie Policy</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
