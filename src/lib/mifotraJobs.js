// Live MIFOTRA (Ministry of Public Service and Labour, Rwanda) hot jobs loader.
// Source: Rwanda Civil Service Recruitment Portal public API.
// Responses arrive zlib-compressed as a byte-map under `_data_` and must be inflated.

import { db } from './firebase'
import { doc, getDoc } from 'firebase/firestore'

export const MIFOTRA_API_URL = 'https://recruitment.mifotra.gov.rw/api/recruitment/open-advertisements'
export const MIFOTRA_PORTAL_URL = 'https://recruitment.mifotra.gov.rw/'
export const MIFOTRA_TAB_ID = 'mifotra'

const CACHE_KEY = 'travelium_mifotra_jobs_cache'
const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes

async function inflateToText(arrayBuffer) {
    if (typeof DecompressionStream === 'undefined') {
        throw new Error('This browser cannot decompress MIFOTRA feeds.')
    }
    const stream = new Blob([arrayBuffer]).stream().pipeThrough(new DecompressionStream('deflate'))
    return await new Response(stream).text()
}

export function normalizeMifotraJob(raw) {
    const closingDate = raw.closingDate || ''
    return {
        id: String(raw.id || raw.requisitionId || ''),
        title: raw.positionName || 'Open Vacancy',
        company: raw.entityName || 'Rwanda Public Service',
        institutionShort: raw.entityAcronym || '',
        location: 'Rwanda',
        grade: [raw.levelName, raw.scaleName].filter(Boolean).join('.') || '',
        scale: raw.scaleName || '',
        posts: Number(raw.numberOfPosts || 1),
        type: raw.employeeGroupName || 'Public Service',
        isInternal: !!raw.isInternal,
        openingDate: raw.openingDate || '',
        closingDate,
        daysLeft: getDaysLeft(closingDate),
        description: String(raw.jobDescriptions || '').trim(),
        salary: (raw.levelName || raw.scaleName) ? `Grade ${[raw.levelName, raw.scaleName].filter(Boolean).join('.')}` : 'Rwanda Civil Service',
        countryName: 'Rwanda',
        flag: '🇷🇼',
        mifotra: true,
        portalUrl: MIFOTRA_PORTAL_URL
    }
}

export function getDaysLeft(closingDate) {
    if (!closingDate) return null
    const diff = new Date(closingDate).getTime() - Date.now()
    if (Number.isNaN(diff)) return null
    return Math.ceil(diff / 86400000)
}

function readCache() {
    try {
        const raw = localStorage.getItem(CACHE_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw)
        if (!parsed || !Array.isArray(parsed.jobs)) return null
        return parsed
    } catch {
        return null
    }
}

function writeCache(jobs) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ jobs, fetched_at: new Date().toISOString() }))
    } catch { }
}

function normalizeList(payload) {
    const list = Array.isArray(payload) ? payload : []
    return list
        .map(normalizeMifotraJob)
        .filter(job => job.id && job.title)
        .sort((a, b) => new Date(b.openingDate || 0) - new Date(a.openingDate || 0))
}

/**
 * Fetch MIFOTRA vacancies.
 * 1. Fresh localStorage cache (unless force)
 * 2. Live request to the MIFOTRA portal
 * 3. Firestore cache written by the `syncMifotraJobs` Cloud Function
 */
export async function fetchMifotraJobs({ force = false } = {}) {
    const cached = readCache()
    if (!force && cached && Date.now() - new Date(cached.fetched_at).getTime() < CACHE_TTL_MS) {
        return { jobs: cached.jobs, source: 'cache', fetched_at: cached.fetched_at }
    }

    try {
        const res = await fetch(MIFOTRA_API_URL, {
            headers: { Accept: 'application/json' },
            cache: force ? 'reload' : 'default'
        })
        if (!res.ok) throw new Error(`MIFOTRA responded ${res.status}`)

        const buffer = await res.arrayBuffer()
        let payload = null
        try {
            payload = JSON.parse(new TextDecoder().decode(buffer))
        } catch {
            payload = JSON.parse(await inflateToText(buffer))
        }
        if (payload && payload._data_) {
            payload = JSON.parse(await inflateToText(buffer))
        }
        const jobs = normalizeList(payload)

        if (!jobs.length) throw new Error('MIFOTRA returned no vacancies')
        writeCache(jobs)
        return { jobs, source: 'live', fetched_at: new Date().toISOString() }
    } catch (liveErr) {
        const serverJobs = await fetchMifotraJobsFromFirestore()
        if (serverJobs?.jobs?.length) {
            return { jobs: serverJobs.jobs, source: 'server-cache', fetched_at: serverJobs.fetched_at }
        }
        if (cached?.jobs?.length) {
            return { jobs: cached.jobs, source: 'stale-cache', fetched_at: cached.fetched_at }
        }
        throw liveErr
    }
}

/** Server-side cache maintained by the scheduled `syncMifotraJobs` Cloud Function. */
export async function fetchMifotraJobsFromFirestore() {
    if (!db) return null
    try {
        const snap = await getDoc(doc(db, 'settings', 'mifotra_jobs'))
        if (!snap.exists()) return null
        const data = snap.data()
        if (!Array.isArray(data.jobs) || !data.jobs.length) return null
        return { ...data, fetched_at: data.updated_at || null }
    } catch {
        return null
    }
}
