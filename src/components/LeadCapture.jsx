import { useState } from 'react'
import { Mail, Loader2, CheckCircle, Bell } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { saveLead } from '../lib/listings'

/**
 * LeadCapture — email capture box for detail pages (deadline reminders + checklists).
 * Saves to Firestore `leads` (falls back to localStorage when offline).
 */
export default function LeadCapture({ source, slug, title, heading, text }) {
    const toast = useToast()
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState('idle') // idle | saving | done

    const finalHeading = heading || (source === 'job'
        ? 'Get alerts for similar jobs'
        : 'Free application checklist')

    const finalText = text || (source === 'job'
        ? 'We\'ll email you matching openings and visa-ready roles before they close.'
        : 'We\'ll email you the document checklist and deadline reminders so you never miss a date.')

    const submit = async (e) => {
        e.preventDefault()
        const value = email.trim()
        if (!/^\S+@\S+\.\S+$/.test(value)) {
            toast('Please enter a valid email address', 'error')
            return
        }
        setStatus('saving')
        await saveLead({ email: value, source, item_slug: slug, item_title: title })
        setStatus('done')
        toast('You\'re in — your checklist and reminders are on the way.', 'success')
    }

    if (status === 'done') {
        return (
            <div className="listing-lead done">
                <CheckCircle size={22} />
                <div>
                    <strong>Check your inbox</strong>
                    <p>Sent to <b>{email}</b>. Nothing in your inbox? Check spam or mark us as safe.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="listing-lead">
            <div className="lead-head">
                <span className="lead-icon"><Bell size={16} /></span>
                <h4>{finalHeading}</h4>
            </div>
            <p>{finalText}</p>
            <form className="lead-form" onSubmit={submit}>
                <span className="lead-input">
                    <Mail size={15} />
                    <input
                        type="email"
                        placeholder="you@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        aria-label="Email address"
                    />
                </span>
                <button type="submit" className="btn btn-navy" disabled={status === 'saving'}>
                    {status === 'saving' ? <Loader2 size={15} className="animate-spin" /> : 'Send me the checklist'}
                </button>
            </form>
            <small className="lead-note">No spam — unsubscribe anytime.</small>
        </div>
    )
}
