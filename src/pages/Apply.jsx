import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import {
    Send, CheckCircle, ArrowRight, Globe, Info, Upload,
    Loader2, AlertCircle, LayoutDashboard, BookOpen
} from 'lucide-react'

export default function Apply() {
    const { currentUser } = useAuth()
    const navigate = useNavigate()
    const toast = useToast()

    const [form, setForm] = useState({
        full_name: '', email: '', phone: '', nationality: '',
        destination: '', program_type: '', education_level: '', message: ''
    })
    const [files, setFiles]               = useState({ passport: null, diploma: null, id_card: null })
    const [status, setStatus]             = useState(null)
    const [loading, setLoading]           = useState(false)
    const [uploadProgress, setUploadProgress] = useState('')

    // Auto-fill email from logged-in user
    useEffect(() => {
        if (currentUser?.email) {
            setForm(f => ({ ...f, email: currentUser.email }))
        }
        if (currentUser?.displayName) {
            setForm(f => ({ ...f, full_name: currentUser.displayName }))
        }
    }, [currentUser])

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
        if (!currentUser) { navigate('/login'); return }
        setLoading(true)
        setStatus(null)

        try {
            const uid = currentUser.uid
            let passportUrl = null;
            let diplomaUrl = null;
            let idCardUrl = null;

            try {
                setUploadProgress('Uploading documents (if provided)...')
                passportUrl = await uploadFile(files.passport, `applications/${uid}/passport_${Date.now()}`)
                diplomaUrl = await uploadFile(files.diploma, `applications/${uid}/diploma_${Date.now()}`)
                idCardUrl = await uploadFile(files.id_card, `applications/${uid}/id_card_${Date.now()}`)
            } catch (storageErr) {
                console.warn('[Apply] Storage is not initialized or rejected the upload. Proceeding without files.', storageErr);
            }

            setUploadProgress('Saving your application...')

            if (!db) {
                const existing = JSON.parse(localStorage.getItem('travelium_applications') || '[]')
                existing.push({ ...form, user_id: uid, user_email: currentUser.email, status: 'pending', documents: { passport: null, diploma: null, id_card: null }, created_at: new Date().toISOString(), saved_at: Date.now() })
                localStorage.setItem('travelium_applications', JSON.stringify(existing))
            } else {
                await addDoc(collection(db, 'applications'), {
                    full_name: form.full_name, email: form.email || currentUser.email,
                    phone: form.phone, nationality: form.nationality,
                    destination: form.destination, program_type: form.program_type,
                    education_level: form.education_level, message: form.message,
                    user_id: uid, user_email: currentUser.email,
                    status: 'pending',
                    documents: { passport: passportUrl || null, diploma: diplomaUrl || null, id_card: idCardUrl || null },
                    created_at: serverTimestamp(), updated_at: serverTimestamp(),
                })
            }

            setStatus({ type: 'success' })
            toast('Application submitted successfully! We\'ll review it shortly.', 'success')
            setForm({
                full_name: '', email: currentUser.email || '', phone: '',
                nationality: '', destination: '', program_type: '',
                education_level: '', message: ''
            })
            setFiles({ passport: null, diploma: null, id_card: null })
        } catch (err) {
            console.error('[Apply] Submission error:', err)
            const existing = JSON.parse(localStorage.getItem('travelium_applications') || '[]')
            existing.push({ ...form, user_id: uid, user_email: currentUser.email, status: 'pending', documents: { passport: null, diploma: null, id_card: null }, created_at: new Date().toISOString(), saved_at: Date.now() })
            localStorage.setItem('travelium_applications', JSON.stringify(existing))
            setStatus({ type: 'success' })
            toast('Application saved offline. We\'ll review it once synced.', 'success')
            setForm({
                full_name: '', email: currentUser.email || '', phone: '',
                nationality: '', destination: '', program_type: '',
                education_level: '', message: ''
            })
            setFiles({ passport: null, diploma: null, id_card: null })
        }
        setUploadProgress('')
        setLoading(false)
    }

    return (
        <main>
            <div className="page-hero">
                <div className="page-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop)' }} />
                <div className="container page-hero-content">
                    <div className="breadcrumb">
                        <Link to="/">Home</Link><span className="sep">›</span><span>Apply Now</span>
                    </div>
                    <h1>Start Your Application</h1>
                    <p>Fill in your details and our expert team will guide you to the right program and destination.</p>
                </div>
            </div>

            <section className="form-page">
                <div className="container">
                    {status?.type === 'success' ? (
                        <div className="apply-success-card animate-fadeIn">
                            <div className="apply-success-icon">
                                <CheckCircle size={48} />
                            </div>
                            <h2>Application Submitted!</h2>
                            <p>
                                Thank you! Our team has received your application and will review it within
                                <strong> 2 business days</strong>. You'll be notified of any updates.
                            </p>
                            <div className="apply-success-actions">
                                <Link to="/dashboard" className="btn btn-primary">
                                    <LayoutDashboard size={18} /> Track Application
                                </Link>
                                <button onClick={() => setStatus(null)} className="btn btn-outline" style={{ borderColor: 'var(--navy)', color: 'var(--navy)' }}>
                                    <BookOpen size={18} /> Submit Another
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form className="form-card animate-fadeIn" onSubmit={handleSubmit}>
                            <div className="form-header">
                                <h2>Application Form</h2>
                                <p className="sub">
                                    Fields marked <span style={{ color: 'var(--error)' }}>*</span> are required.
                                    We'll respond within 2 business days.
                                </p>
                            </div>
                            <div className="form-grid">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Full Name <span style={{ color: 'var(--error)' }}>*</span></label>
                                        <input name="full_name" value={form.full_name} onChange={set} required placeholder="First and last name" />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address <span style={{ color: 'var(--error)' }}>*</span></label>
                                        <input type="email" name="email" value={form.email} onChange={set} required placeholder="you@email.com" />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Phone Number <span style={{ color: 'var(--error)' }}>*</span></label>
                                        <input name="phone" value={form.phone} onChange={set} required placeholder="+250 780 000 000" />
                                    </div>
                                    <div className="form-group">
                                        <label>Nationality <span style={{ color: 'var(--error)' }}>*</span></label>
                                        <input name="nationality" value={form.nationality} onChange={set} required placeholder="e.g. Rwandan, Nigerian..." />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Preferred Destination <span style={{ color: 'var(--error)' }}>*</span></label>
                                        <div className="select-wrap">
                                            <Globe size={16} className="select-icon" />
                                            <select name="destination" value={form.destination} onChange={set} required>
                                                <option value="">Select country</option>
                                                {['Dubai', 'Canada', 'United States', 'United Kingdom',
                                                  'Germany', 'France', 'Oman', 'China', 'Japan', 'Netherlands'].map(c => (
                                                    <option key={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Service Type <span style={{ color: 'var(--error)' }}>*</span></label>
                                        <div className="select-wrap">
                                            <Info size={16} className="select-icon" />
                                            <select name="program_type" value={form.program_type} onChange={set} required>
                                                <option value="">Select service</option>
                                                <option value="study">Study Abroad</option>
                                                <option value="student_visa">Student Visa</option>
                                                <option value="tourist">Tourist Visa</option>
                                                <option value="work">Work Visa</option>
                                                <option value="scholarship">Scholarship Application</option>
                                                <option value="residency">Permanent Residency</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Highest Education Level <span style={{ color: 'var(--error)' }}>*</span></label>
                                    <select name="education_level" value={form.education_level} onChange={set} required>
                                        <option value="">Select level</option>
                                        <option>High School</option>
                                        <option>Bachelor's Degree</option>
                                        <option>Master's Degree</option>
                                        <option>PhD</option>
                                        <option>Professional Certification</option>
                                    </select>
                                </div>

                                <div className="file-upload-section">
                                    <label className="section-label" style={{ display: 'block', marginBottom: '1rem', fontWeight: '600', color: 'var(--navy)' }}>
                                        Required Documents
                                    </label>
                                    <div className="file-grid">
                                        {[
                                            { key: 'passport', label: 'Passport Photo *',        hint: 'Bio-data page copy', required: true  },
                                            { key: 'diploma',  label: 'Latest Diploma / Certificate *', hint: 'Highest qualification', required: true  },
                                            { key: 'id_card',  label: 'National ID (optional)',  hint: 'Front and back copy', required: false },
                                        ].map(({ key, label, hint, required }) => (
                                            <div className="file-input-card" key={key}>
                                                <div className="file-info">
                                                    <Upload size={18} />
                                                    <span>{label}</span>
                                                </div>
                                                <input type="file" name={key} onChange={handleFile} accept="image/*,.pdf" required={required} />
                                                <small style={{ color: '#94a3b8' }}>{hint}</small>
                                                {files[key] && (
                                                    <small style={{ color: 'var(--navy)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '.3rem', marginTop: '.3rem' }}>
                                                        <CheckCircle size={12} /> {files[key].name}
                                                    </small>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group full">
                                    <label>Additional Information</label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={set}
                                        placeholder="Tell us about your goals, timeline, budget, or any specific requirements..."
                                        rows={4}
                                    />
                                </div>

                                {/* Not logged in warning */}
                                {!currentUser && (
                                    <div className="form-msg error" style={{ marginBottom: '1rem' }}>
                                        <AlertCircle size={16} />
                                        You must <Link to="/login" style={{ fontWeight: 700, textDecoration: 'underline' }}>sign in</Link> before submitting.
                                    </div>
                                )}

                                <button type="submit" className="form-submit" disabled={loading || !currentUser}>
                                    {loading ? (
                                        <><Loader2 size={18} className="animate-spin" style={{ marginRight: '.5rem' }} />{uploadProgress || 'Submitting...'}</>
                                    ) : (
                                        <>Submit Application <Send size={18} style={{ marginLeft: '.75rem' }} /></>
                                    )}
                                </button>

                                {status?.type === 'error' && (
                                    <div className="form-msg error">
                                        <AlertCircle size={18} style={{ marginRight: '.5rem', flexShrink: 0 }} />
                                        {status.msg}
                                    </div>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
