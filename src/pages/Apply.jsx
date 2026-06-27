import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { Send, CheckCircle, ArrowRight, Globe, Info, Upload, Loader2 } from 'lucide-react'

export default function Apply() {
    const { currentUser } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        full_name: '', email: '', phone: '', nationality: '',
        destination: '', program_type: '', education_level: '', message: ''
    })
    const [files, setFiles] = useState({ passport: null, diploma: null, id_card: null })
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState('')

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
            setUploadProgress('Uploading passport...')
            const passportUrl = await uploadFile(files.passport, `applications/${uid}/passport_${Date.now()}`)
            setUploadProgress('Uploading diploma...')
            const diplomaUrl  = await uploadFile(files.diploma,  `applications/${uid}/diploma_${Date.now()}`)
            setUploadProgress('Uploading ID card...')
            const idCardUrl   = await uploadFile(files.id_card,  `applications/${uid}/id_card_${Date.now()}`)
            setUploadProgress('Saving application...')

            await addDoc(collection(db, 'applications'), {
                ...form,
                user_id:     uid,
                user_email:  currentUser.email,
                status:      'pending',
                documents: {
                    passport: passportUrl,
                    diploma:  diplomaUrl,
                    id_card:  idCardUrl,
                },
                created_at: serverTimestamp(),
            })

            setStatus({ type: 'success', msg: 'Application submitted successfully! Our team will reach out within 2 business days.' })
            setForm({ full_name: '', email: '', phone: '', nationality: '', destination: '', program_type: '', education_level: '', message: '' })
            setFiles({ passport: null, diploma: null, id_card: null })
        } catch (err) {
            setStatus({ type: 'error', msg: 'Submission failed: ' + err.message })
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
                    <form className="form-card animate-fadeIn" onSubmit={handleSubmit}>
                        <div className="form-header">
                            <h2>Application Form</h2>
                            <p className="sub">All fields marked * are required. We'll respond within 2 business days.</p>
                        </div>
                        <div className="form-grid">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input name="full_name" value={form.full_name} onChange={set} required placeholder="First and last name" />
                                </div>
                                <div className="form-group">
                                    <label>Email Address *</label>
                                    <input type="email" name="email" value={form.email} onChange={set} required placeholder="you@email.com" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Phone Number *</label>
                                    <input name="phone" value={form.phone} onChange={set} required placeholder="+1 (999) 000-0000" />
                                </div>
                                <div className="form-group">
                                    <label>Nationality *</label>
                                    <input name="nationality" value={form.nationality} onChange={set} required placeholder="e.g. Nigerian, Indian..." />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Preferred Destination *</label>
                                    <div className="select-wrap">
                                        <Globe size={16} className="select-icon" />
                                        <select name="destination" value={form.destination} onChange={set} required>
                                            <option value="">Select country</option>
                                            {['Dubai', 'Canada', 'United States', 'United Kingdom', 'Germany', 'France', 'Oman', 'China', 'Japan', 'Netherlands'].map(c => (
                                                <option key={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Service Type *</label>
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
                                <label>Highest Education Level *</label>
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
                                <label className="section-label" style={{ display: 'block', marginBottom: '1rem', fontWeight: '600', color: 'var(--primary-color)' }}>
                                    Required Documents
                                </label>
                                <div className="file-grid">
                                    {[
                                        { key: 'passport', label: 'Passport Photo *', hint: 'Bio-data page copy', required: true },
                                        { key: 'diploma',  label: 'Latest Diploma *',  hint: 'Highest qualification', required: true },
                                        { key: 'id_card',  label: 'National ID / Passport', hint: 'Front and back copy', required: false },
                                    ].map(({ key, label, hint, required }) => (
                                        <div className="file-input-card" key={key}>
                                            <div className="file-info">
                                                <Upload size={18} />
                                                <span>{label}</span>
                                            </div>
                                            <input type="file" name={key} onChange={handleFile} accept="image/*,.pdf" required={required} />
                                            <small>{hint}</small>
                                            {files[key] && <small style={{ color: 'var(--navy)', fontWeight: 600 }}>✓ {files[key].name}</small>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group full">
                                <label>Additional Information</label>
                                <textarea name="message" value={form.message} onChange={set} placeholder="Tell us about your goals, timeline, budget, or any specific requirements..." />
                            </div>

                            <button type="submit" className="form-submit" disabled={loading}>
                                {loading ? (
                                    <><Loader2 size={18} className="animate-spin" style={{ marginRight: '.5rem' }} />{uploadProgress || 'Submitting...'}</>
                                ) : (
                                    <>Submit Application <Send size={18} style={{ marginLeft: '.75rem' }} /></>
                                )}
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
            </section>
        </main>
    )
}
