import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
    LayoutDashboard, Users, FileText, MessageSquare, LogOut,
    CheckCircle, AlertCircle, Loader2, X, ChevronDown,
    Menu, Search, Mail, Phone, Calendar, Clock, User,
    ExternalLink, Filter, MoreHorizontal, ArrowUpDown
} from 'lucide-react'

const statuses = ['pending', 'processing', 'approved', 'rejected']
const statusIcons = { approved: CheckCircle, rejected: AlertCircle, pending: Clock, processing: Loader2 }

const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'users', label: 'Users', icon: Users },
]

export default function Admin() {
    const [user, setUser] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [checking, setChecking] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [applications, setApplications] = useState([])
    const [contacts, setContacts] = useState([])
    const [allUsers, setAllUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('all')
    const [selectedApp, setSelectedApp] = useState(null)
    const [updating, setUpdating] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { navigate('/login'); return }
            setUser(user)
            const { data: adminCheck } = await supabase
                .from('admin_users')
                .select('email')
                .eq('email', user.email)
                .maybeSingle()
            if (!adminCheck) { navigate('/dashboard'); return }
            setIsAdmin(true)
            setChecking(false)
            fetchData()
        }
        init()
    }, [navigate])

    const fetchData = async () => {
        setLoading(true)
        const [appsRes, contactsRes, usersRes] = await Promise.all([
            supabase.from('applications').select('*').order('created_at', { ascending: false }),
            supabase.from('contacts').select('*').order('created_at', { ascending: false }),
            supabase.rpc('get_all_users'),
        ])
        if (appsRes.data) setApplications(appsRes.data)
        if (contactsRes.data) setContacts(contactsRes.data)
        if (usersRes.data) setAllUsers(usersRes.data)
        setLoading(false)
    }

    const updateStatus = async (id, newStatus) => {
        setUpdating(id)
        const { error } = await supabase.from('applications').update({ status: newStatus }).eq('id', id)
        if (!error) setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a))
        setUpdating(null)
    }

    const deleteMessage = async (id) => {
        if (!confirm('Delete this message?')) return
        await supabase.from('contacts').delete().eq('id', id)
        setContacts(prev => prev.filter(c => c.id !== id))
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    const filteredApps = applications.filter(a => {
        if (statusFilter !== 'all' && a.status !== statusFilter) return false
        if (searchTerm) {
            const s = searchTerm.toLowerCase()
            return a.full_name?.toLowerCase().includes(s) || a.email?.toLowerCase().includes(s) || a.destination?.toLowerCase().includes(s)
        }
        return true
    })

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        processing: applications.filter(a => a.status === 'processing').length,
        approved: applications.filter(a => a.status === 'approved').length,
        rejected: applications.filter(a => a.status === 'rejected').length,
    }

    if (checking) return (
        <div className="admin-loading">
            <Loader2 className="animate-spin" size={40} color="var(--gold)" />
            <p>Verifying access...</p>
        </div>
    )

    return (
        <div className="admin-layout">
            <aside className={`admin-sidebar${sidebarOpen ? '' : ' collapsed'}`}>
                <div className="admin-sidebar-header">
                    <div className="admin-logo">
                        <div className="admin-logo-icon">A</div>
                        {sidebarOpen && <span className="admin-logo-text">Admin Panel</span>}
                    </div>
                    <button className="admin-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <Menu size={18} />
                    </button>
                </div>
                <nav className="admin-nav">
                    {TABS.map(tab => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                className={`admin-nav-item${activeTab === tab.id ? ' active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <Icon size={20} />
                                {sidebarOpen && <span>{tab.label}</span>}
                            </button>
                        )
                    })}
                </nav>
                <div className="admin-sidebar-footer">
                    <div className="admin-sidebar-user">
                        <div className="admin-user-avatar">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        {sidebarOpen && (
                            <div className="admin-user-info">
                                <span className="admin-user-name">Admin</span>
                                <span className="admin-user-email">{user?.email}</span>
                            </div>
                        )}
                    </div>
                    <button className="admin-logout-btn" onClick={handleLogout}>
                        <LogOut size={18} />
                        {sidebarOpen && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-topbar">
                    <button className="admin-mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <Menu size={22} />
                    </button>
                    <h1>{TABS.find(t => t.id === activeTab)?.label}</h1>
                    <div className="admin-topbar-right">
                        <span className="admin-topbar-email">{user?.email}</span>
                    </div>
                </header>

                <div className="admin-content">
                    {activeTab === 'overview' && (
                        <>
                            <div className="admin-stats-grid">
                                <div className="admin-stat-card total">
                                    <div className="admin-stat-icon"><FileText size={24} /></div>
                                    <div className="admin-stat-body">
                                        <span className="admin-stat-value">{stats.total}</span>
                                        <span className="admin-stat-label">Total Applications</span>
                                    </div>
                                </div>
                                <div className="admin-stat-card pending">
                                    <div className="admin-stat-icon"><Clock size={24} /></div>
                                    <div className="admin-stat-body">
                                        <span className="admin-stat-value">{stats.pending}</span>
                                        <span className="admin-stat-label">Pending Review</span>
                                    </div>
                                </div>
                                <div className="admin-stat-card processing">
                                    <div className="admin-stat-icon"><Loader2 size={24} /></div>
                                    <div className="admin-stat-body">
                                        <span className="admin-stat-value">{stats.processing}</span>
                                        <span className="admin-stat-label">Processing</span>
                                    </div>
                                </div>
                                <div className="admin-stat-card approved">
                                    <div className="admin-stat-icon"><CheckCircle size={24} /></div>
                                    <div className="admin-stat-body">
                                        <span className="admin-stat-value">{stats.approved}</span>
                                        <span className="admin-stat-label">Approved</span>
                                    </div>
                                </div>
                                <div className="admin-stat-card rejected">
                                    <div className="admin-stat-icon"><AlertCircle size={24} /></div>
                                    <div className="admin-stat-body">
                                        <span className="admin-stat-value">{stats.rejected}</span>
                                        <span className="admin-stat-label">Rejected</span>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-section">
                                <h2>Quick Actions</h2>
                                <div className="admin-quick-actions">
                                    <button className="admin-quick-btn" onClick={() => setActiveTab('applications')}>
                                        <FileText size={20} /> Review Applications
                                    </button>
                                    <button className="admin-quick-btn" onClick={() => setActiveTab('messages')}>
                                        <MessageSquare size={20} /> View Messages
                                    </button>
                                    <button className="admin-quick-btn" onClick={fetchData}>
                                        <Loader2 size={20} /> Refresh Data
                                    </button>
                                </div>
                            </div>

                            <div className="admin-section">
                                <h2>Recent Applications</h2>
                                <div className="admin-table-wrap">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Applicant</th>
                                                <th>Destination</th>
                                                <th>Service</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {applications.slice(0, 5).map(a => (
                                                <tr key={a.id}>
                                                    <td><strong>{a.full_name}</strong></td>
                                                    <td>{a.destination}</td>
                                                    <td className="admin-capitalize">{a.program_type?.replace('_', ' ')}</td>
                                                    <td><span className={`admin-badge ${a.status}`}>{a.status}</span></td>
                                                    <td>{new Date(a.created_at).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                            {applications.length === 0 && (
                                                <tr><td colSpan={5} className="admin-empty">No applications yet</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'applications' && (
                        <>
                            <div className="admin-toolbar">
                                <div className="admin-search">
                                    <Search size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, destination..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="admin-filter-group">
                                    <Filter size={18} />
                                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                                        <option value="all">All Status</option>
                                        {statuses.map(s => (
                                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                                <span className="admin-count">{filteredApps.length} application{filteredApps.length !== 1 ? 's' : ''}</span>
                            </div>

                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Applicant</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Destination</th>
                                            <th>Service</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredApps.map(a => (
                                            <tr key={a.id}>
                                                <td><strong>{a.full_name}</strong></td>
                                                <td>{a.email}</td>
                                                <td>{a.phone || '—'}</td>
                                                <td>{a.destination || '—'}</td>
                                                <td className="admin-capitalize">{a.program_type?.replace('_', ' ') || '—'}</td>
                                                <td>
                                                    <span className={`admin-badge ${a.status}`}>{a.status}</span>
                                                </td>
                                                <td>{new Date(a.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <div className="admin-action-cell">
                                                        <div className="admin-status-select">
                                                            <select
                                                                value={a.status}
                                                                onChange={e => updateStatus(a.id, e.target.value)}
                                                                disabled={updating === a.id}
                                                            >
                                                                {statuses.map(s => (
                                                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                                ))}
                                                            </select>
                                                            {updating === a.id && <Loader2 size={14} className="animate-spin" />}
                                                        </div>
                                                        <button className="admin-view-btn" onClick={() => setSelectedApp(selectedApp?.id === a.id ? null : a)}>
                                                            <MoreHorizontal size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredApps.length === 0 && (
                                            <tr><td colSpan={8} className="admin-empty">No applications match your filters</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {selectedApp && (
                                <div className="admin-detail-panel">
                                    <div className="admin-detail-header">
                                        <h3>Application Details</h3>
                                        <button className="admin-detail-close" onClick={() => setSelectedApp(null)}>
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="admin-detail-body">
                                        <div className="admin-detail-grid">
                                            <div className="admin-detail-field">
                                                <label>Full Name</label>
                                                <span>{selectedApp.full_name}</span>
                                            </div>
                                            <div className="admin-detail-field">
                                                <label>Email</label>
                                                <span>{selectedApp.email}</span>
                                            </div>
                                            <div className="admin-detail-field">
                                                <label>Phone</label>
                                                <span>{selectedApp.phone || '—'}</span>
                                            </div>
                                            <div className="admin-detail-field">
                                                <label>Destination</label>
                                                <span>{selectedApp.destination || '—'}</span>
                                            </div>
                                            <div className="admin-detail-field">
                                                <label>Service Type</label>
                                                <span className="admin-capitalize">{selectedApp.program_type?.replace('_', ' ') || '—'}</span>
                                            </div>
                                            <div className="admin-detail-field">
                                                <label>Status</label>
                                                <span className={`admin-badge ${selectedApp.status}`}>{selectedApp.status}</span>
                                            </div>
                                            <div className="admin-detail-field">
                                                <label>Submitted</label>
                                                <span>{new Date(selectedApp.created_at).toLocaleString()}</span>
                                            </div>
                                            <div className="admin-detail-field">
                                                <label>User ID</label>
                                                <span style={{ fontSize: '.75rem', fontFamily: 'monospace' }}>{selectedApp.user_id || '—'}</span>
                                            </div>
                                        </div>
                                        {selectedApp.message && (
                                            <div className="admin-detail-field" style={{ gridColumn: '1 / -1' }}>
                                                <label>Additional Message</label>
                                                <p style={{ marginTop: '.5rem', lineHeight: 1.6 }}>{selectedApp.message}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'messages' && (
                        <>
                            <div className="admin-toolbar">
                                <span className="admin-count">{contacts.length} message{contacts.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Subject</th>
                                            <th>Message</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contacts.map(c => (
                                            <tr key={c.id}>
                                                <td><strong>{c.name}</strong></td>
                                                <td><a href={`mailto:${c.email}`} className="admin-link">{c.email}</a></td>
                                                <td>{c.phone || '—'}</td>
                                                <td>{c.subject || '—'}</td>
                                                <td style={{ maxWidth: 250 }}>
                                                    <span className="admin-truncate">{c.message}</span>
                                                </td>
                                                <td>{new Date(c.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <button className="admin-view-btn delete" onClick={() => deleteMessage(c.id)}>
                                                        <X size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {contacts.length === 0 && (
                                            <tr><td colSpan={7} className="admin-empty">No messages yet</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {activeTab === 'users' && (
                        <>
                            <div className="admin-toolbar">
                                <span className="admin-count">{allUsers.length} user{allUsers.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                            <th>Full Name</th>
                                            <th>Joined</th>
                                            <th>User ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allUsers.map(u => (
                                            <tr key={u.id}>
                                                <td>{u.email}</td>
                                                <td>{u.full_name || '—'}</td>
                                                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                                <td style={{ fontSize: '.75rem', fontFamily: 'monospace' }}>{u.id}</td>
                                            </tr>
                                        ))}
                                        {allUsers.length === 0 && (
                                            <tr><td colSpan={4} className="admin-empty">No users found</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
