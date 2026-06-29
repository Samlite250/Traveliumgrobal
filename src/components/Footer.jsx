import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Plane, Globe, Send, Play, Mail, Phone, ShieldCheck } from 'lucide-react'

export default function Footer() {
    const [siteSettings, setSiteSettings] = useState(null)

    useEffect(() => {
        if (!db) return
        const unsub = onSnapshot(doc(db, 'settings', 'site'), (snap) => {
            if (snap.exists()) setSiteSettings(snap.data())
        })
        return unsub
    }, [])
    const s = siteSettings || {}
    const whatsAppNumbers = s.whatsappNumbers || []
    const getFirstPhone = () => {
        if (s.supportPhone) return s.supportPhone
        if (whatsAppNumbers.length > 0) return whatsAppNumbers[0].number?.replace(/^\+/, '') || '+250 782 531 515'
        return '+250 782 531 515'
    }
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
                        <p className="brand-pitch">{s.description || 'Your trusted partner for global career transformation.'}</p>
                        <div className="social-links-premium">
                            {s.linkedin && <a href={s.linkedin} className="social-pill" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Globe size={16} /></a>}
                            {s.twitter && <a href={s.twitter} className="social-pill" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><Send size={16} /></a>}
                            {s.youtube && <a href={s.youtube} className="social-pill" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Play size={16} /></a>}
                            {s.instagram && <a href={s.instagram} className="social-pill" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Send size={16} /></a>}
                            {s.facebook && <a href={s.facebook} className="social-pill" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Globe size={16} /></a>}
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
                        <div className="contact-card-premium" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                            <h4 style={{ color: 'white', marginBottom: '1.5rem' }}>Support Hub</h4>
                            <div className="contact-grid-premium">
                                <div className="contact-block">
                                    <div className="block-head">
                                        <div className="block-icon"><ShieldCheck size={16} /></div>
                                        <span style={{ color: 'white' }}>Visas & General</span>
                                    </div>
                                    <div className="block-body" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.4rem', color: 'rgba(255,255,255,0.8)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                            <Phone size={14} color="var(--gold)" /> <span>{getFirstPhone()}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                            <Mail size={14} color="var(--gold)" /> <a href={`mailto:${s.supportEmail || 'traveliumglobal@gmail.com'}`} style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>{s.supportEmail || 'traveliumglobal@gmail.com'}</a>
                                        </div>
                                    </div>
                                </div>

                                {whatsAppNumbers.length >= 1 ? whatsAppNumbers.map((w, i) => (
                                <div className="contact-block" key={i}>
                                    <div className="block-head">
                                        <div className="block-icon"><Globe size={16} /></div>
                                        <span style={{ color: 'white' }}>{w.label || (i === 0 ? 'Jobs & Recruitment' : 'Air Ticketing')}</span>
                                    </div>
                                    <div className="block-body" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.4rem', color: 'rgba(255,255,255,0.8)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                            <Phone size={14} color="var(--gold)" /> <span>{w.number}</span>
                                        </div>
                                    </div>
                                </div>
                                )) : (<>
                                <div className="contact-block">
                                    <div className="block-head">
                                        <div className="block-icon"><Globe size={16} /></div>
                                        <span style={{ color: 'white' }}>Jobs & Recruitment</span>
                                    </div>
                                    <div className="block-body" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.4rem', color: 'rgba(255,255,255,0.8)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                            <Phone size={14} color="var(--gold)" /> <span>+250 796 230 619</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="contact-block">
                                    <div className="block-head">
                                        <div className="block-icon"><Plane size={16} /></div>
                                        <span style={{ color: 'white' }}>Air Ticketing</span>
                                    </div>
                                    <div className="block-body" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.4rem', color: 'rgba(255,255,255,0.8)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                            <Phone size={14} color="var(--gold)" /> <span>+250 793 658 206</span>
                                        </div>
                                    </div>
                                </div>
                                </>)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom-premium">
                    <div className="copyright-info">
                        <span>© {new Date().getFullYear()} {s.copyright || 'Travelium Global. Licensed Recruitment & Travel Agency.'}</span>
                    </div>
                    <div className="legal-links">
                        <Link to="#">Terms of Use</Link>
                        <Link to="#">Privacy Policy</Link>
                        <span className="location-tag"><Globe size={14} /> {s.headquarters || 'Headquartered in Kigali, Rwanda'}</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
