import { Link } from 'react-router-dom'
import CTABanner from '../components/CTABanner'
import {
    FlaskConical, HeartPulse, Briefcase, Scale, Palette, BookOpen,
    MapPin, ArrowRight, Globe
} from 'lucide-react'

const programs = [
    {
        icon: <FlaskConical size={24} />,
        tag: 'Science & Tech', title: 'STEM Programs',
        desc: 'Engineering, Computer Science, Data Science, and more at top global universities.',
        img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
    },
    {
        icon: <HeartPulse size={24} />,
        tag: 'Health', title: 'Medicine & Health Sciences',
        desc: 'Medical degrees, nursing, pharmacy from internationally recognized institutions.',
        img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
    },
    {
        icon: <Briefcase size={24} />,
        tag: 'Business', title: 'Business & Management',
        desc: 'MBA, finance, marketing at leading business schools worldwide.',
        img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
    },
    {
        icon: <Scale size={24} />,
        tag: 'Law', title: 'Law & Political Science',
        desc: 'LLB, LLM, international law programs in USA, UK, Canada and beyond.',
        img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop',
    },
    {
        icon: <Palette size={24} />,
        tag: 'Arts', title: 'Arts & Design',
        desc: 'Creative degrees in graphic design, architecture, film, and fine arts.',
        img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop',
    },
    {
        icon: <BookOpen size={24} />,
        tag: 'Humanities', title: 'Social Sciences',
        desc: 'Psychology, sociology, international relations from top-ranking universities.',
        img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop',
    },
]

const destinations = [
    { name: 'Canada', flag: 'https://flagcdn.com/w40/ca.png' },
    { name: 'United States', flag: 'https://flagcdn.com/w40/us.png' },
    { name: 'United Kingdom', flag: 'https://flagcdn.com/w40/gb.png' },
    { name: 'Australia', flag: 'https://flagcdn.com/w40/au.png' },
    { name: 'Germany', flag: 'https://flagcdn.com/w40/de.png' },
    { name: 'New Zealand', flag: 'https://flagcdn.com/w40/nz.png' },
]

export default function StudyAbroad() {
    return (
        <main>
            <div className="page-hero">
                <div className="page-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?q=80&w=1600&auto=format&fit=crop)' }} />
                <div className="container page-hero-content">
                    <div className="breadcrumb">
                        <Link to="/">Home</Link><span className="sep">›</span><span>Study Abroad</span>
                    </div>
                    <h1>Study Abroad Programs</h1>
                    <p>Discover world-class universities and programs tailored to your academic goals and career aspirations.</p>
                </div>
            </div>

            <section className="content-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">Fields of Study</div>
                        <h2 className="section-title">Choose Your Program</h2>
                        <p className="section-sub">Explore programs across all major disciplines at partner universities worldwide.</p>
                    </div>
                    <div className="programs-grid">
                        {programs.map(p => (
                            <div key={p.title} className="program-card">
                                <div className="program-card-img">
                                    <img src={p.img} alt={p.title} />
                                    <span className="program-tag">{p.tag}</span>
                                </div>
                                <div className="program-card-body">
                                    <div className="program-icon">{p.icon}</div>
                                    <h3>{p.title}</h3>
                                    <p>{p.desc}</p>
                                    <Link to="/apply" className="service-link">
                                        Apply Now <ArrowRight size={15} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="content-section destinations-strip">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">Top Destinations</div>
                        <h2 className="section-title">Where Can You Study?</h2>
                    </div>
                    <div className="destinations-pills">
                        {destinations.map(d => (
                            <span key={d.name} className="destination-pill">
                                <img src={d.flag} alt={d.name} />
                                {d.name}
                            </span>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                        <Link to="/apply" className="btn btn-primary" style={{ fontSize: '1rem' }}>
                            Apply for Study Abroad <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            <CTABanner />
        </main>
    )
}
