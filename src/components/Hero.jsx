import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, GraduationCap, Star, CheckCircle, Send } from 'lucide-react'

// Hero background slideshow images — Dubai, visas, scholarships, campuses
const heroBgImages = [
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&q=80&auto=format&fit=crop',  // Dubai skyline
    'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1400&q=80&auto=format&fit=crop',  // University campus
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1400&q=80&auto=format&fit=crop',  // Graduation
    'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=1400&q=80&auto=format&fit=crop',  // Dubai city
]

const marqueeImages = [
    {
        src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80&auto=format&fit=crop',
        alt: 'Study Group',
        label: 'Study Abroad',
        desc: 'Join top-ranked universities across the UK, USA & Europe with expert guidance.',
        cta: 'Apply Now',
        link: '/apply'
    },
    {
        src: 'https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?w=600&q=80&auto=format&fit=crop',
        alt: 'London',
        label: 'United Kingdom',
        desc: 'Russell Group universities, post-study work visas & scholarship opportunities.',
        cta: 'Explore UK',
        link: '/destinations'
    },
    {
        src: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=600&q=80&auto=format&fit=crop',
        alt: 'Travel & Visas',
        label: 'Visa Assistance',
        desc: '98% success rate. We handle every step of your student or work visa application.',
        cta: 'Get Your Visa',
        link: '/visa-services'
    },
    {
        src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80&auto=format&fit=crop',
        alt: 'International Students',
        label: 'Global Community',
        desc: 'Connect with 15,000+ alumni from 50+ countries sharing your global ambitions.',
        cta: 'Join Us',
        link: '/about'
    },
    {
        src: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&q=80&auto=format&fit=crop',
        alt: 'Campus Library',
        label: 'Scholarships',
        desc: 'Access curated scholarships worth millions — fully supported applications.',
        cta: 'Find Scholarships',
        link: '/scholarships'
    },
    {
        src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80&auto=format&fit=crop',
        alt: 'Collaborative Study',
        label: 'Work Abroad — Dubai',
        desc: 'Land a high-paying role in the UAE. We manage your work visa from start to finish.',
        cta: 'Apply for Dubai',
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
        label: 'Work Abroad — Tokyo',
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
        src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80&auto=format&fit=crop',
        alt: 'Career Coaching',
        label: 'Career Support',
        desc: 'CV writing, interview prep & job placement support — we don\'t stop at the visa.',
        cta: 'Register Free',
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

                        {/* Bullet benefits */}
                        <div className="hero-benefits">
                            <div className="benefit-item">
                                <CheckCircle size={16} className="benefit-icon" />
                                <span>98% Visa Success Rate</span>
                            </div>
                            <div className="benefit-item">
                                <CheckCircle size={16} className="benefit-icon" />
                                <span>200+ Partner Universities</span>
                            </div>
                            <div className="benefit-item">
                                <CheckCircle size={16} className="benefit-icon" />
                                <span>Complete Scholarship Guidance</span>
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
                                <span><strong>15,000+</strong> students placed worldwide</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Assessment Form */}
                    <div className="hero-form-wrapper reveal">
                        <div className="hero-form-card">
                            <div className="form-card-header">
                                <h3>Check Your Eligibility</h3>
                                <p>Get a response within 24 hours</p>
                            </div>
                            
                            {submitted ? (
                                <div className="form-success-msg">
                                    <CheckCircle size={40} className="success-icon" />
                                    <h4>Application Received!</h4>
                                    <p>Our global education expert will contact you shortly.</p>
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
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-group-custom">
                                        <label htmlFor="hero-dest">Preferred Destination</label>
                                        <select 
                                            id="hero-dest"
                                            value={formData.destination}
                                            onChange={(e) => setFormData({...formData, destination: e.target.value})}
                                            required
                                        >
                                            <option value="">Select country...</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="USA">United States</option>
                                            <option value="Canada">Canada</option>
                                            <option value="Australia">Australia</option>
                                            <option value="Germany">Germany</option>
                                        </select>
                                    </div>
                                    <div className="form-group-custom">
                                        <label htmlFor="hero-service">Service Needed</label>
                                        <select 
                                            id="hero-service"
                                            value={formData.service}
                                            onChange={(e) => setFormData({...formData, service: e.target.value})}
                                            required
                                        >
                                            <option value="">Select service...</option>
                                            <option value="Study">Study Abroad Visa</option>
                                            <option value="Work">Work Visa / Permit</option>
                                            <option value="Tourist">Tourist / Visitor Visa</option>
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

            {/* ── Destination Showcase Grid ── */}
            <div className="hero-dest-grid-wrap">
                <div className="container">
                    <div className="hero-dest-grid">
                        {marqueeImages.map((img, i) => (
                            <div className="hero-dest-card" key={i}>
                                <div className="hero-dest-img">
                                    <img src={img.src} alt={img.alt} loading="lazy" />
                                    <div className="hero-dest-img-overlay" />
                                </div>
                                <div className="hero-dest-body">
                                    <h4 className="hero-dest-label">{img.label}</h4>
                                    <p className="hero-dest-desc">{img.desc}</p>
                                    <Link to={img.link} className="hero-dest-cta-btn">
                                        {img.cta} <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </section>
    )
}
