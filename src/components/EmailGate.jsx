import { useState } from 'react'
import { Lock, Mail, CheckCircle } from 'lucide-react'
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
        if (!valid) { setError('Enter a valid email address'); return }
        setSubmitting(true)
        try {
            await saveSubscriber(email.trim(), source)
            try { localStorage.setItem(STORAGE_KEY, '1') } catch { }
            setDone(true)
            setTimeout(() => setUnlocked(true), 1200)
        } catch {
            setError('Something went wrong. Try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="email-gate">
            <div className="email-gate-card">
                <div className="eg-header">
                    <span className="eg-badge"><Lock size={13} /> Premium</span>
                    <h3>Unlock {count}+ more {source === 'scholarships' ? 'scholarships' : 'jobs'}</h3>
                    <p>Free access + weekly opportunity alerts. No spam, unsubscribe anytime.</p>
                </div>

                {done ? (
                    <div className="email-gate-success">
                        <CheckCircle size={18} />
                        <span>Unlocked — loading…</span>
                    </div>
                ) : (
                    <form className="eg-form" onSubmit={handleSubmit}>
                        <div className="eg-input">
                            <Mail size={15} />
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                aria-label="Email address"
                                required
                            />
                        </div>
                        <button type="submit" disabled={submitting}>
                            {submitting ? '…' : 'Subscribe'}
                        </button>
                        {error && <span className="eg-error">{error}</span>}
                    </form>
                )}

                <div className="eg-trust">
                    <span>✓ Free forever</span>
                    <span>✓ No spam</span>
                    <span>✓ One-click unsubscribe</span>
                </div>
            </div>

            <div className="email-gate-locked">
                <div className="email-gate-blur" aria-hidden="true">
                    {children}
                </div>
                <div className="email-gate-overlay">
                    <Lock size={28} />
                    <p>Subscribe above to view</p>
                </div>
            </div>
        </div>
    )
}
