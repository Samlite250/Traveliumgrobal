import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth'
import { auth } from '../lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Temporary Mock for Demo Display without real Firebase Keys
  const [currentUser, setCurrentUser] = useState({
    uid: 'demo_user_123',
    email: 'demo@travelium.edu',
    displayName: 'Demo Student'
  })

  useEffect(() => {
    // Only subscribe to auth state when Firebase is actually initialized
    if (!auth) return  // demo mode — keep the mock user above
    const unsub = onAuthStateChanged(auth, user => setCurrentUser(user ?? null))
    return unsub
  }, [])

  const login = (email, password) => Promise.resolve({ user: currentUser })
  const signup = async (email, password, displayName) => Promise.resolve({ user: currentUser })
  const logout = () => {
    setCurrentUser(null)
    return Promise.resolve()
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
