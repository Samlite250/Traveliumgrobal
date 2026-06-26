import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
    Plane, Send, CheckCircle, ArrowRight,
    Calendar, MapPin, Users, Upload,
    ChevronRight, Info
} from 'lucide-react'

export default function Flights() {
    const [form, setForm] = useState({
        full_name: '', email: '', phone: '',
        origin: '', destination: '',
        departure_date: '', return_date: '',
        trip_type: 'one-way', passengers: '1',
        message: ''
    })
    const [files, setFiles] = useState({
        passport: null,
        id_card: null
    })
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(false)

    const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    const handleFile = e => setFiles(f => ({ ...f, [e.target.name]: e.target.files[0] }))

    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        setStatus(null)

        try {
            // In a real implementation, we would upload files to Supabase Storage here
            // const { data, error: uploadError } = await supabase.storage.from('applications').upload(...)

            const { error } = await supabase.from('applications').insert([{
                ...form,
                program_type: 'flight_booking',
                // file_urls will be added here after upload logic is implemented
            }])

            if (error) throw error

            setStatus({ type: 'success', msg: 'Flight booking request submitted! Our travel agent will contact you with the best prices shortly.' })
            setForm({
                full_name: '', email: '', phone: '',
                origin: '', destination: '',
                departure_date: '', return_date: '',
                trip_type: 'one-way', passengers: '1',
                message: ''
            })
            setFiles({ passport: null, id_card: null })
        } catch (error) {
            setStatus({ type: 'error', msg: 'Submission failed. Please try again.' })
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

                                    {form.trip_type === 'round-trip' ? (
                                        <div className="input-group">
                                            <label>Return Date</label>
                                            <div className="input-field">
                                                <Calendar size={18} className="field-icon" />
                                                <input type="date" name="return_date" value={form.return_date} onChange={set} required />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="input-group">
                                            <label>Passengers</label>
                                            <div className="input-field">
                                                <Users size={18} className="field-icon" />
                                                <select name="passengers" value={form.passengers} onChange={set}>
                                                    {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Adult' : 'Adults'}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="document-upload-premium">
                                    <h3>Travel Documents <small>(Optional for inquiry)</small></h3>
                                    <div className="upload-grid-premium">
                                        <label className="upload-box-premium">
                                            <Upload size={20} />
                                            <span>Passport Bio-Page</span>
                                            <input type="file" name="passport" onChange={handleFile} accept="image/*,.pdf" />
                                        </label>
                                        <label className="upload-box-premium">
                                            <Upload size={20} />
                                            <span>National ID</span>
                                            <input type="file" name="id_card" onChange={handleFile} accept="image/*,.pdf" />
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
                                <a href="https://wa.me/250793658206" className="wa-btn-premium">
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
