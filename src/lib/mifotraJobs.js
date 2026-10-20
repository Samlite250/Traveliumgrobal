// Live MIFOTRA (Ministry of Public Service and Labour, Rwanda) hot jobs loader.
// Source: Rwanda Civil Service Recruitment Portal public API.
// Responses arrive zlib-compressed as a byte-map under `_data_` and must be inflated.

import { db } from './firebase'
import { doc, getDoc } from 'firebase/firestore'

export const MIFOTRA_API_URL = 'https://recruitment.mifotra.gov.rw/api/recruitment/open-advertisements'
export const MIFOTRA_PORTAL_URL = 'https://recruitment.mifotra.gov.rw/'
export const MIFOTRA_TAB_ID = 'mifotra'

const CACHE_KEY = 'travelium_mifotra_jobs_cache'
const CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6 hours
const LIVE_TIMEOUT_MS = 8000 // per attempt — the portal regularly stalls
const LIVE_DELAY_MS = 1500 // stagger before the backup attempt

async function bytesToText(bytes, format) {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream(format))
    return await new Response(stream).text()
}

async function inflateToText(bytes) {
    const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
    const attempts = []
    if (typeof DecompressionStream !== 'undefined') {
        for (const format of ['deflate', 'deflate-raw']) {
            attempts.push(() => bytesToText(u8, format))
        }
    }
    attempts.push(async () => {
        const pako = await import('pako')
        return new TextDecoder().decode(pako.inflate(u8))
    })
    attempts.push(async () => {
        const pako = await import('pako')
        return new TextDecoder().decode(pako.inflateRaw(u8))
    })

    let lastErr = null
    for (const attempt of attempts) {
        try {
            return await attempt()
        } catch (err) {
            lastErr = err
        }
    }
    throw lastErr || new Error('Unable to decode the MIFOTRA feed.')
}

function bytesFromByteMap(map) {
    if (Array.isArray(map)) return Uint8Array.from(map.map(Number))
    const keys = Object.keys(map)
    keys.sort((a, b) => (Number(a) - Number(b)) || a.localeCompare(b))
    return Uint8Array.from(keys.map(k => Number(map[k]) & 0xff))
}

async function decodeMifotraPayload(payload) {
    if (!payload || !payload._data_) return payload
    const bytes = bytesFromByteMap(payload._data_)
    const text = await inflateToText(bytes)
    const decoded = JSON.parse(text)
    return decoded && decoded._data_ ? await decodeMifotraPayload(decoded) : decoded
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

/**
 * A vacancy is expired once its closing date/time has passed.
 * Closing dates are end-of-day timestamps from MIFOTRA, so we treat the
 * whole closing day as still open and drop the job the moment it's over.
 */
export function isMifotraJobExpired(job) {
    if (!job || !job.closingDate) return false
    const close = new Date(job.closingDate).getTime()
    if (Number.isNaN(close)) return false
    const endOfClosingDay = new Date(close)
    endOfClosingDay.setHours(23, 59, 59, 999)
    return Date.now() > endOfClosingDay.getTime()
}

function dropExpired(jobs) {
    return (Array.isArray(jobs) ? jobs : []).filter(job => !isMifotraJobExpired(job))
}

function readCache() {
    try {
        const raw = localStorage.getItem(CACHE_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw)
        if (!parsed || !Array.isArray(parsed.jobs)) return null
        const jobs = dropExpired(parsed.jobs)
        if (!jobs.length) {
            localStorage.removeItem(CACHE_KEY)
            return null
        }
        return { ...parsed, jobs }
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
    return dropExpired(
        list
            .map(normalizeMifotraJob)
            .filter(job => job.id && job.title)
    ).sort((a, b) => new Date(b.openingDate || 0) - new Date(a.openingDate || 0))
}

/**
 * Fetch MIFOTRA vacancies (client-only, no server/Blaze plan required).
 * 1. Fresh localStorage cache (unless force)
 * 2. Live requests with timeout + retries (the portal intermittently 502s/stalls)
 * 3. Stale localStorage cache, then the optional Firestore cache
 *    (`settings/mifotra_jobs`) — only present if the admin sync ran.
 */
function firstSuccess(promises) {
    return new Promise((resolve, reject) => {
        let remaining = promises.length
        let lastErr = null
        promises.forEach(p => {
            Promise.resolve(p).then(resolve).catch(err => {
                lastErr = err
                remaining -= 1
                if (remaining === 0) {
                    reject(lastErr && lastErr.name === 'AbortError'
                        ? new Error('The MIFOTRA portal is taking too long to respond. Please try again.')
                        : (lastErr || new Error('Unable to reach the MIFOTRA portal.')))
                }
            })
        })
    })
}

async function fetchOnce({ bust = false, delay = 0 } = {}) {
    if (delay) await new Promise(r => setTimeout(r, delay))

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), LIVE_TIMEOUT_MS)
    try {
        const url = bust ? `${MIFOTRA_API_URL}?_=${Date.now()}` : MIFOTRA_API_URL
        const res = await fetch(url, {
            headers: { Accept: 'application/json' },
            cache: 'reload',
            signal: controller.signal
        })
        if (!res.ok) throw new Error(`MIFOTRA responded ${res.status}`)

        const buffer = await res.arrayBuffer()
        let payload
        try {
            payload = JSON.parse(new TextDecoder().decode(buffer))
        } catch {
            payload = JSON.parse(await inflateToText(buffer))
        }
        payload = await decodeMifotraPayload(payload)

        if (!Array.isArray(payload)) throw new Error('MIFOTRA returned an unexpected response')
        return normalizeList(payload)
    } finally {
        clearTimeout(timer)
    }
}

async function fetchLiveJobs() {
    return firstSuccess([
        fetchOnce(),
        fetchOnce({ bust: true }),
        fetchOnce({ bust: true, delay: LIVE_DELAY_MS })
    ])
}

export async function fetchMifotraJobs({ force = false } = {}) {
    const cached = readCache()
    if (!force && cached && Date.now() - new Date(cached.fetched_at).getTime() < CACHE_TTL_MS) {
        return { jobs: cached.jobs, source: 'cache', fetched_at: cached.fetched_at }
    }

    try {
        const jobs = await fetchLiveJobs()
        writeCache(jobs)
        return { jobs, source: 'live', fetched_at: new Date().toISOString() }
    } catch (liveErr) {
        if (cached?.jobs?.length) {
            return { jobs: cached.jobs, source: 'stale-cache', fetched_at: cached.fetched_at }
        }
        const serverJobs = await fetchMifotraJobsFromFirestore()
        if (serverJobs?.jobs?.length) {
            return { jobs: serverJobs.jobs, source: 'server-cache', fetched_at: serverJobs.fetched_at }
        }
        throw liveErr
    }
}

/** Optional server-side cache (written when the Cloud Function is deployed). */
export async function fetchMifotraJobsFromFirestore() {
    if (!db) return null
    try {
        const snap = await getDoc(doc(db, 'settings', 'mifotra_jobs'))
        if (!snap.exists()) return null
        const data = snap.data()
        const jobs = dropExpired(data.jobs)
        if (!jobs.length) return null
        return { ...data, jobs, fetched_at: data.updated_at || null }
    } catch {
        return null
    }
}
