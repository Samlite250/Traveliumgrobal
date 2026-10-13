import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import { useTranslation } from 'react-i18next'

const CONTACT_EMAIL = 'support@traveliumglobal.com'

export default function PrivacyPolicy() {
    const { t } = useTranslation()
    return (
        <main>
            <SEOHead
                title="Privacy Policy | Travelium Global"
                description="How Travelium Global collects, uses and protects your personal data — including cookies and Google AdSense advertising disclosures."
                canonical="/privacy-policy"
            />
            <div className="page-hero" style={{ minHeight: '42vh' }}>
                <div className="page-hero-bg" style={{ backgroundImage: 'linear-gradient(135deg, var(--navy-dark), var(--navy-light))' }} />
                <div className="container page-hero-content">
                    <div className="breadcrumb">
                        <Link to="/">Home</Link><span className="sep">›</span><span>{t('legal.privacyBreadcrumb', 'Privacy Policy')}</span>
                    </div>
                    <h1>{t('legal.privacyTitle', 'Privacy Policy')}</h1>
                    <p>{t('legal.privacySubtitle', 'Last updated: October 13, 2026')}</p>
                </div>
            </div>

            <section className="content-section">
                <div className="container">
                    <div className="legal-content">
                        <p>
                            Travelium Global ("we", "our", "us") operates the website <strong>www.traveliumglobal.com</strong>.
                            We are committed to protecting your privacy and handling your personal data transparently and securely.
                            This policy explains what information we collect, why we collect it, how we use it, and the choices you have.
                        </p>

                        <h2>1. Information We Collect</h2>
                        <ul>
                            <li><strong>Information you provide:</strong> name, email address, phone number, nationality, education and employment details, CV/resume, and any documents you submit when applying for study programs, jobs, visas, scholarships, or contacting support.</li>
                            <li><strong>Account information:</strong> if you create an account, we store your login credentials (securely hashed) and profile details.</li>
                            <li><strong>Usage data:</strong> pages visited, time spent, browser type, device information, and approximate location derived from your IP address.</li>
                            <li><strong>Cookies and similar technologies:</strong> small files stored on your device to keep the site working, remember preferences, and measure traffic.</li>
                        </ul>

                        <h2>2. How We Use Your Information</h2>
                        <ul>
                            <li>To provide our services: study-abroad placement, job recruitment, visa guidance, scholarship applications, and flight booking assistance.</li>
                            <li>To respond to inquiries and provide customer support.</li>
                            <li>To process applications and communicate status updates.</li>
                            <li>To improve our website, content, and marketing.</li>
                            <li>To display relevant advertising and measure ad performance (see Section 5).</li>
                            <li>To comply with legal and regulatory obligations.</li>
                        </ul>

                        <h2>3. Legal Bases for Processing</h2>
                        <p>
                            Where the GDPR or similar laws apply, we process your data based on: your consent (e.g. marketing cookies,
                            newsletter), performance of a contract (e.g. processing your application), legitimate interests (e.g. site
                            security, analytics, advertising), and compliance with legal obligations.
                        </p>

                        <h2>4. Cookies</h2>
                        <p>
                            We use essential cookies to operate the site, preference cookies to remember your choices (such as language),
                            and analytics/advertising cookies to understand how the site is used. You can control or delete cookies through
                            your browser settings. Disabling some cookies may affect parts of the site.
                        </p>

                        <h2>5. Advertising &amp; Google AdSense</h2>
                        <p>
                            This website displays advertisements served by Google AdSense. This section discloses how that works, as required
                            by Google's policies:
                        </p>
                        <ul>
                            <li>
                                Third-party vendors, including Google, use cookies (including the <strong>DoubleClick DART cookie</strong>) to serve
                                ads on this site based on your prior visits to this and other websites.
                            </li>
                            <li>
                                Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our
                                site and/or other sites on the Internet.
                            </li>
                            <li>
                                You may opt out of personalized advertising by visiting{' '}
                                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>, and
                                opt out of third-party vendor cookies for personalized advertising at{' '}
                                <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.
                            </li>
                            <li>
                                We do not control the cookies used by Google or other advertisers. For more information, see{' '}
                                <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google's Privacy &amp; Terms</a>.
                            </li>
                            <li>
                                Where required by law (e.g. in the EEA/UK), we obtain consent before serving personalized advertising, and you
                                can withdraw consent at any time by clearing your cookies or adjusting your browser settings.
                            </li>
                        </ul>

                        <h2>6. Third-Party Services</h2>
                        <p>
                            We rely on trusted providers to operate this website. These providers process limited data on our behalf:
                        </p>
                        <ul>
                            <li><strong>Google Firebase</strong> — authentication, database (Cloud Firestore), storage, and Cloud Functions for application processing.</li>
                            <li><strong>Vercel</strong> — website hosting and content delivery.</li>
                            <li><strong>Google AdSense</strong> — advertising (see Section 5).</li>
                        </ul>
                        <p>
                            We never sell your personal data. We share application-related information with partner universities,
                            employers, or immigration authorities only where necessary to deliver the service you requested, or where
                            required by law.
                        </p>

                        <h2>7. Data Retention &amp; Security</h2>
                        <p>
                            We keep your personal data only as long as needed to provide our services, comply with legal obligations, and
                            resolve disputes. Data is transmitted over HTTPS and stored with industry-standard safeguards. Documents you
                            upload are access-restricted to authorized staff.
                        </p>

                        <h2>8. Your Rights</h2>
                        <p>Depending on your location, you may have the right to:</p>
                        <ul>
                            <li>Access the personal data we hold about you.</li>
                            <li>Request correction of inaccurate data.</li>
                            <li>Request deletion of your data ("right to be forgotten").</li>
                            <li>Object to or restrict processing, or withdraw consent at any time.</li>
                            <li>Request a copy of your data in a portable format.</li>
                            <li>Lodge a complaint with your local data protection authority.</li>
                        </ul>
                        <p>
                            To exercise any of these rights, email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We respond to
                            verified requests within 30 days.
                        </p>

                        <h2>9. Children's Privacy</h2>
                        <p>
                            Our services are not directed at children under 13 (or under 16 in the EEA). We do not knowingly collect personal
                            data from children. If you believe a child has provided us data, contact us and we will delete it promptly.
                        </p>

                        <h2>10. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. Changes are posted on this page with an updated "Last updated"
                            date. Continued use of the site after changes constitutes acceptance of the updated policy.
                        </p>

                        <h2>11. Contact Us</h2>
                        <p>
                            Questions about this Privacy Policy or your data? Contact us:
                        </p>
                        <ul>
                            <li>Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
                            <li>Phone / WhatsApp: +250 786 189 460</li>
                            <li>Website: <Link to="/contact">www.traveliumglobal.com/contact</Link></li>
                        </ul>
                    </div>
                </div>
            </section>
        </main>
    )
}
