import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Briefcase, GraduationCap, Plane, Star, ArrowRight, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const fallbackServices = [
    { title: 'Flight Booking', img: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=800&auto=format&fit=crop', desc: 'Find and book cheap flights globally. Best rates guaranteed, flexible options, and 24/7 travel support.', href: '/flights', type: 'flight' },
    { title: 'Dubai / UAE Work Visa', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop', desc: 'Fast-track your UAE work visa. We handle the entire process — job offer verification, Emirates ID, and more.', href: '/visa-services', type: 'visa' },
    { title: 'Work Visa (Global)', img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop', desc: 'Employment-based visas for Canada, UK, Germany, USA & more. Our 98% success rate speaks for itself.', href: '/visa-services', type: 'visa' },
    { title: 'Tourist Visa', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop', desc: 'Travel the world with ease. We handle your tourist visa process end-to-end.', href: '/visa-services', type: 'visa' },
    { title: 'Permanent Residency', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop', desc: 'Pathway to Permanent Residency. Secure your future in Canada, Australia, Europe or another destination.', href: '/visa-services', type: 'visa' },
    { title: 'Study Abroad', img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop', desc: 'Discover the best universities and degree programs worldwide with our expert academic guidance.', href: '/study-abroad', type: 'study' },
    { title: 'Scholarships & Funding', img: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop', desc: 'Access fully funded scholarships from top institutions — Commonwealth, Chevening, Fulbright & more.', href: '/scholarships', type: 'scholarship' },
    { title: 'Consultation & Advisory', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop', desc: 'Expert one-on-one guidance to plan your international journey, from visa to settlement.', href: '/contact', type: 'visa' },
]

const typeHref = { visa: '/visa-services', flight: '/flights', study: '/study-abroad', scholarship: '/scholarships' }
const serviceIcon = { visa: <Briefcase size={16} />, flight: <Plane size={16} />, study: <GraduationCap size={16} />, scholarship: <Star size={16} /> }

const categories = [
    { key: 'visa', title: 'Visas & Relocation', blurb: 'Work, tourist & residency visas processed end-to-end.', icon: <Briefcase size={20} />, types: ['visa'] },
    { key: 'study', title: 'Study & Scholarships', blurb: 'University admissions & fully funded scholarship support.', icon: <GraduationCap size={20} />, types: ['study', 'scholarship'] },
    { key: 'travel', title: 'Travel & Flights', blurb: 'Flight booking & travel support, worldwide.', icon: <Plane size={20} />, types: ['flight'] },
]

export default function Services() {
    const { t } = useTranslation()
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

    const rawDisplay = loading ? fallbackServices : (services.length ? services.filter(s => s.active !== false) : fallbackServices)
    const uniqueServicesMap = new Map()
    rawDisplay.forEach(s => {
        const key = (s.name || s.title || '').trim().toLowerCase()
        if (key && !uniqueServicesMap.has(key)) {
            uniqueServicesMap.set(key, s)
        }
    })
    const display = Array.from(uniqueServicesMap.values())

    // Group services into professional categories (unknown types → Travel/misc bucket)
    const grouped = categories.map(cat => ({
        ...cat,
        items: display.filter(s => cat.types.includes(s.type))
    }))
    const known = new Set(grouped.flatMap(g => g.items))
    const extras = display.filter(s => !known.has(s))
    if (extras.length) {
        grouped.push({
            key: 'more', title: 'More Services', blurb: 'Additional support from our team.',
            icon: <Star size={20} />, items: extras
        })
    }
    const visibleGroups = grouped.filter(g => g.items.length)

    // Local scroll-reveal observer specifically for async loaded service groups
    useEffect(() => {
        if (loading) return
        const timer = setTimeout(() => {
            const els = document.querySelectorAll('.services-categories .reveal')
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
                    <div className="section-label">{t('services.label', 'What We Offer')}</div>
                    <h2 className="section-title">{t('services.title', 'Our Services')}</h2>
                    <p className="section-sub">
                        {t('services.subtitle', 'Comprehensive work visa & career relocation support — from Dubai to the world')}
                    </p>
                </div>
                {loading && <div className="admin-loading"><Loader2 size={24} className="animate-spin" /></div>}

                <div className="services-categories">
                    {visibleGroups.map(cat => (
                        <div key={cat.key} className="service-category reveal">
                            <div className="service-category-head">
                                <span className="service-category-icon">{cat.icon}</span>
                                <div className="service-category-text">
                                    <h3>{cat.title}</h3>
                                    <p>{cat.blurb}</p>
                                </div>
                            </div>
                            <ul className="service-category-list">
                                {cat.items.map((s, i) => (
                                    <li key={s.id || s.title || i}>
                                        <Link to={s.href || typeHref[s.type] || '/visa-services'} className="service-list-link">
                                            <span className="service-list-icon">{serviceIcon[s.type] || <Briefcase size={16} />}</span>
                                            <span className="service-list-text">
                                                <strong>{s.name || s.title}</strong>
                                                <small>{s.description || s.desc}</small>
                                            </span>
                                            <ArrowRight size={15} className="service-list-arrow" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="services-footnote">
                    <Link to="/contact" className="btn btn-navy">
                        {t('services.consult', 'Get a Free Consultation')} <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    )
}
