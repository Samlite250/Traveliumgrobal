import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CTABanner from '../components/CTABanner'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { CalendarDays, ArrowRight, Loader2 } from 'lucide-react'

const fallbackScholarships = [
    { amount: 'Full Fund', title: 'Commonwealth Scholarship', country: 'United Kingdom', flag: 'https://flagcdn.com/w40/gb.png', desc: 'Fully funded scholarships for students from developing countries.', deadline: 'Dec 31, 2026' },
    { amount: '$25,000', title: 'Chevening Scholarship', country: 'United Kingdom', flag: 'https://flagcdn.com/w40/gb.png', desc: 'UK government global scholarship program.', deadline: 'Nov 15, 2026' },
    { amount: '$30,000', title: 'Fulbright Program', country: 'United States', flag: 'https://flagcdn.com/w40/us.png', desc: 'International exchange program sponsored by the US government.', deadline: 'Oct 15, 2026' },
    { amount: '$20,000', title: 'Vanier Canada Graduate', country: 'Canada', flag: 'https://flagcdn.com/w40/ca.png', desc: 'For doctoral students with leadership excellence.', deadline: 'Nov 1, 2026' },
    { amount: 'Full Fund', title: 'DAAD Scholarship', country: 'Germany', flag: 'https://flagcdn.com/w40/de.png', desc: 'German Academic Exchange Service funding.', deadline: 'Jan 31, 2027' },
    { amount: '$15,000', title: 'Australia Awards', country: 'Australia', flag: 'https://flagcdn.com/w40/au.png', desc: 'Awards funded by the Australian government.', deadline: 'Apr 30, 2027' },
]

export default function Scholarships() {
    const [scholarships, setScholarships] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!db) { setLoading(false); return }
        const q = query(collection(db, 'services'), where('type', '==', 'scholarship'), where('active', '==', true))
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
            setScholarships(data.length ? data : fallbackScholarships)
            setLoading(false)
        }, () => { setScholarships(fallbackScholarships); setLoading(false) })
        return unsub
    }, [])

    const display = loading ? fallbackScholarships : scholarships

    return (
        <main>
            <div className="page-hero">
                <div className="page-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1600&auto=format&fit=crop)' }} />
                <div className="container page-hero-content">
                    <div className="breadcrumb">
                        <Link to="/">Home</Link><span className="sep">›</span><span>Scholarships</span>
                    </div>
                    <h1>Scholarships & Funding</h1>
                    <p>Discover scholarships that can fund your global education. We help you find the right opportunity and prepare a winning application.</p>
                </div>
            </div>

            <section className="content-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">Available Scholarships</div>
                        <h2 className="section-title">Find Your Scholarship</h2>
                        <p className="section-sub">Browse top scholarships available for international students across the globe.</p>
                    </div>
                    {loading && <div className="admin-loading"><Loader2 size={24} className="animate-spin" /><p>Loading scholarships...</p></div>}
                    <div className="scholarships-grid">
                        {display.map(s => {
                            const amount = s.amount || (s.price ? `$${s.price.toLocaleString()}` : 'Contact us')
                            return (
                                <div key={s.title} className="scholarship-card">
                                    <div className="scholarship-amount">{amount}</div>
                                    <div className="scholarship-body">
                                        <h3>{s.title}</h3>
                                        {s.country && <div className="scholarship-country">
                                            {s.flag && <img src={s.flag} alt={s.country} />}
                                            {s.country}
                                        </div>}
                                        <p>{s.description || s.desc}</p>
                                        <div className="scholarship-footer">
                                            {s.deadline && <span className="scholarship-deadline">
                                                <CalendarDays size={14} />
                                                Deadline: <strong>{s.deadline}</strong>
                                            </span>}
                                            <Link to="/apply" className="btn btn-navy scholarship-apply-btn">
                                                Apply <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <CTABanner />
        </main>
    )
}
