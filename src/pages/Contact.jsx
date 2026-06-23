import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(false)

    const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        setStatus(null)
        const { error } = await supabase.from('contacts').insert([form])
        setLoading(false)
        if (error) {
            setStatus({ type: 'error', msg: 'Something went wrong. Please try again.' })
        } else {
            setStatus({ type: 'success', msg: 'Message sent! We\'ll get back to you within 24 hours.' })
            setForm({ name: '', email: '', phone: '', subject: '', message: '' })
        }
    }

    return (
        <main>
            <div className="page-hero">
                <div className="page-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1516387933999-ed33b5ecab39?q=80&w=1600&auto=format&fit=crop)' }} />
                <div className="container page-hero-content">
                    <div className="breadcrumb">
                        <Link to="/">Home</Link><span className="sep">›</span><span>Contact Us</span>
                    </div>
                    <h1>Contact Us</h1>
                    <p>Have a question? We're here to help. Reach out to our expert team today.</p>
                </div>
            </div>

            <section className="content-section">
                <div className="container">
                    <div className="contact-split">
                        <div className="contact-info">
                            <div className="section-label">Get In Touch</div>
                            <h2>Let's Talk About Your Future</h2>
                            <p>Our team of expert consultants is ready to answer all your questions about studying abroad, visa requirements, or scholarship opportunities.</p>
                            <div className="contact-items">
                                <div className="contact-item">
                                    <div className="contact-item-icon"><MapPin size={20} /></div>
                                    <div>
                                        <h4>Office Address</h4>
                                        <p>123 Global Avenue, Suite 400,<br />New York, NY 10001, USA</p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <div className="contact-item-icon"><Phone size={20} /></div>
                                    <div>
                                        <h4>Phone Number</h4>
                                        <p>+250 788207455</p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <div className="contact-item-icon"><Mail size={20} /></div>
                                    <div>
                                        <h4>Email Address</h4>
                                        <p>info@traveliumglobal.com</p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <div className="contact-item-icon"><Clock size={20} /></div>
                                    <div>
                                        <h4>Working Hours</h4>
                                        <p>Mon – Sat: 9:00 AM – 7:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form className="form-card" onSubmit={handleSubmit}>
                            <div className="form-header">
                                <h2>Send a Message</h2>
                                <p className="sub">Fill in the form and we'll respond within 24 hours.</p>
                            </div>
                            <div className="form-grid">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Full Name *</label>
                                        <input name="name" value={form.name} onChange={set} required placeholder="Your full name" />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address *</label>
                                        <input type="email" name="email" value={form.email} onChange={set} required placeholder="you@email.com" />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input name="phone" value={form.phone} onChange={set} placeholder="+1 (999) 000-0000" />
                                    </div>
                                    <div className="form-group">
                                        <label>Subject *</label>
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
                                    <label>Message *</label>
                                    <textarea name="message" value={form.message} onChange={set} required placeholder="Tell us how we can help you..." />
                                </div>
                                <button type="submit" className="form-submit" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Message'}
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
