import { Link } from 'react-router-dom'
import { Briefcase, TrendingUp, ArrowRight, Star, Sparkles, Globe } from 'lucide-react'

const destinations = [
    { id: 'ae', flag: 'https://flagcdn.com/w80/ae.png', name: 'Dubai, UAE', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop', jobs: '10k+', salary: 'AED 8k+', featured: true, tag: 'Most Popular' },
    { id: 'ca', flag: 'https://flagcdn.com/w80/ca.png', name: 'Canada', img: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=800&auto=format&fit=crop', jobs: '5k+', salary: 'CAD 50k+', featured: true },
    { id: 'us', flag: 'https://flagcdn.com/w80/us.png', name: 'United States', img: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?q=80&w=800&auto=format&fit=crop', jobs: '6k+', salary: 'USD 55k+', featured: true },
    { id: 'gb', flag: 'https://flagcdn.com/w80/gb.png', name: 'United Kingdom', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop', jobs: '4.5k+', salary: 'GBP 35k+' },
    { id: 'de', flag: 'https://flagcdn.com/w80/de.png', name: 'Germany', img: 'https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?q=80&w=800&auto=format&fit=crop', jobs: '3k+', salary: 'EUR 35k+' },
    { id: 'fr', flag: 'https://flagcdn.com/w80/fr.png', name: 'France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop', jobs: '2.5k+', salary: 'EUR 30k+' },
    { id: 'om', flag: 'https://flagcdn.com/w80/om.png', name: 'Oman', img: 'https://images.unsplash.com/photo-1549474843-ed29a439266e?q=80&w=800&auto=format&fit=crop', jobs: '2k+', salary: 'OMR 500+' },
    { id: 'cn', flag: 'https://flagcdn.com/w80/cn.png', name: 'China', img: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=800&auto=format&fit=crop', jobs: '8k+', salary: 'CNY 15k+', tag: 'High Demand' },
    { id: 'jp', flag: 'https://flagcdn.com/w80/jp.png', name: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop', jobs: '4k+', salary: 'JPY 300k+' },
    { id: 'nl', flag: 'https://flagcdn.com/w80/nl.png', name: 'Netherlands', img: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=800&auto=format&fit=crop', jobs: '1.5k+', salary: 'EUR 40k+' },
]

export default function Destinations() {
    return (
        <section className="destinations-premium section-padding">
            <div className="container">
                <div className="premium-section-header text-center">
                    <span className="p-badge">
                        <Sparkles size={14} className="icon-gold" /> Global Opportunities
                    </span>
                    <h2>Featured Destinations</h2>
                    <p className="mx-auto">
                        Explore verified career pathways in the world's most stable economies.
                    </p>
                </div>

                <div className="destinations-grid-premium">
                    {destinations.map(d => (
                        <div
                            key={d.id}
                            className={`dest-card-v2 animate-reveal ${d.featured ? 'dest-card--featured' : ''}`}
                        >
                            <div className="dest-img-wrap">
                                <img src={d.img} alt={d.name} className="main-img" />
                                <div className="flag-overlay">
                                    <img src={d.flag} alt={d.name} />
                                </div>
                                {d.tag && (
                                    <div className="featured-pill">
                                        <Star size={10} fill="currentColor" /> {d.tag}
                                    </div>
                                )}
                            </div>

                            <div className="dest-content">
                                <h3>{d.name}</h3>
                                <div className="dest-stats-row">
                                    <div className="stat-pill">
                                        <Briefcase size={12} /> {d.jobs}
                                    </div>
                                    <div className="stat-pill">
                                        <TrendingUp size={12} /> {d.salary}
                                    </div>
                                </div>
                                <Link to="/visa-services" className="dest-action-link">
                                    Explore Program <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
