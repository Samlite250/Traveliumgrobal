import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'

const Home = lazy(() => import('./pages/Home'))
const StudyAbroad = lazy(() => import('./pages/StudyAbroad'))
const VisaServices = lazy(() => import('./pages/VisaServices'))
const Scholarships = lazy(() => import('./pages/Scholarships'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Apply = lazy(() => import('./pages/Apply'))
const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Flights = lazy(() => import('./pages/Flights'))
const BuyTicket = lazy(() => import('./pages/BuyTicket'))

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Suspense fallback={<LoadingScreen />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/study-abroad" element={<StudyAbroad />} />
                    <Route path="/visa-services" element={<VisaServices />} />
                    <Route path="/scholarships" element={<Scholarships />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/apply" element={<Apply />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/flights" element={<Flights />} />
                    <Route path="/buy-ticket" element={<BuyTicket />} />
                </Routes>
            </Suspense>
            <Footer />
        </BrowserRouter>
    )
}
