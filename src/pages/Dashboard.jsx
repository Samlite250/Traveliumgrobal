import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import {
    LayoutDashboard, PlusCircle, LogOut, ClipboardList,
    CheckCircle, AlertCircle, Loader2, ArrowRight, User,
    FileText, Clock, ShieldCheck, HelpCircle, ChevronRight,
    Settings, Search, Filter, TrendingUp, XCircle, CreditCard, DollarSign,
    MessageSquare, Eye, X, Phone, Mail, Sparkles, RefreshCw
} from 'lucide-react'

const statusInfo = {
    pending: {
        class: 'status-pending',
        icon: <Clock size={16} />,
        label: 'Pending Review',
        step: 1,
        description: 'Your application is waiting for initial review by our admissions team.'
    },
    processing: {
        class: 'status-processing',
        icon: <Loader2 size={16} className="animate-spin" />,
        label: 'Processing',
        step: 2,
        description: 'Our team is actively processing your documents with the relevant authorities.'
    },
    approved: {
        class: 'status-approved',
        icon: <ShieldCheck size={16} />,
        label: 'Approved',
        step: 4,
        description: 'Congratulations! Your application has been approved. Check your email for next steps.'
    },
    rejected: {
        class: 'status-rejected',
        icon: <AlertCircle size={16} />,
        label: 'Not Approved',
        step: 4,
        description: 'Unfortunately, your application was not approved at this time. Contact support for details.'
    }
}

