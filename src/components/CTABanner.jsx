import { Link } from 'react-router-dom'
import { Calendar, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function CTABanner() {
    const { t } = useTranslation()
    return (
        <section className="cta-banner">
            <div className="container">
                <h2>{t('ctaBanner.title', 'Ready to Start Your Journey Abroad?')}</h2>
                <p>{t('ctaBanner.subtitle', 'Book your free consultation with our experts today!')}</p>
                <div className="cta-actions">
                    <Link to="/contact" className="btn btn-primary">
                        <Calendar size={18} /> {t('ctaBanner.bookConsultation', 'Book Free Consultation')}
                    </Link>
                    <Link to="/apply" className="btn btn-outline">
                        {t('ctaBanner.applyNow', 'Apply Now')} <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    )
}
