import { Link } from 'react-router-dom'
import { Briefcase, Landmark, Palmtree, GraduationCap, ArrowRight } from 'lucide-react'

const services = [
    {
        icon: <Briefcase size={24} />, title: 'Dubai Work Visa',
        img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop',
        desc: 'Fast-track your UAE work visa. We handle the entire process — job offer verification, Emirates ID, and more.',
        href: '/visa-services',
        featured: true,
    },
    {
        icon: <Landmark size={24} />, title: 'Work Visa (Global)',
        img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop',
        desc: 'Employment-based visas for Canada, UK, Germany, USA & more. Our 98% success rate speaks for itself.',
        href: '/visa-services',
    },
    {
        icon: <Palmtree size={24} />, title: 'Tourist Visa',
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
        desc: 'Travel the world with ease. We handle your tourist visa process end-to-end.',
        href: '/visa-services',
    },
    {
        icon: <GraduationCap size={24} />, title: 'Study Abroad',
        img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop',
        desc: 'Discover the best universities and programs worldwide with our expert academic guidance.',
        href: '/study-abroad',
    },
]

export default function Services() {
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
                <div className="services-grid">
                    {services.map(s => (
                        <div key={s.title} className={`service-card reveal${s.featured ? ' service-card--featured' : ''}`}>
                            <div className="service-img">
                                <img src={s.img} alt={s.title} />
                            </div>
                            <div className="service-content">
                                <div className="service-icon">{s.icon}</div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                                <Link to={s.href} className="service-link">
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
