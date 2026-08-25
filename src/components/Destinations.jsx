import { Link } from 'react-router-dom'
import { Briefcase, TrendingUp, ArrowRight, Star, Sparkles, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const destinations = [
    { id: 'ae', flag: 'https://flagcdn.com/w80/ae.png', name: 'Dubai, UAE', countryParam: 'Dubai', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop', jobs: '10k+', salary: 'AED 8k+', featured: true, tag: 'Most Popular' },
    { id: 'ca', flag: 'https://flagcdn.com/w80/ca.png', name: 'Canada', countryParam: 'Canada', img: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=800&auto=format&fit=crop', jobs: '5k+', salary: 'CAD 50k+', featured: true },
    { id: 'us', flag: 'https://flagcdn.com/w80/us.png', name: 'United States', countryParam: 'USA', img: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?q=80&w=800&auto=format&fit=crop', jobs: '6k+', salary: 'USD 55k+', featured: true },
    { id: 'gb', flag: 'https://flagcdn.com/w80/gb.png', name: 'United Kingdom', countryParam: 'UK', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop', jobs: '4.5k+', salary: 'GBP 35k+' },
    { id: 'de', flag: 'https://flagcdn.com/w80/de.png', name: 'Germany', countryParam: 'Germany', img: 'https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?q=80&w=800&auto=format&fit=crop', jobs: '3k+', salary: 'EUR 35k+' },
    { id: 'au', flag: 'https://flagcdn.com/w80/au.png', name: 'Australia', countryParam: 'Australia', img: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=800&auto=format&fit=crop', jobs: '4k+', salary: 'AUD 55k+', tag: 'High Paying' },
    { id: 'qa', flag: 'https://flagcdn.com/w80/qa.png', name: 'Qatar', countryParam: 'Qatar', img: 'https://images.unsplash.com/photo-1578895210405-907db48a7812?q=80&w=800&auto=format&fit=crop', jobs: '3.5k+', salary: 'QAR 9k+', tag: 'Tax-Free' },
    { id: 'no', flag: 'https://flagcdn.com/w80/no.png', name: 'Norway', countryParam: 'Norway', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop', jobs: '2k+', salary: 'NOK 45k+', tag: 'Top Quality' },
    { id: 'pl', flag: 'https://flagcdn.com/w80/pl.png', name: 'Poland', countryParam: 'Poland', img: 'https://images.unsplash.com/photo-1519197924294-4ac97f1615c6?q=80&w=800&auto=format&fit=crop', jobs: '3k+', salary: 'PLN 12k+', tag: 'Fast Visa' },
    { id: 'fr', flag: 'https://flagcdn.com/w80/fr.png', name: 'France', countryParam: 'France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop', jobs: '2.5k+', salary: 'EUR 30k+' },
    { id: 'om', flag: 'https://flagcdn.com/w80/om.png', name: 'Oman', countryParam: 'Oman', img: 'https://images.unsplash.com/photo-1606813332135-228593b6e201?q=80&w=800&auto=format&fit=crop', jobs: '2k+', salary: 'OMR 500+' },
    { id: 'cn', flag: 'https://flagcdn.com/w80/cn.png', name: 'China', countryParam: 'China', img: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=800&auto=format&fit=crop', jobs: '8k+', salary: 'CNY 15k+', tag: 'High Demand' },
    { id: 'jp', flag: 'https://flagcdn.com/w80/jp.png', name: 'Japan', countryParam: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop', jobs: '4k+', salary: 'JPY 300k+' },
    { id: 'nl', flag: 'https://flagcdn.com/w80/nl.png', name: 'Netherlands', countryParam: 'Netherlands', img: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=800&auto=format&fit=crop', jobs: '1.5k+', salary: 'EUR 40k+' },
]

export default function Destinations() {
    const { t } = useTranslation()
    return (
        <section className="destinations-premium section-padding">
            <div className="container">
                <div className="premium-section-header text-center">
                    <span className="p-badge">
                        <Sparkles size={14} className="icon-gold" /> {t('destinations.badge', 'Global Opportunities')}
                    </span>
                    <h2>{t('destinations.title', 'Featured Destinations')}</h2>
                    <p className="mx-auto">
                        {t('destinations.subtitle', "Explore verified career pathways in the world's most stable economies.")}
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
                                <Link to={`/jobs?country=${d.countryParam || d.name}`} className="dest-action-link">
                                    {t('destinations.exploreProgram', 'Explore Program')} <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
