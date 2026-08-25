import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { isAdmin } from './lib/firebase'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'

// Resilient lazy import wrapper that auto-reloads the page if a Vite dynamic chunk fail to load (404 on deployment update)
function safeLazy(importFn) {
    return lazy(() =>
        importFn().catch((err) => {
            console.warn('Dynamic chunk import failed (deployment update detected). Reloading...', err)
            const key = 'chunk_reload_attempts'
            const reloads = parseInt(sessionStorage.getItem(key) || '0', 10)
            if (reloads < 2) {
                sessionStorage.setItem(key, String(reloads + 1))
                window.location.reload()
            }
            throw err
        })
    )
}

const Home = safeLazy(() => import('./pages/Home'))
const StudyAbroad = safeLazy(() => import('./pages/StudyAbroad'))
const VisaServices = safeLazy(() => import('./pages/VisaServices'))
const Scholarships = safeLazy(() => import('./pages/Scholarships'))
const About = safeLazy(() => import('./pages/About'))
const Contact = safeLazy(() => import('./pages/Contact'))
const Apply = safeLazy(() => import('./pages/Apply'))
const Login = safeLazy(() => import('./pages/Login'))
const Dashboard = safeLazy(() => import('./pages/Dashboard'))
const Flights = safeLazy(() => import('./pages/Flights'))
const BuyTicket = safeLazy(() => import('./pages/BuyTicket'))
const Jobs = safeLazy(() => import('./pages/Jobs'))

function ProtectedRoute({ children }) {
    const { currentUser } = useAuth()
    if (currentUser === undefined) return <LoadingScreen />
    if (!currentUser) return <Navigate to="/login" replace />
    return children
}

function AdminRoute({ children }) {
    const { currentUser } = useAuth()
    if (currentUser === undefined) return <LoadingScreen />
    if (!currentUser || !isAdmin(currentUser)) return <Navigate to="/" replace />
    return children
}

function AppLayout() {
    const location = useLocation()
    const adminPaths = ['/admin', '/admin-login', '/admi-login']
    const isAdminPath = adminPaths.some(p => location.pathname === p || location.pathname.startsWith('/admin'))

    // Automatic Scroll To Top on route change or handle hash anchors
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '')
            const el = document.getElementById(id)
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                return
            }
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }, [location.pathname, location.search, location.hash])

    // Global scroll-reveal observer — adds .visible to all .reveal elements on scroll
    useEffect(() => {
        const timer = setTimeout(() => {
            const els = document.querySelectorAll('.reveal')
            if (!els.length) return
            const observer = new IntersectionObserver(
                (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }),
                { threshold: 0.1 }
            )
            els.forEach(el => observer.observe(el))
            return () => observer.disconnect()
        }, 100) // small delay lets React finish rendering
        return () => clearTimeout(timer)
    }, [location.pathname])

    return (
        <>
            {!isAdminPath && <Navbar />}
            <Suspense fallback={<LoadingScreen />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/study-abroad" element={<StudyAbroad />} />
                    <Route path="/visa-services" element={<VisaServices />} />
                    <Route path="/scholarships" element={<Scholarships />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/flights" element={<Flights />} />
                    <Route path="/buy-ticket" element={<BuyTicket />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/apply" element={
                        <ProtectedRoute><Apply /></ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                        <ProtectedRoute><Dashboard /></ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                        <AdminRoute><AdminDashboard /></AdminRoute>
                    } />
                    <Route path="/admi-login" element={<AdminLogin />} />
                    <Route path="/admin-login" element={<Navigate to="/admi-login" replace />} />
                </Routes>
            </Suspense>
            {!isAdminPath && <Footer />}
        </>
    )
}

export default function App() {
    return (
        <BrowserRouter future={{ v7_relativeSplatPath: true }}>
            <AuthProvider>
                <ToastProvider>
                    <AppLayout />
                </ToastProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}
