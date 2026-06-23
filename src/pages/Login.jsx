import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Plane, CheckCircle, ArrowRight, Mail, Lock, User } from 'lucide-react'

export default function Login() {
    const [tab, setTab] = useState('login')
    const [form, setForm] = useState({ email: '', password: '', full_name: '' })
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        setStatus(null)

        if (tab === 'login') {
            const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
            if (error) setStatus({ type: 'error', msg: error.message })
            else navigate('/dashboard')
        } else {
            const { error } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: { data: { full_name: form.full_name } }
            })
            if (error) setStatus({ type: 'error', msg: error.message })
            else setStatus({ type: 'success', msg: 'Account created! Please check your email to verify.' })
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
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <div className="input-with-icon">
                                        <User size={18} />
                                        <input name="full_name" value={form.full_name} onChange={set} required placeholder="Your full name" />
                                    </div>
                                </div>
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
                                    <input type="password" name="password" value={form.password} onChange={set} required placeholder={tab === 'signup' ? 'Min. 8 characters' : 'Enter your password'} minLength={6} />
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
                                ? <>Don't have an account? <button className="text-btn" onClick={() => setTab('signup')}>Sign Up</button></>
                                : <>Already have an account? <button className="text-btn" onClick={() => setTab('login')}>Login</button></>
                            }
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
