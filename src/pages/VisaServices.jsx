import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CTABanner from '../components/CTABanner'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Briefcase, Globe, GraduationCap, Home, CheckCircle, ArrowRight, Star, Zap, Flame, Loader2 } from 'lucide-react'

const fallbackVisas = [
    { title: 'Dubai / UAE Work Visa', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop', desc: 'Fast-track your UAE work visa.', price: 299, featured: true, features: ['Job offer verification', 'Emirates ID processing'] },
    { title: 'Work Visa (Global)', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop', desc: 'Employment visas for 50+ destinations.', price: 399, features: ['Work permit processing', 'Legal documentation'] },
    { title: 'Tourist Visa', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop', desc: 'Short-term visitor visa.', price: 149, features: ['Application filing', 'Fast processing'] },
    { title: 'Student Visa', img: 'https://images.unsplash.com/photo-1568792923760-d70635a89fdc?q=80&w=800&auto=format&fit=crop', desc: 'Full enrollment student visa.', price: 299, features: ['University admission', 'Visa coaching'] },
    { title: 'Permanent Residency', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop', desc: 'Pathway to PR.', price: 999, features: ['Eligibility assessment', 'Legal counsel'] },
]

const iconMap = { 'Dubai / UAE Work Visa': <Briefcase size={28} />, 'Work Visa (Global)': <Briefcase size={28} />, 'Tourist Visa': <Globe size={28} />, 'Student Visa': <GraduationCap size={28} />, 'Permanent Residency': <Home size={28} /> }

const dubaiHighlights = [
    { icon: '💰', title: 'Tax-Free Income', desc: 'Keep 100% of your earnings — zero income tax in the UAE' },
    { icon: '🏙️', title: 'World-Class City', desc: 'Live and work in one of the world\'s most dynamic cities' },
    { icon: '✈️', title: '10,000+ Open Roles', desc: 'Hospitality, tech, finance, construction & more' },
    { icon: '⚡', title: 'Fast Processing', desc: 'UAE work visa processed in as little as 2–3 weeks' },
]

export default function VisaServices() {
    const [visas, setVisas] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!db) { setLoading(false); return }
        const q = query(collection(db, 'services'), where('type', '==', 'visa'), where('active', '==', true))
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
            setVisas(data.length ? data : fallbackVisas)
            setLoading(false)
        }, () => { setVisas(fallbackVisas); setLoading(false) })
        return unsub
    }, [])

    const display = loading ? fallbackVisas : visas

    return (
        <main>
            <div className="page-hero">
                <div className="page-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop)' }} />
                <div className="container page-hero-content">
                    <div className="breadcrumb">
                        <Link to="/">Home</Link><span className="sep">›</span><span>Visa Services</span>
                    </div>
                    <h1>Work Visa Services</h1>
                    <p>Expert work visa assistance for Dubai, Canada, UK, Germany & 50+ countries. We handle the paperwork — you focus on your new career.</p>
                </div>
            </div>

            {/* Dubai Spotlight Section */}
            <section className="dubai-spotlight section">
                <div className="container">
                    <div className="dubai-spotlight-header">
                        <div className="section-label"><Flame size={20} className="icon-fire" /> Featured Destination</div>
                        <h2 className="section-title">Work in Dubai, UAE</h2>
                        <p className="section-sub">
                            The #1 destination for ambitious professionals. Tax-free salaries, visa-friendly policies, and limitless career growth.
                        </p>
                    </div>
                    <div className="dubai-highlights-grid">
                        {dubaiHighlights.map(h => (
                            <div key={h.title} className="dubai-highlight-card">
                                <div className="dubai-highlight-icon">{h.icon}</div>
                                <h4>{h.title}</h4>
                                <p>{h.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="dubai-spotlight-cta">
                        <Link to="/apply" className="btn btn-primary">
                            Apply for Dubai Work Visa <ArrowRight size={16} />
                        </Link>
                        <Link to="/contact" className="btn btn-outline">
                            <Zap size={16} /> Free Consultation
                        </Link>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">Our Offerings</div>
                        <h2 className="section-title">Visa Types We Handle</h2>
                        <p className="section-sub">Work visas are our speciality — but we've got you covered for every journey type.</p>
                    </div>
                    {loading && <div className="admin-loading"><Loader2 size={24} className="animate-spin" /><p>Loading services...</p></div>}
                    <div className="visa-types-grid">
                        {display.map(v => (
                            <div key={v.title} className={`visa-card${v.featured ? ' visa-card--featured' : ''}`}>
                                {v.featured && (
                                    <div className="visa-featured-badge">
                                        <Star size={12} fill="currentColor" /> Most Popular
                                    </div>
                                )}
                                <div className="visa-card-img">
                                    <img src={v.img || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop'} alt={v.title} />
                                </div>
                                <div className="visa-card-body">
                                    <div className="visa-icon">{iconMap[v.title] || <Briefcase size={28} />}</div>
                                    <h3>{v.title}</h3>
                                    <p>{v.description || v.desc}</p>
                                    <div className="visa-price">{v.price ? `From $${v.price}` : 'Contact us'}</div>
                                    <ul className="visa-features">
                                        {(v.features || []).map(f => (
                                            <li key={f}>
                                                <CheckCircle size={14} className="check-icon" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link to="/apply" className="btn btn-navy visa-apply-btn">
                                        Apply Now <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <CTABanner />
        </main>
    )
}
