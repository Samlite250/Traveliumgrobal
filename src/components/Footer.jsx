import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Plane, Globe, Send, Play, Mail, Phone, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Footer() {
    const { t } = useTranslation()
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
        if (whatsAppNumbers.length > 0) return whatsAppNumbers[0].number?.replace(/^\+/, '') || '+250 786 189 460'
        return '+250 786 189 460'
    }
    return (
        <footer className="footer-premium">
            <div className="container">
                <div className="footer-main-grid">
                    <div className="footer-brand-side">
                        <Link to="/" className="nav-logo">
                            <img src="/logo.png" alt="Travelium Global" className="brand-logo-img" />
                            <div className="logo-text-stack">
                                <span className="logo-name">TRAVELIUM</span>
                                <span className="logo-tagline">Global</span>
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
                            <h4>{t('footer.quickLinks', 'Quick Links')}</h4>
                            <ul>
                                <li><Link to="/">{t('navbar.home', 'Home')}</Link></li>
                                <li><Link to="/jobs">{t('footer.jobs', 'Jobs & Careers')}</Link></li>
                                <li><Link to="/about">{t('footer.about', 'About Travelium')}</Link></li>
                                <li><Link to="/visa-services">{t('footer.visaSolutions', 'Visa Solutions')}</Link></li>
                                <li><Link to="/flights">{t('footer.flightBooking', 'Flight Booking')}</Link></li>
                                <li><Link to="/contact">{t('footer.contactSupport', 'Contact Support')}</Link></li>
                            </ul>
                        </div>
                        <div className="footer-links-col">
                            <h4>{t('footer.hotDestinies', 'Hot Destinies')}</h4>
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
                        <div className="contact-card-premium" style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', padding: '1.25rem 1.5rem', borderRadius: '16px' }}>
                            <h4 style={{ color: 'var(--gold)', fontSize: '0.95rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: '800' }}>
                                Support Hub
                            </h4>
                            <div className="contact-grid-compact" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                <div className="contact-block-compact" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: '700', fontSize: '0.82rem', textTransform: 'uppercase' }}>
                                        <ShieldCheck size={15} color="var(--gold)" />
                                        <span>Visas & General Inquiries</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', paddingLeft: '1.4rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Phone size={13} color="var(--gold)" />
                                            <span>{getFirstPhone()}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Mail size={13} color="var(--gold)" />
                                            <a href={`mailto:${s.supportEmail || 'traveliumglobal@gmail.com'}`} style={{ color: '#cbd5e1', textDecoration: 'none' }}>{s.supportEmail || 'traveliumglobal@gmail.com'}</a>
                                        </div>
                                    </div>
                                </div>

                                <div className="contact-block-compact" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: '700', fontSize: '0.82rem', textTransform: 'uppercase' }}>
                                        <Globe size={15} color="var(--gold)" />
                                        <span>Jobs & Recruitment</span>
                                    </div>
                                    <div style={{ paddingLeft: '1.4rem', fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Phone size={13} color="var(--gold)" />
                                        <span>{whatsAppNumbers[1]?.number || '+250 796 230 619'}</span>
                                    </div>
                                </div>

                                <div className="contact-block-compact" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: '700', fontSize: '0.82rem', textTransform: 'uppercase' }}>
                                        <Plane size={15} color="var(--gold)" />
                                        <span>Air Ticketing</span>
                                    </div>
                                    <div style={{ paddingLeft: '1.4rem', fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Phone size={13} color="var(--gold)" />
                                        <span>{whatsAppNumbers[2]?.number || '+250 793 658 206'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom-premium">
                    <div className="copyright-info">
                        <span>© {new Date().getFullYear()} {s.copyright || 'Travelium Global. Licensed Recruitment & Travel Agency.'}</span>
                    </div>
                    <div className="legal-links">
                        <Link to="/contact">{t('footer.terms', 'Terms of Use')}</Link>
                        <Link to="/contact">{t('footer.privacy', 'Privacy Policy')}</Link>
                        <span className="location-tag"><Globe size={14} /> {s.headquarters || 'Headquartered in Dubai, UAE'}</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
