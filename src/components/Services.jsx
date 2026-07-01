import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Briefcase, Landmark, Palmtree, GraduationCap, ArrowRight, Loader2 } from 'lucide-react'

const fallbackServices = [
    { title: 'Flight Booking', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=800&auto=format&fit=crop', desc: 'Find and book cheap flights globally. Best rates guaranteed, flexible options, and 24/7 travel support.', href: '/flights', featured: true, type: 'flight' },
    { title: 'Work Visa (Global)', img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop', desc: 'Employment-based visas for Canada, UK, Germany, USA & more. Our 98% success rate speaks for itself.', href: '/visa-services', type: 'visa' },
    { title: 'Tourist Visa', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop', desc: 'Travel the world with ease. We handle your tourist visa process end-to-end.', href: '/visa-services', type: 'visa' },
    { title: 'Permanent Residency', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop', desc: 'Pathway to Permanent Residency. Secure your future in Canada, Australia, Europe or another destination.', href: '/visa-services', type: 'visa' },
    { title: 'Study Abroad', img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop', desc: 'Discover the best universities and degree programs worldwide with our expert academic guidance.', href: '/study-abroad', type: 'study' },
    { title: 'Consultation & Advisory', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop', desc: 'Expert one-on-one guidance to plan your international journey, from visa to settlement.', href: '/contact', type: 'visa' },
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

    // Local scroll-reveal observer specifically for async loaded service cards
    useEffect(() => {
        if (loading) return
        const timer = setTimeout(() => {
            const els = document.querySelectorAll('.services-grid .reveal')
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(e => {
                        if (e.isIntersecting) {
                            e.target.classList.add('visible')
                            observer.unobserve(e.target)
                        }
                    })
                },
                { threshold: 0.1 }
            )
            els.forEach(el => observer.observe(el))
            return () => observer.disconnect()
        }, 50)
        return () => clearTimeout(timer)
    }, [loading])

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
                    {display.slice(0, 8).map((s, i) => (
                        <div key={s.id || s.title || i} className={`service-card reveal${s.featured ? ' service-card--featured' : ''}`}>
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
