import { Link } from 'react-router-dom'
import { Calendar, ArrowRight } from 'lucide-react'

export default function CTABanner() {
    return (
        <section className="cta-banner">
            <div className="container">
                <h2>Ready to Start Your Journey Abroad?</h2>
                <p>Book your free consultation with our experts today!</p>
                <div className="cta-actions">
                    <Link to="/contact" className="btn btn-primary">
                        <Calendar size={18} /> Book Free Consultation
                    </Link>
                    <Link to="/apply" className="btn btn-outline">
                        Apply Now <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    )
}
