import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Briefcase, Star, CheckCircle, Send, ChevronLeft, ChevronRight } from 'lucide-react'

// Hero background slideshow images — Dubai, visas, scholarships, campuses
const heroBgImages = [
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&q=80&auto=format&fit=crop',  // Dubai skyline
    'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1400&q=80&auto=format&fit=crop',  // University campus
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1400&q=80&auto=format&fit=crop',  // Graduation
    'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=1400&q=80&auto=format&fit=crop',  // Dubai city
]

const marqueeImages = [
    {
        src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80&auto=format&fit=crop',
        alt: 'Dubai Skyline',
        label: '🔥 Work in Dubai — UAE',
        desc: 'Tax-free salaries, world-class lifestyle. We fast-track your UAE work visa from start to finish.',
        cta: 'Apply for Dubai',
        link: '/visa-services'
    },
    {
        src: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=600&q=80&auto=format&fit=crop',
        alt: 'Dubai City',
        label: 'Dubai — NOW HIRING',
        desc: '10,000+ open roles in hospitality, finance, tech & construction. Relocation support included.',
        cta: 'Get UAE Visa',
        link: '/visa-services'
    },
    {
        src: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=600&q=80&auto=format&fit=crop',
        alt: 'Work Visas',
        label: 'Work Visa Assistance',
        desc: '98% visa success rate. We handle every step of your international work visa application.',
        cta: 'Get Your Work Visa',
        link: '/visa-services'
    },
    {
        src: 'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?w=600&q=80&auto=format&fit=crop',
        alt: 'Germany',
        label: 'Work Abroad — Germany',
        desc: 'EU Blue Card & skilled worker visas. Relocate to Europe\'s biggest economy.',
        cta: 'Get Germany Visa',
        link: '/visa-services'
    },
    {
        src: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80&auto=format&fit=crop',
        alt: 'Tokyo Japan',
        label: 'Work Abroad — Japan',
        desc: 'Japan\'s booming tech & hospitality sectors are hiring internationally right now.',
        cta: 'Apply for Japan',
        link: '/visa-services'
    },
    {
        src: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=600&q=80&auto=format&fit=crop',
        alt: 'Paris France',
        label: 'Work Abroad — France',
        desc: 'France Talent Passport Visa: fast-track work authorization for skilled professionals.',
        cta: 'Apply for France',
        link: '/visa-services'
    },
    {
        src: 'https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?w=600&q=80&auto=format&fit=crop',
        alt: 'London UK',
        label: 'Work Abroad — UK',
        desc: 'Skilled Worker Visa for the UK. Access world-class employers in London and beyond.',
        cta: 'Explore UK',
        link: '/visa-services'
    },
    {
        src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80&auto=format&fit=crop',
        alt: 'Career Coaching',
        label: 'Career & Job Support',
        desc: 'CV writing, interview prep & job placement support — we don\'t stop at the visa.',
        cta: 'Register Free',
        link: '/apply'
    },
    {
        src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80&auto=format&fit=crop',
        alt: 'Global Network',
        label: 'Global Community',
        desc: 'Connect with 15,000+ professionals placed in 50+ countries sharing your ambitions.',
        cta: 'Join Us',
        link: '/about'
    },
    {
        src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80&auto=format&fit=crop',
        alt: 'Study Group',
        label: 'Study Abroad',
        desc: 'Join top-ranked universities across the UK, USA & Europe with expert guidance.',
        cta: 'Apply Now',
        link: '/apply'
    },
]


const proofAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=faces&q=80',
]

