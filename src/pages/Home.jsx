import { useEffect } from 'react'
import Hero from '../components/Hero'
import StatsBar from '../components/StatsBar'
import Services from '../components/Services'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import Destinations from '../components/Destinations'
import CTABanner from '../components/CTABanner'

export default function Home() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
            { threshold: 0.12 }
        )
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
        return () => observer.disconnect()
    }, [])

    return (
        <main>
            <Hero />
            <StatsBar />
            <Services />
            <HowItWorks />
            <Testimonials />
            <Destinations />
            <CTABanner />
        </main>
    )
}
