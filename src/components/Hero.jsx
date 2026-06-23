import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, GraduationCap, Users, Star } from 'lucide-react'

const marqueeImages = [
    { src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=480&q=75&auto=format&fit=crop', alt: 'Student Life' },
    { src: 'https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?w=480&q=75&auto=format&fit=crop', alt: 'London Study' },
    { src: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=480&q=75&auto=format&fit=crop', alt: 'Travel Airport' },
    { src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=480&q=75&auto=format&fit=crop', alt: 'International Students' },
    { src: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=480&q=75&auto=format&fit=crop', alt: 'Campus Library' },
    { src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=480&q=75&auto=format&fit=crop', alt: 'Graduation' },
    { src: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=480&q=75&auto=format&fit=crop', alt: 'University Campus' },
    { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=480&q=75&auto=format&fit=crop', alt: 'Study Group' },
]

const proofAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=faces&q=80',
]

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-bg"></div>

            {/* ── Main content ── */}
            <div className="hero-inner">
                <div className="container">
                    <div className="hero-content reveal">

                        <div className="hero-badge">
                            <GraduationCap size={14} />
                            Your Future, Our Mission
                        </div>

                        <h1 className="hero-title">
                            Your Gateway to <em>Global Education</em><br />
                            &amp; <span>Travel Opportunities</span>
                        </h1>

                        <p className="hero-sub">
                            Join thousands of students building their future with the world's
                            best universities. Expert guidance from application to arrival.
                        </p>

                        <div className="hero-actions">
                            <Link to="/apply" className="btn btn-primary">
                                Apply Now <ArrowRight size={16} />
                            </Link>
                            <Link to="/contact" className="btn btn-outline">
                                <Calendar size={16} /> Free Consultation
                            </Link>
                        </div>

                        {/* Social proof row */}
                        <div className="hero-proof">
                            <div className="hero-proof-avatars">
                                {proofAvatars.map((url, i) => (
                                    <img key={i} src={url} alt={`Placed Student ${i + 1}`} loading="lazy" />
                                ))}
                            </div>
                            <div className="hero-proof-text">
                                <div className="hero-proof-stars">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                </div>
                                <span><strong>15,000+</strong> students placed worldwide</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ── Horizontal marquee ── */}
            <div className="hero-marquee-wrap">
                <div className="hero-marquee">
                    <div className="hero-marquee-track">
                        {[...marqueeImages, ...marqueeImages].map((img, i) => (
                            <div className="hero-marquee-card" key={i}>
                                <img src={img.src} alt={img.alt} loading={i < 8 ? 'eager' : 'lazy'} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </section>
    )
}
