import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ADMIN_EMAILS } from '../lib/firebase'

export default function AdminPortalRedirect() {
    const { currentUser, loading } = useAuth()

    if (loading) return <div className="loader-wrap"><div className="animate-spin">...</div></div>

    // If logged in as admin, go to dashboard
    if (currentUser && ADMIN_EMAILS.includes(currentUser.email)) {
        return <Navigate to="/admin" replace />
    }

    // Otherwise, go to standard login which will redirect back once they log in as admin
    return <Navigate to="/login" replace />
}
