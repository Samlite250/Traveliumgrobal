import { Link } from 'react-router-dom'
import CTABanner from '../components/CTABanner'
import SEOHead from '../components/SEOHead'
import { fallbackScholarships, scholarshipSlug, trackOutbound } from '../lib/listings'
import {
    ShieldCheck, TrendingUp, Stamp, Plane,
    CalendarDays, ArrowRight, ExternalLink, GraduationCap, MapPin, Briefcase, Star
} from 'lucide-react'

// ── "Why Rwanda" highlights ──
const rwandaHighlights = [
    { icon: '🛡️', title: 'Africa\'s Safest Country', desc: 'Ranked the safest country in Africa for 8+ consecutive years — live and work with peace of mind.' },
    { icon: '🚀', title: 'Fastest-Growing Economy', desc: 'Sustained 7–8% annual GDP growth with a business-friendly government and zero red-tape reforms.' },
    { icon: '💻', title: 'Kigali Innovation City', desc: 'A booming tech hub hosting Apple\'s AI campus, smart-device assembly plants and hundreds of startups.' },
    { icon: '🛂', title: 'Visa-on-Arrival', desc: 'All African citizens get visas on arrival; e-visas available for travellers from 200+ countries worldwide.' },
    { icon: '🌿', title: 'Clean & Green Capital', desc: 'Kigali is Africa\'s cleanest city — car-free days, monthly Umuganda community service and a plastic-free nation.' },
    { icon: '✈️', title: 'East Africa\'s Gateway', desc: 'Direct RwandAir flights to Dubai, Europe, Asia, India and the Americas — the perfect regional base.' },
]

// ── Featured jobs in Rwanda (curated from our Rwanda jobs board) ──
const rwandaJobs = [
    { title: 'Software Engineer / Full Stack Developer', company: 'Kigali Innovation City — Tech Startups', location: 'Kigali, Rwanda', salary: 'RWF 1,200,000 – 2,500,000 / month', type: 'Full-Time', tag: 'High Pay', tagClass: 'hp-badge' },
    { title: 'Hospitality & Hotel Operations Manager', company: 'Kigali Serena Hotel & Resort Group', location: 'Kigali, Rwanda', salary: 'RWF 1,500,000 – 2,800,000 / month', type: 'Full-Time', tag: 'High Pay', tagClass: 'hp-badge' },
    { title: 'Financial Analyst & Accountant', company: 'Kigali Financial Services Group', location: 'Kigali, Rwanda', salary: 'RWF 1,100,000 – 1,900,000 / month', type: 'Full-Time', tag: 'High Pay', tagClass: 'hp-badge' },
    { title: 'English–French Bilingual Customer Success Lead', company: 'Rwanda Global Business Hub (GBH)', location: 'Kigali, Rwanda', salary: 'RWF 1,000,000 – 1,600,000 / month', type: 'Full-Time', tag: 'Bilingual', tagClass: 'verified-badge' },
    { title: 'Ride-Hailing Driver Partner', company: 'Yego & Local Mobility Services', location: 'Kigali, Rwanda', salary: 'RWF 150,000 – 350,000 / month', type: 'Part-Time / Flexible', tag: 'Flexible', tagClass: 'verified-badge' },
    { title: 'Digital Marketing & Social Media Assistant', company: 'Kigali Creative Agencies', location: 'Kigali, Rwanda (Hybrid)', salary: 'RWF 100,000 – 200,000 / month', type: 'Part-Time / Remote Option', tag: 'Hybrid', tagClass: 'verified-badge' },
]

// ── Top universities & schools in Rwanda ──
const rwandaUniversities = [
    {
        tag: 'Pan-African', title: 'African Leadership University (ALU)',
        desc: 'Self-leadership-driven degrees in computer science, business and global challenges — campus in the heart of Kigali.',
        img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
    },
    {
        tag: 'Public', title: 'University of Rwanda',
        desc: 'The nation\'s largest public university — medicine, engineering, business, law and IT across six campuses.',
        img: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop',
    },
    {
        tag: 'World-Class', title: 'Carnegie Mellon University Africa',
        desc: 'Master\'s programs in electrical & computer engineering and information technology from a top-10 US university — right in Kigali.',
        img: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=800&auto=format&fit=crop',
    },
    {
        tag: 'Global Health', title: 'University of Global Health Equity (UGHE)',
        desc: 'Butaro-based institution training a new generation of global health leaders in equity-centered medicine.',
        img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop',
    },
    {
        tag: 'Engineering', title: 'INES-Ruhengeri',
        desc: 'Leading institute of engineering and applied sciences — water, energy, environment and ICT programs in Musanze.',
        img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop',
    },
    {
        tag: 'TVET', title: 'Rwanda Polytechnic (RP)',
        desc: 'Hands-on TVET colleges nationwide — welding, automotive, ICT, hospitality and advanced manufacturing skills.',
        img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop',
    },
]

