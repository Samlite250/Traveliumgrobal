import { Link } from 'react-router-dom'
import { Briefcase, TrendingUp, ArrowRight, Star } from 'lucide-react'

const destinations = [
    {
        flag: 'https://flagcdn.com/w80/ae.png', name: 'Dubai, UAE',
        img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop',
        jobs: '10,000+', salary: 'AED 8K – 30K/mo',
        featured: true,
        tag: 'Most Popular',
    },
    {
        flag: 'https://flagcdn.com/w80/ca.png', name: 'Canada',
        img: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=800&auto=format&fit=crop',
        jobs: '5,000+', salary: 'CAD 50K – 90K/yr',
    },
    {
        flag: 'https://flagcdn.com/w80/gb.png', name: 'United Kingdom',
        img: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?q=80&w=800&auto=format&fit=crop',
        jobs: '4,000+', salary: 'GBP 30K – 70K/yr',
    },
    {
        flag: 'https://flagcdn.com/w80/de.png', name: 'Germany',
        img: 'https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?q=80&w=800&auto=format&fit=crop',
        jobs: '3,000+', salary: 'EUR 35K – 65K/yr',
    },
    {
        flag: 'https://flagcdn.com/w80/us.png', name: 'United States',
        img: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?q=80&w=800&auto=format&fit=crop',
        jobs: '6,000+', salary: 'USD 55K – 120K/yr',
    },
    {
        flag: 'https://flagcdn.com/w80/au.png', name: 'Australia',
        img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop',
        jobs: '2,500+', salary: 'AUD 60K – 100K/yr',
    },
]

export default function Destinations() {
    return (
        <section className="destinations section">
            <div className="container">
                <div className="section-header">
                    <div className="section-label">Work Abroad</div>
                    <h2 className="section-title">Top Work Destinations</h2>
                    <p className="section-sub">
                        Secure a high-paying international career with our expert work visa guidance
                    </p>
                </div>
                <div className="destinations-grid">
                    {destinations.map(d => (
                        <div
                            key={d.name}
                            className={`destination-card reveal${d.featured ? ' destination-card--featured' : ''}`}
                        >
                            {d.tag && (
                                <div className="destination-featured-badge">
                                    <Star size={12} fill="currentColor" /> {d.tag}
                                </div>
                            )}
                            <div className="destination-img">
                                <img src={d.img} alt={d.name} />
                                <img src={d.flag} className="destination-flag" alt={`${d.name} Flag`} />
                            </div>
                            <div className="destination-info">
                                <div className="destination-name">{d.name}</div>
                                <div className="destination-meta">
                                    <Briefcase size={14} style={{ marginRight: '4px' }} />
                                    Open Jobs: {d.jobs}
                                </div>
                                <div className="destination-tuition">
                                    <TrendingUp size={14} style={{ marginRight: '4px' }} />
                                    Avg. Salary: <strong>{d.salary}</strong>
                                </div>
                            </div>
                            <Link to="/visa-services" className="destination-btn">
                                Get Work Visa <ArrowRight size={14} />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
