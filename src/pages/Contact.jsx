import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, addDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useToast } from '../context/ToastContext'
import SEOHead from '../components/SEOHead'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Contact() {
    const { t } = useTranslation()
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(false)
    const [siteSettings, setSiteSettings] = useState(null)
    const toast = useToast()

    useEffect(() => {
        if (!db) return
        const unsub = onSnapshot(doc(db, 'settings', 'site'), (snap) => {
            if (snap.exists()) setSiteSettings(snap.data())
        })
        return unsub
    }, [])
    const s = siteSettings || {}
    const w = s.whatsappNumbers || []

    const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        setStatus(null)
        try {
            if (!db) {
                const existing = JSON.parse(localStorage.getItem('travelium_contacts') || '[]')
                existing.push({ ...form, created_at: new Date().toISOString(), saved_at: Date.now() })
                localStorage.setItem('travelium_contacts', JSON.stringify(existing))
            } else {
                await addDoc(collection(db, 'contacts'), {
                    ...form,
                    created_at: serverTimestamp()
                })
            }
            toast('Message sent! We\'ll get back to you within 24 hours.', 'success')
            setStatus({ type: 'success', msg: 'Message sent! We\'ll get back to you within 24 hours.' })
            setForm({ name: '', email: '', phone: '', subject: '', message: '' })
        } catch (error) {
            console.error('Contact form error:', error)
            const existing = JSON.parse(localStorage.getItem('travelium_contacts') || '[]')
            existing.push({ ...form, created_at: new Date().toISOString(), saved_at: Date.now() })
            localStorage.setItem('travelium_contacts', JSON.stringify(existing))
            toast('Message saved offline. We\'ll receive it once connected.', 'success')
            setStatus({ type: 'success', msg: 'Message saved offline.' })
            setForm({ name: '', email: '', phone: '', subject: '', message: '' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <main>
            <SEOHead
                title="Contact Travelium Global — Get a Free Visa & Study Abroad Consultation"
                description="Contact Travelium Global for a free consultation on study abroad, work visas, scholarships & international jobs. Our expert team serves Rwanda, East Africa and worldwide clients."
                canonical="/contact"
            />
            <div className="page-hero">
                <div className="page-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1516387933999-ed33b5ecab39?q=80&w=1600&auto=format&fit=crop)' }} />
                <div className="container page-hero-content">
                    <div className="breadcrumb">
                        <Link to="/">Home</Link><span className="sep">›</span><span>{t('contact.breadcrumb', 'Contact Us')}</span>
                    </div>
                    <h1>{t('contact.title', 'Contact Us')}</h1>
                    <p>{t('contact.subtitle', "Have a question? We're here to help. Reach out to our expert team today.")}</p>
                </div>
            </div>

            <section className="content-section">
                <div className="container">
                    <div className="contact-split">
                        <div className="contact-info">
                            <div className="section-label">{t('contact.getInTouch', 'Get In Touch')}</div>
                            <h2>{t('contact.talkTitle', "Let's Talk About Your Future")}</h2>
                            <p>{t('contact.talkSub', 'Our team of expert consultants is ready to answer all your questions about studying abroad, visa requirements, or scholarship opportunities.')}</p>
                            <div className="contact-items">
                                <div className="contact-item">
                                    <div className="contact-item-icon"><MapPin size={20} /></div>
                                    <div>
                                        <h4>{t('contact.office', 'Office Address')}</h4>
                                        <p>{s.address || '123 Global Avenue, Suite 400,<br />New York, NY 10001, USA'}</p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <div className="contact-item-icon"><Phone size={20} /></div>
                                    <div className="contact-phone-list">
                                        <h4>{t('contact.support', 'TRAVELIUM SUPPORT')}</h4>
                                        <div className="phone-entry">
                                            <p><strong>{s.supportPhone || '+250 786 189 460'}</strong></p>
                                            <small>Visas &amp; General Support</small>
                                            {s.supportPhone && <a href={`https://wa.me/${s.supportPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="whatsapp-link"><Send size={13} /></a>}
                                        </div>
                                        {w.length > 0 ? w.map((n, i) => (
                                            <div className="phone-entry" key={i}>
                                                <p><strong>{n.number}</strong></p>
                                                <small>{n.label || (i === 0 ? 'Assistant' : 'Support & Inquiry')}</small>
                                                <a href={`https://wa.me/${n.number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="whatsapp-link"><Send size={13} /></a>
                                            </div>
                                        )) : (<>
                                            <div className="phone-entry">
                                                <p><strong>+257 65 84 02 80</strong></p>
                                                <small>Regional Support (Burundi)</small>
                                                <a href="https://wa.me/25765840280" target="_blank" rel="noopener noreferrer" className="whatsapp-link"><Send size={13} /></a>
                                            </div>
                                            <div className="phone-entry">
                                                <p><strong>+250 733 387 135</strong></p>
                                                <small>Jobs &amp; Recruitment</small>
                                                <a href="https://wa.me/250733387135" target="_blank" rel="noopener noreferrer" className="whatsapp-link"><Send size={13} /></a>
                                            </div>
                                            <div className="phone-entry">
                                                <p><strong>+250 732 580 014</strong></p>
                                                <small>Air Ticketing &amp; Visas</small>
                                                <a href="https://wa.me/250732580014" target="_blank" rel="noopener noreferrer" className="whatsapp-link"><Send size={13} /></a>
                                            </div>
                                        </>)}
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <div className="contact-item-icon"><Mail size={20} /></div>
                                    <div>
                                        <h4>{t('contact.emailLabel', 'Email Address')}</h4>
                                        <p>{s.supportEmail || 'traveliumgrobal@gmail.com'}</p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <div className="contact-item-icon"><Clock size={20} /></div>
                                    <div>
                                        <h4>{t('contact.workingHours', 'Working Hours')}</h4>
                                        <p>{s.workingHours || 'Mon – Sat: 9:00 AM – 7:00 PM'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form className="form-card" onSubmit={handleSubmit}>
                            <div className="form-header">
                                <h2>{t('contact.sendMessage', 'Send a Message')}</h2>
                                <p className="sub">{t('contact.sendSub', "Fill in the form and we'll respond within 24 hours.")}</p>
                            </div>
                            <div className="form-grid">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>{t('contact.fName', 'Full Name *')}</label>
                                        <input name="name" value={form.name} onChange={set} required placeholder="e.g: Sam Dev" />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('contact.fEmail', 'Email Address *')}</label>
                                        <input type="email" name="email" value={form.email} onChange={set} required placeholder="e.g: travelium@gmail.com" />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>{t('contact.fPhone', 'Phone Number')}</label>
                                        <input name="phone" value={form.phone} onChange={set} placeholder="+1 (999) 000-0000" />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('contact.fSubject', 'Subject *')}</label>
                                        <select name="subject" value={form.subject} onChange={set} required>
                                            <option value="">Select a subject</option>
                                            <option>Study Abroad Inquiry</option>
                                            <option>Student Visa Help</option>
                                            <option>Tourist Visa Help</option>
                                            <option>Work Visa Help</option>
                                            <option>Scholarship Inquiry</option>
                                            <option>General Question</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>{t('contact.fMessage', 'Message *')}</label>
                                    <textarea name="message" value={form.message} onChange={set} required placeholder="Tell us how we can help you..." />
                                </div>
                                <button type="submit" className="form-submit" disabled={loading}>
                                    {loading ? t('contact.sendingBtn', 'Sending...') : t('contact.sendBtn', 'Send Message')}
                                    {!loading && <Send size={18} style={{ marginLeft: '.75rem' }} />}
                                </button>
                                {status && (
                                    <div className={`form-msg ${status.type}`}>
                                        {status.type === 'success' && <CheckCircle size={18} style={{ marginRight: '.5rem' }} />}
                                        {status.msg}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    )
}
