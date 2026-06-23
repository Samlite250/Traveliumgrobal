import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
    LayoutDashboard, PlusCircle, LogOut, ClipboardList,
    CheckCircle, AlertCircle, Loader2, ArrowRight, User
} from 'lucide-react'

const statusColor = {
    pending: 'status-pending',
    approved: 'status-approved',
    rejected: 'status-rejected',
    processing: 'status-processing'
}

export default function Dashboard() {
    const [user, setUser] = useState(null)
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) { navigate('/login'); return }
            setUser(user)
            supabase
                .from('applications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .then(({ data }) => { setApplications(data || []); setLoading(false) })
        })
    }, [navigate])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    const pending = applications.filter(a => a.status === 'pending').length
    const approved = applications.filter(a => a.status === 'approved').length

    if (loading) return (
        <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
            <div className="loader-wrap">
                <Loader2 className="animate-spin" size={40} color="var(--navy)" />
                <p style={{ marginTop: '1rem', fontWeight: 600, color: 'var(--navy)' }}>Loading Dashboard...</p>
            </div>
        </div>
    )

    return (
        <main>
            <div className="page-hero dashboard-hero">
                <div className="page-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1600&auto=format&fit=crop)' }} />
                <div className="container page-hero-content" style={{ textAlign: 'left' }}>
                    <div className="dashboard-welcome">
                        <div className="user-avatar-large">
                            <User size={32} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', marginBottom: '.25rem' }}>
                                Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                            </h1>
                            <p>Manage your applications and track your global education journey.</p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="dashboard">
                <div className="container">
                    <div className="dashboard-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                            <LayoutDashboard size={24} color="var(--navy)" />
                            <h2>Account Overview</h2>
                        </div>
                        <div className="dashboard-actions">
                            <Link to="/apply" className="btn btn-primary">
                                <PlusCircle size={18} /> New Application
                            </Link>
                            <button onClick={handleLogout} className="btn btn-outline">
                                <LogOut size={18} /> Sign Out
                            </button>
                        </div>
                    </div>

                    <div className="dashboard-stats">
                        <div className="dash-stat">
                            <div className="dash-stat-label">Total Applications</div>
                            <div className="dash-stat-value">{applications.length}</div>
                        </div>
                        <div className="dash-stat">
                            <div className="dash-stat-label">Pending Review</div>
                            <div className="dash-stat-value" style={{ color: '#d97706' }}>{pending}</div>
                        </div>
                        <div className="dash-stat">
                            <div className="dash-stat-label">Approved</div>
                            <div className="dash-stat-value" style={{ color: '#16a34a' }}>{approved}</div>
                        </div>
                    </div>

                    <div className="applications-table-wrap">
                        <div className="applications-table-head">
                            <h3><ClipboardList size={18} style={{ marginRight: '.5rem', verticalAlign: 'middle' }} /> Recent Applications</h3>
                        </div>
                        {applications.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon"><ClipboardList size={48} /></div>
                                <h3>No applications yet</h3>
                                <p>Start your journey by submitting your first application for study or visa services.</p>
                                <Link to="/apply" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                                    Apply Now <ArrowRight size={18} />
                                </Link>
                            </div>
                        ) : (
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Applicant Name</th>
                                            <th>Destination</th>
                                            <th>Service Type</th>
                                            <th>Status</th>
                                            <th>Submission Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.map(a => (
                                            <tr key={a.id}>
                                                <td style={{ fontWeight: 600 }}>{a.full_name}</td>
                                                <td>{a.destination}</td>
                                                <td style={{ textTransform: 'capitalize' }}>
                                                    {a.program_type?.replace('_', ' ')}
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${statusColor[a.status] || 'status-pending'}`}>
                                                        {a.status === 'approved' && <CheckCircle size={12} style={{ marginRight: '.3rem' }} />}
                                                        {a.status === 'rejected' && <AlertCircle size={12} style={{ marginRight: '.3rem' }} />}
                                                        {a.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(a.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}
