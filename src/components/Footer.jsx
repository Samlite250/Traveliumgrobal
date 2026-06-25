import { Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa';

const footerLinks = {
    'Quick Links': [
        { label: 'Home', href: '/' },
        { label: 'Work Abroad', href: '/visa-services' },
        { label: 'Visa Services', href: '/visa-services' },
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
    ],
    'Services': [
        { label: 'Dubai Work Visa', href: '/visa-services' },
        { label: 'Skilled Worker Visa', href: '/visa-services' },
        { label: 'Work Permit Help', href: '/contact' },
        { label: 'Job Placement', href: '/about' },
        { label: 'Relocation Support', href: '/contact' },
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
                            <p>Your Gateway to Global Work Visas and Career Relocation.</p>
                            <div className="footer-social">
                                <a href="#" aria-label="LinkedIn"><Globe size={15} /></a>
                                <a href="#" aria-label="Twitter"><Send size={15} /></a>
                                <a href="#" aria-label="YouTube"><Play size={15} /></a>
                            </div>
                            <div className="footer-contact-inline">
                                <a href="mailto:traveliumgrobal@gmail.com"><Mail size={13} /> traveliumgrobal@gmail.com</a>
                                <a href="tel:+250782531515"><Phone size={13} /> +250 782531515 (Main)</a> <a href="https://wa.me/250782531515" target="_blank" rel="noopener noreferrer" className="whatsapp-link"><Send size={13} /></a>
                                <a href="tel:+250796230619"><Phone size={13} /> +250 796230619 (Assistant)</a>
                                <a href="https://wa.me/250796230619" target="_blank" rel="noopener noreferrer" className="whatsapp-link"><Send size={13} /></a>
                                <a href="tel:+250793658206"><Phone size={13} /> +250 793658206 (Support)</a>
                                <a href="https://wa.me/250793658206" target="_blank" rel="noopener noreferrer" className="whatsapp-link"><Send size={13} /></a>
                            </div>
                        </div>

                        <div className="footer-links-wrapper">
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
