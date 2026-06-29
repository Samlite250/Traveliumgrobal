import { Link } from 'react-router-dom'
import { CheckCircle, Clock, ShieldCheck, Ticket, ArrowRight, Info } from 'lucide-react'

const WhatsAppIcon = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
)

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

                                <a href="https://wa.me/250793658206" className="wa-btn-sm" target="_blank" rel="noopener noreferrer">
                                    <WhatsAppIcon size={18} /> Chat with Agent
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
