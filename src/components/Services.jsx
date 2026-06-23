import { Link } from 'react-router-dom'
import { GraduationCap, Landmark, Palmtree, Briefcase, ArrowRight } from 'lucide-react'

const services = [
    {
        icon: <GraduationCap size={24} />, title: 'Study Abroad',
        img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop',
        desc: 'Discover the best universities and programs worldwide with our expert guidance.',
        href: '/study-abroad',
    },
    {
        icon: <Landmark size={24} />, title: 'Student Visa',
        img: 'https://images.unsplash.com/photo-1568792923760-d70635a89fdc?q=80&w=800&auto=format&fit=crop',
        desc: 'We provide complete assistance for your student visa applications.',
        href: '/visa-services',
    },
    {
        icon: <Palmtree size={24} />, title: 'Tourist Visa',
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
        desc: 'Travel the world with ease. We handle your tourist visa process.',
        href: '/visa-services',
    },
    {
        icon: <Briefcase size={24} />, title: 'Work Visa',
        img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop',
        desc: 'Explore global career opportunities. We help you get work visas.',
        href: '/visa-services',
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
                        Comprehensive support for every step of your international journey
                    </p>
                </div>
                <div className="services-grid">
                    {services.map(s => (
                        <div key={s.title} className="service-card reveal">
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
