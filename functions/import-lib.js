const admin = require('firebase-admin')

// ═══════════════════════════════════════════════════════════════════════
//  AUTO-IMPORT PIPELINE — Jobs & Scholarships from verified sources
//
//  Flow: fetch (cron or admin trigger) → normalize → scam-filter →
//  dedupe → store as PENDING in "imported_listings". Nothing goes live
//  until an admin approves it in the dashboard. Approved jobs go to the
//  "jobs" collection; approved scholarships go to "services"
//  (type: 'scholarship') — both expire automatically to avoid stale posts.
// ═══════════════════════════════════════════════════════════════════════

const LISTING_TTL_DAYS = 45
const MAX_PER_SOURCE_PER_RUN = 40

const DEFAULT_IMPORT_SOURCES = {
  arbeitnow: { enabled: true, autoApprove: false, countries: [] },
  remotive: { enabled: true, autoApprove: false, countries: [] },
  adzuna: { enabled: false, autoApprove: false, countries: [], appId: '', appKey: '' },
  officialScholarships: { enabled: true, autoApprove: false },
}

// Official scholarship programs — the institutions themselves are the source.
const OFFICIAL_SCHOLARSHIPS = [
  { slug: 'daad', title: 'DAAD Scholarships', institution: 'German Academic Exchange Service (DAAD)', country: 'Germany', amount: 'Full Fund', url: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/', applyUrl: 'https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/', desc: 'Scholarships for international students, graduates and researchers across all degree levels, funded by the German government.' },
  { slug: 'chevening', title: 'Chevening Scholarship', institution: 'UK Government (FCDO)', country: 'United Kingdom', amount: 'Full Fund', url: 'https://www.chevening.org/scholarships/', applyUrl: 'https://www.chevening.org/apply/', desc: 'UK government global scholarship programme for future leaders — full funding for a one-year master\u2019s degree.' },
  { slug: 'commonwealth', title: 'Commonwealth Master\u2019s Scholarship', institution: 'Commonwealth Scholarship Commission', country: 'United Kingdom', amount: 'Full Fund', url: 'https://cscuk.fcdo.gov.uk/scholarships/', applyUrl: 'https://cscuk.fcdo.gov.uk/apply/', desc: 'Fully funded master\u2019s study in the UK for students from low- and middle-income Commonwealth countries.' },
  { slug: 'fulbright', title: 'Fulbright Foreign Student Program', institution: 'US Department of State', country: 'United States', amount: 'Full Fund', url: 'https://foreign.fulbrightonline.org/', applyUrl: 'https://foreign.fulbrightonline.org/apply', desc: 'Flagship US exchange programme bringing international students to American universities for graduate study.' },
  { slug: 'erasmus-mundus', title: 'Erasmus Mundus Joint Master\u2019s', institution: 'European Commission', country: 'European Union', amount: 'Full Fund', url: 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en', desc: 'EU-funded scholarships for joint master\u2019s programmes delivered by consortia of European universities.' },
  { slug: 'mext', title: 'MEXT Scholarship', institution: 'Government of Japan (MEXT)', country: 'Japan', amount: 'Full Fund', url: 'https://www.studyinjapan.go.jp/en/planning/scholarship/', desc: 'Japanese government scholarships covering tuition, monthly allowance and travel for international students.' },
  { slug: 'australia-awards', title: 'Australia Awards Scholarships', institution: 'Australian Government (DFAT)', country: 'Australia', amount: 'Full Fund', url: 'https://www.dfat.gov.au/people-to-people/australia-awards', desc: 'Long-term development awards for study in Australia, with a focus on partner countries in the Indo-Pacific and Africa.' },
  { slug: 'vanier', title: 'Vanier Canada Graduate Scholarship', institution: 'Government of Canada', country: 'Canada', amount: 'CAD 50,000/year', url: 'https://vanier.gc.ca/en/', desc: 'Canada\u2019s premier doctoral scholarship, awarded for academic excellence, research potential and leadership.' },
  { slug: 'eiffel', title: 'Eiffel Excellence Scholarship', institution: 'Campus France', country: 'France', amount: 'Full Fund', url: 'https://www.campusfrance.org/en/eiffel-scholarship-program-of-excellence', desc: 'French government scholarship attracting top international students to master\u2019s and PhD programmes.' },
  { slug: 'holland', title: 'Holland Scholarship', institution: 'Dutch Ministry of Education', country: 'Netherlands', amount: '€5,000', url: 'https://www.studyinnl.org/finances/holland-scholarship', desc: 'Financial award for international students from outside the EEA starting a bachelor\u2019s or master\u2019s in the Netherlands.' },
  { slug: 'swiss-excellence', title: 'Swiss Government Excellence Scholarship', institution: 'Swiss Confederation', country: 'Switzerland', amount: 'Full Fund', url: 'https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships.html', desc: 'Research and postgraduate scholarships for foreign scholars at Swiss universities.' },
  { slug: 'gates-cambridge', title: 'Gates Cambridge Scholarship', institution: 'University of Cambridge', country: 'United Kingdom', amount: 'Full Fund', url: 'https://www.gatescambridge.org/', desc: 'Full-cost scholarships for outstanding applicants from outside the UK to pursue postgraduate study at Cambridge.' },
  { slug: 'rhodes', title: 'Rhodes Scholarship', institution: 'University of Oxford', country: 'United Kingdom', amount: 'Full Fund', url: 'https://www.rhodeshouse.ox.ac.uk/scholarships/', desc: 'The oldest international graduate scholarship programme, enabling study at the University of Oxford.' },
  { slug: 'knight-hennessy', title: 'Knight-Hennessy Scholars', institution: 'Stanford University', country: 'United States', amount: 'Full Fund', url: 'https://knight-hennessy.stanford.edu/', desc: 'Stanford\u2019s flagship graduate scholarship funding any degree across all seven Stanford schools.' },
]

const COUNTRY_ALIASES = {
  usa: 'United States', us: 'United States', 'united states of america': 'United States', america: 'United States',
  uk: 'United Kingdom', britain: 'United Kingdom', england: 'United Kingdom', 'great britain': 'United Kingdom',
  uae: 'United Arab Emirates', emirates: 'United Arab Emirates',
  'republic of korea': 'South Korea', korea: 'South Korea',
  deutschland: 'Germany', 'federal republic of germany': 'Germany',
}

function normalizeCountry(raw) {
  if (!raw) return 'Remote'
  const cleaned = String(raw).trim().toLowerCase()
  if (COUNTRY_ALIASES[cleaned]) return COUNTRY_ALIASES[cleaned]
  // Prefer the last comma-separated segment ("Berlin, Germany" → "Germany")
  const parts = String(raw).split(',').map(p => p.trim()).filter(Boolean)
  const candidate = (parts[parts.length - 1] || String(raw).trim()).toLowerCase()
  if (COUNTRY_ALIASES[candidate]) return COUNTRY_ALIASES[candidate]
  const titleCased = parts[parts.length - 1] || String(raw).trim()
  if (['remote', 'worldwide', 'anywhere', 'global', 'european union', 'eu'].includes(candidate)) {
    if (candidate === 'european union' || candidate === 'eu') return 'European Union'
    return 'Remote'
  }
  return titleCased
}

function stripHtml(html) {
  if (!html) return ''
  return decodeEntities(String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim())
}

function decodeEntities(s) {
  if (!s) return ''
  return String(s)
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;|&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
}

// Flags listings that ask applicants for money — consistent with Travelium's
// published policy that job seekers are never charged to apply.
function scanForScamSignals(text) {
  const flags = []
  if (!text) return { flagged: false, flags }
  if (/(application|registration|processing|training|visa|recruitment|agency)\s*fee/i.test(text)) flags.push('fee-mention')
  if (/(pay|payment|deposit|wire\s*transfer|western\s*union|bitcoin|crypto).{0,80}(apply|application|registration|processing|training|offer)/i.test(text)) flags.push('payment-request')
  if (/100%\s*(guaranteed|assurance).{0,40}(visa|job|admission|scholarship)/i.test(text)) flags.push('unrealistic-guarantee')
  return { flagged: flags.length > 0, flags }
}

function importDocId(type, source, externalId) {
  const clean = String(externalId || '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120)
  return `${type}_${source}_${clean || 'unknown'}`
}

async function fetchJson(url, timeoutMs = 15000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'TraveliumGlobal-Importer/1.0 (contact: support@traveliumglobal.com)' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

async function fetchText(url, timeoutMs = 12000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'TraveliumGlobal-Importer/1.0 (contact: support@traveliumglobal.com)' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.text()
  } finally {
    clearTimeout(timer)
  }
}

// Creates the listing only if the dedupe ID doesn't exist yet — so anything
// already pending/approved/rejected is never re-imported or overwritten.
async function createListingOnce(db, listing) {
  const { docId, ...payload } = listing
  const ref = db.collection('imported_listings').doc(docId)
  try {
    await ref.create(payload)
    return 'imported'
  } catch (err) {
    if (err && err.code === 6) return 'already-known' // ALREADY_EXISTS
    throw err
  }
}

function countryAllowed(country, filter) {
  if (!Array.isArray(filter) || filter.length === 0) return true
  return filter.some(c => String(c).toLowerCase().trim() === String(country).toLowerCase().trim())
}

async function importArbeitnow(db, cfg) {
  let imported = 0
  let fetched = 0
  try {
    const data = await fetchJson('https://www.arbeitnow.com/api/job-board-api')
    const rows = Array.isArray(data?.data) ? data.data : []
    fetched = rows.length
    for (const j of rows.slice(0, MAX_PER_SOURCE_PER_RUN)) {
      const country = normalizeCountry(j.location || (j.remote ? 'Remote' : ''))
      if (!countryAllowed(country, cfg.countries)) continue
      const description = stripHtml(j.description).slice(0, 4000)
      const scam = scanForScamSignals(`${j.title} ${description}`)
      const listing = {
        docId: importDocId('job', 'arbeitnow', j.slug || j.title),
        type: 'job',
        title: String(j.title || 'Untitled role').slice(0, 200),
        company: String(j.company_name || 'Verified employer').slice(0, 120),
        country,
        location: String(j.location || (j.remote ? 'Remote' : '')).slice(0, 160),
        description,
        salary: '',
        jobType: Array.isArray(j.job_types) && j.job_types.length ? j.job_types.join(', ') : 'full-time',
        source: 'arbeitnow',
        sourceName: 'Arbeitnow Job Board (verified)',
        sourceUrl: String(j.url || `https://www.arbeitnow.com/jobs/${j.slug}`),
        sourceId: String(j.slug || j.title),
        flags: scam.flags,
        flagged: scam.flagged,
        status: 'pending',
        imported_at: admin.firestore.FieldValue.serverTimestamp(),
        expires_at: admin.firestore.Timestamp.fromMillis(Date.now() + LISTING_TTL_DAYS * 86400000),
      }
      const result = await createListingOnce(db, listing)
      if (result === 'imported') imported++
    }
  } catch (err) {
    console.error('arbeitnow import failed:', err.message)
    return { fetched, imported, error: err.message }
  }
  return { fetched, imported }
}

async function importRemotive(db, cfg) {
  let imported = 0
  let fetched = 0
  try {
    const data = await fetchJson('https://remotive.com/api/remote-jobs?limit=50')
    const rows = Array.isArray(data?.jobs) ? data.jobs : []
    fetched = rows.length
    for (const j of rows.slice(0, MAX_PER_SOURCE_PER_RUN)) {
      const country = normalizeCountry(j.candidate_required_location || 'Remote')
      if (!countryAllowed(country, cfg.countries)) continue
      const description = stripHtml(j.description).slice(0, 4000)
      const scam = scanForScamSignals(`${j.title} ${description}`)
      const listing = {
        docId: importDocId('job', 'remotive', j.id || j.url),
        type: 'job',
        title: String(j.title || 'Untitled role').slice(0, 200),
        company: String(j.company_name || 'Verified employer').slice(0, 120),
        country,
        location: String(j.candidate_required_location || 'Remote').slice(0, 160),
        description,
        salary: String(j.salary || ''),
        jobType: String(j.job_type || 'full-time').replace('_', '-'),
        source: 'remotive',
        sourceName: 'Remotive (verified remote jobs)',
        sourceUrl: String(j.url || ''),
        sourceId: String(j.id || j.url),
        flags: scam.flags,
        flagged: scam.flagged,
        status: 'pending',
        imported_at: admin.firestore.FieldValue.serverTimestamp(),
        expires_at: admin.firestore.Timestamp.fromMillis(Date.now() + LISTING_TTL_DAYS * 86400000),
      }
      const result = await createListingOnce(db, listing)
      if (result === 'imported') imported++
    }
  } catch (err) {
    console.error('remotive import failed:', err.message)
    return { fetched, imported, error: err.message }
  }
  return { fetched, imported }
}

// Optional — activates automatically once appId + appKey are saved in the
// dashboard source manager (register free at developer.adzuna.com).
async function importAdzuna(db, cfg) {
  if (!cfg.appId || !cfg.appKey) return { fetched: 0, imported: 0, error: 'missing-credentials' }
  let imported = 0
  let fetched = 0
  const countries = (Array.isArray(cfg.countries) && cfg.countries.length ? cfg.countries : ['United Arab Emirates', 'United Kingdom', 'United States', 'Canada', 'Germany', 'Australia', 'France', 'Netherlands', 'Poland', 'Japan'])
    .map(c => ({ name: c, api: c.toLowerCase().replace(/\s+/g, '-') }))
  try {
    for (const c of countries) {
      const data = await fetchJson(`https://api.adzuna.com/v1/api/jobs/${c.api}/search/1?app_id=${encodeURIComponent(cfg.appId)}&app_key=${encodeURIComponent(cfg.appKey)}&results_per_page=20&content-type=application/json`)
      const rows = Array.isArray(data?.results) ? data.results : []
      fetched += rows.length
      for (const j of rows) {
        const country = normalizeCountry(j.location?.display_name || c.name)
        if (!countryAllowed(country, cfg.countries)) continue
        const description = stripHtml(j.description).slice(0, 4000)
        const scam = scanForScamSignals(`${j.title} ${description}`)
        const listing = {
          docId: importDocId('job', 'adzuna', j.id || j.redirect_url),
          type: 'job',
          title: String(j.title || 'Untitled role').replace(/<[^>]+>/g, '').slice(0, 200),
          company: String(j.company?.display_name || 'Verified employer').slice(0, 120),
          country,
          location: String(j.location?.display_name || c.name).slice(0, 160),
          description,
          salary: j.salary_min && j.salary_max ? `${Math.round(j.salary_min)} - ${Math.round(j.salary_max)} ${data.salary_currency || ''}`.trim() : '',
          jobType: Array.isArray(j.contract_time) && j.contract_time.length ? j.contract_time.join(', ') : 'full-time',
          source: 'adzuna',
          sourceName: 'Adzuna (verified listings)',
          sourceUrl: String(j.redirect_url || ''),
          sourceId: String(j.id || j.redirect_url),
          flags: scam.flags,
          flagged: scam.flagged,
          status: 'pending',
          imported_at: admin.firestore.FieldValue.serverTimestamp(),
          expires_at: admin.firestore.Timestamp.fromMillis(Date.now() + LISTING_TTL_DAYS * 86400000),
        }
        const result = await createListingOnce(db, listing)
        if (result === 'imported') imported++
      }
    }
  } catch (err) {
    console.error('adzuna import failed:', err.message)
    return { fetched, imported, error: err.message }
  }
  return { fetched, imported }
}

// Pulls from each programme's official page: refreshes the meta description
// and best-effort deadline so admins always review current official info.
async function importOfficialScholarships(db, cfg) {
  let imported = 0
  let fetched = 0
  for (const prog of OFFICIAL_SCHOLARSHIPS) {
    if (imported >= MAX_PER_SOURCE_PER_RUN) break
    let description = prog.desc
    let deadline = 'See official page'
    try {
      const html = await fetchText(prog.url)
      fetched++
      const metaDesc = html.match(/<meta[^>]+(?:name="description"|property="og:description")[^>]+content="([^"]+)"/i)
      if (metaDesc && metaDesc[1]) description = decodeEntities(metaDesc[1]).slice(0, 600)
      const dl = html.match(/deadline[^<]{0,60}?((jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{1,2},?\s*\d{4}|\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{4})/i)
      if (dl) deadline = decodeEntities(dl[1])
    } catch (err) {
      console.warn(`official scholarship fetch failed (${prog.slug}):`, err.message)
    }
    const scam = scanForScamSignals(description)
    const listing = {
      docId: importDocId('scholarship', 'official', prog.slug),
      type: 'scholarship',
      title: prog.title,
      institution: prog.institution,
      country: prog.country,
      amount: prog.amount,
      description: description.slice(0, 2000),
      deadline,
      source: 'official',
      sourceName: `${prog.institution} (official)`,
      sourceUrl: prog.url,
      applyUrl: prog.applyUrl || '',
      sourceId: prog.slug,
      flags: scam.flags,
      flagged: scam.flagged,
      status: 'pending',
      imported_at: admin.firestore.FieldValue.serverTimestamp(),
      expires_at: admin.firestore.Timestamp.fromMillis(Date.now() + LISTING_TTL_DAYS * 86400000),
    }
    const result = await createListingOnce(db, listing)
    if (result === 'imported') imported++
  }
  return { fetched, imported }
}

// Marks stale listings expired. Approved jobs are hidden in the "jobs"
// collection; approved scholarships are deactivated in "services".
async function sweepExpired(db) {
  const now = admin.firestore.Timestamp.now()
  const stale = await db.collection('imported_listings')
    .where('status', 'in', ['pending', 'approved'])
    .where('expires_at', '<', now)
    .get()
  let expired = 0
  const batch = db.batch()
  stale.forEach(doc => {
    const d = doc.data()
    batch.update(doc.ref, { status: 'expired', expired_at: admin.firestore.FieldValue.serverTimestamp() })
    if (d.status === 'approved' && d.liveId) {
      if (d.type === 'job') {
        batch.update(db.collection('jobs').doc(d.liveId), { status: 'expired', updated_at: admin.firestore.FieldValue.serverTimestamp() })
      } else if (d.type === 'scholarship') {
        batch.update(db.collection('services').doc(d.liveId), { active: false, updated_at: admin.firestore.FieldValue.serverTimestamp() })
      }
    }
    expired++
  })
  if (expired) await batch.commit()
  return expired
}

// Publishes an approved listing to its live collection and links it back.
// Used by the dashboard's approve action (via client SDK) and by auto-approve.
async function publishListing(db, docId, data) {
  const importedRef = db.collection('imported_listings').doc(docId)
  if (data.type === 'job') {
    const live = await db.collection('jobs').add({
      title: data.title,
      company: data.company,
      country: data.country,
      location: data.location || '',
      description: data.description || '',
      salary: data.salary || '',
      jobType: data.jobType || 'full-time',
      source: data.source || '',
      sourceName: data.sourceName || '',
      sourceUrl: data.sourceUrl || '',
      applyUrl: data.applyUrl || '',
      auto: true,
      status: 'active',
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      expires_at: data.expires_at || admin.firestore.Timestamp.fromMillis(Date.now() + LISTING_TTL_DAYS * 86400000),
    })
    await importedRef.update({ status: 'approved', approved_at: admin.firestore.FieldValue.serverTimestamp(), liveId: live.id })
  } else {
    const live = await db.collection('services').add({
      type: 'scholarship',
      title: data.title,
      amount: data.amount || 'Contact us',
      country: data.country || '',
      description: data.description || '',
      deadline: data.deadline || '',
      source: data.source || '',
      sourceName: data.sourceName || '',
      sourceUrl: data.sourceUrl || '',
      applyUrl: data.applyUrl || '',
      auto: true,
      active: true,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      expires_at: data.expires_at || admin.firestore.Timestamp.fromMillis(Date.now() + LISTING_TTL_DAYS * 86400000),
    })
    await importedRef.update({ status: 'approved', approved_at: admin.firestore.FieldValue.serverTimestamp(), liveId: live.id })
  }
}

async function runAllImports() {
  const db = admin.firestore()
  const settingsRef = db.collection('settings').doc('importSources')
  const settingsSnap = await settingsRef.get()
  const stored = settingsSnap.exists ? settingsSnap.data() : {}
  const cfg = { ...DEFAULT_IMPORT_SOURCES, ...stored }

  const perSource = {}
  if (cfg.arbeitnow?.enabled !== false) perSource.arbeitnow = await importArbeitnow(db, cfg.arbeitnow || {})
  if (cfg.remotive?.enabled !== false) perSource.remotive = await importRemotive(db, cfg.remotive || {})
  if (cfg.adzuna?.enabled) perSource.adzuna = await importAdzuna(db, cfg.adzuna || {})
  if (cfg.officialScholarships?.enabled !== false) perSource.officialScholarships = await importOfficialScholarships(db, cfg.officialScholarships || {})

  // Auto-approve (per source, default OFF): publish fresh unflagged imports
  // immediately. Flagged listings always wait for manual review.
  let autoApproved = 0
  for (const [key, result] of Object.entries(perSource)) {
    const sourceCfg = cfg[key] || {}
    if (!sourceCfg.autoApprove || !result?.imported) continue
    let fresh
    try {
      fresh = await db.collection('imported_listings')
        .where('source', '==', key === 'officialScholarships' ? 'official' : key)
        .where('status', '==', 'pending')
        .where('flagged', '==', false)
        .limit(result.imported)
        .get()
    } catch (err) {
      console.error('auto-approve query failed for', key, err.message)
      continue
    }
    for (const doc of fresh.docs) {
      try {
        await publishListing(db, doc.id, doc.data())
        autoApproved++
      } catch (err) {
        console.error('auto-approve failed for', doc.id, err.message)
      }
    }
  }

  let expired = 0
  try {
    expired = await sweepExpired(db)
  } catch (err) {
    console.error('expiry sweep failed (imports are unaffected):', err.message)
  }

  const summary = { at: new Date().toISOString(), perSource, autoApproved, expired }
  await settingsRef.set({ ...cfg, lastRunAt: admin.firestore.FieldValue.serverTimestamp(), lastRunSummary: summary }, { merge: true })
  return summary
}

module.exports = { runAllImports, publishListing }