export default function Hero() {
    const [activeBg, setActiveBg] = useState(0)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        destination: '',
        service: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const scrollRef = useRef(null);
    const scrollPosRef = useRef(0);
    const requestRef = useRef();

    useEffect(() => {
        const play = () => {
            if (scrollRef.current) {
                scrollPosRef.current += 0.15;

                // loop back when scrolling past original content
                // card width is approx 240px + 1.1rem gap (approx 257px)
                // 10 items * 257.6px = 2576px
                if (scrollPosRef.current >= 2576) {
                    scrollPosRef.current = 0;
                }

                scrollRef.current.scrollLeft = scrollPosRef.current;
            }
            requestRef.current = requestAnimationFrame(play);
        };
        requestRef.current = requestAnimationFrame(play);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    const handleMouseEnter = () => cancelAnimationFrame(requestRef.current);
    const handleMouseLeave = () => {
        // sync pos before restarting
        if (scrollRef.current) scrollPosRef.current = scrollRef.current.scrollLeft;
        const play = () => {
            if (scrollRef.current) {
                scrollPosRef.current += 0.15;
                if (scrollPosRef.current >= 2576) {
                    scrollPosRef.current = 0;
                }
                scrollRef.current.scrollLeft = scrollPosRef.current;
            }
            requestRef.current = requestAnimationFrame(play);
        };
        requestRef.current = requestAnimationFrame(play);
    };

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
            scrollPosRef.current = scrollRef.current.scrollLeft - 300;
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
            scrollPosRef.current = scrollRef.current.scrollLeft + 300;
        }
    };

    // Cycle background image every 60 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveBg(prev => (prev + 1) % heroBgImages.length)
        }, 60000)
        return () => clearInterval(timer)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name && formData.email) {
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 5000);
            setFormData({ name: '', email: '', destination: '', service: '' });
        }
    };

    return (
        <section className="hero">
            <div className="hero-bg" aria-hidden="true">
                {heroBgImages.map((src, i) => (
                    <img
                        key={i}
                        src={src}
                        alt=""
                        className={`hero-bg-img${activeBg === i ? ' hero-bg-img--active' : ''}`}
                        loading={i === 0 ? 'eager' : 'lazy'}
                    />
                ))}
                {/* Frosted overlay */}
                <div className="hero-bg-overlay" />
            </div>

            {/* ── Main content (Two Column) ── */}
            <div className="hero-inner">
                <div className="container hero-grid">

                    {/* Left Column: Copy */}
                    <div className="hero-content reveal">
                        <div className="hero-badge">
                            <Briefcase size={14} />
                            Your Career, Our Mission
                        </div>

                        <h1 className="hero-title">
                            Your Gateway to <em>Dubai</em> &amp;<br />
                            <span>Global Work Visas</span>
                        </h1>

                        <p className="hero-sub">
                            Join thousands of professionals securing high-paying careers abroad.
                            Expert work visa guidance — from application to your first day on the job.
                        </p>

                        {/* Bullet benefits */}
                        <div className="hero-benefits">
                            <div className="benefit-item">
                                <CheckCircle size={16} className="benefit-icon" />
                                <span>98% Work Visa Success Rate</span>
                            </div>
                            <div className="benefit-item">
                                <CheckCircle size={16} className="benefit-icon" />
                                <span>Dubai & 50+ Countries Covered</span>
                            </div>
                            <div className="benefit-item">
                                <CheckCircle size={16} className="benefit-icon" />
                                <span>End-to-End Relocation Support</span>
                            </div>
                        </div>

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
                                <span><strong>15,000+</strong> professionals placed worldwide</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Assessment Form */}
                    <div className="hero-form-wrapper reveal">
                        <div className="hero-form-card">
                            <div className="form-card-header">
                                <h3>Check Work Visa Eligibility</h3>
                                <p>Get a response within 24 hours</p>
                            </div>

                            {submitted ? (
                                <div className="form-success-msg">
                                    <CheckCircle size={40} className="success-icon" />
                                    <h4>Application Received!</h4>
                                    <p>Our work visa expert will contact you shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="hero-form">
                                    <div className="form-group-custom">
                                        <label htmlFor="hero-name">Full Name</label>
                                        <input
                                            type="text"
                                            id="hero-name"
                                            placeholder="John Doe"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group-custom">
                                        <label htmlFor="hero-email">Email Address</label>
                                        <input
                                            type="email"
                                            id="hero-email"
                                            placeholder="john@example.com"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group-custom">
                                        <label htmlFor="hero-dest">Preferred Destination</label>
                                        <select
                                            id="hero-dest"
                                            value={formData.destination}
                                            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                            required
                                        >
                                            <option value="">Select country...</option>
                                            <option value="Dubai">🇦🇪 Dubai, UAE — Most Popular</option>
                                            <option value="Canada">🇨🇦 Canada</option>
                                            <option value="UK">🇬🇧 United Kingdom</option>
                                            <option value="Germany">🇩🇪 Germany</option>
                                            <option value="USA">🇺🇸 United States</option>
                                            <option value="Australia">🇦🇺 Australia</option>
                                            <option value="Japan">🇯🇵 Japan</option>
                                            <option value="France">🇫🇷 France</option>
                                        </select>
                                    </div>
                                    <div className="form-group-custom">
                                        <label htmlFor="hero-service">Service Needed</label>
                                        <select
                                            id="hero-service"
                                            value={formData.service}
                                            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                            required
                                        >
                                            <option value="">Select service...</option>
                                            <option value="Work">Work Visa / Permit</option>
                                            <option value="Dubai">Dubai UAE Work Visa</option>
                                            <option value="Tourist">Tourist / Visitor Visa</option>
                                            <option value="Study">Study Abroad Visa</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block btn-icon">
                                        Submit Inquiry <Send size={16} />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Destination Showcase Scroll Strip ── */}
            <div
                className="hero-dest-strip-wrap"
                ref={scrollRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleMouseEnter}
                onTouchEnd={handleMouseLeave}
            >
                <div className="hero-dest-controls">
                    <button className="dest-scroll-btn left" onClick={scrollLeft} aria-label="Scroll left">
                        <ChevronLeft size={20} />
                    </button>
                    <button className="dest-scroll-btn right" onClick={scrollRight} aria-label="Scroll right">
                        <ChevronRight size={20} />
                    </button>
                </div>
                <div className="hero-dest-scroll">
                    {[...marqueeImages, ...marqueeImages].map((img, i) => (
                        <div className="hero-dest-card" key={i}>
                            <div className="hero-dest-img">
                                <img src={img.src} alt={img.alt} loading="lazy" />
                                <div className="hero-dest-img-overlay" />
                                <span className="hero-dest-img-label">{img.label}</span>
                            </div>
                            <div className="hero-dest-body">
                                <p className="hero-dest-desc">{img.desc}</p>
                                <Link to={img.link} className="hero-dest-cta-btn">
                                    {img.cta} <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    )
}
