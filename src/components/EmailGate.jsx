import { useState } from 'react'
import { Lock, CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import { saveSubscriber } from '../lib/listings'

const STORAGE_KEY = 'travelium_subscriber_unlocked'

export function isUnlocked() {
    try { return localStorage.getItem(STORAGE_KEY) === '1' } catch { return false }
}

export default function EmailGate({ count, source, children }) {
    const [unlocked, setUnlocked] = useState(isUnlocked)
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState('idle') // idle | saving | done
    const [error, setError] = useState('')

    if (unlocked) return children

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        const value = email.trim()
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setError('Please enter a valid email address')
            return
        }
        setStatus('saving')
        try {
            await saveSubscriber(value, source)
            try { localStorage.setItem(STORAGE_KEY, '1') } catch { }
            setStatus('done')
            setTimeout(() => setUnlocked(true), 1300)
        } catch {
            setStatus('idle')
            setError('Something went wrong. Please try again.')
        }
    }

    const label = source === 'scholarships' ? 'scholarships' : 'jobs'

    if (status === 'done') {
        return (
            <div className="email-gate">
                <div className="eg-card eg-done">
                    <CheckCircle size={38} />
                    <h4>You're in!</h4>
                    <p>Full access unlocked. Loading {count}+ more {label}…</p>
                </div>
                <div className="email-gate-locked">
                    <div className="email-gate-blur" aria-hidden="true">{children}</div>
                </div>
            </div>
        )
    }

    return (
        <div className="email-gate">
            <div className="eg-card">
                <div className="eg-badge"><Lock size={12} /> Members only</div>

                <h4>Unlock {count}+ more {label}</h4>
                <p className="eg-sub">
                    Join thousands of job seekers getting weekly opportunity alerts, deadline reminders and application tips.
                </p>

                <form className="eg-form" onSubmit={handleSubmit}>
                    <div className="eg-field">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-label="Email address"
                            disabled={status === 'saving'}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-navy" disabled={status === 'saving'}>
                        {status === 'saving'
                            ? <><Loader2 size={15} className="animate-spin" /> Subscribing…</>
                            : <>Unlock Free <ArrowRight size={15} /></>
                        }
                    </button>
                </form>

                {error && <p className="eg-error">{error}</p>}

                <div className="eg-meta">
                    <span>Free forever</span>
                    <span className="eg-dot">·</span>
                    <span>No spam</span>
                    <span className="eg-dot">·</span>
                    <span>Unsubscribe anytime</span>
                </div>
            </div>

            <div className="email-gate-locked">
                <div className="email-gate-blur" aria-hidden="true">{children}</div>
                <div className="email-gate-overlay">
                    <Lock size={26} />
                    <p>Subscribe to unlock the rest</p>
                </div>
            </div>
        </div>
    )
}
