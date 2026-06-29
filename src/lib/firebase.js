import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET

// All critical env vars must be present for real Firebase mode
const HAS_REAL_CONFIG = apiKey && authDomain && projectId && storageBucket &&
  !apiKey.includes('Fake') && apiKey.length > 20

let auth, db, storage

if (HAS_REAL_CONFIG) {
  const firebaseConfig = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || undefined,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || undefined,
  }
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
  console.log('[Travelium] Firebase initialized:', projectId)
} else {
  console.warn('[Travelium] No valid Firebase config — running in demo mode. Missing:', JSON.stringify({ apiKey: !!apiKey, authDomain: !!authDomain, projectId: !!projectId, storageBucket: !!storageBucket }))
  auth = null
  db = null
  storage = null
}

export { auth, db, storage }
export const analytics = null

// Admin emails
export const ADMIN_EMAILS = ['traveliumgrobal@gmail.com', 'samlite250@gmail.com']
export const isAdmin = (user) => user && ADMIN_EMAILS.includes(user.email)
