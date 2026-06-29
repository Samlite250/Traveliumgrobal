import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY

// If no real API key is set, skip Firebase entirely to avoid 400 errors
const IS_REAL_FIREBASE = apiKey && !apiKey.includes('Fake') && apiKey.length > 20

let auth, db, storage

if (IS_REAL_FIREBASE) {
  const firebaseConfig = {
    apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
} else {
  console.warn('[Travelium] No valid Firebase config — running in demo mode.')
  auth = null
  db = null
  storage = null
}

export { auth, db, storage }
export const analytics = null

// Admin emails
export const ADMIN_EMAILS = ['traveliumgrobal@gmail.com', 'samlite250@gmail.com']
export const isAdmin = (user) => user && ADMIN_EMAILS.includes(user.email)
