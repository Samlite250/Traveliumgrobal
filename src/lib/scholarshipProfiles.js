// ─── Real scholarship program data ───
// Per-program facts for the official programmes Travelium lists: what the award
// actually covers, who can apply, which documents the provider asks for and
// which degree levels are open. Resolution order on the public site is
//   1. the values stored on the Firestore listing (admin-editable)
//   2. the curated profile below (matched by id / title / official domain)
//   3. a generic checklist built from the listing's own fields
// Any value an admin edits in Firestore always wins over this file.

export const SCHOLARSHIP_PROFILES = [
    {
        key: 'humphrey',
        name: 'Hubert H. Humphrey Fellowship',
        match: ['humphrey', 'hubert h humphrey'],
        domains: ['usaid.gov', 'humphreyfellowship.org'],
        levels: ["Master's (non-professional, 12 months)", "Master's (professional fellowship)"],
        benefits: [
            'Full tuition and academic fees at the host US university',
            'Monthly maintenance stipend plus medical benefits',
            'Round-trip international airfare from your home country',
            'Settlement, accident and liability insurance',
            'Professional development programme and US leader network',
            'Option of a 12-month extension for master\'s programmes',
        ],
        eligibility: [
            'You are a citizen of an eligible country with a strong record of public service and leadership',
            'You hold a bachelor degree and at least two years of relevant professional experience',
            'You have a clear professional goal that matches one of the fellowship tracks',
            'You meet the English proficiency requirement of the host programme',
            'You have not previously held a Humphrey Fellowship',
        ],
        documents: [
            'Fellowship application form and personal statement',
            'Curriculum vitae covering the last five years of work experience',
            'Academic transcripts and degree certificate',
            'English proficiency test results (IELTS / TOEFL)',
            'Three recommendation letters, including one from your supervisor',
            'Evidence of civic, volunteer and community involvement',
        ],
    },
    {
        key: 'fulbright',
        name: 'Fulbright Foreign Student Program',
        match: ['fulbright'],
        domains: ['fulbrightonline.org', 'fulbrightprogram.org'],
        levels: ["Master's (degree or non-degree programme)", 'PhD (full research degree)'],
        benefits: [
            'Full tuition and mandatory fees at the host university',
            'Monthly maintenance stipend for living expenses',
            'Comprehensive health insurance for the full award period',
            'Round-trip airfare between your home country and the United States',
            'Settling-in allowance of about USD 5,000 (higher for PhD awards)',
            'J-1 visa fees covered, plus a computer and insurance subsidy where offered',
        ],
        eligibility: [
            'You hold citizenship of a Fulbright partner country and are not a US citizen or permanent resident',
            'You hold a bachelor degree or higher and can show a strong academic record',
            'You meet the English requirement of your host programme (typically TOEFL or IELTS)',
            'You have not previously received a Fulbright award',
            'You are willing and able to return to your home country after the award (generally two years)',
        ],
        documents: [
            'Completed Fulbright Foreign Student application form',
            'Academic transcripts and degree certificates for every qualification listed',
            'Official English proficiency test scores',
            'Statement of purpose plus study or research proposal',
            'Three letters of recommendation',
            'Curriculum vitae and a copy of your passport bio page',
        ],
    },
    {
        key: 'commonwealth',
        name: 'Commonwealth Scholarship',
        match: ['commonwealth'],
        domains: ['cscuk.fcdo.gov.uk', 'commonwealthscholarships.org'],
        levels: ["Master's (one year, full-time)", 'PhD (up to three years, research)', 'Distance / open university awards'],
        benefits: [
            'Full tuition fees for the whole duration of the award',
            'Monthly maintenance stipend towards living costs',
            'Travel allowance covering your journey from your home country to the UK and back',
            'Thesis and research support grant for PhD and distance awards',
            'Warm clothing allowance where the host climate requires it',
            'Support for dependants in exceptional circumstances',
        ],
        eligibility: [
            'You are a citizen of a low- or middle-income Commonwealth country, including Rwanda',
            'You hold at least a second-class upper bachelor degree or an equivalent qualification',
            'You satisfy the years-since-graduation rule for the award you are applying to',
            'You meet the English requirement (IELTS 6.0 overall with 5.5 in every band, or TOEFL 80-90)',
            'You are within the age limit for the award (master\'s usually 35, PhD usually 40)',
        ],
        documents: [
            'Completed CSC online application form',
            'Academic transcripts and certificates for each degree listed',
            'Proof of citizenship or residency for your home country',
            'English language test results unless you qualify for an exemption',
            'Personal statement and two academic references',
            'Research proposal for PhD applications',
        ],
    },
    {
        key: 'chevening',
        name: 'Chevening Scholarship',
        match: ['chevening'],
        domains: ['chevening.org'],
        levels: ["Master's (one-year postgraduate programme)"],
        benefits: [
            'Full tuition fees for the duration of the scholarship',
            'Monthly living allowance to cover day-to-day costs',
            'Travel grant covering return flights from your home country to the UK',
            'Thesis or research project allowance',
            'Comprehensive medical insurance and visa support from the British Council',
            'Access to the Chevening alumni network and career services',
        ],
        eligibility: [
            'You hold a bachelor degree or equivalent qualification at the time of application',
            'You have at least three years of work experience (Rwandan applicants: three years minimum)',
            'You meet the English requirement (IELTS 6.5 overall with 6.0 in every band, or an equivalent TOEFL score)',
            'You have not previously been funded by a UK government scholarship for the same award',
            'You can show leadership and a plan for applying the programme in your home country',
        ],
        documents: [
            'Completed Chevening application form',
            'Education and qualification records (transcripts and degree certificate)',
            'Work experience statement with dates, duties and responsibilities',
            'Three reference letters, including one from your employer',
            'Personal statement of at least 500 words on your motivation and leadership',
            'IELTS / TOEFL certificate and reference number',
        ],
    },
    {
        key: 'gates cambridge',
        name: 'Gates Cambridge Scholarship',
        match: ['gates cambridge'],
        domains: ['gatescambridge.org'],
        levels: ['PhD (full-time research degree at the University of Cambridge)'],
        benefits: [
            'Full cost of attendance — tuition, living costs and student maintenance',
            'Airfare from your home country to the UK and return',
            'Visa, immigration and health costs covered',
            'Additional support for dependants, a laptop and exceptional research costs',
            'Access to the Gates Cambridge community, mentoring and alumni events',
        ],
        eligibility: [
            'You hold a first degree equivalent to a Cambridge second-class honours degree or above',
            'You meet the English requirement (IELTS 7.5 with 7.0 in every band, or TOEFL 107+)',
            'You have strong potential to contribute to the research environment',
            'You are not a UK or EU national and have not held a Gates Cambridge award before',
            'You apply for Cambridge admission to the PhD programme in the same year',
        ],
        documents: [
            'Cambridge application form plus the Gates Cambridge supplementary form',
            'Personal statement and statement of research intent',
            'Curriculum vitae',
            'First-degree certificate, transcripts and supervisor reports',
            'Three references, including one from your proposed PhD supervisor',
            'English proficiency test scores and a copy of your passport',
        ],
    },
    {
        key: 'rhodes',
        name: 'Rhodes Scholarship',
        match: ['rhodes'],
        domains: ['rhodeshouse.ox.ac.uk', 'rhodeshouse.oxford'],
        levels: ["Bachelor's (Rhodes Scholar — Oxford undergraduate)", "Master's / Doctoral (Rhodes Scholars Worldwide)"],
        benefits: [
            'All university fees at Oxford or your chosen partner institution',
            'Monthly living stipend for the full duration of the award',
            'Flights to and from Oxford, or to your host country for Rhodes Scholars Worldwide',
            'Comprehensive health insurance and visa sponsorship',
            'Access to the Rhodes Trust network, mentoring and career support',
        ],
        eligibility: [
            'You meet the academic standard expected by Oxford — for the Scholarship, exceptionally strong results',
            'You have shown leadership, service and a lasting commitment to your community',
            'You satisfy the citizenship, age and residency conditions of your home country',
            'You are from a country eligible for the award and have not held it before',
            'For Rhodes Scholars Worldwide: you hold a bachelor degree and two to three years of work experience',
        ],
        documents: [
            'Application form and personal statement',
            'Curriculum vitae',
            'Academic transcripts, certificates and referee reports',
            'Evidence of leadership and community service (awards, volunteering, organisations)',
            'Evidence of athletic achievement where the Scholarship track requires it',
            'Copy of your passport and proof of language proficiency',
        ],
    },
    {
        key: 'knight hennessy',
        name: 'Knight-Hennessy Scholars',
        match: ['knight hennessy', 'knight-hennessy'],
        domains: ['knight-hennessy.stanford.edu', 'stanford.edu'],
        levels: ["Master's (any Stanford graduate programme)", "PhD (any of Stanford's graduate programmes)"],
        benefits: [
            'Full tuition and a stipend covering the fellowship period',
            'Living stipend and full health insurance',
            'Travel funding and support for relocation to Stanford',
            'Access to a global fellowship community of scholars and alumni',
            'Funding for academic conference travel and special projects',
        ],
        eligibility: [
            'You hold a bachelor degree equivalent to a Stanford bachelor degree',
            'You have applied to and been admitted to a Stanford graduate programme',
            'You show exceptional academic ability, leadership and community impact',
            'You meet the English proficiency requirement of your department',
            'You are not a US citizen or permanent resident for this programme',
        ],
        documents: [
            'Stanford graduate admission application',
            'Knight-Hennessy application form and personal statement',
            'Curriculum vitae',
            'Academic transcripts and degree certificates',
            'Three recommendation letters',
            'Standardised test scores (GRE / GMAT) where the department requires them',
        ],
    },
    {
        key: 'daad',
        name: 'DAAD Scholarships',
        match: ['daad'],
        domains: ['daad.de'],
        levels: ["Master's (Development-Related Postgraduate Courses — EPOS)", "Master's (Study Scholarships)", 'PhD and research grants'],
        benefits: [
            'Full tuition fees and university charges',
            'Monthly living allowance (about EUR 1,000 for students, EUR 1,150 for doctoral candidates)',
            'Travel allowance of about EUR 850, or 50% of a one-way fare for study grants',
            'Health insurance cover for the whole scholarship period',
            'Study and research allowance for books, equipment and field work',
            'German language course or preparatory language programme where required',
        ],
        eligibility: [
            'You hold a bachelor degree for master\'s programmes, or a master\'s degree for doctoral study',
            'For EPOS courses: at least two years of professional experience after your degree',
            'You meet the language requirement of your chosen programme (English or German proof)',
            'You apply to a DAAD-supported programme or scholarship route',
            'You have not previously received a DAAD scholarship for the same study project',
        ],
        documents: [
            'DAAD online application form with every section completed',
            'Curriculum vitae in the DAAD format',
            'Detailed letter of motivation',
            'Study proposal or research proposal',
            'Degree certificates and academic transcripts with credit points',
            'Language certificates (IELTS / TOEFL / Goethe-Institut) and reference letters',
        ],
    },
    {
        key: 'erasmus mundus',
        name: 'Erasmus Mundus',
        match: ['erasmus mundus', 'erasmus'],
        domains: ['eacea.ec.europa.eu', 'erasmus-plus.ec.europa.eu'],
        levels: ["Master's (joint or consortium programme)", 'PhD (Erasmus Mundus joint doctorate)'],
        benefits: [
            'Full tuition fees and enrolment costs at the host universities',
            'Monthly stipend of about EUR 1,400 for the whole programme',
            'Travel grant of up to EUR 300, or EUR 500 for longer distances, for inter-campus mobility',
            'Travel and installation allowance for parents of students with dependants',
            'Full health insurance under the Erasmus+ scheme',
            'Reduced or waived tuition for students from partner countries',
        ],
        eligibility: [
            'You hold a bachelor degree for master\'s programmes, or a master\'s for doctoral study',
            'You comply with the mobility rule — no more than 12 months living in the programme country in the last three years',
            'You meet the language requirement of the consortium (usually English for master\'s programmes)',
            'You have not already used an Erasmus+ mobility grant at the same study level',
            'You apply through the consortium and complete the home university admission process',
        ],
        documents: [
            'Erasmus Mundus / consortium application form',
            'Curriculum vitae and letter of motivation',
            'Bachelor\'s (or master\'s) diploma and transcript with credits',
            'Language proficiency certificate (IELTS / TOEFL)',
            'Copy of your passport and a passport photograph',
            'Two academic reference letters',
        ],
    },
    {
        key: 'mext',
        name: 'MEXT Scholarship',
        match: ['mext'],
        domains: ['studyinjapan.go.jp', 'mofa.go.jp'],
        levels: ["Master's (research student and student)", 'PhD (doctoral student)', 'Specialised training (non-degree)'],
        benefits: [
            'Full tuition fees waived at the host university',
            'Monthly scholarship allowance (about JPY 144,000 for research and doctoral students)',
            'Round-trip airfare from your home country to Japan',
            'Settlement allowance plus dormitory or host-family placement support',
            'Medical insurance and research support for laboratory work',
            'Free Japanese language training for non-research students',
        ],
        eligibility: [
            'You are a national of a country covered by the MEXT scholarship programme',
            'You hold a bachelor degree for master\'s applicants, or a master\'s degree for doctoral applicants',
            'You meet the age limit — generally 25 for master\'s and doctoral students, 20 for specialised training',
            'You have the required academic standing and, for non-research courses, a Japanese proficiency certificate',
            'You agree to return to your home country and share what you have learned',
        ],
        documents: [
            'MEXT scholarship application form with a study or research plan',
            'Academic transcripts and degree certificates with a certified seal',
            'Research plan (doctoral) or study plan (master\'s)',
            'Japanese proficiency certificate for non-research students',
            'Medical certificate and chest X-ray results where required',
            'Passport copy, photographs and family details form',
        ],
    },
    {
        key: 'vanier',
        name: 'Vanier Canada Graduate Scholarship',
        match: ['vanier'],
        domains: ['vanier.gc.ca'],
        levels: ['PhD (full-time doctoral studies in Canada)'],
        benefits: [
            'Funding of CAD 50,000 per year for up to three years (up to CAD 150,000 in total)',
            'Full health insurance coverage for the award holder and dependants',
            'Travel allowance to help with relocation to Canada',
            'Relocation support for the award holder and family',
            'Access to graduate research funding and the Canadian university network',
        ],
        eligibility: [
            'You are a Canadian citizen or permanent resident',
            'You are enrolled full-time in a PhD programme at a Canadian university',
            'You hold a strong academic record (typically a 3.7+ GPA or equivalent)',
            'You meet the language requirement (IELTS / TOEFL or an approved exemption)',
            'You have not previously held a Vanier Canada Graduate Scholarship',
        ],
        documents: [
            'Vanier application form and referee reports',
            'Curriculum vitae',
            'Academic transcripts from every post-secondary institution',
            'Two referee letters (academic, plus a research supervisor where applicable)',
            'Language proficiency results or exemption documentation',
            'Confirmation of your doctoral enrolment',
        ],
    },
    {
        key: 'eiffel',
        name: 'Eiffel Excellence Scholarship',
        match: ['eiffel'],
        domains: ['campusfrance.org'],
        levels: ["Master's (fully funded excellence grants)", 'PhD (doctoral excellence grants)'],
        benefits: [
            'Monthly allowance of about EUR 1,181 for master\'s students (EUR 1,406 for PhD students)',
            'Full tuition fees waived at the French institution',
            'Additional allowance of EUR 50-100 per month depending on the grant',
            'Health insurance and campus services included in the university package',
            'Support from Campus France throughout the award',
        ],
        eligibility: [
            'You are a national of a non-EU / non-EEA country, including Rwanda',
            'You are enrolled in, or applying to, a French higher education institution',
            'You hold a strong academic record — a bachelor degree for master\'s, a master for PhD',
            'You meet the age limit (generally under 25 for master\'s grants)',
            'You do not hold another scholarship funding the same programme and you meet the French or English requirement',
        ],
        documents: [
            'Campus France / Eiffel application file with the university admission',
            'Curriculum vitae',
            'Copies of diplomas and academic transcripts',
            'French or English language certificate',
            'Copy of your passport and bank details for payment',
            'Admission confirmation from the host institution',
        ],
    },
    {
        key: 'holland',
        name: 'Holland Scholarship',
        match: ['holland scholarship'],
        domains: ['studyinnl.org'],
        levels: ["Bachelor's (non-EEA students)", "Master's (non-EEA students)"],
        benefits: [
            'One-off grant of EUR 5,000-10,000 towards tuition fees for the first year',
            'Applies to both Dutch bachelor\'s and master\'s programmes',
            'Paid directly to your selected institution once you accept the offer',
            'Can be combined with other Dutch scholarship schemes where the rules allow',
        ],
        eligibility: [
            'You are not a national of the EEA, Switzerland or the UK (non-EEA applicant)',
            'You have been offered a place on a qualifying Dutch higher education programme',
            'You hold an excellent academic record that qualifies you for the scholarship',
            'You are applying for a bachelor\'s or master\'s programme in the Netherlands',
        ],
        documents: [
            'Completed Holland Scholarship application form',
            'Official admission letter from the Dutch institution',
            'Academic transcripts and diplomas',
            'Proof of nationality (passport or residency permit)',
            'Short statement of motivation and academic CV',
        ],
    },
    {
        key: 'swiss excellence',
        name: 'Swiss Government Excellence Scholarships',
        match: ['swiss government excellence', 'swiss excellence'],
        domains: ['sbfi.admin.ch'],
        levels: ["Master's (postgraduate study grants)", 'PhD (doctoral and post-doctoral research)'],
        benefits: [
            'Full tuition fees at the Swiss university',
            'Living allowance of about CHF 1,800 per month',
            'Travel allowance covering the journey to Switzerland',
            'Settlement allowance and accommodation support for longer stays',
            'Access to Swiss university research networks and laboratories',
        ],
        eligibility: [
            'You are a national of a country with a bilateral scholarship agreement with Switzerland',
            'You hold excellent academic credentials — a bachelor for master\'s, a master for PhD',
            'You meet the required language proficiency (English, French, German or Italian)',
            'You have not previously held a Swiss Government Excellence Scholarship',
            'You are admitted to, or applying to, a Swiss university',
        ],
        documents: [
            'Swiss Government Excellence Scholarship application form',
            'Curriculum vitae and letter of motivation',
            'University admission confirmation',
            'Academic transcripts and diplomas',
            'Language proficiency certificates',
            'Copy of your passport and reference letters',
        ],
    },
    {
        key: 'turkiye scholarships',
        name: 'Türkiye Government Scholarships',
        match: ['turkish scholarship', 'turkish government scholarship', 'turkiye scholarship', 'turkiye government scholarship'],
        domains: ['turkiye.gov.tr', 'turkishscholarships.gov.tr'],
        levels: ["Bachelor's", "Master's", 'PhD', 'Post-doctoral research'],
        benefits: [
            'Full tuition and university fees',
            'Monthly stipend of about TRY 4,500 for undergraduates and TRY 6,000 for postgraduates',
            'Round-trip airfare to Türkiye',
            'Free health insurance and access to university dormitories',
            'Turkish language course before the programme starts',
        ],
        eligibility: [
            'You are a national of a country covered by the programme and hold the required qualification',
            'Your age is within the limit for your level (generally 21 for bachelor\'s, 35 for master\'s)',
            'You have the academic average required for your previous degree',
            'You hold the required Turkish or English language certificate where applicable',
            'You are not enrolled in a full-time programme funded by another scholarship',
        ],
        documents: [
            'YÖKS scholarship application form and study plan',
            'Copy of your passport and photographs',
            'Academic transcripts and diploma showing the required average',
            'Language proficiency certificate (Turkish or English)',
            'Health report and photographs for the application',
        ],
    },
    {
        key: 'chinese scholarship',
        name: 'Chinese Government Scholarship (CSC)',
        match: ['chinese government scholarship', 'chinese scholarship', 'csc'],
        domains: ['csc.edu.cn'],
        levels: ["Bachelor's", "Master's", 'PhD', 'Chinese language / non-degree'],
        benefits: [
            'Full tuition waiver at the host university',
            'Monthly stipend of about CNY 1,450-2,800 depending on level and award type',
            'Free accommodation provided by the host university',
            'Comprehensive medical insurance for the full study period',
            'Round-trip airfare for full-scholarship holders',
        ],
        eligibility: [
            'You are a foreign citizen with a valid passport from a country covered by the programme',
            'You hold the academic qualification required for the programme and a strong transcript',
            'You are in good health',
            'You meet the Chinese language or English language requirement for the programme',
            'You have not received another CSC award for the same programme',
        ],
        documents: [
            'CSC online application form and study plan',
            'Copy of your passport and photograph',
            'Academic transcripts and diploma',
            'Language proficiency certificate',
            'Physical examination form and medical report',
            'Recommendation letters and published academic work where applicable',
        ],
    },
    {
        key: 'australia awards',
        name: 'Australia Awards Scholarships',
        match: ['australia awards'],
        domains: ['dfat.gov.au'],
        levels: ["Bachelor's", "Master's", 'PhD'],
        benefits: [
            'Full tuition fees and the student contribution for the whole course',
            'Living allowance paid for the duration of the award',
            'Travel grant covering return flights from your home country to Australia',
            'Relocation grant and arrival assistance on settling in',
            'Comprehensive health cover and access to student support services',
        ],
        eligibility: [
            'You are a national of an eligible participant country and can hold its citizenship',
            'You meet the minimum age of 18 and the academic entry requirement for your programme',
            'You have a strong academic record and are not already enrolled in an equivalent award',
            'You meet the English proficiency requirement of your chosen programme',
            'You intend to return to your home country and contribute its development',
        ],
        documents: [
            'Online application form for the Australia Awards scholarship',
            'Curriculum vitae and personal statement',
            'Academic transcripts and degree certificate with certified English translation',
            'English proficiency test results',
            'Proof of citizenship and current residence',
            'Recommendation letters and evidence of professional experience',
        ],
    },
    {
        key: 'mastercard foundation',
        name: 'Mastercard Foundation Scholars Program',
        match: ['mastercard foundation'],
        domains: ['mastercardfdn.org'],
        levels: ["Bachelor's (full degree, up to three years)", "Master's (up to two years)"],
        benefits: [
            'Full tuition and fees for the whole duration of the programme',
            'Monthly living allowance plus an annual allowance for books and a laptop',
            'Travel and relocation support to and from the host institution',
            'One-to-one mentoring and structured leadership development',
            'Access to the Mastercard Foundation Scholars network and career opportunities',
        ],
        eligibility: [
            'You are from a low- or middle-income African country, including Rwanda',
            'You have a strong academic record and admission to an eligible institution',
            'You demonstrate leadership and a commitment to community impact',
            'You have not previously received a Mastercard Foundation Scholarship',
            'You intend to return home and apply your learning to your country\'s development',
        ],
        documents: [
            'Online application form with every section complete',
            'Curriculum vitae and personal statement',
            'Academic transcripts, certificate and admission letter',
            'Evidence of leadership and community service',
            'Recommendation letters and a copy of your national ID',
        ],
    },
    {
        key: 'tony elumelu',
        name: 'Tony Elumelu Foundation Scholarship',
        match: ['tony elumelu', 'elumelu'],
        domains: ['tonyelumelufoundation.org'],
        levels: ["Bachelor's", "Master's", 'MBA and PhD programmes'],
        benefits: [
            'USD 2,000 per year for five years towards tuition, living and academic expenses',
            'Mentorship and coaching from the Elumelu alumni network',
            'Access to the annual foundation summit and learning resources',
            'Entry into a community of African entrepreneurs and leaders',
        ],
        eligibility: [
            'You are an African national with a strong academic record from an African university',
            'You are pursuing a full-time undergraduate, master\'s, MBA or doctoral programme',
            'You have leadership experience and a record of community impact',
            'You meet the academic threshold set for your programme',
            'You have not previously received a Tony Elumelu Foundation scholarship',
        ],
        documents: [
            'Completed scholarship application form',
            'Proof of admission to the university and your study plan',
            'Academic transcripts and degree certificate',
            'Curriculum vitae and personal statement',
            'Leadership, volunteer and community service evidence',
            'Copy of your national identification',
        ],
    },
]

