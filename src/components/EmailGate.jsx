import { useState, useEffect } from 'react'
import { Lock, Mail, CheckCircle, Sparkles, Bell, CalendarClock, FileCheck } from 'lucide-react'
import { saveSubscriber } from '../lib/listings'

const STORAGE_KEY = 'travelium_subscriber_unlocked'

export function isUnlocked() {
    try { return localStorage.getItem(STORAGE_KEY) === '1' } catch { return false }
}

export default function EmailGate({ count, source, children }) {
    const [unlocked, setUnlocked] = useState(isUnlocked)
    const [email, setEmail] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [done, setDone] = useState(false)
    const [error, setError] = useState('')

    if (unlocked) return children

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        if (!valid) { setError('Please enter a valid email address'); return }
        setSubmitting(true)
        try {
            await saveSubscriber(email.trim(), source)
            try { localStorage.setItem(STORAGE_KEY, '1') } catch { }
            setDone(true)
            setTimeout(() => setUnlocked(true), 1400)
        } catch {
            setError('Something went wrong. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <div className="email-gate">
                <div className="email-gate-card">
                    <div className="email-gate-icon">
                        <Lock size={26} />
                    </div>
                    <h3>{count}+ more {source === 'scholarships' ? 'scholarships' : 'jobs'} waiting</h3>
                    <p>Unlock all listings free — plus weekly alerts so you never miss a deadline.</p>

                    {done ? (
                        <div className="email-gate-success">
                            <CheckCircle size={22} />
                            <span>Unlocked! Loading your results…</span>
                        </div>
                    ) : (
                        <form className="email-gate-form" onSubmit={handleSubmit}>
                            <div className="email-gate-input-row">
                                <Mail size={17} className="email-gate-input-icon" />
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    aria-label="Email address"
                                    required
                                />
                                <button type="submit" disabled={submitting}>
                                    {submitting ? 'Unlocking…' : 'Unlock Free'}
                                </button>
                            </div>
                            {error && <p className="email-gate-error">{error}</p>}
                        </form>
                    )}

                    <ul className="email-gate-perks">
                        <li><Bell size={13} /> Weekly new-job alerts</li>
                        <li><CalendarClock size={13} /> Scholarship deadline reminders</li>
                        <li><FileCheck size={13} /> Application tips & guides</li>
                        <li><Sparkles size={13} /> Free forever, no spam</li>
                    </ul>
                </div>

                <div className="email-gate-locked">
                    <div className="email-gate-blur" aria-hidden="true">
                        {children}
                    </div>
                    <div className="email-gate-overlay">
                        <Lock size={32} />
                        <p>Sign up above to view these listings</p>
                    </div>
                </div>
            </div>
        </>
    )
}
