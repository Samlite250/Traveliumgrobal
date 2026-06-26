import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plane, Search, Calendar, Users, MapPin, ArrowRight, Tag, ShieldCheck, Clock } from 'lucide-react'
import CTABanner from '../components/CTABanner'

const searchFilters = [
    { label: 'Round Trip', value: 'round' },
    { label: 'One Way', value: 'oneway' },
    { label: 'Multi-city', value: 'multi' },
]

const recentDeals = [
    {
        from: 'Kigali (KGL)', to: 'Dubai (DXB)',
        price: '450', date: 'Oct 12 - Oct 20',
        img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop'
    },
    {
        from: 'Kigali (KGL)', to: 'Istanbul (IST)',
        price: '580', date: 'Nov 05 - Nov 15',
        img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop'
    },
    {
        from: 'Kigali (KGL)', to: 'Nairobi (NBO)',
        price: '290', date: 'Sep 28 - Oct 05',
        img: 'https://images.unsplash.com/photo-1580227974558-86d49811c002?q=80&w=800&auto=format&fit=crop'
    },
]

export default function Flights() {
    const [tripType, setTripType] = useState('round')

    return (
        <main className="flights-page">
            <div className="page-hero">
                <div className="page-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1436491865332-7a61a109c05d?q=80&w=1600&auto=format&fit=crop)' }} />
                <div className="container page-hero-content">
                    <div className="breadcrumb">
                        <Link to="/">Home</Link><span className="sep">›</span><span>Flights</span>
                    </div>
                    <h1>Book Your Next Adventure</h1>
                    <p>Compare thousands of flights and find the best deals to your dream destinations worldwide.</p>

                    <div className="flight-search-container">
                        <div className="search-tabs">
                            {searchFilters.map(f => (
                                <button
                                    key={f.value}
                                    className={`search-tab ${tripType === f.value ? 'active' : ''}`}
                                    onClick={() => setTripType(f.value)}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                        <div className="search-form">
                            <div className="input-group">
                                <label><MapPin size={14} /> From</label>
                                <input type="text" placeholder="Origin City or Airport" defaultValue="Kigali (KGL)" />
                            </div>
                            <div className="input-group">
                                <label><MapPin size={14} /> To</label>
                                <input type="text" placeholder="Destination City or Airport" />
                            </div>
                            <div className="input-group">
                                <label><Calendar size={14} /> Departure</label>
                                <input type="text" placeholder="Select Date" />
                            </div>
                            {tripType === 'round' && (
                                <div className="input-group">
                                    <label><Calendar size={14} /> Return</label>
                                    <input type="text" placeholder="Select Date" />
                                </div>
                            )}
                            <div className="input-group">
                                <label><Users size={14} /> Travelers</label>
                                <input type="text" placeholder="1 Adult, Economy" />
                            </div>
                            <button className="btn-search">
                                <Search size={20} />
                                <span>Search</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <section className="content-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">Exclusive Offers</div>
                        <h2 className="section-title">Trending Flight Deals</h2>
                        <p className="section-sub">Don't miss out on these hand-picked destinations with the best current prices.</p>
                    </div>
                    <div className="programs-grid">
                        {recentDeals.map(deal => (
                            <div key={deal.to} className="program-card">
                                <div className="program-card-img">
                                    <img src={deal.img} alt={deal.to} />
                                    <span className="program-tag">From ${deal.price}</span>
                                </div>
                                <div className="program-card-body">
                                    <div className="program-icon"><Plane size={24} /></div>
                                    <h3>{deal.from} to {deal.to}</h3>
                                    <p className="deal-date">{deal.date}</p>
                                    <p>Experience the beauty of {deal.to} with our exclusive flight partners.</p>
                                    <Link to="/apply" className="service-link">
                                        Book Now <ArrowRight size={15} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="content-section highlights-section">
                <div className="container">
                    <div className="highlights-grid">
                        <div className="highlight-item">
                            <Tag className="highlight-icon" />
                            <h3>Best Price Guarantee</h3>
                            <p>We work with over 500 airlines to bring you the most competitive fares in the market.</p>
                        </div>
                        <div className="highlight-item">
                            <ShieldCheck className="highlight-icon" />
                            <h3>Secure Booking</h3>
                            <p>Your personal information and payment details are protected by industry-leading security.</p>
                        </div>
                        <div className="highlight-item">
                            <Clock className="highlight-icon" />
                            <h3>24/7 Support</h3>
                            <p>Our travel experts are available around the clock to assist you with any flight queries.</p>
                        </div>
                    </div>
                </div>
            </section>

            <CTABanner />
        </main>
    )
}
