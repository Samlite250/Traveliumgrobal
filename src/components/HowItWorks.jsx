import { FileText, Upload, Search, Settings, CheckCircle, Plane } from 'lucide-react'

const steps = [
    { num: 1, icon: <FileText size={20} />, title: 'Submit Application', desc: 'Fill out our simple online application form.' },
    { num: 2, icon: <Upload size={20} />, title: 'Upload Documents', desc: 'Upload all required documents online.' },
    { num: 3, icon: <Search size={20} />, title: 'Consultation & Review', desc: 'Our experts review your profile.' },
    { num: 4, icon: <Settings size={20} />, title: 'Processing', desc: 'We process your application.' },
    { num: 5, icon: <CheckCircle size={20} />, title: 'Approval', desc: 'Get your visa or admission approval.' },
    { num: 6, icon: <Plane size={20} />, title: 'Travel Preparation', desc: 'We guide you for a smooth journey.' },
]

export default function HowItWorks() {
    return (
        <section className="how-it-works section">
            <div className="container">
                <div className="section-header">
                    <div className="section-label">Simple Process</div>
                    <h2 className="section-title">How It Works</h2>
                    <p className="section-sub">
                        From application to departure — we guide you every step of the way
                    </p>
                </div>
                <div className="steps-grid">
                    {steps.map((s, i) => (
                        <div key={s.num} className="step-card reveal">
                            <div className="step-circle">{s.num}</div>
                            <h4>{s.title}</h4>
                            <p>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
