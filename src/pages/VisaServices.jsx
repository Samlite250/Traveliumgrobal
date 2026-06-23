import { Link } from 'react-router-dom'
import CTABanner from '../components/CTABanner'
import { GraduationCap, Globe, Briefcase, Home, CheckCircle, ArrowRight } from 'lucide-react'

const visas = [
    {
        icon: <GraduationCap size={28} />,
        title: 'Student Visa',
        img: 'https://images.unsplash.com/photo-1568792923760-d70635a89fdc?q=80&w=800&auto=format&fit=crop',
        desc: 'Full enrollment student visa for accredited degree programs at partner universities.',
        price: 'From $299',
        features: ['University admission assistance', 'Document preparation', 'Visa interview coaching', 'Follow-up support'],
    },
    {
        icon: <Globe size={28} />,
        title: 'Tourist Visa',
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
        desc: 'Short-term visitor visa for travel, tourism and exploring new countries.',
        price: 'From $149',
        features: ['Application filing', 'Travel itinerary planning', 'Hotel booking letter', 'Fast processing'],
    },
    {
        icon: <Briefcase size={28} />,
        title: 'Work Visa',
        img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
        desc: 'Employment-based visa for professionals seeking international career opportunities.',
        price: 'From $399',
        features: ['Job offer verification', 'Work permit processing', 'Legal documentation', 'Employer liaison'],
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

export default function VisaServices() {
    return (
        <main>
            <div className="page-hero">
                <div className="page-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544229661-33299c4170df?q=80&w=1600&auto=format&fit=crop)' }} />
                <div className="container page-hero-content">
                    <div className="breadcrumb">
                        <Link to="/">Home</Link><span className="sep">›</span><span>Visa Services</span>
                    </div>
                    <h1>Visa Services</h1>
                    <p>Expert visa assistance for students, tourists, workers and residents. We handle the paperwork — you focus on your journey.</p>
                </div>
            </div>

            <section className="content-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">Our Offerings</div>
                        <h2 className="section-title">Visa Types We Handle</h2>
                        <p className="section-sub">From student to work visas, we've got you covered for every journey type.</p>
                    </div>
                    <div className="visa-types-grid">
                        {visas.map(v => (
                            <div key={v.title} className="visa-card">
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