// ── Steps to live, work or study in Rwanda ──
const moveSteps = [
    { step: '01', icon: <Briefcase size={22} />, title: 'Find Your Opportunity', desc: 'Browse Rwanda jobs on our board, apply for local scholarships, or enroll at a Kigali university.' },
    { step: '02', icon: <Stamp size={22} />, title: 'Secure Visa & Permits', desc: 'We guide you through e-visas, work permits, residence permits and student permits with Immigration Rwanda.' },
    { step: '03', icon: <MapPin size={22} />, title: 'Land & Settle in Kigali', desc: 'Airport pickup, accommodation help, RWANDAIR ticketing and on-the-ground support from our Kigali team.' },
]

export default function Rwanda() {
    const rwandaScholarships = fallbackScholarships.filter(s => String(s.country || '').toLowerCase() === 'rwanda')

    return (
        <main>
            <SEOHead
                title="Rwanda Hub — Jobs, Scholarships, Universities & Life in Rwanda | Travelium Global"
                description="Everything Rwanda in one place: high-paying jobs in Kigali, Rwanda government & university scholarships, top universities, work visas and relocation support from Travelium Global."
                canonical="/rwanda"
            />

            {/* ── Hero ── */}
            <div className="page-hero">
                <div className="page-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?q=80&w=1600&auto=format&fit=crop)' }} />
                <div className="container page-hero-content">
                    <div className="breadcrumb">
                        <Link to="/">Home</Link><span className="sep">›</span><span>Rwanda</span>
                    </div>
                    <h1>🇷🇼 Discover Rwanda</h1>
                    <p>East Africa's fastest-growing tech, hospitality & services hub — local jobs, scholarships, universities and relocation support, all in one place.</p>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                        <Link to="/jobs?country=Rwanda" className="btn btn-primary">
                            <Briefcase size={16} /> Browse Rwanda Jobs
                        </Link>
                        <Link to="/apply" className="btn btn-navy">
                            Apply Now <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Why Rwanda ── */}
            <section className="dubai-spotlight section">
                <div className="container">
                    <div className="dubai-spotlight-header">
                        <div className="section-label"><Star size={20} className="icon-fire" /> Featured Destination</div>
                        <h2 className="section-title">Why Rwanda?</h2>
                        <p className="section-sub">
                            The "Land of a Thousand Hills" is Africa's biggest success story — safe, clean, connected and hungry for talent.
                        </p>
                    </div>
                    <div className="dubai-highlights-grid">
                        {rwandaHighlights.map(h => (
                            <div key={h.title} className="dubai-highlight-card">
                                <div className="dubai-highlight-icon">{h.icon}</div>
                                <h4>{h.title}</h4>
                                <p>{h.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="dubai-spotlight-cta">
                        <Link to="/apply" className="btn btn-primary">
                            Start Your Rwanda Journey <ArrowRight size={16} />
                        </Link>
                        <Link to="/contact" className="btn btn-outline">
                            <ShieldCheck size={16} /> Free Consultation
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Featured Rwanda Jobs ── */}
            <section className="content-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label"><Briefcase size={16} /> Work in Rwanda</div>
                        <h2 className="section-title">Featured Jobs in Rwanda</h2>
                        <p className="section-sub">High-paying and flexible roles from Kigali's tech, finance, hospitality & creative sectors — updated daily.</p>
                    </div>
                    <div className="jobs-grid">
                        {rwandaJobs.map(job => (
                            <div key={job.title} className="job-card">
                                <div className="job-card-top">
                                    <div className={`job-badge ${job.tagClass}`}>{job.tag}</div>
                                    <span className="job-country-tag"><MapPin size={13} /> Rwanda</span>
                                </div>

                                <h4 className="job-title">{job.title}</h4>

                                <div className="job-meta-row">
                                    <span className="job-company"><Briefcase size={14} /> {job.company}</span>
                                    <span className="job-location"><MapPin size={14} /> {job.location}</span>
                                </div>

                                <div className="job-salary-box">
                                    <TrendingUp size={18} />
                                    <span className="salary-text">{job.salary}</span>
                                </div>

                                <div className="job-card-footer">
                                    <span className="exp-badge">{job.type}</span>
                                    <Link to="/jobs?country=Rwanda" className="btn-apply-job primary">
                                        View &amp; Apply <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                        <Link to="/jobs?country=Rwanda" className="btn btn-primary" style={{ fontSize: '1rem' }}>
                            Browse All Rwanda Jobs & Careers <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Rwanda Scholarships ── */}
            <section className="content-section" style={{ background: 'var(--bg-light, #f7f9fc)' }}>
                <div className="container">
                    <div className="section-header">
                        <div className="section-label"><GraduationCap size={16} /> Fund Your Future</div>
                        <h2 className="section-title">Scholarships to Study in Rwanda</h2>
                        <p className="section-sub">Government and university-funded scholarships for Rwandan and international students.</p>
                    </div>
                    <div className="scholarships-grid">
                        {rwandaScholarships.map(s => {
                            const displayTitle = s.title || s.name || 'Scholarship'
                            const detailPath = `/scholarships/${scholarshipSlug(s)}`
                            return (
                                <div key={displayTitle} className="scholarship-card">
                                    <div className={`scholarship-amount${s.amount === 'Full Fund' ? ' full-fund' : ''}`}>{s.amount}</div>
                                    <div className="scholarship-body">
                                        <h3><Link to={detailPath} className="scholarship-title-link">{displayTitle}</Link></h3>
                                        {s.country && <div className="scholarship-country">
                                            {s.flag && <img src={s.flag} alt={s.country} />}
                                            {s.country}
                                        </div>}
                                        <p>{s.description || s.desc || ''}</p>
                                        <div className="scholarship-footer">
                                            {s.deadline && <span className="scholarship-deadline">
                                                <CalendarDays size={14} />
                                                Deadline: <strong>{s.deadline}</strong>
                                            </span>}
                                            <Link to={detailPath} className="btn btn-navy scholarship-apply-btn">
                                                View &amp; Apply <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                        {s.sourceUrl && (
                                            <div className="scholarship-source">
                                                <ShieldCheck size={12} />
                                                {s.sourceName ? `${s.sourceName} — ` : ''}
                                                <a
                                                    href={s.sourceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => trackOutbound({ type: 'scholarship', id: displayTitle, title: displayTitle, url: s.sourceUrl })}
                                                >
                                                    Official program page <ExternalLink size={11} />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                        <Link to="/scholarships?country=Rwanda" className="btn btn-primary" style={{ fontSize: '1rem' }}>
                            View All Rwanda Scholarships <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Universities ── */}
            <section className="content-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label"><GraduationCap size={16} /> Study in Rwanda</div>
                        <h2 className="section-title">Top Universities & Schools</h2>
                        <p className="section-sub">World-class degrees and hands-on training — from pan-African leadership campuses to global health medicine.</p>
                    </div>
                    <div className="programs-grid">
                        {rwandaUniversities.map(u => (
                            <div key={u.title} className="program-card">
                                <div className="program-card-img">
                                    <img src={u.img} alt={u.title} loading="lazy" />
                                    <span className="program-tag">{u.tag}</span>
                                </div>
                                <div className="program-card-body">
                                    <div className="program-icon"><GraduationCap size={24} /></div>
                                    <h3>{u.title}</h3>
                                    <p>{u.desc}</p>
                                    <Link to="/apply" className="service-link">
                                        Apply Now <ArrowRight size={15} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Plan Your Move ── */}
            <section className="dubai-spotlight section">
                <div className="container">
                    <div className="dubai-spotlight-header">
                        <div className="section-label"><Plane size={20} /> Relocation Support</div>
                        <h2 className="section-title">Plan Your Move to Rwanda</h2>
                        <p className="section-sub">From your first application to your first day in Kigali — our team walks with you every step.</p>
                    </div>
                    <div className="dubai-highlights-grid">
                        {moveSteps.map(s => (
                            <div key={s.step} className="dubai-highlight-card">
                                <div className="dubai-highlight-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    {s.icon}
                                    <span style={{ fontWeight: 900, fontSize: '1.1rem' }}>{s.step}</span>
                                </div>
                                <h4>{s.title}</h4>
                                <p>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="dubai-spotlight-cta">
                        <Link to="/visa-services" className="btn btn-primary">
                            <Stamp size={16} /> Visa & Work Permit Guide
                        </Link>
                        <Link to="/flights" className="btn btn-outline">
                            <Plane size={16} /> Flights to Kigali
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Quick Facts ── */}
            <section className="content-section" style={{ background: 'var(--navy, #0B192C)', color: '#fff' }}>
                <div className="container">
                    <div className="section-header">
                        <div className="section-label" style={{ color: 'var(--gold, #C9A24B)' }}><TrendingUp size={16} /> Good to Know</div>
                        <h2 className="section-title" style={{ color: '#fff' }}>Rwanda at a Glance</h2>
                    </div>
                    <div className="dubai-highlights-grid">
                        {[
                            { icon: '📍', title: 'Capital', desc: 'Kigali — clean, safe & tech-forward, home to 1.2M+ residents.' },
                            { icon: '🗣️', title: 'Languages', desc: 'Kinyarwanda, English, French & Swahili — English widely spoken.' },
                            { icon: '💵', title: 'Currency', desc: 'Rwandan Franc (RWF); USD widely accepted in Kigali.' },
                            { icon: '🌍', title: 'Region', desc: 'East African Community (EAC) member — free movement for EAC citizens.' },
                        ].map(f => (
                            <div key={f.title} className="dubai-highlight-card" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)' }}>
                                <div className="dubai-highlight-icon">{f.icon}</div>
                                <h4 style={{ color: '#fff' }}>{f.title}</h4>
                                <p style={{ color: '#cbd5e1' }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '2.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/apply" className="btn btn-primary">
                            Apply Now <ArrowRight size={16} />
                        </Link>
                        <Link to="/contact" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.35)' }}>
                            <Star size={16} /> Talk to Our Kigali Team
                        </Link>
                    </div>
                </div>
            </section>

            <CTABanner />
        </main>
    )
}
