import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import StudyAbroad from './pages/StudyAbroad'
import VisaServices from './pages/VisaServices'
import Scholarships from './pages/Scholarships'
import About from './pages/About'
import Contact from './pages/Contact'
import Apply from './pages/Apply'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
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
            </Routes>
            <Footer />
        </BrowserRouter>
    )
}
