const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

const ADMIN_EMAILS = ['traveliumgrobal@gmail.com', 'samlite250@gmail.com']

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
