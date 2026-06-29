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

    useEffect(() => {
        if (currentUser && ADMIN_EMAILS.includes(currentUser.email)) {
            navigate('/admin')
        }
    }, [currentUser, navigate])

    async function handleSubmit(e) {
        e.preventDefault()
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
            {/* Animated background blobs */}
            <div className="login-bg-blob blob-1" />
            <div className="login-bg-blob blob-2" />
            <div className="login-bg-blob blob-3" />

            <div className="admin-login-container">
                <div className="admin-login-card">
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
                                    placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
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
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .admin-login-page {
                    min-height: 100vh;
                    display: grid;
                    place-items: center;
                    background: #0a0f1e;
                    position: relative;
                    overflow: hidden;
                    font-family: 'Inter', system-ui, sans-serif;
                }

                /* Animated background blobs */
                .login-bg-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    opacity: 0.3;
                    animation: blobFloat 20s ease-in-out infinite;
                    pointer-events: none;
                }
                .blob-1 {
                    width: 600px;
                    height: 600px;
                    background: linear-gradient(135deg, #fbbf24, #d97706);
                    top: -200px;
                    right: -100px;
                    animation-delay: 0s;
                }
                .blob-2 {
                    width: 500px;
                    height: 500px;
                    background: linear-gradient(135deg, #6366f1, #4f46e5);
                    bottom: -150px;
                    left: -100px;
                    animation-delay: -7s;
                }
                .blob-3 {
                    width: 400px;
                    height: 400px;
                    background: linear-gradient(135deg, #ec4899, #db2777);
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation-delay: -14s;
                }
                @keyframes blobFloat {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -30px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }

                .admin-login-container {
                    width: 100%;
                    max-width: 440px;
                    padding: 2rem;
                    position: relative;
                    z-index: 10;
                }
                .admin-login-card {
                    background: rgba(15, 23, 42, 0.75);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 24px;
                    padding: 3rem 2.5rem;
                    box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.03) inset;
                }
                .admin-login-header {
                    text-align: center;
                    margin-bottom: 2.5rem;
                }
                .admin-badge-icon {
                    width: 68px;
                    height: 68px;
                    background: linear-gradient(135deg, #fbbf24, #d97706);
                    border-radius: 18px;
                    display: grid;
                    place-items: center;
                    color: #fff;
                    margin: 0 auto 1.5rem;
                    box-shadow: 0 12px 28px -8px rgba(217, 119, 6, 0.5);
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
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    transition: all 0.25s;
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
                    pointer-events: none;
                }
                .admin-login-form input {
                    width: 100%;
                    padding: 0.9rem 1rem 0.9rem 2.85rem;
                    background: rgba(15, 23, 42, 0.9);
                    border: none;
                    border-radius: 12px;
                    color: #fff;
                    font-size: 1rem;
                    outline: none;
                    font-family: inherit;
                }
                .admin-login-form input:-webkit-autofill,
                .admin-login-form input:-webkit-autofill:hover,
                .admin-login-form input:-webkit-autofill:focus,
                .admin-login-form input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 1000px rgba(15, 23, 42, 0.95) inset !important;
                    -webkit-text-fill-color: #fff !important;
                    transition: background-color 5000s ease-in-out 0s;
                }
                .admin-login-form input::placeholder {
                    color: #475569;
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
                    font-family: inherit;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    transition: all 0.25s;
                    margin-top: 0.5rem;
                }
                .admin-submit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 24px -8px rgba(245, 158, 11, 0.4);
                }
                .admin-submit-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                .admin-login-footer {
                    margin-top: 2rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.06);
                    display: flex;
                    justify-content: center;
                }
                .back-home-btn {
                    background: transparent;
                    border: none;
                    color: #64748b;
                    font-size: 0.85rem;
                    font-weight: 600;
                    font-family: inherit;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .back-home-btn:hover { color: #fbbf24; }

                .status-alert {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1rem;
                    border-radius: 10px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                }
                .status-alert.error {
                    background: rgba(239, 68, 68, 0.12);
                    color: #fca5a5;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }

                @media (max-width: 480px) {
                    .admin-login-card { padding: 2rem 1.5rem; border-radius: 20px; }
                    .blob-1, .blob-2, .blob-3 { width: 300px; height: 300px; }
                }
            `}} />
        </main>
    )
}
