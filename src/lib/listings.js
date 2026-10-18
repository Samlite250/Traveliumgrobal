import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

// ─── Slug helpers (shared between list pages & detail pages) ───
export const slugify = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
export const scholarshipSlug = (s) => slugify(s?.title || s?.name || '')
export const jobSlug = (job, countryName) => slugify(`${job?.title || ''} ${countryName || job?.country || ''}`)

// ─── Fallback scholarships (offline / empty Firestore) ───
export const fallbackScholarships = [
    { amount: 'Full Fund', title: 'Commonwealth Scholarship', country: 'United Kingdom', flag: 'https://flagcdn.com/w40/gb.png', desc: 'Fully funded scholarships for students from developing countries.', deadline: 'Dec 31, 2026', sourceUrl: 'https://cscuk.fcdo.gov.uk/scholarships/commonwealth-scholarships/', sourceName: 'Commonwealth Scholarships' },
    { amount: '$25,000', title: 'Chevening Scholarship', country: 'United Kingdom', flag: 'https://flagcdn.com/w40/gb.png', desc: 'UK government global scholarship program.', deadline: 'Nov 15, 2026', sourceUrl: 'https://www.chevening.org/scholarships/', sourceName: 'Chevening' },
    { amount: '$30,000', title: 'Fulbright Program', country: 'United States', flag: 'https://flagcdn.com/w40/us.png', desc: 'International exchange program sponsored by the US government.', deadline: 'Oct 15, 2026', sourceUrl: 'https://foreign.fulbrightprogram.org/', sourceName: 'Fulbright' },
    { amount: '$20,000', title: 'Vanier Canada Graduate', country: 'Canada', flag: 'https://flagcdn.com/w40/ca.png', desc: 'For doctoral students with leadership excellence.', deadline: 'Nov 1, 2026', sourceUrl: 'https://vanier.gc.ca/en/recipients.html', sourceName: 'Vanier Canada' },
    { amount: 'Full Fund', title: 'DAAD Scholarship', country: 'Germany', flag: 'https://flagcdn.com/w40/de.png', desc: 'German Academic Exchange Service funding.', deadline: 'Jan 31, 2027', sourceUrl: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/', sourceName: 'DAAD' },
    { amount: '$15,000', title: 'Australia Awards', country: 'Australia', flag: 'https://flagcdn.com/w40/au.png', desc: 'Awards funded by the Australian government.', deadline: 'Apr 30, 2027', sourceUrl: 'https://www.dfat.gov.au/australias-awards', sourceName: 'Australia Awards' },
]

// ─── Outbound click tracking (anonymous analytics → outbound_clicks) ───
export function trackOutbound({ type, id, title, url }) {
    try {
        if (db) {
            addDoc(collection(db, 'outbound_clicks'), {
                type, id: id || '', title: title || '', url: url || '',
                path: window.location.pathname,
                created_at: serverTimestamp(),
            }).catch(() => { })
        }
        const log = JSON.parse(localStorage.getItem('travelium_outbound_clicks') || '[]')
        log.unshift({ type, id, title, url, path: window.location.pathname, at: new Date().toISOString() })
        localStorage.setItem('travelium_outbound_clicks', JSON.stringify(log.slice(0, 300)))
    } catch { }
}

export function openOfficial({ type, id, title, url }) {
    if (!url) return
    trackOutbound({ type, id, title, url })
    window.open(url, '_blank', 'noopener,noreferrer')
}

// ─── Lead capture (email signups for checklists / deadline reminders) ───
export async function saveLead(lead) {
    const payload = {
        ...lead,
        path: typeof window !== 'undefined' ? window.location.pathname : '',
        created_at_client: new Date().toISOString(),
    }
    if (db) {
        try {
            await addDoc(collection(db, 'leads'), { ...payload, created_at: serverTimestamp() })
            return true
        } catch { /* fall through to offline */ }
    }
    try {
        const leads = JSON.parse(localStorage.getItem('travelium_leads') || '[]')
        leads.unshift({ ...payload, id: 'lead_' + Date.now() })
        localStorage.setItem('travelium_leads', JSON.stringify(leads.slice(0, 500)))
    } catch { }
    return false
}

// ─── Article content builders ───
export function buildScholarshipArticle(s) {
    const title = s.title || s.name || 'This Scholarship'
    const country = s.country || 'the host country'
    const amount = s.amount || (s.price ? `$${s.price.toLocaleString()}` : 'full or partial funding')
    const isFullFund = /full/i.test(String(amount))
    const deadline = s.deadline || 'the official deadline'

    return [
        {
            id: 'overview', label: 'Overview', title: `About ${title}`,
            paragraphs: [
                s.description || s.desc || `${title} is a scholarship opportunity for international students who want to study abroad.`,
                isFullFund
                    ? `This is a fully funded award: successful applicants receive comprehensive financial support to focus entirely on their studies in ${country}.`
                    : `The award is valued at approximately ${amount} and is designed to reduce the financial barrier to studying in ${country}.`,
                `Applications for the current cycle close on ${deadline}. Travelium Global reviews every opportunity before listing it, and this guide walks you through eligibility, documents and the exact steps to apply on the official website.`,
            ],
        },
        {
            id: 'benefits', label: 'What\'s Covered', title: 'Scholarship Benefits',
            list: isFullFund ? [
                'Full tuition fees paid directly to the university',
                'Monthly living / stipend allowance',
                'Round-trip international airfare',
                'Comprehensive health insurance coverage',
                'Settlement & arrival allowance',
                'Research / thesis funding where applicable',
            ] : [
                `Financial award of approximately ${amount}`,
                'Tuition contribution or full waiver depending on level',
                'Access to the university / program support network',
                'Certificate and alumni network on completion',
            ],
        },
        {
            id: 'eligibility', label: 'Eligibility', title: 'Who Can Apply',
            list: [
                `Open to international students — applicants from Rwanda, East Africa and other developing countries are strongly encouraged`,
                `Outstanding academic record in your previous degree (usually a strong GPA / class of degree)`,
                'Meet the language requirement of the program (English proficiency test such as IELTS, TOEFL or Duolingo where required)',
                `Degree level appropriate for the award (check the official page for bachelor\'s, master\'s or PhD tracks)`,
                `Submit a complete application before the deadline — late submissions are not accepted`,
            ],
        },
        {
            id: 'documents', label: 'Documents', title: 'Required Documents',
            list: [
                'Valid international passport (bio page)',
                'Academic degree certificate / diploma',
                'Official academic transcripts / mark sheets',
                'Curriculum Vitae (CV / resume)',
                'Two or three recommendation letters',
                'Motivation / personal statement letter',
                'English language test result (if required)',
                'Passport-sized photograph',
            ],
            note: 'Document requirements vary by program — always cross-check the official application portal before uploading.',
        },
        {
            id: 'how-to-apply', label: 'How to Apply', title: 'How to Apply — Step by Step',
            steps: [
                'Read this guide fully and confirm you meet every eligibility item above.',
                'Open the official application page using the Apply button on this guide (opens in a new tab).',
                'Create your account on the official portal and verify your email.',
                'Complete every section of the application form — incomplete forms are rejected.',
                'Upload your documents in the required format (usually PDF, under the size limit).',
                'Review everything, submit, and save your confirmation number / reference ID.',
            ],
        },
        {
            id: 'faq', label: 'FAQ', title: 'Frequently Asked Questions',
            faq: [
                { q: `Is ${title} fully funded?`, a: isFullFund ? 'Yes — the award covers tuition, living costs and travel as listed in the benefits section. Always confirm the exact package on the official page.' : `The award is valued at approximately ${amount}. Check the official page for the exact breakdown of what is covered.` },
                { q: 'Can I apply from Rwanda or East Africa?', a: 'Yes. This opportunity is open to international applicants, and Travelium Global helps applicants from Rwanda, Uganda, Kenya, Tanzania and across Africa prepare competitive applications.' },
                { q: 'Do I need IELTS or TOEFL?', a: 'Many programs require an English proficiency test, but some accept Medium of Instruction letters or waive the requirement for English-taught degrees. The official page states the exact requirement.' },
                { q: 'What happens after I click "Apply on Official Site"?', a: 'You are taken to the official scholarship website in a new tab to submit your application directly with the provider. Travelium Global never charges you for access to official application links.' },
                { q: 'How do I track my application?', a: 'Save your reference ID from the official portal, then create a Travelium Global account to record the application in your dashboard. Our team can also review your documents before you submit.' },
            ],
        },
    ]
}

export function buildJobArticle(j) {
    const title = j.title || 'This Position'
    const company = j.company || 'the employer'
    const location = j.location || j.countryName || 'the posted location'
    const salary = j.salary || 'a competitive salary'
    const requirements = (j.requirements && j.requirements.length) ? j.requirements : null
    const description = j.description || ''

    return [
        {
            id: 'overview', label: 'Overview', title: `About the Role`,
            paragraphs: [
                description || `${title} — a verified international opportunity with ${company} in ${location}. This listing is part of Travelium Global's curated global jobs board for professionals seeking sponsored roles abroad.`,
                `${company} is hiring for this position offering ${salary}. The role is posted with full details below: requirements, benefits and the exact application route.`,
                j.auto
                    ? 'This listing was imported from a verified source. Always confirm the final details on the official posting before applying.'
                    : 'This position is handled end-to-end by Travelium Global — our recruitment team reviews your profile and guides you through the work permit process.',
            ],
        },
        {
            id: 'details', label: 'Job Details', title: 'Position Details',
            facts: [
                { k: 'Position', v: title },
                { k: 'Company', v: company },
                { k: 'Location', v: location },
                { k: 'Salary / Pay', v: salary },
                j.type ? { k: 'Employment Type', v: j.type } : null,
                j.hours ? { k: 'Hours', v: j.hours } : null,
                j.experience ? { k: 'Experience', v: j.experience } : null,
                j.sourceName ? { k: 'Source', v: j.sourceName } : null,
            ].filter(Boolean),
        },
        {
            id: 'requirements', label: 'Requirements', title: 'Requirements & Qualifications',
            list: requirements || [
                'Relevant qualification for the role (degree, diploma or certification)',
                'Professional working proficiency in English',
                'Valid passport and eligibility for a work permit / visa',
                'View the official posting for the full requirements list',
            ],
        },
        {
            id: 'how-to-apply', label: 'How to Apply', title: 'How to Apply',
            steps: [
                'Review the requirements above and prepare your CV / resume in PDF format.',
                j.applyUrl || j.sourceUrl
                    ? 'Click "Apply on Official Site" — the official application page opens in a new tab.'
                    : 'Fill in the application form on this page — it goes directly to the Travelium Global recruitment desk.',
                'Double-check your contact details so our officers can reach you.',
                'Submit before the closing date; early applications are reviewed first.',
                'Keep your reference / confirmation ID — you can track progress in your Travelium dashboard.',
            ],
        },
        {
            id: 'faq', label: 'FAQ', title: 'Frequently Asked Questions',
            faq: [
                { q: 'Is this job verified?', a: j.auto ? 'This listing comes from a verified job source that Travelium Global imports daily. Confirm final terms on the official posting.' : 'Yes — this listing is managed by Travelium Global. Our team verifies the employer before publishing.' },
                { q: 'Does the employer sponsor a visa / work permit?', a: 'Sponsored roles are flagged in the job title or type (e.g. "Work Permit Provided", "EU Blue Card", "Skilled Worker Visa"). Our visa desk can assess your eligibility before you apply.' },
                { q: 'What does Travelium Global charge?', a: 'Browsing and applying through our job board is free. Our optional services — CV review, document preparation and visa filing — are quoted upfront before any work begins.' },
                { q: 'How soon will I hear back?', a: 'For Travelium-managed roles, our officers contact shortlisted candidates within 3–5 working days. For official postings, the employer\'s own timeline applies.' },
            ],
        },
    ]
}