export default function Dashboard() {
    const { currentUser, logout } = useAuth()
    const toast = useToast()
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [selectedApp, setSelectedApp] = useState(null)

    // User Profile State
    const [profileName, setProfileName] = useState(() => {
        return localStorage.getItem('travelium_user_name') || currentUser?.displayName || currentUser?.email?.split('@')[0] || ''
    })
    const [profilePhone, setProfilePhone] = useState(() => {
        return localStorage.getItem('travelium_user_phone') || '+250 780 000 000'
    })
    const [profileSaved, setProfileSaved] = useState(false)
    const navigate = useNavigate()

    // 1. REAL-TIME SYNCHRONIZATION FUNCTION
    const loadLocalUserApps = () => {
        try {
            const adminApps = JSON.parse(localStorage.getItem('travelium_applications_admin') || '[]')
            const userApps = adminApps.filter(a =>
                (currentUser?.uid && a.user_id === currentUser.uid) ||
                (currentUser?.email && (a.email?.toLowerCase() === currentUser.email.toLowerCase() || a.user_email?.toLowerCase() === currentUser.email.toLowerCase()))
            )
            if (userApps.length) {
                setApplications(userApps)
            }
        } catch { }
    }

    useEffect(() => {
        if (!currentUser) return

        let unsubFirestore = null

        // Firestore Realtime Listener
        if (db) {
            try {
                const q = query(
                    collection(db, 'applications'),
                    where('user_id', '==', currentUser.uid)
                )
                unsubFirestore = onSnapshot(q, (snap) => {
                    const apps = snap.docs.map(d => ({ id: d.id, ...d.data() }))
                    apps.sort((a, b) => {
                        const ta = a.created_at?.toMillis?.() || a.created_at?.seconds || 0
                        const tb = b.created_at?.toMillis?.() || b.created_at?.seconds || 0
                        return tb - ta
                    })
                    setApplications(apps)
                    setLoading(false)
                }, (err) => {
                    console.warn("Firestore realtime sync notice, loading local admin apps:", err)
                    loadLocalUserApps()
                    setLoading(false)
                })
            } catch (err) {
                loadLocalUserApps()
                setLoading(false)
            }
        } else {
            loadLocalUserApps()
            setLoading(false)
        }

        // Multi-tab BroadcastChannel + Storage Event Listener for Immediate Admin Sync
        const handleSyncEvent = () => {
            loadLocalUserApps()
        }

        window.addEventListener('storage', handleSyncEvent)
        window.addEventListener('travelium_sync_updated', handleSyncEvent)

        let bc = null
        if (window.BroadcastChannel) {
            bc = new BroadcastChannel('travelium_admin_sync')
            bc.onmessage = (e) => {
                if (e.data?.type === 'DATA_UPDATED' && e.data?.key === 'applications') {
                    loadLocalUserApps()
                    if (toast) toast('Your application status has been updated by admissions!', 'info')
                }
            }
        }

        return () => {
            if (unsubFirestore) unsubFirestore()
            window.removeEventListener('storage', handleSyncEvent)
            window.removeEventListener('travelium_sync_updated', handleSyncEvent)
            if (bc) bc.close()
        }
    }, [currentUser])

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/')
        } catch (err) {
            console.error("Logout error:", err)
        }
    }

    const saveProfileSettings = () => {
        try {
            localStorage.setItem('travelium_user_name', profileName)
            localStorage.setItem('travelium_user_phone', profilePhone)
            setProfileSaved(true)
            if (toast) toast('Profile settings saved successfully!', 'success')
            setTimeout(() => setProfileSaved(false), 3000)
        } catch {
            if (toast) toast('Failed to save settings locally.', 'error')
        }
    }

    const pendingCount = applications.filter(a => a.status === 'pending' || a.status === 'processing').length
    const approvedCount = applications.filter(a => a.status === 'approved').length
    const rejectedCount = applications.filter(a => a.status === 'rejected').length

    const filteredApps = applications.filter(a => {
        const matchesSearch = (a.destination || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (a.program_type || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || a.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const recentApps = applications.slice(0, 4)

    const renderTableContent = (data) => (
        <div className="premium-table-wrap">
            <table className="premium-table">
                <thead>
                    <tr>
                        <th>Service & Destination</th>
                        <th>Status</th>
                        <th>Progress Timeline</th>
                        <th>Submitted</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(a => {
                        const currentStep = statusInfo[a.status]?.step || 1
                        return (
                            <tr key={a.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedApp(a)}>
                                <td>
                                    <div className="service-info">
                                        <span className="service-name" style={{ fontWeight: '800', color: '#0f172a' }}>
                                            {a.program_type?.replace('_', ' ').toUpperCase() || 'APPLICATION'}
                                        </span>
                                        <span className="service-sub" style={{ color: '#475569', fontWeight: '600' }}>
                                            📍 {a.destination || 'Global'}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div className={`status-pill ${statusInfo[a.status]?.class || 'status-pending'}`}>
                                        {statusInfo[a.status]?.icon || <Clock size={16} />}
                                        <span>{statusInfo[a.status]?.label || a.status}</span>
                                    </div>
                                </td>
                                <td>
                                    {/* 4-Step Progress Indicator */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', minWidth: '160px' }}>
                                        {[1, 2, 3, 4].map(stepNum => (
                                            <div
                                                key={stepNum}
                                                style={{
                                                    flex: 1,
                                                    height: '6px',
                                                    borderRadius: '4px',
                                                    background: a.status === 'rejected' && stepNum === 4
                                                        ? '#ef4444'
                                                        : stepNum <= currentStep
                                                            ? (a.status === 'approved' ? '#10b981' : '#c8a84b')
                                                            : '#e2e8f0',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                title={`Step ${stepNum}`}
                                            />
                                        ))}
                                    </div>
                                </td>
                                <td>
                                    <span className="date-text">
                                        {a.created_at?.toDate ? a.created_at.toDate().toLocaleDateString(undefined, {
                                            year: 'numeric', month: 'short', day: 'numeric'
                                        }) : (a.created_at ? new Date(a.created_at).toLocaleDateString() : 'Recent')}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn-act pro"
                                        onClick={(e) => { e.stopPropagation(); setSelectedApp(a); }}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            padding: '0.4rem 0.75rem',
                                            borderRadius: '8px',
                                            background: '#dbeafe',
                                            color: '#1d4ed8',
                                            border: 'none',
                                            fontWeight: '700',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Eye size={14} /> View
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );

    if (loading) return (
        <div className="premium-loader">
            <div className="loader-content">
                <div className="loader-circle"></div>
                <Loader2 className="animate-spin loader-icon" size={48} />
                <h3>Securing your data...</h3>
                <p>Preparing your personalized dashboard</p>
            </div>
        </div>
    )

    return (
        <main className="dashboard-layout">
            {/* Sidebar Navigation */}
            <aside className="dash-sidebar">
                <div className="sidebar-brand">
                    <div className="sidebar-logo">T</div>
                    <div className="sidebar-brand-text">
                        <span>Travelium</span>
                        <small>Portal</small>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <LayoutDashboard size={20} />
                        <span>Overview</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'applications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('applications')}
                    >
                        <ClipboardList size={20} />
                        <span>My Applications</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <Settings size={20} />
                        <span>Settings</span>
                    </button>
                    <Link to="/apply" className="nav-item dash-new-app-link">
                        <PlusCircle size={20} />
                        <span>New Application</span>
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-pill-large">
                        <div className="avatar-initials">
                            {profileName ? profileName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="user-details">
                            <span className="user-name">{profileName || 'Traveler'}</span>
                            <span className="user-role">Applicant Account</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="dash-main">
                <header className="dash-top-bar">
                    <div className="welcome-message">
                        <h1>Welcome back, {profileName.split(' ')[0] || 'Traveler'}</h1>
                        <p>Track your global education, visa, and job journey live.</p>
                    </div>
                    <div className="dash-actions-top">
                        <Link to="/contact" className="help-link">
                            <HelpCircle size={20} />
                            <span>Help Center</span>
                        </Link>
                        <Link to="/apply" className="btn-premium-sm">
                            <PlusCircle size={16} />
                            <span>Apply Now</span>
                        </Link>
                    </div>
                </header>

                <div className="dash-scroll-content">
                    {activeTab === 'overview' && (
                        <>
                            {/* Stats Row — 4 cards */}
                            <div className="dash-stats-grid">
                                {/* Card 1 — Total */}
                                <div className="premium-stat-card navy" style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                                    <div className="stat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className="stat-label" style={{ color: '#475569', fontWeight: '800', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Applications</span>
                                        <div className="stat-icon-wrap" style={{ background: '#e0e7ff', color: '#3730a3', padding: '0.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ClipboardList size={20} />
                                        </div>
                                    </div>
                                    <div className="stat-content" style={{ marginTop: '0.75rem' }}>
                                        <span className="stat-value" style={{ color: '#0f172a', fontWeight: '900', fontSize: '2rem', display: 'block', lineHeight: '1' }}>{applications.length}</span>
                                        <span className="stat-trend neutral" style={{ color: '#475569', fontWeight: '700', fontSize: '0.8rem', marginTop: '0.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <TrendingUp size={14} /> All time
                                        </span>
                                    </div>
                                    <div className="stat-bar" style={{ width: '100%', height: '4px', background: '#3730a3', borderRadius: '2px', marginTop: '0.75rem' }}></div>
                                </div>

                                {/* Card 2 — In Progress */}
                                <div className="premium-stat-card gold" style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                                    <div className="stat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className="stat-label" style={{ color: '#475569', fontWeight: '800', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>In Progress</span>
                                        <div className="stat-icon-wrap" style={{ background: '#fef3c7', color: '#b45309', padding: '0.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Clock size={20} />
                                        </div>
                                    </div>
                                    <div className="stat-content" style={{ marginTop: '0.75rem' }}>
                                        <span className="stat-value" style={{ color: '#0f172a', fontWeight: '900', fontSize: '2rem', display: 'block', lineHeight: '1' }}>{pendingCount}</span>
                                        <span className="stat-trend pending" style={{ color: '#b45309', fontWeight: '700', fontSize: '0.8rem', marginTop: '0.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Clock size={14} /> Live tracking
                                        </span>
                                    </div>
                                    <div className="stat-bar" style={{ width: applications.length ? `${(pendingCount / applications.length) * 100}%` : '0%', height: '4px', background: '#b45309', borderRadius: '2px', marginTop: '0.75rem' }}></div>
                                </div>

                                {/* Card 3 — Approved */}
                                <div className="premium-stat-card success" style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                                    <div className="stat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className="stat-label" style={{ color: '#475569', fontWeight: '800', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Approved</span>
                                        <div className="stat-icon-wrap" style={{ background: '#d1fae5', color: '#047857', padding: '0.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ShieldCheck size={20} />
                                        </div>
                                    </div>
                                    <div className="stat-content" style={{ marginTop: '0.75rem' }}>
                                        <span className="stat-value" style={{ color: '#0f172a', fontWeight: '900', fontSize: '2rem', display: 'block', lineHeight: '1' }}>{approvedCount}</span>
                                        <span className="stat-trend success" style={{ color: '#047857', fontWeight: '700', fontSize: '0.8rem', marginTop: '0.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <CheckCircle size={14} />
                                            {applications.length ? `${Math.round((approvedCount / applications.length) * 100)}% rate` : 'Ready'}
                                        </span>
                                    </div>
                                    <div className="stat-bar" style={{ width: applications.length ? `${(approvedCount / applications.length) * 100}%` : '0%', height: '4px', background: '#047857', borderRadius: '2px', marginTop: '0.75rem' }}></div>
                                </div>

                                {/* Card 4 — Rejected */}
                                <div className="premium-stat-card rejected" style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                                    <div className="stat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className="stat-label" style={{ color: '#475569', fontWeight: '800', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Action Needed</span>
                                        <div className="stat-icon-wrap" style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <XCircle size={20} />
                                        </div>
                                    </div>
                                    <div className="stat-content" style={{ marginTop: '0.75rem' }}>
                                        <span className="stat-value" style={{ color: '#0f172a', fontWeight: '900', fontSize: '2rem', display: 'block', lineHeight: '1' }}>{rejectedCount}</span>
                                        <span className="stat-trend danger" style={{ color: '#b91c1c', fontWeight: '700', fontSize: '0.8rem', marginTop: '0.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <AlertCircle size={14} />
                                            {rejectedCount > 0 ? 'Review notes' : 'All clear'}
                                        </span>
                                    </div>
                                    <div className="stat-bar" style={{ width: applications.length ? `${(rejectedCount / applications.length) * 100}%` : '0%', height: '4px', background: '#b91c1c', borderRadius: '2px', marginTop: '0.75rem' }}></div>
                                </div>
                            </div>

                            {/* Recent Applications Preview */}
                            <div className="dash-content-card">
                                <div className="card-header">
                                    <div className="card-title-group">
                                        <ClipboardList size={20} className="title-icon" style={{ color: '#c8a84b' }} />
                                        <div>
                                            <h3 style={{ margin: 0, fontWeight: '800', color: '#0f172a' }}>Live Applications</h3>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Real-time updates from Travelium admissions officers</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveTab('applications')} className="text-btn" style={{ fontWeight: '700', color: '#1d4ed8' }}>
                                        View All ({applications.length}) <ChevronRight size={16} />
                                    </button>
                                </div>
                                {recentApps.length === 0 ? (
                                    <div className="empty-dashboard-state" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                                        <div className="empty-box-icon" style={{ display: 'inline-flex', padding: '1.5rem', background: '#f1f5f9', borderRadius: '50%', color: '#94a3b8', marginBottom: '1rem' }}>
                                            <ClipboardList size={40} />
                                        </div>
                                        <h3 style={{ fontWeight: '800', color: '#0f172a' }}>No applications yet</h3>
                                        <p style={{ color: '#64748b' }}>Submit an application for Study Abroad, Visas, or Overseas Jobs.</p>
                                        <Link to="/apply" className="btn btn-primary" style={{ marginTop: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#1e2338', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '10px', textDecoration: 'none', fontWeight: '700' }}>
                                            Start New Application <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                ) : renderTableContent(recentApps)}
                            </div>
                        </>
                    )}

                    {activeTab === 'applications' && (
                        <div className="dash-content-card">
                            <div className="card-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '1.5rem' }}>
                                <div className="card-title-group">
                                    <ClipboardList size={20} className="title-icon" style={{ color: '#c8a84b' }} />
                                    <div>
                                        <h3 style={{ margin: 0, fontWeight: '800', color: '#0f172a' }}>All Applications</h3>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Comprehensive live progress of your requests</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1.5px solid #94a3b8', padding: '0.6rem 1rem', borderRadius: '10px', flex: 1, minWidth: '250px' }}>
                                        <Search size={18} color="#64748b" />
                                        <input
                                            type="text"
                                            placeholder="Search destination or program..."
                                            style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '0.6rem', width: '100%', fontSize: '0.9rem', color: '#0f172a', fontWeight: '600' }}
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <select
                                        style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: '1.5px solid #94a3b8', outline: 'none', background: '#ffffff', fontSize: '0.9rem', color: '#0f172a', fontWeight: '700', minWidth: '160px' }}
                                        value={filterStatus}
                                        onChange={e => setFilterStatus(e.target.value)}
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="pending">Pending Review</option>
                                        <option value="processing">Processing</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Not Approved</option>
                                    </select>
                                </div>
                            </div>

                            {filteredApps.length === 0 ? (
                                <div className="empty-dashboard-state" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                                    <h3 style={{ color: '#0f172a', fontWeight: '700' }}>No matching applications found</h3>
                                    <p style={{ color: '#64748b' }}>Try adjusting your search query or filter.</p>
                                </div>
                            ) : renderTableContent(filteredApps)}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="dash-content-card" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <Settings size={32} color="#c8a84b" />
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', color: '#0f172a', margin: 0, fontWeight: '800' }}>Account Settings</h3>
                                    <p style={{ color: '#64748b', margin: '0.2rem 0 0' }}>Update your profile details to ensure accurate visa and admission processing.</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>Full Name</label>
                                    <input
                                        type="text"
                                        value={profileName}
                                        onChange={e => setProfileName(e.target.value)}
                                        style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', border: '1.5px solid #94a3b8', background: '#ffffff', color: '#0f172a', fontSize: '0.95rem', fontWeight: '700' }}
                                    />
                                    <small style={{ color: '#64748b', marginTop: '0.4rem', display: 'block' }}>Official full name matching your international passport.</small>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>Email Address</label>
                                    <input
                                        type="email"
                                        value={currentUser?.email || ''}
                                        readOnly
                                        style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', background: '#f8fafc', color: '#475569', fontSize: '0.95rem', fontWeight: '600' }}
                                    />
                                    <small style={{ color: '#64748b', marginTop: '0.4rem', display: 'block' }}>Primary email address used for login and official updates.</small>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>WhatsApp / Phone Number</label>
                                    <input
                                        type="text"
                                        value={profilePhone}
                                        onChange={e => setProfilePhone(e.target.value)}
                                        style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', border: '1.5px solid #94a3b8', background: '#ffffff', color: '#0f172a', fontSize: '0.95rem', fontWeight: '700' }}
                                    />
                                    <small style={{ color: '#64748b', marginTop: '0.4rem', display: 'block' }}>Used by our admissions desk to reach you directly.</small>
                                </div>
                                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <button className="btn-premium-sm" onClick={saveProfileSettings} style={{ background: '#1e2338', color: '#ffffff', border: 'none', padding: '0.8rem 1.75rem', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>
                                        Save Profile Changes
                                    </button>
                                    {profileSaved && <span style={{ color: '#10b981', fontWeight: '700', fontSize: '0.9rem' }}>✓ Saved!</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Support Panel */}
                    {activeTab === 'overview' && (
                        <div className="dash-footer-promo" style={{ background: 'linear-gradient(135deg, #1e2338 0%, #0f172a 100%)', borderRadius: '16px', padding: '2rem', color: '#fff', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                            <div className="promo-text">
                                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#ffffff' }}>Need assistance with your application?</h3>
                                <p style={{ margin: '0.35rem 0 0', color: '#cbd5e1', fontSize: '0.9rem' }}>Our admissions officers are on standby to review your documents.</p>
                            </div>
                            <div className="promo-actions">
                                <Link to="/contact" className="wa-btn-dash" style={{ background: '#c8a84b', color: '#0f172a', padding: '0.75rem 1.5rem', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Phone size={18} /> Contact Support
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* APPLICATION DETAIL & ADMIN FEEDBACK MODAL */}
            {selectedApp && (
                <div className="admin-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setSelectedApp(null)}>
                    <div className="admin-modal" style={{ background: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', border: '1.5px solid #cbd5e1', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }} onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header" style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>Application Details</h3>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>Reference ID: #{selectedApp.id?.slice(0, 8)}</p>
                            </div>
                            <button onClick={() => setSelectedApp(null)} style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0f172a' }}><X size={18} /></button>
                        </div>
                        <div className="admin-modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {/* Status Banner */}
                            <div style={{ padding: '1rem', borderRadius: '12px', background: selectedApp.status === 'approved' ? '#ecfdf5' : (selectedApp.status === 'rejected' ? '#fef2f2' : '#f8fafc'), border: `1.5px solid ${selectedApp.status === 'approved' ? '#6ee7b7' : (selectedApp.status === 'rejected' ? '#fca5a5' : '#cbd5e1')}`, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {statusInfo[selectedApp.status]?.icon || <Clock size={24} />}
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>Status: {statusInfo[selectedApp.status]?.label || selectedApp.status}</h4>
                                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#475569' }}>{statusInfo[selectedApp.status]?.description}</p>
                                </div>
                            </div>

                            {/* Official Admin Note / Review Feedback */}
                            {selectedApp.admin_note && (
                                <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '12px', padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b45309', fontWeight: '800', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                                        <MessageSquare size={16} /> Official Admissions Officer Note:
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#78350f', fontWeight: '600', lineHeight: '1.5' }}>"{selectedApp.admin_note}"</p>
                                </div>
                            )}

                            {/* Application Info Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <div>
                                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Program / Service</span>
                                    <p style={{ margin: '0.2rem 0 0', fontWeight: '800', color: '#0f172a' }}>{selectedApp.program_type?.replace('_', ' ').toUpperCase()}</p>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Target Destination</span>
                                    <p style={{ margin: '0.2rem 0 0', fontWeight: '800', color: '#0f172a' }}>📍 {selectedApp.destination || 'Global'}</p>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Applicant Email</span>
                                    <p style={{ margin: '0.2rem 0 0', fontWeight: '700', color: '#0f172a' }}>{selectedApp.user_email || selectedApp.email || currentUser?.email}</p>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Submitted Date</span>
                                    <p style={{ margin: '0.2rem 0 0', fontWeight: '700', color: '#0f172a' }}>
                                        {selectedApp.created_at?.toDate ? selectedApp.created_at.toDate().toLocaleDateString() : 'Recently'}
                                    </p>
                                </div>
                            </div>

                            {/* Documents Section */}
                            <div>
                                <h4 style={{ margin: '0 0 0.65rem', fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>Uploaded Documents Verification</h4>
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    {selectedApp.documents?.passport ? (
                                        <a href={selectedApp.documents.passport} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '10px', textDecoration: 'none', color: '#0f172a', fontWeight: '700', fontSize: '0.85rem' }}>
                                            <FileText size={16} color="#1d4ed8" /> Passport Copy (View)
                                        </a>
                                    ) : (
                                        <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic' }}>No Passport file uploaded</span>
                                    )}
                                    {selectedApp.documents?.diploma && (
                                        <a href={selectedApp.documents.diploma} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '10px', textDecoration: 'none', color: '#0f172a', fontWeight: '700', fontSize: '0.85rem' }}>
                                            <FileText size={16} color="#10b981" /> Academic Diploma (View)
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="admin-modal-footer" style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <Link to="/contact" className="btn btn-secondary" style={{ padding: '0.6rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', textDecoration: 'none', color: '#0f172a', fontWeight: '700', fontSize: '0.88rem' }}>
                                Contact Counselor
                            </Link>
                            <button onClick={() => setSelectedApp(null)} style={{ padding: '0.6rem 1.25rem', borderRadius: '10px', background: '#1e2338', color: '#ffffff', border: 'none', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer' }}>
                                Close Window
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
