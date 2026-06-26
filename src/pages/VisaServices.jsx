import { Link } from 'react-router-dom'
import CTABanner from '../components/CTABanner'
import { Briefcase, Globe, GraduationCap, Home, CheckCircle, ArrowRight, Star, Zap, Fire } from 'lucide-react'

const visas = [
    {
        icon: <Briefcase size={28} />,
        title: 'Dubai / UAE Work Visa',
        img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop',
        desc: 'Fast-track your UAE work visa. Tax-free salaries, world-class lifestyle, and thousands of open roles across every industry.',
        price: 'From $299',
        featured: true,
        features: ['Job offer verification & matching', 'Emirates ID & residency processing', 'Work permit full documentation', 'Employer liaison & follow-up'],
    },
    {
        icon: <Briefcase size={28} />,
        title: 'Work Visa (Global)',
        img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
        desc: 'Employment-based visas for Canada, UK, Germany, USA, Japan and more. Our 98% success rate covers 50+ destinations.',
        price: 'From $399',
        features: ['Job offer verification', 'Work permit processing', 'Legal documentation', 'Employer liaison'],
    },
    {
        icon: <Globe size={28} />,
        title: 'Tourist Visa',
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
        desc: 'Short-term visitor visa for travel, tourism, and exploring new countries without the hassle.',
        price: 'From $149',
        features: ['Application filing', 'Travel itinerary planning', 'Hotel booking letter', 'Fast processing'],
    },
    {
        icon: <GraduationCap size={28} />,
        title: 'Student Visa',
        img: 'https://images.unsplash.com/photo-1568792923760-d70635a89fdc?q=80&w=800&auto=format&fit=crop',
        desc: 'Full enrollment student visa for accredited degree programs at partner universities worldwide.',
        price: 'From $299',
        features: ['University admission assistance', 'Document preparation', 'Visa interview coaching', 'Follow-up support'],
    },
    {
        icon: <Home size={28} />,
        title: 'Permanent Residency',
        img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
        desc: 'Pathway to permanent residency and long-term stay visas in top countries.',
        price: 'From $999',
        features: ['Eligibility assessment', 'Points-based system help', 'Family sponsorship', 'Legal counsel'],
    },
]

const dubaiHighlights = [
    { icon: '💰', title: 'Tax-Free Income', desc: 'Keep 100% of your earnings — zero income tax in the UAE' },
    { icon: '🏙️', title: 'World-Class City', desc: 'Live and work in one of the world\'s most dynamic cities' },
    { icon: '✈️', title: '10,000+ Open Roles', desc: 'Hospitality, tech, finance, construction & more' },
    { icon: '⚡', title: 'Fast Processing', desc: 'UAE work visa processed in as little as 2–3 weeks' },
]

export default function VisaServices() {
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
                        <div className="section-label"><Fire size={20} className="icon-fire" /> Featured Destination</div>
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
                    <div className="visa-types-grid">
                        {visas.map(v => (
                            <div key={v.title} className={`visa-card${v.featured ? ' visa-card--featured' : ''}`}>
                                {v.featured && (
                                    <div className="visa-featured-badge">
                                        <Star size={12} fill="currentColor" /> Most Popular
                                    </div>
                                )}
                                <div className="visa-card-img">
                                    <img src={v.img} alt={v.title} />
                                </div>
                                <div className="visa-card-body">
                                    <div className="visa-icon">{v.icon}</div>
                                    <h3>{v.title}</h3>
                                    <p>{v.desc}</p>
                                    <div className="visa-price">{v.price}</div>
                                    <ul className="visa-features">
                                        {v.features.map(f => (
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
