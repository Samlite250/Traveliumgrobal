import { FileText, Upload, Search, Settings, CheckCircle, Plane } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const steps = [
    { num: 1, icon: <FileText size={20} />, titleKey: 'howItWorks.step1a', descKey: 'howItWorks.step1b', title: 'Submit Application', desc: 'Fill out our simple online application form.' },
    { num: 2, icon: <Upload size={20} />, titleKey: 'howItWorks.step2a', descKey: 'howItWorks.step2b', title: 'Upload Documents', desc: 'Upload all required documents online.' },
    { num: 3, icon: <Search size={20} />, titleKey: 'howItWorks.step3a', descKey: 'howItWorks.step3b', title: 'Consultation & Review', desc: 'Our experts review your profile.' },
    { num: 4, icon: <Settings size={20} />, titleKey: 'howItWorks.step4a', descKey: 'howItWorks.step4b', title: 'Processing', desc: 'We process your application.' },
    { num: 5, icon: <CheckCircle size={20} />, titleKey: 'howItWorks.step5a', descKey: 'howItWorks.step5b', title: 'Approval', desc: 'Get your visa or admission approval.' },
    { num: 6, icon: <Plane size={20} />, titleKey: 'howItWorks.step6a', descKey: 'howItWorks.step6b', title: 'Travel Preparation', desc: 'We guide you for a smooth journey.' },
]

export default function HowItWorks() {
    const { t } = useTranslation()
    return (
        <section className="how-it-works section">
            <div className="container">
                <div className="section-header">
                    <div className="section-label">{t('howItWorks.label', 'Simple Process')}</div>
                    <h2 className="section-title">{t('howItWorks.title', 'How It Works')}</h2>
                    <p className="section-sub">
                        {t('howItWorks.subtitle', 'From application to departure — we guide you every step of the way')}
                    </p>
                </div>
                <div className="steps-grid">
                    {steps.map((s, i) => (
                        <div key={s.num} className="step-card reveal">
                            <div className="step-circle">{s.num}</div>
                            <h4>{t(s.titleKey, s.title)}</h4>
                            <p>{t(s.descKey, s.desc)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
