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
                <div className="hero-scroller reveal">
                    <div className="hero-scroller-col col-up">
                        <div className="hero-scroller-inner">
                            <div className="hero-scroller-card">
                                <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=75&auto=format&fit=crop" alt="Student Life" loading="eager" />
                            </div>
                            <div className="hero-scroller-card">
                                <img src="https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?w=600&q=75&auto=format&fit=crop" alt="United Kingdom Study" loading="eager" />
                            </div>
                            <div className="hero-scroller-card">
                                <img src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=600&q=75&auto=format&fit=crop" alt="Travel Airport" loading="eager" />
                            </div>
                            <div className="hero-scroller-card">
                                <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=75&auto=format&fit=crop" alt="International Students" loading="eager" />
                            </div>
                            {/* Duplicate for infinite loop */}
                            <div className="hero-scroller-card">
                                <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=75&auto=format&fit=crop" alt="Student Life" loading="lazy" />
                            </div>
                            <div className="hero-scroller-card">
                                <img src="https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?w=600&q=75&auto=format&fit=crop" alt="United Kingdom Study" loading="lazy" />
                            </div>
                            <div className="hero-scroller-card">
                                <img src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=600&q=75&auto=format&fit=crop" alt="Travel Airport" loading="lazy" />
                            </div>
                            <div className="hero-scroller-card">
                                <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=75&auto=format&fit=crop" alt="International Students" loading="lazy" />
                            </div>
                        </div>
                    </div>
                    <div className="hero-scroller-col col-down">
                        <div className="hero-scroller-inner">
                            <div className="hero-scroller-card">
                                <img src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&q=75&auto=format&fit=crop" alt="Campus Library" loading="eager" />
                            </div>
                            <div className="hero-scroller-card">
                                <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&q=75&auto=format&fit=crop" alt="Graduation Ceremony" loading="eager" />
                            </div>
                            <div className="hero-scroller-card">
                                <img src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=600&q=75&auto=format&fit=crop" alt="University Campus" loading="eager" />
                            </div>
                            <div className="hero-scroller-card">
                                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=75&auto=format&fit=crop" alt="Student Group Studying" loading="eager" />
                            </div>
                            {/* Duplicate for infinite loop */}
                            <div className="hero-scroller-card">
                                <img src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&q=75&auto=format&fit=crop" alt="Campus Library" loading="lazy" />
                            </div>
                            <div className="hero-scroller-card">
                                <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&q=75&auto=format&fit=crop" alt="Graduation Ceremony" loading="lazy" />
                            </div>
                            <div className="hero-scroller-card">
                                <img src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=600&q=75&auto=format&fit=crop" alt="University Campus" loading="lazy" />
                            </div>
                            <div className="hero-scroller-card">
                                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=75&auto=format&fit=crop" alt="Student Group Studying" loading="lazy" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
