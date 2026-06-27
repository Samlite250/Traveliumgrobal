import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import { AuthProvider, useAuth } from './context/AuthContext'
import { isAdmin } from './lib/firebase'

const Home         = lazy(() => import('./pages/Home'))
const StudyAbroad  = lazy(() => import('./pages/StudyAbroad'))
const VisaServices = lazy(() => import('./pages/VisaServices'))
const Scholarships = lazy(() => import('./pages/Scholarships'))
const About        = lazy(() => import('./pages/About'))
const Contact      = lazy(() => import('./pages/Contact'))
const Apply        = lazy(() => import('./pages/Apply'))
const Login        = lazy(() => import('./pages/Login'))
const Dashboard    = lazy(() => import('./pages/Dashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminPortal = lazy(() => import('./pages/AdminPortal'))
const Flights      = lazy(() => import('./pages/Flights'))
const BuyTicket    = lazy(() => import('./pages/BuyTicket'))

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

function AppRoutes() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<LoadingScreen />}>
                <Routes>
                    <Route path="/"              element={<Home />} />
                    <Route path="/study-abroad"  element={<StudyAbroad />} />
                    <Route path="/visa-services" element={<VisaServices />} />
                    <Route path="/scholarships"  element={<Scholarships />} />
                    <Route path="/about"         element={<About />} />
                    <Route path="/contact"       element={<Contact />} />
                    <Route path="/flights"       element={<Flights />} />
                    <Route path="/buy-ticket"    element={<BuyTicket />} />
                    <Route path="/login"         element={<Login />} />
                    <Route path="/apply" element={
                        <ProtectedRoute><Apply /></ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                        <ProtectedRoute><Dashboard /></ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                        <AdminRoute><AdminDashboard /></AdminRoute>
                    } />
                    <Route path="/admin-portal"  element={<AdminPortal />} />
                </Routes>
            </Suspense>
            <Footer />
        </>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    )
}
