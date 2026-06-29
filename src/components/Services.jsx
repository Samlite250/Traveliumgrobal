import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Briefcase, Landmark, Palmtree, GraduationCap, ArrowRight, Loader2 } from 'lucide-react'

const fallbackServices = [
    { title: 'Dubai Work Visa', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop', desc: 'Fast-track your UAE work visa.', href: '/visa-services', featured: true },
    { title: 'Work Visa (Global)', img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop', desc: 'Employment-based visas for 50+ destinations.', href: '/visa-services' },
    { title: 'Tourist Visa', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop', desc: 'Travel the world with ease.', href: '/visa-services' },
    { title: 'Study Abroad', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop', desc: 'Discover best universities worldwide.', href: '/study-abroad' },
]

const typeHref = { visa: '/visa-services', flight: '/flights', study: '/study-abroad', scholarship: '/scholarships' }
const iconMap = { visa: <Briefcase size={24} />, flight: <Landmark size={24} />, study: <GraduationCap size={24} />, scholarship: <Palmtree size={24} /> }

export default function Services() {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!db) { setLoading(false); return }
        const q = query(collection(db, 'services'), where('active', '==', true))
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
            setServices(data.length ? data : fallbackServices)
            setLoading(false)
        }, () => { setServices(fallbackServices); setLoading(false) })
        return unsub
    }, [])

    const display = loading ? fallbackServices : services.filter(s => s.active !== false || loading)

    return (
        <section className="services section">
            <div className="container">
                <div className="section-header">
                    <div className="section-label">What We Offer</div>
                    <h2 className="section-title">Our Services</h2>
                    <p className="section-sub">
                        Comprehensive work visa & career relocation support — from Dubai to the world
                    </p>
                </div>
                {loading && <div className="admin-loading"><Loader2 size={24} className="animate-spin" /></div>}
                <div className="services-grid">
                    {display.slice(0, 8).map(s => (
                        <div key={s.title} className={`service-card reveal${s.featured ? ' service-card--featured' : ''}`}>
                            <div className="service-img">
                                <img src={s.img || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop'} alt={s.title} />
                            </div>
                            <div className="service-content">
                                <div className="service-icon">{iconMap[s.type] || <Briefcase size={24} />}</div>
                                <h3>{s.name || s.title}</h3>
                                <p>{s.description || s.desc}</p>
                                <Link to={typeHref[s.type] || '/visa-services'} className="service-link">
                                    Learn More <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
