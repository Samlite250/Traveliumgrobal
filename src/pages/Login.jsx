import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { isAdmin } from '../lib/firebase'
import { Plane, CheckCircle, ArrowRight, Mail, Lock, User, Phone, Globe } from 'lucide-react'

const COUNTRIES = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Côte d'Ivoire", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"]

export default function Login() {
    const [tab, setTab] = useState('login')
    const [form, setForm] = useState({ email: '', password: '', full_name: '', phone: '', country: '' })
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const toast = useToast()
    const { login, signup } = useAuth()

    const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        setStatus(null)
        try {
            if (tab === 'login') {
                const { user } = await login(form.email.trim(), form.password.trim())
                toast('Login successful!', 'success')
                navigate(isAdmin(user) ? '/admin' : '/dashboard')
            } else {
                await signup(form.email.trim(), form.password.trim(), form.full_name, form.phone, form.country)
                toast('Account created successfully!', 'success')
                navigate('/dashboard')
            }
        } catch (err) {
            setStatus({ type: 'error', msg: err.message })
            toast(err.message, 'error')
        }
        setLoading(false)
    }

    return (
        <main>
            <div className="auth-page">
                <div className="auth-left">
                    <div className="auth-left-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop)' }} />
                    <div className="auth-left-content">
                        <Link to="/" className="nav-logo" style={{ color: 'white', marginBottom: '2.5rem' }}>
                            <div className="logo-icon"><Plane size={24} /></div>
                            TRAVELIUM
                        </Link>
                        <h2>Your Journey to Global Success Starts Here</h2>
                        <p>Access your personalized dashboard, track your applications, and get expert guidance every step of the way.</p>
                        <ul className="auth-features">
                            <li><CheckCircle size={18} /> Track your application status in real-time</li>
                            <li><CheckCircle size={18} /> Get personalized program recommendations</li>
                            <li><CheckCircle size={18} /> Access document checklists and guides</li>
                            <li><CheckCircle size={18} /> Connect with our expert advisors</li>
                            <li><CheckCircle size={18} /> Receive scholarship alerts for your profile</li>
                        </ul>
                    </div>
                </div>

                <div className="auth-right">
                    <div className="auth-form-wrap">
                        <div className="auth-form-header">
                            <h3>{tab === 'login' ? 'Welcome Back' : 'Create Account'}</h3>
                            <p className="sub">{tab === 'login' ? 'Sign in to your Travelium account' : 'Join thousands of students achieving their dreams'}</p>
                        </div>

                        <div className="auth-tabs">
                            <button className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>Login</button>
                            <button className={`auth-tab${tab === 'signup' ? ' active' : ''}`} onClick={() => setTab('signup')}>Sign Up</button>
                        </div>

                        <form className="form-grid" onSubmit={handleSubmit}>
                            {tab === 'signup' && (
                                <>
                                    <div className="form-group">
                                        <label>Full Name *</label>
                                        <div className="input-with-icon">
                                            <User size={18} />
                                            <input name="full_name" value={form.full_name} onChange={set} required placeholder="Your full name" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number *</label>
                                        <div className="input-with-icon">
                                            <Phone size={18} />
                                            <input type="tel" name="phone" value={form.phone} onChange={set} required placeholder="e.g. +1 234 567 8900" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Country *</label>
                                        <div className="input-with-icon">
                                            <Globe size={18} />
                                            <select name="country" value={form.country} onChange={set} required style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem', WebkitAppearance: 'none', appearance: 'none', paddingLeft: '5px' }}>
                                                <option value="" disabled hidden>Select your country</option>
                                                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="form-group">
                                <label>Email Address *</label>
                                <div className="input-with-icon">
                                    <Mail size={18} />
                                    <input type="email" name="email" value={form.email} onChange={set} required placeholder="you@email.com" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Password *</label>
                                <div className="input-with-icon">
                                    <Lock size={18} />
                                    <input type="password" name="password" value={form.password} onChange={set} required placeholder={tab === 'signup' ? 'Min. 6 characters' : 'Enter your password'} minLength={6} />
                                </div>
                            </div>
                            {tab === 'login' && (
                                <div style={{ textAlign: 'right', marginTop: '-.5rem' }}>
                                    <a href="#" style={{ fontSize: '.8rem', color: 'var(--navy)', fontWeight: 600 }}>Forgot password?</a>
                                </div>
                            )}
                            <button type="submit" className="form-submit" disabled={loading} style={{ marginTop: '.5rem' }}>
                                {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
                                {!loading && <ArrowRight size={18} style={{ marginLeft: '.5rem' }} />}
                            </button>
                            {status && (
                                <div className={`form-msg ${status.type}`}>
                                    {status.type === 'success' && <CheckCircle size={16} style={{ marginRight: '.5rem' }} />}
                                    {status.msg}
                                </div>
                            )}
                        </form>

                        <p className="auth-link">
                            {tab === 'login'
                                ? <> Don't have an account? <button className="text-btn" onClick={() => setTab('signup')}>Sign Up</button></>
                                : <> Already have an account? <button className="text-btn" onClick={() => setTab('login')}>Login</button></>
                            }
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
