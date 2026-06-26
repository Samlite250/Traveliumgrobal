import { Link } from 'react-router-dom'
import { Send, CheckCircle, Clock, ShieldCheck, Ticket, ArrowRight, Info } from 'lucide-react'

export default function BuyTicket() {
    const ticketProcess = [
        {
            icon: <Info size={28} />,
            title: 'Share Your Details',
            desc: 'Send us your departure city, destination, and preferred travel dates on WhatsApp.'
        },
        {
            icon: <Clock size={28} />,
            title: 'Get Best Quotes',
            desc: 'Our experts will compare prices across 500+ airlines to find you the best rates.'
        },
        {
            icon: <ShieldCheck size={28} />,
            title: 'Secure Booking',
            desc: 'Confirm your choice, and we will handle the payment and issuance securely.'
        },
        {
            icon: <CheckCircle size={28} />,
            title: 'Instant E-Ticket',
            desc: 'Receive your verified e-ticket directly via WhatsApp and official email.'
        }
    ]

    return (
        <main className="buy-ticket-page">
            <div className="page-hero-premium">
                <div className="container">
                    <div className="hero-content-stack animate-reveal">
                        <span className="hero-badge">Ticketing Center</span>
                        <h1>International Flight Solutions</h1>
                        <p>Experience seamless global travel with our dedicated ticketing assistance. Competitive rates and personalized support for every journey.</p>
                    </div>
                </div>
                <div className="hero-overlay-gradient" />
            </div>

            <section className="info-section section-padding">
                <div className="container">
                    <div className="ticket-info-grid">
                        <div className="ticket-process-side animate-reveal" style={{ animationDelay: '0.2s' }}>
                            <div className="premium-section-header">
                                <span className="p-badge">The Method</span>
                                <h2>How to Buy Your Ticket</h2>
                                <p>Booking your next flight with Travelium Global is a simple, four-step professional process designed for your convenience.</p>
                            </div>

                            <div className="process-list-premium">
                                {ticketProcess.map((step, i) => (
                                    <div key={i} className="process-step-premium" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                                        <div className="step-num">{i + 1}</div>
                                        <div className="step-icon-box">{step.icon}</div>
                                        <div className="step-text">
                                            <h4>{step.title}</h4>
                                            <p>{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="ticket-cta-side animate-reveal" style={{ animationDelay: '0.5s' }}>
                            <div className="cta-card-premium">
                                <div className="cta-icon-box-large"><Ticket size={36} /></div>
                                <h3>Ready to Book?</h3>
                                <p>Our ticketing consultants are live on WhatsApp to assist with your inquiries and provide instant bookings.</p>

                                <ul className="premium-check-list">
                                    <li><CheckCircle size={16} /> Exclusive Agency Discounts</li>
                                    <li><CheckCircle size={16} /> Flexible Date Options</li>
                                    <li><CheckCircle size={16} /> Verified E-Tickets</li>
                                </ul>

                                <a href="https://wa.me/250793658206" className="wa-btn-xl" target="_blank" rel="noopener noreferrer">
                                    <Send size={20} /> Chat with Ticketing Agent
                                </a>

                                <div className="response-time">
                                    <Clock size={14} />
                                    <span>Average response: 5 Minutes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
