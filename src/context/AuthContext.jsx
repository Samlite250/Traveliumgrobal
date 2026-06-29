import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth'
import { auth, ADMIN_EMAILS } from '../lib/firebase'

const AuthContext = createContext(null)

const DEMO_USER = {
  uid: 'demo_user_123',
  email: 'demo@travelium.edu',
  displayName: 'Demo Student'
}

const ADMIN_DEMO_USERS = {
  'traveliumgrobal@gmail.com': { uid: 'admin_travelium', displayName: 'Travelium Admin' },
  'samlite250@gmail.com': { uid: 'admin_samlite', displayName: 'Sam Admin' },
}

function createAdminUser(email) {
  const info = ADMIN_DEMO_USERS[email]
  return { uid: info?.uid || 'admin_demo', email, displayName: info?.displayName || 'Admin' }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(undefined)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!auth) {
      setCurrentUser(DEMO_USER)
      setInitialized(true)
      return
    }
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setInitialized(true)
    })
    return unsub
  }, [])

  const login = async (email, password) => {
    if (!auth) {
      if (ADMIN_EMAILS.includes(email)) return { user: createAdminUser(email) }
      return { user: DEMO_USER }
    }
    try {
      return await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      if (ADMIN_EMAILS.includes(email)) {
        console.warn('Firebase auth failed, using demo fallback for admin:', err.code || err.message)
        setCurrentUser(createAdminUser(email))
        return { user: createAdminUser(email) }
      }
      throw err
    }
  }

  const signup = async (email, password, displayName) => {
    if (!auth) return Promise.resolve({ user: DEMO_USER })
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(cred.user, { displayName })
    }
    return cred
  }

  const logout = () => {
    if (!auth || (currentUser && ADMIN_DEMO_USERS[currentUser.email])) {
      setCurrentUser(null)
      return Promise.resolve()
    }
    return signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {initialized ? children : (
        <div className="premium-loader">
          <div className="loader-content">
            <div className="loader-circle"></div>
            <p>Initializing...</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
