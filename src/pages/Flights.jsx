import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, addDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import {
    Plane, Send, CheckCircle, ArrowRight,
    Calendar, MapPin, Users, Upload,
    ChevronRight, Info, PhoneCall, ShieldCheck, Clock
} from 'lucide-react'

export default function Flights() {
    const { currentUser } = useAuth()
    const toast = useToast()
    const [siteSettings, setSiteSettings] = useState(null)

    useEffect(() => {
        if (!db) return
        const unsub = onSnapshot(doc(db, 'settings', 'site'), (snap) => {
            if (snap.exists()) setSiteSettings(snap.data())
        })
        return unsub
    }, [])
    const w = siteSettings?.whatsappNumbers || []
    const ticketingNum = w.find(n => n.label?.toLowerCase().includes('ticket') || n.label?.toLowerCase().includes('air')) || w[0] || { number: '250793658206' }
    const waNum = ticketingNum.number.startsWith('+') ? ticketingNum.number.substring(1) : ticketingNum.number.replace(/[^0-9]/g, '')
    const [form, setForm] = useState({
        full_name: '', email: '', phone: '',
        origin: '', destination: '',
        departure_date: '',
        trip_type: 'one-way'
    })
    const [files, setFiles] = useState({
        passport: null
    })
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(false)

    const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    const handleFile = e => setFiles(f => ({ ...f, [e.target.name]: e.target.files[0] }))

    const uploadFile = async (file, path) => {
        if (!file) return null
        const storageRef = ref(storage, path)
        await uploadBytes(storageRef, file)
        return getDownloadURL(storageRef)
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        setStatus(null)

        try {
            let passportUrl = null
            if (files.passport && storage) {
                passportUrl = await uploadFile(files.passport, `flights/${currentUser?.uid || 'guest'}/passport_${Date.now()}`)
            }

            if (!db) {
                const existing = JSON.parse(localStorage.getItem('travelium_flights') || '[]')
                existing.push({ ...form, program_type: 'flight_booking', status: 'pending', documents: { passport: passportUrl }, created_at: new Date().toISOString(), saved_at: Date.now() })
                localStorage.setItem('travelium_flights', JSON.stringify(existing))
            } else {
                await addDoc(collection(db, 'applications'), {
                    ...form, user_id: currentUser?.uid || null,
                    user_email: currentUser?.email || form.email,
                    program_type: 'flight_booking', status: 'pending',
                    documents: { passport: passportUrl },
                    created_at: serverTimestamp(),
                })
            }

            toast('Flight booking request submitted! Our travel agent will contact you shortly.', 'success')
            setStatus({ type: 'success', msg: 'Flight booking request submitted! Our travel agent will contact you with the best prices shortly.' })
            setForm({
                full_name: '', email: '', phone: '',
                origin: '', destination: '',
                departure_date: '',
                trip_type: 'one-way'
            })
            setFiles({ passport: null })
        } catch (error) {
            console.error('Flight booking error:', error)
            const existing = JSON.parse(localStorage.getItem('travelium_flights') || '[]')
            existing.push({ ...form, program_type: 'flight_booking', status: 'pending', documents: { passport: null }, created_at: new Date().toISOString(), saved_at: Date.now() })
            localStorage.setItem('travelium_flights', JSON.stringify(existing))
            toast('Flight request saved offline. We\'ll contact you once received.', 'success')
            setStatus({ type: 'success', msg: 'Flight request saved offline.' })
            setForm({
                full_name: '', email: '', phone: '',
                origin: '', destination: '',
                departure_date: '',
                trip_type: 'one-way'
            })
            setFiles({ passport: null })
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="flights-page">
            <div className="page-hero">
                <div className="page-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=1600&auto=format&fit=crop)' }} />
                <div className="container page-hero-content">
                    <div className="breadcrumb">
                        <Link to="/">Home</Link><span className="sep">›</span><span>Book Flight</span>
                    </div>
                    <h1 className="animate-reveal">Global Flight Booking</h1>
                    <p className="animate-reveal" style={{ animationDelay: '0.1s' }}>Exclusive deals on international flights. We source the best prices for your journey.</p>
                </div>
            </div>

            <section className="form-page section">
                <div className="container">
                    <div className="flights-layout">
                        <div className="flights-main">
                            <form className="premium-form glass animate-reveal" onSubmit={handleSubmit} style={{ animationDelay: '0.2s' }}>
                                <div className="form-header-premium">
                                    <div className="header-badge">Step 1 of 2</div>
                                    <h2>Flight Ticket Inquiry</h2>
                                    <p>Share your travel plans and receive a quote within minutes.</p>
                                </div>

                                <div className="trip-type-tabs">
                                    <button
                                        type="button"
                                        className={`trip-tab ${form.trip_type === 'one-way' ? 'active' : ''}`}
                                        onClick={() => setForm(f => ({ ...f, trip_type: 'one-way' }))}
                                    >
                                        One Way
                                    </button>
                                    <button
                                        type="button"
                                        className={`trip-tab ${form.trip_type === 'round-trip' ? 'active' : ''}`}
                                        onClick={() => setForm(f => ({ ...f, trip_type: 'round-trip' }))}
                                    >
                                        Round Trip
                                    </button>
                                </div>

                                <div className="form-premium-grid">
                                    <div className="input-group full">
                                        <label>Full Name</label>
                                        <div className="input-field">
                                            <Users size={18} className="field-icon" />
                                            <input name="full_name" value={form.full_name} onChange={set} required placeholder="Enter full name" />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label>Email Address</label>
                                        <div className="input-field">
                                            <Send size={18} className="field-icon" />
                                            <input type="email" name="email" value={form.email} onChange={set} required placeholder="you@example.com" />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label>Phone Number</label>
                                        <div className="input-field">
                                            <PhoneCall size={18} className="field-icon" />
                                            <input name="phone" value={form.phone} onChange={set} required placeholder="+250..." />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label>Origin City</label>
                                        <div className="input-field">
                                            <MapPin size={18} className="field-icon" />
                                            <input name="origin" value={form.origin} onChange={set} required placeholder="From where?" />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label>Destination City</label>
                                        <div className="input-field">
                                            <MapPin size={18} className="field-icon" />
                                            <input name="destination" value={form.destination} onChange={set} required placeholder="To where?" />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label>Departure Date</label>
                                        <div className="input-field">
                                            <Calendar size={18} className="field-icon" />
                                            <input type="date" name="departure_date" value={form.departure_date} onChange={set} required />
                                        </div>
                                    </div>


                                </div>

                                <div className="document-upload-premium">
                                    <h3>Travel Document <small>(Optional for inquiry)</small></h3>
                                    <div className="upload-grid-premium">
                                        <label className="upload-box-premium full-width">
                                            <Upload size={20} />
                                            <span>Passport Bio-Page Photo</span>
                                            <input type="file" name="passport" onChange={handleFile} accept="image/*,.pdf" />
                                        </label>
                                    </div>
                                </div>

                                <button type="submit" className="submit-btn-premium" disabled={loading}>
                                    {loading ? 'Sending Request...' : 'Get Best Quote'}
                                    <ArrowRight size={20} />
                                </button>

                                {status && (
                                    <div className={`status-alert ${status.type} animate-reveal`}>
                                        {status.type === 'success' ? <CheckCircle size={20} /> : <Info size={20} />}
                                        {status.msg}
                                    </div>
                                )}
                            </form>
                        </div>

                        <div className="flights-sidebar-premium">
                            <div className="sidebar-card animate-reveal" style={{ animationDelay: '0.3s' }}>
                                <h3>Why Travelium?</h3>
                                <ul className="premium-features-list">
                                    <li>
                                        <div className="feat-icon"><ShieldCheck size={18} /></div>
                                        <div>
                                            <strong>Verified Agency</strong>
                                            <span>Licensed travel partner.</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="feat-icon"><Plane size={18} /></div>
                                        <div>
                                            <strong>500+ Airlines</strong>
                                            <span>Widest range of options.</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="feat-icon"><Clock size={18} /></div>
                                        <div>
                                            <strong>Fast Response</strong>
                                            <span>Quotes within 30 minutes.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="whatsapp-help-card animate-reveal" style={{ animationDelay: '0.4s' }}>
                                <div className="wa-icon-large"><Send size={32} /></div>
                                <h4>Instant Assistance</h4>
                                <p>Talk directly to our travel experts for immediate booking support.</p>
                                <a href={`https://wa.me/${waNum}`} className="wa-btn-premium">
                                    Open WhatsApp Chat
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
