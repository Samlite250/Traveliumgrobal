import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import {
    LayoutDashboard, PlusCircle, LogOut, ClipboardList,
    CheckCircle, AlertCircle, Loader2, ArrowRight, User, 
    FileText, Clock, ShieldCheck, HelpCircle, ChevronRight,
    Settings, Search, Filter
} from 'lucide-react'

const statusInfo = {
    pending: { 
        class: 'status-pending', 
        icon: <Clock size={16} />, 
        label: 'Pending Review',
        description: 'Your application is waiting for initial review by our admissions team.'
    },
    approved: { 
        class: 'status-approved', 
        icon: <ShieldCheck size={16} />, 
        label: 'Approved',
        description: 'Congratulations! Your application has been approved. Check your email for next steps.'
    },
    rejected: { 
        class: 'status-rejected', 
        icon: <AlertCircle size={16} />, 
        label: 'Not Approved',
        description: 'Unfortunately, your application was not approved at this time. Contact support for details.'
    },
    processing: { 
        class: 'status-processing', 
        icon: <Loader2 size={16} className="animate-spin" />, 
        label: 'Processing',
        description: 'Our team is actively processing your documents with the relevant authorities.'
    }
}

export default function Dashboard() {
    const { currentUser, logout } = useAuth()
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const navigate = useNavigate()

    useEffect(() => {
        if (!currentUser) return
        const q = query(
            collection(db, 'applications'),
            where('user_id', '==', currentUser.uid),
            orderBy('created_at', 'desc')
        )
        getDocs(q).then(snap => {
            setApplications(snap.docs.map(d => ({ id: d.id, ...d.data() })))
            setLoading(false)
        }).catch(err => {
            console.error("Dashboard data load error:", err)
            setLoading(false)
        })
    }, [currentUser])

    const handleLogout = async () => { 
        try {
            await logout()
            navigate('/') 
        } catch (err) {
            console.error("Logout error:", err)
        }
    }

    const pendingCount = applications.filter(a => a.status === 'pending' || a.status === 'processing').length
    const approvedCount = applications.filter(a => a.status === 'approved').length

    const filteredApps = applications.filter(a => {
        const matchesSearch = a.destination?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              a.program_type?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || a.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const recentApps = applications.slice(0, 3)

    const renderTableContent = (data) => (
        <div className="premium-table-wrap">
            <table className="premium-table">
                <thead>
                    <tr>
                        <th>Service & Destination</th>
                        <th>Status</th>
                        <th>Documents</th>
                        <th>Submitted</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(a => (
                        <tr key={a.id}>
                            <td>
                                <div className="service-info">
                                    <span className="service-name">{a.program_type?.replace('_', ' ')}</span>
                                    <span className="service-sub">{a.destination}</span>
                                </div>
                            </td>
                            <td>
                                <div className={`status-pill ${statusInfo[a.status]?.class || 'status-pending'}`}>
                                    {statusInfo[a.status]?.icon || <Clock size={16} />}
                                    <span>{statusInfo[a.status]?.label || a.status}</span>
                                </div>
                            </td>
                            <td>
                                <div className="doc-badges">
                                    {a.documents?.passport && (
                                        <a href={a.documents.passport} target="_blank" rel="noreferrer" className="doc-chip" title="Passport">
                                            <FileText size={14} />
                                            <span>Passport</span>
                                        </a>
                                    )}
                                    {a.documents?.diploma && (
                                        <a href={a.documents.diploma} target="_blank" rel="noreferrer" className="doc-chip" title="Diploma">
                                            <FileText size={14} />
                                            <span>Diploma</span>
                                        </a>
                                    )}
                                </div>
                            </td>
                            <td>
                                <span className="date-text">
                                    {a.created_at?.toDate ? a.created_at.toDate().toLocaleDateString(undefined, { 
                                        year: 'numeric', month: 'short', day: 'numeric' 
                                    }) : 'Recent'}
                                </span>
                            </td>
                            <td>
                                <button className="action-circle-btn">
                                    <ChevronRight size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
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
                    <Link to="/apply" className="nav-item" style={{ marginTop: 'auto', background: 'var(--gold-glass)', color: 'var(--gold-dark)'}}>
                        <PlusCircle size={20} />
                        <span>New Application</span>
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-pill-large">
                        <div className="avatar-initials">
                            {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : currentUser?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                            <span className="user-name">{currentUser?.displayName || currentUser?.email?.split('@')[0]}</span>
                            <span className="user-role">Student Account</span>
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
                        <h1>Welcome back, {currentUser?.displayName?.split(' ')[0] || currentUser?.email?.split('@')[0]}</h1>
                        <p>Track your global education and visa journey here.</p>
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
                            {/* Stats Row */}
                            <div className="dash-stats-grid">
                                <div className="premium-stat-card navy">
                                    <div className="stat-icon-wrap">
                                        <ClipboardList size={24} />
                                    </div>
                                    <div className="stat-content">
                                        <span className="stat-label">Total Submissions</span>
                                        <span className="stat-value">{applications.length}</span>
                                    </div>
                                    <div className="stat-decoration"></div>
                                </div>
                                <div className="premium-stat-card gold">
                                    <div className="stat-icon-wrap">
                                        <Clock size={24} />
                                    </div>
                                    <div className="stat-content">
                                        <span className="stat-label">In Progress</span>
                                        <span className="stat-value">{pendingCount}</span>
                                    </div>
                                    <div className="stat-decoration"></div>
                                </div>
                                <div className="premium-stat-card success">
                                    <div className="stat-icon-wrap">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div className="stat-content">
                                        <span className="stat-label">Approved</span>
                                        <span className="stat-value">{approvedCount}</span>
                                    </div>
                                    <div className="stat-decoration"></div>
                                </div>
                            </div>
        
                            {/* Recent Applications Preview */}
                            <div className="dash-content-card">
                                <div className="card-header">
                                    <div className="card-title-group">
                                        <ClipboardList size={20} className="title-icon" />
                                        <div>
                                            <h3>Recent Applications</h3>
                                            <p>A quick view of your latest requests</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveTab('applications')} className="text-btn">
                                        View All <ChevronRight size={16} />
                                    </button>
                                </div>
                                {recentApps.length === 0 ? (
                                    <div className="empty-dashboard-state">
                                        <div className="empty-box-icon">
                                            <ClipboardList size={48} />
                                        </div>
                                        <h3>No applications found</h3>
                                        <p>You haven't submitted any applications yet.</p>
                                        <Link to="/apply" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                                            Start New Application <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                ) : renderTableContent(recentApps)}
                            </div>
                        </>
                    )}

                    {activeTab === 'applications' && (
                        <div className="dash-content-card">
                            <div className="card-header" style={{flexDirection: 'column', alignItems: 'stretch', gap: '1.5rem'}}>
                                <div className="card-title-group">
                                    <ClipboardList size={20} className="title-icon" />
                                    <div>
                                        <h3>All Applications</h3>
                                        <p>Comprehensive history of your journey</p>
                                    </div>
                                </div>
                                <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                                    <div style={{display: 'flex', alignItems: 'center', background: 'var(--white)', border: '1px solid var(--gray-200)', padding: '0.6rem 1rem', borderRadius: '10px', flex: 1, minWidth: '250px'}}>
                                        <Search size={18} color="var(--gray-400)" />
                                        <input 
                                            type="text" 
                                            placeholder="Search destination or program..." 
                                            style={{border: 'none', background: 'transparent', outline: 'none', marginLeft: '0.6rem', width: '100%', fontSize: '0.9rem'}} 
                                            value={searchTerm} 
                                            onChange={e => setSearchTerm(e.target.value)} 
                                        />
                                    </div>
                                    <select 
                                        style={{padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid var(--gray-200)', outline: 'none', background: 'var(--white)', fontSize: '0.9rem', color: 'var(--gray-600)', minWidth: '160px'}} 
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
                                <div className="empty-dashboard-state">
                                    <h3>No matches found</h3>
                                    <p>Try adjusting your search criteria.</p>
                                </div>
                            ) : renderTableContent(filteredApps)}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="dash-content-card" style={{padding: '2rem'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'}}>
                                <Settings size={32} color="var(--gold-dark)" />
                                <div>
                                    <h3 style={{fontSize: '1.5rem', color: 'var(--navy)'}}>Profile & Settings</h3>
                                    <p style={{color: 'var(--gray-600)'}}>Manage your personal account details.</p>
                                </div>
                            </div>
                            
                            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px'}}>
                                <div>
                                    <label style={{display:'block', fontWeight: 'bold', color: 'var(--gray-800)', marginBottom: '0.5rem'}}>Full Name</label>
                                    <input 
                                        type="text" 
                                        value={currentUser?.displayName || 'Not Provided'} 
                                        readOnly 
                                        style={{width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--gray-200)', background: 'var(--gray-100)', color: 'var(--gray-600)', fontSize: '0.95rem'}} 
                                    />
                                    <small style={{color: 'var(--gray-400)', marginTop: '0.4rem', display: 'block'}}>Your name as it appears on official documents.</small>
                                </div>
                                <div>
                                    <label style={{display:'block', fontWeight: 'bold', color: 'var(--gray-800)', marginBottom: '0.5rem'}}>Email Address</label>
                                    <input 
                                        type="email" 
                                        value={currentUser?.email || ''} 
                                        readOnly 
                                        style={{width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--gray-200)', background: 'var(--gray-100)', color: 'var(--gray-600)', fontSize: '0.95rem'}} 
                                    />
                                    <small style={{color: 'var(--gray-400)', marginTop: '0.4rem', display: 'block'}}>This is the email used for all communications and login.</small>
                                </div>
                                <div style={{marginTop: '1rem', display: 'flex', gap: '1rem'}}>
                                    <button className="btn-premium-sm" onClick={() => alert('Profile update feature coming soon!')}>
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Support Panel (Only on Overview) */}
                    {activeTab === 'overview' && (
                        <div className="dash-footer-promo">
                            <div className="promo-text">
                                <h3>Need help with your application?</h3>
                                <p>Our expert counselors are available to guide you through every step of your journey.</p>
                            </div>
                            <div className="promo-actions">
                                <Link to="/contact" className="wa-btn-dash">
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
