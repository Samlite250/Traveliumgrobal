import { Link } from 'react-router-dom'
import { Send, CheckCircle, Clock, ShieldCheck, Ticket, ArrowRight, Info } from 'lucide-react'

export default function BuyTicket() {
    const ticketProcess = [
        {
            icon: <Info size={24} />,
            title: 'Share Your Details',
            desc: 'Send us your departure city, destination, and preferred dates.'
        },
        {
            icon: <Clock size={24} />,
            title: 'Get Best Quotes',
            desc: 'Our agents will find the best available prices across 500+ airlines.'
        },
        {
            icon: <ShieldCheck size={24} />,
            title: 'Secure Booking',
            desc: 'Once you confirm, we process your payment and issue your ticket.'
        },
        {
            icon: <CheckCircle size={24} />,
            title: 'Receive Ticket',
            desc: 'Your e-ticket will be sent directly to your email and WhatsApp.'
        }
    ]

    return (
        <main className="buy-ticket-page">
            <div className="page-hero">
                <div className="page-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1600&auto=format&fit=crop)' }} />
                <div className="container page-hero-content">
                    <div className="breadcrumb">
                        <Link to="/">Home</Link><span className="sep">›</span><span>Buy Ticket</span>
                    </div>
                    <h1>Easy Ticket Booking</h1>
                    <p>Get the most competitive rates for your international travel with our dedicated ticketing assistant.</p>
                </div>
            </div>

            <section className="info-section section">
                <div className="container">
                    <div className="ticket-info-grid">
                        <div className="ticket-process-side">
                            <div className="section-header">
                                <div className="section-label">Process</div>
                                <h2 className="section-title">How to Buy Your Ticket</h2>
                                <p className="section-sub">Booking a flight is simple and secure with Travelium Grobal.</p>
                            </div>

                            <div className="process-list">
                                {ticketProcess.map((step, i) => (
                                    <div key={i} className="process-step">
                                        <div className="step-icon">{step.icon}</div>
                                        <div className="step-content">
                                            <h4>{step.title}</h4>
                                            <p>{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="ticket-cta-side">
                            <div className="cta-card animate-fadeIn">
                                <div className="cta-icon-box"><Ticket size={32} /></div>
                                <h3>Ready to Fly?</h3>
                                <p>Our travel consultants are available on WhatsApp to provide you with instant quotes and personalized support.</p>

                                <ul className="cta-benefits">
                                    <li><CheckCircle size={16} /> Exclusive discounts</li>
                                    <li><CheckCircle size={16} /> Flexible rescheduling</li>
                                    <li><CheckCircle size={16} /> Visa-linked support</li>
                                </ul>

                                <a href="https://wa.me/250793658206" className="btn btn-whatsapp-large" target="_blank" rel="noopener noreferrer">
                                    <Send size={18} /> Chat with Ticketing Agent
                                </a>
                                <p className="cta-footer">Average response time: &lt; 5 minutes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