// ─── Matching helpers ───
const norm = (v) => String(v || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

const hostOf = (url) => {
    try { return new URL(url).hostname.replace(/^www\./, '').toLowerCase() } catch { return '' }
}

const escaped = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Whole-word match so "csc" never matches inside another word.
// A trailing plural "s" is allowed ("scholarship" matches "scholarships").
const containsPhrase = (haystack, phrase) => {
    const p = norm(phrase)
    if (!p) return false
    return new RegExp(`\\b${escaped(p)}s?\\b`).test(haystack)
}

const matchesDomain = (host, domains = []) => {
    if (!host) return false
    return domains.some(d => host === d || host.endsWith('.' + d))
}

/**
 * Finds the curated profile that belongs to a listing.
 * Checks the listing id/slug first, then the official domain, then the title.
 */
export function matchScholarshipProfile(listing) {
    if (!listing) return null
    const ids = [listing.sourceId, listing.slug, listing.id].filter(Boolean).map(norm)
    const titles = [listing.title, listing.name].filter(Boolean).map(norm)
    const host = hostOf(listing.sourceUrl || listing.applyUrl || listing.url || '')

    for (const p of SCHOLARSHIP_PROFILES) {
        if (ids.includes(norm(p.key))) return p
    }
    for (const p of SCHOLARSHIP_PROFILES) {
        if (matchesDomain(host, p.domains)) return p
    }
    for (const p of SCHOLARSHIP_PROFILES) {
        for (const phrase of p.match || []) {
            if (titles.some(t => containsPhrase(t, phrase))) return p
        }
    }
    return null
}

export const profileByKey = (key) => SCHOLARSHIP_PROFILES.find(p => p.key === norm(key)) || null
