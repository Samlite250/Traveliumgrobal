import { Link } from 'react-router-dom'
import { Plane, Globe, Send, Play, Mail, Phone } from 'lucide-react'
const WhatsAppIcon = ({ size = 13 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);


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
        <footer className="footer-premium">
            <div className="container">
                <div className="footer-main-grid">
                    <div className="footer-brand-side">
                        <Link to="/" className="nav-logo">
                            <div className="logo-icon"><Plane size={24} transform="rotate(45)" /></div>
                            <div className="logo-text-stack">
                                <span className="logo-name">TRAVELIUM</span>
                                <span className="logo-tagline">Grobal</span>
                            </div>
                        </Link>
                        <p className="brand-pitch">
                            Your trusted partner for global career transformation. We simplify the complex visa and relocation process so you can focus on your future.
                        </p>
                        <div className="social-links-premium">
                            <a href="#" className="social-pill"><Globe size={16} /></a>
                            <a href="#" className="social-pill"><Send size={16} /></a>
                            <a href="#" className="social-pill"><Play size={16} /></a>
                        </div>
                    </div>

                    <div className="footer-nav-grid">
                        <div className="footer-links-col">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/about">About Travelium</Link></li>
                                <li><Link to="/visa-services">Visa Solutions</Link></li>
                                <li><Link to="/flights">Flight Booking</Link></li>
                                <li><Link to="/contact">Contact Support</Link></li>
                            </ul>
                        </div>
                        <div className="footer-links-col">
                            <h4>Hot Destinies</h4>
                            <ul>
                                <li><Link to="/visa-services">Dubai, UAE</Link></li>
                                <li><Link to="/visa-services">Canada PR</Link></li>
                                <li><Link to="/visa-services">United Kingdom</Link></li>
                                <li><Link to="/visa-services">USA Work Visa</Link></li>
                                <li><Link to="/visa-services">Germany & EU</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-contact-side">
                        <div className="contact-card-premium">
                            <h4>Support Hub</h4>
                            <div className="contact-grid-premium">
                                <div className="contact-block">
                                    <div className="block-head">
                                        <div className="block-icon"><ShieldCheck size={16} /></div>
                                        <span>Visas & General</span>
                                    </div>
                                    <div className="block-body">
                                        <a href="tel:+250782531515" className="link-item">+250 782 531 515</a>
                                        <a href="https://wa.me/250782531515" target="_blank" rel="noopener noreferrer" className="wa-link-inline">
                                            <WhatsAppIcon size={14} /> Secure Chat
                                        </a>
                                    </div>
                                </div>

                                <div className="contact-block">
                                    <div className="block-head">
                                        <div className="block-icon"><Globe size={16} /></div>
                                        <span>Jobs & Recruitment</span>
                                    </div>
                                    <div className="block-body">
                                        <a href="tel:+250796230619" className="link-item">+250 796 230 619</a>
                                        <a href="https://wa.me/250796230619" target="_blank" rel="noopener noreferrer" className="wa-link-inline">
                                            <WhatsAppIcon size={14} /> Direct Hire
                                        </a>
                                    </div>
                                </div>

                                <div className="contact-block">
                                    <div className="block-head">
                                        <div className="block-icon"><Plane size={16} /></div>
                                        <span>Air Ticketing</span>
                                    </div>
                                    <div className="block-body">
                                        <a href="tel:+250793658206" className="link-item">+250 793 658 206</a>
                                        <a href="https://wa.me/250793658206" target="_blank" rel="noopener noreferrer" className="wa-link-inline">
                                            <WhatsAppIcon size={14} /> Book Flight
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom-premium">
                    <div className="copyright-info">
                        <span>© {new Date().getFullYear()} Travelium Global. Licensed Recruitment & Travel Agency.</span>
                    </div>
                    <div className="legal-links">
                        <Link to="#">Terms of Use</Link>
                        <Link to="#">Privacy Policy</Link>
                        <span className="location-tag"><Globe size={14} /> Headquartered in Kigali, Rwanda</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
