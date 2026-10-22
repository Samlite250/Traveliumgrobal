import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import { matchScholarshipProfile } from './scholarshipProfiles'

// ─── Slug helpers (shared between list pages & detail pages) ───
export const slugify = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
export const scholarshipSlug = (s) => slugify(s?.title || s?.name || '')
export const jobSlug = (job, countryName) => slugify(`${job?.title || ''} ${countryName || job?.country || ''}`)

// ─── URL helpers ───
const APPLICATION_URL_RE = /^https?:\/\/.{5,}/i
const INSTITUTION_ONLY_ORIGINS = ['risb.rw', 'alueducation.com', 'ur.ac.rw', 'vanier.gc.ca', 'dfat.gov.au']

export function isApplicationUrl(url) {
    if (!url || !APPLICATION_URL_RE.test(url)) return false
    try {
        const host = new URL(url).hostname.replace(/^www\./, '')
        return !INSTITUTION_ONLY_ORIGINS.some(o => host === o || host.endsWith('.' + o))
    } catch { return false }
}

export function resolveApplyUrl(listing) {
    const source = listing?.applyUrl || listing?.applicationUrl || listing?.apply_url || listing?.sourceUrl || listing?.source_url
    if (source && isApplicationUrl(source)) return source
    return ''
}

// ─── Verified-listing policy ───
// Only "serious" listings go public: a real application route must exist and the
// listing must not have tripped the scam-signal scanner.
export function isVerifiedListing(listing) {
    if (!listing) return false
    if (listing.flagged === true) return false
    if (Array.isArray(listing.flags) && listing.flags.length > 0) return false
    if (listing.verified === false) return false
    return isApplicationUrl(resolveApplyUrl(listing))
}

