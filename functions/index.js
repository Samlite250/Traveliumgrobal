const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

const ADMIN_EMAILS = ['support@traveliumglobal.com', 'traveliumgrobal@gmail.com', 'samlite250@gmail.com']

/**
 * Callable function: syncAuthUsers
 *
 * Lists every Firebase Authentication user and creates/updates a
 * corresponding document in the Firestore "users" collection.
 * Only callable by users whose email is in ADMIN_EMAILS.
 */
exports.syncAuthUsers = functions.https.onCall(async (_data, context) => {
  // 1. Verify caller is authenticated and is an admin
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be signed in to sync users.',
    )
  }
  const callerEmail = context.auth.token.email
  if (!callerEmail || !ADMIN_EMAILS.includes(callerEmail)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only administrators can sync users.',
    )
  }

  const db = admin.firestore()
  const auth = admin.auth()

  // 2. Fetch all existing user documents from Firestore (to skip already-synced)
  const existingSnap = await db.collection('users').get()
  const existingUids = new Set()
  existingSnap.forEach(doc => existingUids.add(doc.id))

  // 3. List all Firebase Auth users (paginated)
  let allUsers = []
  let nextPageToken
  do {
    const listResult = await auth.listUsers(1000, nextPageToken)
    allUsers = allUsers.concat(listResult.users)
    nextPageToken = listResult.pageToken
  } while (nextPageToken)

  // 4. Filter out users who already have a Firestore document
  const toCreate = allUsers.filter(u => !existingUids.has(u.uid))

  // 5. Batch-write missing user documents (max 500 per batch)
  let created = 0
  const BATCH_LIMIT = 500
  for (let i = 0; i < toCreate.length; i += BATCH_LIMIT) {
    const batch = db.batch()
    const chunk = toCreate.slice(i, i + BATCH_LIMIT)
    for (const user of chunk) {
      const docRef = db.collection('users').doc(user.uid)
      batch.set(docRef, {
        email: user.email || '',
        displayName: user.displayName || '',
        phone: user.phoneNumber || '',
        photoURL: user.photoURL || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        role: 'student',
      }, { merge: true })
    }
    await batch.commit()
    created += chunk.length
  }

  return {
    synced: created,
    totalAuthUsers: allUsers.length,
    totalFirestoreDocs: existingUids.size,
    message: `Synced ${created} new user${created !== 1 ? 's' : ''} from Firebase Auth.`,
  }
})

/**
 * Callable function: deleteAuthUser
 *
 * Deletes a user from both Firebase Authentication and the Firestore "users"
 * collection. Only callable by admin users.
 */
exports.deleteAuthUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be signed in.')
  }
  const callerEmail = context.auth.token.email
  if (!callerEmail || !ADMIN_EMAILS.includes(callerEmail)) {
    throw new functions.https.HttpsError('permission-denied', 'Only administrators can delete users.')
  }

  const uid = data.uid
  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'User UID is required.')
  }

  const db = admin.firestore()
  const auth = admin.auth()

  // Delete Firestore document
  try {
    await db.collection('users').doc(uid).delete()
  } catch (err) {
    console.error('Error deleting Firestore doc:', err)
  }

  // Delete from Firebase Auth
  try {
    await auth.deleteUser(uid)
  } catch (err) {
    if (err.code !== 'auth/user-not-found') {
      throw new functions.https.HttpsError('internal', 'Failed to delete auth user: ' + err.message)
    }
  }

  return { success: true, message: 'User deleted successfully.' }
})

// ═══════════════════════════════════════════════════════════════════════
//  AUTO-IMPORT PIPELINE wrappers — the pipeline logic lives in
//  import-lib.js so the same code runs from Cloud Functions (below, if
//  Blaze is enabled later) and from GitHub Actions (run-imports.js).
// ═══════════════════════════════════════════════════════════════════════

const { runAllImports } = require('./import-lib')

exports.scheduledImports = functions
  .runWith({ timeoutSeconds: 300, memory: '256MB' })
  .pubsub.schedule('every 24 hours')
  .timeZone('Africa/Kigali')
  .onRun(async () => {
    const summary = await runAllImports()
    console.log('scheduledImports summary:', JSON.stringify(summary))
    return null
  })

exports.runImports = functions.https.onCall(async (_data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be signed in.')
  }
  const callerEmail = context.auth.token.email
  if (!callerEmail || !ADMIN_EMAILS.includes(callerEmail)) {
    throw new functions.https.HttpsError('permission-denied', 'Only administrators can run imports.')
  }
  return runAllImports()
})


