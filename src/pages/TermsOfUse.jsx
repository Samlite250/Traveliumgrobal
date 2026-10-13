import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import { useTranslation } from 'react-i18next'

const CONTACT_EMAIL = 'support@traveliumglobal.com'

export default function TermsOfUse() {
    const { t } = useTranslation()
    return (
        <main>
            <SEOHead
                title="Terms of Use | Travelium Global"
                description="The terms and conditions governing your use of www.traveliumglobal.com and Travelium Global's services."
                canonical="/terms-of-use"
            />
            <div className="page-hero" style={{ minHeight: '42vh' }}>
                <div className="page-hero-bg" style={{ backgroundImage: 'linear-gradient(135deg, var(--navy-dark), var(--navy-light))' }} />
                <div className="container page-hero-content">
                    <div className="breadcrumb">
                        <Link to="/">Home</Link><span className="sep">›</span><span>{t('legal.termsBreadcrumb', 'Terms of Use')}</span>
                    </div>
                    <h1>{t('legal.termsTitle', 'Terms of Use')}</h1>
                    <p>{t('legal.termsSubtitle', 'Last updated: October 13, 2026')}</p>
                </div>
            </div>

            <section className="content-section">
                <div className="container">
                    <div className="legal-content">
                        <p>
                            Welcome to Travelium Global. These Terms of Use ("Terms") govern your access to and use of{' '}
                            <strong>www.traveliumglobal.com</strong> (the "Site") and the services offered through it. By using the Site,
                            you agree to these Terms. If you do not agree, please do not use the Site.
                        </p>

                        <h2>1. Who We Are</h2>
                        <p>
                            Travelium Global is a licensed recruitment and travel agency providing study-abroad placement, international
                            job recruitment, visa application guidance, scholarship application support, and air ticketing assistance.
                            References to "we", "our" and "us" mean Travelium Global.
                        </p>

                        <h2>2. Our Services</h2>
                        <p>
                            We act as an intermediary and advisor. We help you prepare and submit applications to universities, employers,
                            scholarship bodies, and immigration authorities. Final decisions on admissions, employment, scholarships, and
                            visas rest solely with those institutions and authorities. We do not guarantee admission, employment, scholarship
                            awards, or visa approval.
                        </p>

                        <h2>3. Eligibility &amp; Accounts</h2>
                        <ul>
                            <li>You must be at least 18 years old (or have the consent of a parent/legal guardian) to use our services.</li>
                            <li>You agree to provide accurate, current, and complete information in all applications and account registrations.</li>
                            <li>You are responsible for keeping your account credentials confidential and for all activity under your account.</li>
                            <li>Submitting fraudulent documents or false information may result in immediate termination of services and may carry legal consequences.</li>
                        </ul>

                        <h2>4. Acceptable Use</h2>
                        <p>You agree not to:</p>
                        <ul>
                            <li>Use the Site for any unlawful purpose or in violation of any applicable law or regulation.</li>
                            <li>Scrape, harvest, or collect information about other users without their consent.</li>
                            <li>Attempt to gain unauthorized access to the Site, other accounts, or our systems.</li>
                            <li>Interfere with or disrupt the Site, including introducing malware or attempting denial-of-service attacks.</li>
                            <li>Misrepresent your identity, qualifications, or intentions.</li>
                        </ul>

                        <h2>5. Intellectual Property</h2>
                        <p>
                            All content on the Site — including text, graphics, logos, images, and design — is owned by Travelium Global or
                            its licensors and is protected by copyright and trademark laws. You may view and print content for personal,
                            non-commercial use. You may not reproduce, distribute, or create derivative works from Site content without our
                            prior written permission.
                        </p>

                        <h2>6. Job Listings &amp; Recruitment Disclaimer</h2>
                        <p>
                            Job listings published on the Site are provided in good faith. We verify employers where practicable but cannot
                            guarantee the accuracy, currency, or legitimacy of every listing. You are responsible for conducting your own
                            due diligence with any employer. We will never ask you to pay fees to view job listings; beware of any party
                            soliciting payment while claiming to represent us.
                        </p>

                        <h2>7. Visa &amp; Immigration Disclaimer</h2>
                        <p>
                            Information on this Site regarding visa categories, requirements, and processes is general in nature and is{' '}
                            <strong>not legal advice</strong>. Immigration rules change frequently and vary by destination. Always confirm
                            requirements with the relevant embassy, consulate, or official government source before making decisions.
                        </p>

                        <h2>8. Payments, Bookings &amp; Refunds</h2>
                        <ul>
                            <li>Service fees, if any, are quoted and agreed before work begins and are payable per the invoice terms.</li>
                            <li>Flight bookings and ticket purchases are subject to airline fare rules; changes and refunds follow the applicable fare conditions.</li>
                            <li>Fees paid to third parties (e.g. embassy fees, university application fees) are non-refundable by us.</li>
                            <li>Refunds of our service fees, where applicable, are handled per the specific service agreement signed with you.</li>
                        </ul>

                        <h2>9. Third-Party Links &amp; Advertising</h2>
                        <p>
                            The Site contains links to third-party websites and displays third-party advertising (including Google AdSense).
                            We are not responsible for the content, policies, or practices of third-party sites. Your interactions with
                            advertisers are solely between you and them. See our{' '}
                            <Link to="/privacy-policy">Privacy Policy</Link> for details on cookies and advertising.
                        </p>

                        <h2>10. Disclaimer of Warranties</h2>
                        <p>
                            The Site and its content are provided "as is" and "as available" without warranties of any kind, express or
                            implied. We do not warrant that the Site will be uninterrupted, error-free, or free of harmful components, nor
                            the accuracy or completeness of any content.
                        </p>

                        <h2>11. Limitation of Liability</h2>
                        <p>
                            To the maximum extent permitted by law, Travelium Global and its team shall not be liable for any indirect,
                            incidental, special, consequential, or punitive damages — including lost profits, data, or opportunities — arising
                            from your use of, or inability to use, the Site or our services. Our aggregate liability for any direct claim
                            shall not exceed the fees you paid to us for the specific service giving rise to the claim.
                        </p>

                        <h2>12. Indemnification</h2>
                        <p>
                            You agree to indemnify and hold harmless Travelium Global from any claims, damages, losses, and expenses
                            (including reasonable legal fees) arising from your breach of these Terms, your violation of any law, or your
                            submission of false or fraudulent information.
                        </p>

                        <h2>13. Governing Law &amp; Disputes</h2>
                        <p>
                            These Terms are governed by the laws of the United Arab Emirates, without regard to conflict-of-law principles.
                            Any dispute arising from these Terms or our services shall first be addressed through good-faith negotiation;
                            unresolved disputes shall be subject to the exclusive jurisdiction of the competent courts of Dubai, UAE.
                        </p>

                        <h2>14. Changes to These Terms</h2>
                        <p>
                            We may revise these Terms at any time by posting the updated version on this page with a new "Last updated" date.
                            Your continued use of the Site after changes are posted constitutes acceptance of the revised Terms.
                        </p>

                        <h2>15. Contact</h2>
                        <p>
                            Questions about these Terms? Contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or{' '}
                            <Link to="/contact">through our contact page</Link>.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    )
}
