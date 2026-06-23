import { useState, useEffect } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
    {
        stars: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        text: '"Travelium made my study abroad dream possible. Their support was amazing throughout the process!"',
        name: 'Sarah A.', role: 'Cornell University, Toronto',
    },
    {
        stars: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        text: '"I got my student visa for the UK without any hassle. Thank you Travelium Global for your excellent support!"',
        name: 'David K.', role: 'University of Manchester',
    },
    {
        stars: 5, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
        text: '"The team guided me perfectly to secure a scholarship in Australia. Highly recommended services!"',
        name: 'Priya M.', role: 'Monash University, Australia',
    },
    {
        stars: 5, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
        text: '"Professional and fast. They processed my work visa in record time. I am now working in Canada!"',
        name: 'James O.', role: 'Toronto, Canada',
    },
    {
        stars: 5, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
        text: '"Best consultancy I have used. They handled everything from start to finish for my study abroad."',
        name: 'Lisa E.', role: 'TU Berlin, Germany',
    },
]

export default function Testimonials() {
    const [index, setIndex] = useState(0)
    const [visible, setVisible] = useState(3)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setVisible(1)
            } else if (window.innerWidth <= 1024) {
                setVisible(2)
            } else {
                setVisible(3)
            }
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const max = Math.max(0, testimonials.length - visible)

    useEffect(() => {
        if (index > max) setIndex(max)
    }, [index, max])

    const prev = () => setIndex(i => Math.max(0, i - 1))
    const next = () => setIndex(i => Math.min(max, i + 1))

    const offsetPx = visible === 1 ? 24 : visible === 2 ? 12 : 8 // gap is 1.5rem (24px)

    return (
        <section className="testimonials section">
            <div className="container">
                <div className="section-header">
                    <div className="section-label">Success Stories</div>
                    <h2 className="section-title">Student Success Stories</h2>
                    <p className="section-sub">
                        Hear from students who achieved their dreams with Travelium
                    </p>
                </div>
                <div className="testimonials-slider">
                    <div
                        className="testimonials-track"
                        style={{ transform: `translateX(calc(-${index * (100 / visible)}% - ${index * offsetPx}px))` }}
                    >
                        {testimonials.map((t, i) => (
                            <div key={i} className="testimonial-card reveal">
                                <div className="testimonial-top">
                                    <div className="testimonial-stars">
                                        {[...Array(t.stars)].map((_, idx) => (
                                            <Star key={idx} size={14} fill="var(--gold)" color="var(--gold)" />
                                        ))}
                                    </div>
                                    <p className="testimonial-text">{t.text}</p>
                                </div>
                                <div className="testimonial-author">
                                    <div className="testimonial-avatar">
                                        <img src={t.avatar} alt={t.name} />
                                    </div>
                                    <div className="testimonial-meta">
                                        <div className="testimonial-name">{t.name}</div>
                                        <div className="testimonial-role">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="slider-controls">
                    <button className="slider-btn" onClick={prev} disabled={index === 0} aria-label="Previous">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="slider-dots">
                        {Array.from({ length: max + 1 }).map((_, i) => (
                            <button
                                key={i}
                                className={`slider-dot ${i === index ? 'active' : ''}`}
                                onClick={() => setIndex(i)}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                    <button className="slider-btn" onClick={next} disabled={index === max} aria-label="Next">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    )
}
