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
                    <h1>Global Flight Booking</h1>
                    <p>Exclusive deals on international flights. Direct routes to Dubai, USA, Europe, and Asia.</p>
                </div>
            </div>

            <section className="form-page">
                <div className="container">
                    <div className="flights-grid">
                        <div className="flights-form-container">
                            <form className="form-card animate-fadeIn" onSubmit={handleSubmit}>
                                <div className="form-header">
                                    <div className="form-icon-circle"><Plane size={24} /></div>
                                    <h2>Flight Reservation</h2>
                                    <p className="sub">Secure your seat at the best rate. We'll handle the logistics.</p>
                                </div>

                                <div className="trip-type-selector">
                                    <label className={`trip-type-btn ${form.trip_type === 'one-way' ? 'active' : ''}`}>
                                        <input type="radio" name="trip_type" value="one-way" checked={form.trip_type === 'one-way'} onChange={set} />
                                        One Way
                                    </label>
                                    <label className={`trip-type-btn ${form.trip_type === 'round-trip' ? 'active' : ''}`}>
                                        <input type="radio" name="trip_type" value="round-trip" checked={form.trip_type === 'round-trip'} onChange={set} />
                                        Round Trip
                                    </label>
                                </div>

                                <div className="form-grid">
                                    <div className="form-group full">
                                        <label>Full Name *</label>
                                        <input name="full_name" value={form.full_name} onChange={set} required placeholder="Name as on Passport" />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Email Address *</label>
                                            <input type="email" name="email" value={form.email} onChange={set} required placeholder="you@email.com" />
                                        </div>
                                        <div className="form-group">
                                            <label>Phone Number *</label>
                                            <input name="phone" value={form.phone} onChange={set} required placeholder="+1 (999) 00-0000" />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Departure City *</label>
                                            <div className="input-with-icon">
                                                <MapPin size={16} />
                                                <input name="origin" value={form.origin} onChange={set} required placeholder="From where?" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Destination City *</label>
                                            <div className="input-with-icon">
                                                <MapPin size={16} />
                                                <input name="destination" value={form.destination} onChange={set} required placeholder="To where?" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Departure Date *</label>
                                            <div className="input-with-icon">
                                                <Calendar size={16} />
                                                <input type="date" name="departure_date" value={form.departure_date} onChange={set} required />
                                            </div>
                                        </div>
                                        {form.trip_type === 'round-trip' && (
                                            <div className="form-group">
                                                <label>Return Date *</label>
                                                <div className="input-with-icon">
                                                    <Calendar size={16} />
                                                    <input type="date" name="return_date" value={form.return_date} onChange={set} required />
                                                </div>
                                            </div>
                                        )}
                                        <div className="form-group">
                                            <label>Passengers *</label>
                                            <div className="input-with-icon">
                                                <Users size={16} />
                                                <select name="passengers" value={form.passengers} onChange={set}>
                                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Adult' : 'Adults'}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="file-upload-section">
                                        <label className="section-label">Required Documents</label>
                                        <div className="file-grid">
                                            <div className="file-input-card">
                                                <div className="file-info">
                                                    <Upload size={18} />
                                                    <span>Passport Photo *</span>
                                                </div>
                                                <input type="file" name="passport" onChange={handleFile} accept="image/*,.pdf" required />
                                                <small>Clear copy of bio-data page</small>
                                            </div>
                                            <div className="file-input-card">
                                                <div className="file-info">
                                                    <Upload size={18} />
                                                    <span>National ID</span>
                                                </div>
                                                <input type="file" name="id_card" onChange={handleFile} accept="image/*,.pdf" />
                                                <small>Front and back copy</small>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group full">
                                        <label>Additional Requests</label>
                                        <textarea name="message" value={form.message} onChange={set} placeholder="Preferred airline, seat preferences, or dietary requirements..." />
                                    </div>

                                    <button type="submit" className="form-submit" disabled={loading}>
                                        {loading ? 'Processing...' : 'Book Flight Now'}
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

                        <div className="flights-sidebar">
                            <div className="info-card">
                                <h3>Why Book With Us?</h3>
                                <ul className="info-list">
                                    <li><ChevronRight size={14} /> Competitive Pricing</li>
                                    <li><ChevronRight size={14} /> 24/7 Travel Support</li>
                                    <li><ChevronRight size={14} /> Visa-Linked Booking</li>
                                    <li><ChevronRight size={14} /> Flexible Rescheduling</li>
                                </ul>
                            </div>

                            <div className="help-box">
                                <div className="help-icon"><Info size={24} /></div>
                                <h4>Need Assistance?</h4>
                                <p>Our travel consultants are ready to help you plan your itinerary.</p>
                                <a href="https://wa.me/250793658206" className="btn btn-whatsapp">
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