// ─── Fallback scholarships (offline / empty Firestore) ───
// Verified programs only — each must expose a genuine online application route.
// The detail data (levels, benefits, eligibility, documents) is filled in
// from the curated program profiles below.
const FALLBACK_SCHOLARSHIP_BASE = [
    { amount: 'Full Fund', title: 'Commonwealth Scholarship', country: 'United Kingdom', flag: 'https://flagcdn.com/w40/gb.png', desc: 'Fully funded scholarships for students from developing countries to study at UK universities.', deadline: 'Dec 31, 2026', sourceUrl: 'https://cscuk.fcdo.gov.uk/scholarships/commonwealth-scholarships/', applyUrl: 'https://cscuk.fcdo.gov.uk/apply/', sourceName: 'Commonwealth Scholarships' },
    { amount: '$25,000', title: 'Chevening Scholarship', country: 'United Kingdom', flag: 'https://flagcdn.com/w40/gb.png', desc: 'UK government global scholarship program for future leaders.', deadline: 'Nov 15, 2026', sourceUrl: 'https://www.chevening.org/scholarships/', applyUrl: 'https://www.chevening.org/apply/', sourceName: 'Chevening' },
    { amount: '$30,000', title: 'Fulbright Program', country: 'United States', flag: 'https://flagcdn.com/w40/us.png', desc: 'Flagship US exchange programme bringing international students to American universities for graduate study.', deadline: 'Oct 15, 2026', sourceUrl: 'https://foreign.fulbrightonline.org/', applyUrl: 'https://foreign.fulbrightonline.org/apply', sourceName: 'Fulbright' },
    { amount: 'Full Fund', title: 'DAAD Scholarship', country: 'Germany', flag: 'https://flagcdn.com/w40/de.png', desc: 'German Academic Exchange Service scholarships for international students and researchers.', deadline: 'Jan 31, 2027', sourceUrl: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/', applyUrl: 'https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/', sourceName: 'DAAD' },
    // ── Rwanda ──
    { amount: 'Full Fund', title: 'Mastercard Foundation Scholars Program (UR)', country: 'Rwanda', flag: 'https://flagcdn.com/w40/rw.png', desc: 'Full scholarships for talented young people from economically disadvantaged backgrounds to study at the University of Rwanda.', deadline: 'Oct 12, 2026', sourceUrl: 'https://mcfsprecruitment.ur.ac.rw/', applyUrl: 'https://mcfsprecruitment.ur.ac.rw/', sourceName: 'Mastercard Foundation & University of Rwanda' },
    { amount: 'Full Fund', title: 'DAAD In-Country MSc Electrical Power Systems', country: 'Rwanda', flag: 'https://flagcdn.com/w40/rw.png', desc: 'Fully funded Master of Science in Electrical Power Systems at the University of Rwanda, funded by Germany\'s BMZ. Open to Sub-Saharan African graduates.', deadline: 'Nov 12, 2026', sourceUrl: 'https://www.daad.de/en/', applyUrl: 'https://portal.meindaad.de/sites/personalfunding/#PBFApplication-Start?fundingProgramInstance=57883917', sourceName: 'DAAD & University of Rwanda' },
    { amount: 'Full Fund', title: 'Korea-Rwanda Government Scholarship (KOICA)', country: 'Rwanda', flag: 'https://flagcdn.com/w40/rw.png', desc: 'Fully funded Master\'s degree programs in South Korea for Rwandan government employees. Covers airfare, tuition, accommodation and monthly allowance.', deadline: 'Jun 24, 2026', sourceUrl: 'https://www.hec.gov.rw/updates/scholarships', applyUrl: 'https://hecmis.hec.gov.rw/', sourceName: 'KOICA & Rwanda HEC' },
    { amount: 'Full Fund', title: 'China-Rwanda Government Scholarship', country: 'Rwanda', flag: 'https://flagcdn.com/w40/rw.png', desc: 'Bilateral scholarship for Bachelor\'s, Master\'s and PhD studies in China. Science fields preferred with 80%+ in Senior Six.', deadline: 'Jan 17, 2026', sourceUrl: 'https://www.hec.gov.rw/updates/scholarships', applyUrl: 'https://hecmis.hec.gov.rw/', sourceName: 'Government of China & Rwanda HEC' },
    { amount: 'Full Fund', title: 'DAFI Refugee Scholarship (Rwanda)', country: 'Rwanda', flag: 'https://flagcdn.com/w40/rw.png', desc: 'UNHCR tertiary scholarship for refugee and returnee students pursuing bachelor\'s degrees at universities in Rwanda. Covers tuition, food, transport and accommodation.', deadline: 'Aug 7, 2026', sourceUrl: 'https://help.unhcr.org/rwanda/2026/07/15/call-for-application-for-dafi-scholarship-programme-for-academic-year-2026-2027/', applyUrl: 'https://help.unhcr.org/rwanda/2026/07/15/call-for-application-for-dafi-scholarship-programme-for-academic-year-2026-2027/', sourceName: 'UNHCR DAFI Programme' },
]

export const fallbackScholarships = FALLBACK_SCHOLARSHIP_BASE.map(s => {
    const p = matchScholarshipProfile(s)
    if (!p) return s
    return {
        ...s,
        levels: p.levels,
        benefits: p.benefits,
        eligibility: p.eligibility,
        documents: p.documents,
    }
})

// ─── Listing field helpers ───
// Admins can store these as arrays (Firestore) or as newline-separated text.
export function normalizeStringList(value) {
    if (!value) return []
    if (Array.isArray(value)) return value.map(v => String(v).trim()).filter(Boolean)
    return String(value)
        .split(/\r?\n/)
        .map(v => v.replace(/^\s*[-•*]\s*/, '').trim())
        .filter(Boolean)
}

const firstList = (...values) => {
    for (const v of values) {
        const list = normalizeStringList(v)
        if (list.length) return list
    }
    return []
}

const profileOf = (s) => matchScholarshipProfile(s)

// ─── Real scholarship data accessors ───
// Resolution order for every section: listing field → curated program profile
// → generic checklist derived from the listing's own fields.
const SECTION_FIELDS = {
    levels: ['levels', 'level', 'studyLevels', 'degreeLevels', 'qualification', 'educationLevel'],
    benefits: ['benefits', 'coverage', 'scholarshipBenefits'],
    eligibility: ['eligibility', 'eligibilityCriteria', 'whoCanApply', 'requirements'],
    documents: ['documents', 'requiredDocuments', 'documentRequirements'],
}

// Returns { items, source } — source is 'listing' | 'profile' | 'generic'.
export function scholarshipSection(s, kind) {
    const fields = SECTION_FIELDS[kind] || []
    const own = firstList(...fields.map(f => s?.[f]))
    if (own.length) return { items: own, source: 'listing' }
    const p = profileOf(s)
    if (p?.[kind]?.length) return { items: [...p[kind]], source: 'profile' }
    return { items: [], source: 'generic' }
}

export const scholarshipLevels = (s) => scholarshipSection(s, 'levels').items
export const scholarshipBenefits = (s) => scholarshipSection(s, 'benefits').items
export const scholarshipEligibility = (s) => scholarshipSection(s, 'eligibility').items
export const scholarshipDocuments = (s) => scholarshipSection(s, 'documents').items
export const scholarshipDataSource = (s, kind) => scholarshipSection(s, kind).source



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

// ─── Email-gate subscriber (unlocks full jobs/scholarships lists) ───
export async function saveSubscriber(email, source = 'jobs') {
    const payload = { email, source, created_at: new Date().toISOString() }
    if (db) {
        try {
            await addDoc(collection(db, 'subscribers'), { ...payload, created_at: serverTimestamp() })
            return true
        } catch { /* fall through to offline */ }
    }
    try {
        const subs = JSON.parse(localStorage.getItem('travelium_subscribers') || '[]')
        if (!subs.some(s => s.email === email)) subs.unshift({ ...payload, id: 'sub_' + Date.now() })
        localStorage.setItem('travelium_subscribers', JSON.stringify(subs.slice(0, 1000)))
    } catch { }
    return false
}

// ─── Article content builders ───
// Generic checklists — only used when a listing has neither its own data nor a
// curated program profile. Every item is derived from the listing's own fields.
const genericBenefits = (s, amount, country) => [
    `Financial award of approximately ${amount}`,
    country ? `Toward study and living costs for programmes in ${country}` : 'Toward study and living costs',
    'The exact package (tuition, stipend, travel, insurance) is published on the official program page',
]

const genericEligibility = (s, levels, deadline) => {
    const level = levels[0]
    return [
        'Open to international applicants',
        level ? `Applicants must hold the qualification required for the ${level} programme` : 'Applicants must hold the academic qualification required for the programme',
        'English language proficiency is required unless the programme is taught in another language',
        'A complete application must be submitted before the deadline — late applications are not accepted',
        `The current application cycle closes on ${deadline}`,
    ]
}

const genericDocuments = () => [
    'Valid passport (bio page)',
    'Academic transcripts and degree certificate',
    'Curriculum vitae or resume',
    'Language proficiency certificate where the programme requires one',
    'Recommendation or reference letters',
    'Passport-size photograph',
]

// Turns a list of sentences into one readable sentence for the FAQ answers.
const asSentence = (items, max = 3) => {
    if (!items.length) return ''
    const picked = items.slice(0, max).map(t => String(t).trim().replace(/\s*[.;,]\s*$/, ''))
    const last = picked.pop()
    return `${picked.join('. ')}. ${last}.`
}

export function buildScholarshipArticle(s) {
    const title = s.title || s.name || 'This Scholarship'
    const country = s.country || 'the host country'
    const amount = s.amount || (s.price ? `$${s.price.toLocaleString()}` : 'full or partial funding')
    const isFullFund = /full/i.test(String(amount))
    const deadline = s.deadline || 'the official deadline'

    // ── Real data: listing fields → curated program profile → generic fallback ──
    const levels = scholarshipLevels(s)
    const benefitsSec = scholarshipSection(s, 'benefits')
    const eligibilitySec = scholarshipSection(s, 'eligibility')
    const documentsSec = scholarshipSection(s, 'documents')

    const benefits = benefitsSec.items.length ? benefitsSec.items : genericBenefits(s, amount, country)
    const eligibility = eligibilitySec.items.length ? eligibilitySec.items : genericEligibility(s, levels, deadline)
    const documents = documentsSec.items.length ? documentsSec.items : genericDocuments()

    const benefitsNote = benefitsSec.source === 'generic'
        ? 'General package — the exact funding breakdown for this award is confirmed on the official program page.'
        : null
    const eligibilityNote = eligibilitySec.source === 'generic'
        ? 'Always read the official eligibility rules before you start an application — they override anything shown here.'
        : null
    const documentsNote = documentsSec.source === 'generic'
        ? 'Generic checklist — always cross-check the official application portal before uploading.'
        : 'Document requirements vary by programme — always cross-check the official application portal before uploading.'

    const levelSentence = levels.length
        ? `Open degree levels: ${levels.join(', ')}.`
        : ''

    const faq = [
        {
            q: `Is ${title} fully funded?`,
            a: isFullFund
                ? 'Yes — the award covers tuition, living costs and travel as listed in the benefits section. Always confirm the exact package on the official page.'
                : `The award is valued at approximately ${amount}. Check the official page for the exact breakdown of what is covered.`,
        },
        {
            q: 'Who can apply for this scholarship?',
            a: eligibility.length
                ? `${asSentence(eligibility)} The full list is in the "Who Can Apply" section above.`
                : 'Check the eligibility rules published on the official program page.',
        },
        {
            q: 'Which degree levels can apply?',
            a: levels.length
                ? `${levels.join(' · ')}. Confirm the specific programme and intake on the official page before applying.`
                : 'The degree levels are published on the official program page — pick the programme that matches your qualification.',
        },
        {
            q: 'What documents do I need to prepare?',
            a: documents.length
                ? `${asSentence(documents)} The complete list is in the "Required Documents" section above.`
                : 'The official application portal lists the exact documents it accepts.',
        },
        {
            q: 'What happens after I click "Apply on Official Site"?',
            a: 'You are taken to the official scholarship website in a new tab to submit your application directly with the provider. Travelium Global never charges you for access to official application links.',
        },
        {
            q: 'How do I track my application?',
            a: 'Save your reference ID from the official portal, then create a Travelium Global account to record the application in your dashboard. Our team can also review your documents before you submit.',
        },
    ]

    return [
        {
            id: 'overview', label: 'Overview', title: `About ${title}`,
            paragraphs: [
                s.description || s.desc || `${title} is a scholarship opportunity for international students who want to study abroad.`,
                isFullFund
                    ? `This is a fully funded award: successful applicants receive comprehensive financial support to focus entirely on their studies in ${country}.`
                    : `The award is valued at approximately ${amount} and is designed to reduce the financial barrier to studying in ${country}.`,
                levelSentence ? `${levelSentence} Applications for the current cycle close on ${deadline}.` : `Applications for the current cycle close on ${deadline}.`,
                'Travelium Global reviews every opportunity before listing it, and this guide walks you through eligibility, documents and the exact steps to apply on the official website.',
            ],
        },
        {
            id: 'benefits', label: 'What\'s Covered', title: 'Scholarship Benefits',
            list: benefits,
            note: benefitsNote,
        },
        {
            id: 'eligibility', label: 'Eligibility', title: 'Who Can Apply',
            list: eligibility,
            note: eligibilityNote,
        },
        {
            id: 'documents', label: 'Documents', title: 'Required Documents',
            list: documents,
            note: documentsNote,
        },
        {
            id: 'how-to-apply', label: 'How to Apply', title: 'How to Apply — Step by Step',
            steps: [
                'Read this guide fully and confirm you meet every eligibility item above.',
                'Open the official application page using the Apply button on this guide (opens in a new tab).',
                'Create your account on the official portal and verify your email.',
                'Complete every section of the application form — incomplete forms are rejected.',
                'Upload the documents listed above in the required format (usually PDF, under the size limit).',
                'Review everything, submit, and save your confirmation number / reference ID.',
            ],
        },
        {
            id: 'faq', label: 'FAQ', title: 'Frequently Asked Questions',
            faq,
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
