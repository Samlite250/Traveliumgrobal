import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ADMIN_EMAILS } from '../lib/firebase'
import { ShieldCheck, Mail, Lock, ArrowRight, Home } from 'lucide-react'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    
    const { login, currentUser } = useAuth()
    const navigate = useNavigate()

    // If already logged in as admin, go to admin dashboard
    useEffect(() => {
        if (currentUser && ADMIN_EMAILS.includes(currentUser.email)) {
            navigate('/admin')
        }
    }, [currentUser, navigate])

    async function handleSubmit(e) {
        e.preventDefault()
        
        if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
        if (!ADMIN_EMAILS.includes(email.trim().toLowerCase())) {
            return setError('Access Denied: This portal is for authorized administrative personnel only.')
        }

        try {
            setError('')
            setLoading(true)
            await login(email.trim(), password.trim())
            navigate('/admin')
        } catch (err) {
            setError('Login failed. Please check your credentials.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="admin-login-page">
            <div className="admin-login-container">
                <div className="admin-login-card glass">
                    <div className="admin-login-header">
                        <div className="admin-badge-icon">
                            <ShieldCheck size={32} />
                        </div>
                        <h1>Staff Portal</h1>
                        <p>Authorized Access Only</p>
                    </div>

                    {error && <div className="status-alert error">{error}</div>}

                    <form onSubmit={handleSubmit} className="admin-login-form">
                        <div className="input-group">
                            <label>Admin Email</label>
                            <div className="input-field">
                                <Mail size={18} className="field-icon" />
                                <input 
                                    type="email" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@travelium.com"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Security Password</label>
                            <div className="input-field">
                                <Lock size={18} className="field-icon" />
                                <input 
                                    type="password" 
                                    required 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button disabled={loading} type="submit" className="admin-submit-btn">
                            {loading ? 'Authenticating...' : 'Secure Login'}
                            <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className="admin-login-footer">
                        <button onClick={() => navigate('/')} className="back-home-btn">
                            <Home size={16} />
                            Return to Public Site
                        </button>
                    </div>
                </div>
                
                <div className="admin-login-bg-overlay" />
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .admin-login-page {
                    min-height: 100vh;
                    display: grid;
                    place-items: center;
                    background: #0f172a;
                    position: relative;
                    overflow: hidden;
                    font-family: 'Inter', system-ui, sans-serif;
                }
                .admin-login-container {
                    width: 100%;
                    max-width: 440px;
                    padding: 2rem;
                    position: relative;
                    z-index: 10;
                }
                .admin-login-card {
                    background: rgba(30, 41, 59, 0.7);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 3rem 2.5rem;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
                .admin-login-header {
                    text-align: center;
                    margin-bottom: 2.5rem;
                }
                .admin-badge-icon {
                    width: 64px;
                    height: 64px;
                    background: linear-gradient(135deg, #fbbf24, #d97706);
                    border-radius: 16px;
                    display: grid;
                    place-items: center;
                    color: #fff;
                    margin: 0 auto 1.5rem;
                    box-shadow: 0 10px 20px -5px rgba(217, 119, 6, 0.4);
                }
                .admin-login-header h1 {
                    color: #fff;
                    font-size: 1.75rem;
                    font-weight: 800;
                    margin-bottom: 0.5rem;
                    letter-spacing: -0.02em;
                }
                .admin-login-header p {
                    color: #94a3b8;
                    font-size: 0.95rem;
                    font-weight: 500;
                }
                .admin-login-form .input-group {
                    margin-bottom: 1.5rem;
                }
                .admin-login-form label {
                    display: block;
                    color: #94a3b8;
                    font-size: 0.8rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.6rem;
                }
                .admin-login-form .input-field {
                    position: relative;
                    background: rgba(15, 23, 42, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    transition: all 0.2s;
                }
                .admin-login-form .input-field:focus-within {
                    border-color: #fbbf24;
                    box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.1);
                }
                .admin-login-form .field-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #64748b;
                }
                .admin-login-form input {
                    width: 100%;
                    padding: 0.85rem 1rem 0.85rem 2.75rem;
                    background: transparent;
                    border: none;
                    color: #fff;
                    font-size: 1rem;
                    outline: none;
                }
                .admin-submit-btn {
                    width: 100%;
                    padding: 1rem;
                    background: linear-gradient(to right, #fbbf24, #f59e0b);
                    color: #000;
                    border: none;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-top: 1rem;
                }
                .admin-submit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px -5px rgba(245, 158, 11, 0.3);
                }
                .admin-submit-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }
                .admin-login-footer {
                    margin-top: 2rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    justify-content: center;
                }
                .back-home-btn {
                    background: transparent;
                    border: none;
                    color: #64748b;
                    font-size: 0.85rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .back-home-btn:hover {
                    color: #fbbf24;
                }
                .admin-login-bg-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.05), transparent 70%);
                    pointer-events: none;
                }
            `}} />
        </main>
    )
}
