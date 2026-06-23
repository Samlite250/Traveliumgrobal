import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, GraduationCap } from 'lucide-react'

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-bg"></div>
            <div className="container">
                <div className="hero-content reveal">
                    <div className="hero-badge">
                        <GraduationCap size={16} />
                        Your Future, Our Mission
                    </div>
                    <h1 className="hero-title">
                        Your Gateway to<br />
                        <span>Global Education</span> and<br />
                        <em>Travel Opportunities</em>
                    </h1>
                    <p className="hero-sub">
                        Join thousands of students who are building their future with the world's
                        best universities and global opportunities. We guide you every step of the way.
                    </p>
                    <div className="hero-actions">
                        <Link to="/apply" className="btn btn-primary">
                            Apply Now <ArrowRight size={18} />
                        </Link>
                        <Link to="/contact" className="btn btn-outline">
                            <Calendar size={18} /> Book Free Consultation
                        </Link>
                    </div>
                </div>
                <div className="hero-visual reveal">
                    <div className="hero-visual-card main">
                        <img src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop" alt="University Students" />
                    </div>
                    <div className="hero-visual-card small">
                        <img src="https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=800&auto=format&fit=crop" alt="Travel" />
                    </div>
                    <div className="hero-visual-card small">
                        <img src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=800&auto=format&fit=crop" alt="Campus Life" />
                    </div>
                </div>
            </div>
        </section>
    )
}
