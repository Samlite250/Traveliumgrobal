import { Link } from 'react-router-dom'
import CTABanner from '../components/CTABanner'
import { Users, Target, Globe, Award } from 'lucide-react'

const team = [
    {
        name: 'Dr. Amanda Clarke', role: 'Founder & CEO',
        img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop',
    },
    {
        name: 'James Okonkwo', role: 'Visa Specialist',
        img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop',
    },
    {
        name: 'Priya Sharma', role: 'Scholarship Advisor',
        img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    },
    {
        name: 'Michael Chen', role: 'Study Abroad Consultant',
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    },
]

const values = [
    { icon: <Users size={22} />, title: 'Student-First', desc: 'Every decision we make puts the student\'s success at the center.' },
    { icon: <Target size={22} />, title: 'Results-Driven', desc: 'We\'re proud of our 98% visa approval rate across all categories.' },
    { icon: <Globe size={22} />, title: 'Global Reach', desc: '200+ partner universities across 20+ countries worldwide.' },
    { icon: <Award size={22} />, title: 'Award-Winning', desc: 'Recognized as a top education consultancy for three consecutive years.' },
]

export default function About() {
    return (
        <main>
            <div className="page-hero">
                <div className="page-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop)' }} />
                <div className="container page-hero-content">
                    <div className="breadcrumb">
                        <Link to="/">Home</Link><span className="sep">›</span><span>About Us</span>
                    </div>
                    <h1>About Travelium</h1>
                    <p>Dedicated to making global education accessible to every ambitious student.</p>
                </div>
            </div>

            <section className="content-section">
                <div className="container">
                    <div className="about-grid">
                        <div className="about-text">
                            <div className="section-label">Our Story</div>
                            <h2 className="section-title">Who We Are</h2>
                            <p>
                                Founded in 2015, Travelium Global has helped over 15,000 students realize their dream of studying and working abroad. We are a team of passionate education consultants, visa experts, and travel professionals.
                            </p>
                            <p>
                                Our mission is simple: break down barriers to global education by providing expert guidance, personalized support, and a network of 200+ partner universities across 20+ countries.
                            </p>
                            <div className="about-stats">
                                <div className="about-stat"><div className="num">15K+</div><div className="label">Students Helped</div></div>
                                <div className="about-stat"><div className="num">200+</div><div className="label">Partner Universities</div></div>
                                <div className="about-stat"><div className="num">20+</div><div className="label">Countries</div></div>
                                <div className="about-stat"><div className="num">98%</div><div className="label">Success Rate</div></div>
                            </div>
                        </div>
                        <div className="about-img-wrap">
                            <img
                                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop"
                                alt="Travelium team working with students"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="content-section" style={{ background: 'var(--off-white)' }}>
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">What Drives Us</div>
                        <h2 className="section-title">Our Core Values</h2>
                    </div>
                    <div className="values-grid">
                        {values.map(v => (
                            <div key={v.title} className="value-card">
                                <div className="value-icon">{v.icon}</div>
                                <h4>{v.title}</h4>
                                <p>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="content-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">Our People</div>
                        <h2 className="section-title">Meet the Team</h2>
                    </div>
                    <div className="team-grid">
                        {team.map(m => (
                            <div key={m.name} className="team-card">
                                <div className="team-avatar">
                                    <img src={m.img} alt={m.name} />
                                </div>
                                <h4>{m.name}</h4>
                                <p>{m.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <CTABanner />
        </main>
    )
}
