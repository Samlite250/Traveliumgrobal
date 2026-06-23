import { Link } from 'react-router-dom'
import { School, Landmark, ArrowRight } from 'lucide-react'

const destinations = [
    {
        flag: 'https://flagcdn.com/w80/ca.png', name: 'Canada',
        img: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=800&auto=format&fit=crop',
        universities: '80+', tuition: 'CAD 15K – 25K',
    },
    {
        flag: 'https://flagcdn.com/w80/us.png', name: 'United States',
        img: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?q=80&w=800&auto=format&fit=crop',
        universities: '100+', tuition: 'USD 20K – 45K',
    },
    {
        flag: 'https://flagcdn.com/w80/gb.png', name: 'United Kingdom',
        img: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?q=80&w=800&auto=format&fit=crop',
        universities: '80+', tuition: 'GBP 15K – 35K',
    },
    {
        flag: 'https://flagcdn.com/w80/au.png', name: 'Australia',
        img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop',
        universities: '50+', tuition: 'AUD 20K – 35K',
    },
    {
        flag: 'https://flagcdn.com/w80/de.png', name: 'Germany',
        img: 'https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?q=80&w=800&auto=format&fit=crop',
        universities: '40+', tuition: 'EUR 5K – 15K',
    },
]

export default function Destinations() {
    return (
        <section className="destinations section">
            <div className="container">
                <div className="section-header">
                    <div className="section-label">Top Picks</div>
                    <h2 className="section-title">Popular Destinations</h2>
                    <p className="section-sub">
                        Explore top study destinations with world-class universities
                    </p>
                </div>
                <div className="destinations-grid">
                    {destinations.map(d => (
                        <div key={d.name} className="destination-card reveal">
                            <div className="destination-img">
                                <img src={d.img} alt={d.name} />
                                <img src={d.flag} className="destination-flag" alt={`${d.name} Flag`} />
                            </div>
                            <div className="destination-info">
                                <div className="destination-name">{d.name}</div>
                                <div className="destination-meta">
                                    <School size={14} style={{ marginRight: '4px' }} />
                                    Top Universities: {d.universities}
                                </div>
                                <div className="destination-tuition">
                                    <Landmark size={14} style={{ marginRight: '4px' }} />
                                    Avg. Tuition/Year: <strong>{d.tuition}</strong>
                                </div>
                            </div>
                            <Link to="/study-abroad" className="destination-btn">
                                Explore <ArrowRight size={14} />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