/* --------------------------------------------------------------
 * MIFOTRA Hot Jobs (Rwanda) sync
 *
 * Pulls open vacancies published by Rwanda's Ministry of Public
 * Service and Labour (MIFOTRA) and caches them in
 * Firestore at settings/mifotra_jobs, which the public Jobs page
 * reads as a fallback when the live portal is unreachable.
 * -------------------------------------------------------------- */
const zlib = require('zlib')

const MIFOTRA_API_URL = 'https://recruitment.mifotra.gov.rw/api/recruitment/open-advertisements'
const MIFOTRA_PORTAL_URL = 'https://recruitment.mifotra.gov.rw/'
const MIFOTRA_SYNC_DOC = 'settings/mifotra_jobs'
const MIN_SYNC_INTERVAL_MS = 60 * 1000

function normalizeMifotraJob(raw) {
  const closingDate = raw.closingDate || ''
  const closing = closingDate ? new Date(closingDate).getTime() : NaN
  const daysLeft = Number.isNaN(closing) ? null : Math.ceil((closing - Date.now()) / 86400000)
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
    daysLeft,
    description: String(raw.jobDescriptions || '').trim(),
    salary: (raw.levelName || raw.scaleName)
      ? `Grade ${[raw.levelName, raw.scaleName].filter(Boolean).join('.')}`
      : 'Rwanda Civil Service',
    countryName: 'Rwanda',
    flag: '\u{1F1F7}\u{1F1FC}',
    mifotra: true,
    portalUrl: MIFOTRA_PORTAL_URL,
  }
}

async function fetchMifotraJobs() {
  const res = await fetch(MIFOTRA_API_URL, {
    headers: { Accept: 'application/json', 'User-Agent': 'TraveliumGlobal/1.0 (+https://traveliumglobal.com)' },
  })
  if (!res.ok) throw new Error(`MIFOTRA responded with ${res.status}`)

  const buffer = Buffer.from(await res.arrayBuffer())
  let payload = null
  try {
    payload = JSON.parse(buffer.toString('utf8'))
  } catch (err) {
    payload = JSON.parse(zlib.inflateSync(buffer).toString('utf8'))
  }
  if (payload && payload._data_) {
    payload = JSON.parse(zlib.inflateSync(Buffer.from(Object.values(payload._data_))).toString('utf8'))
  }
  if (!Array.isArray(payload)) throw new Error('Unexpected MIFOTRA payload')

  return payload
    .map(normalizeMifotraJob)
    .filter((job) => job.id && job.title)
    .sort((a, b) => new Date(b.openingDate || 0) - new Date(a.openingDate || 0))
}

async function syncMifotraJobsToFirestore({ force = false } = {}) {
  const db = admin.firestore()
  const docRef = db.doc(MIFOTRA_SYNC_DOC)

  const existing = await docRef.get()
  const lastSync = existing.exists ? existing.data().updated_at_ms || 0 : 0
  if (!force && Date.now() - lastSync < MIN_SYNC_INTERVAL_MS) {
    return { skipped: true, count: existing.exists ? (existing.data().jobs || []).length : 0 }
  }

  const jobs = await fetchMifotraJobs()
  const updated_at_ms = Date.now()
  await docRef.set(
    {
      jobs,
      count: jobs.length,
      source: MIFOTRA_PORTAL_URL,
      updated_at_ms,
      updated_at: new Date(updated_at_ms).toISOString(),
    },
    { merge: true },
  )
  return { skipped: false, count: jobs.length }
}

/**
 * Callable: syncMifotraJobs
 * Refreshes the cached MIFOTRA vacancy list in Firestore.
 * Publicly callable (rate-limited to once a minute) so the Jobs page
 * can force a refresh when the live portal is unreachable.
 */
exports.syncMifotraJobs = functions.https.onCall(async (data) => {
  try {
    const result = await syncMifotraJobsToFirestore({ force: !!(data && data.force) })
    return { success: true, ...result, message: 'MIFOTRA vacancies synced.' }
  } catch (err) {
    console.error('syncMifotraJobs failed:', err)
    throw new functions.https.HttpsError('unavailable', 'Could not reach the MIFOTRA portal: ' + err.message)
  }
})

/**
 * Scheduled: scheduledMifotraSync
 * Keeps the MIFOTRA vacancy cache fresh every 6 hours.
 */
exports.scheduledMifotraSync = functions.pubsub
  .schedule('every 6 hours')
  .timeZone('Africa/Kigali')
  .onRun(async () => {
    try {
      const result = await syncMifotraJobsToFirestore({ force: true })
      console.log('scheduledMifotraSync:', result)
    } catch (err) {
      console.error('scheduledMifotraSync failed:', err)
    }
    return null
  })
