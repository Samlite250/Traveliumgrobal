import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    collection, getDocs, doc, updateDoc, orderBy, query
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import {
    Shield, LogOut, Users, ClipboardList, CheckCircle, XCircle,
    Clock, Loader2, FileText, Search, Filter, RefreshCw
} from 'lucide-react'

const STATUS_OPTIONS = ['all', 'pending', 'processing', 'approved', 'rejected']

const statusColor = {
    pending:    'status-pending',
    approved:   'status-approved',
    rejected:   'status-rejected',
    processing: 'status-processing'
}

export default function AdminDashboard() {
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()

    const [applications, setApplications] = useState([])
    const [filtered, setFiltered]         = useState([])
    const [loading, setLoading]           = useState(true)
    const [updating, setUpdating]         = useState(null)
    const [search, setSearch]             = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterType, setFilterType]     = useState('all')

    const fetchApplications = async () => {
        setLoading(true)
        const q = query(collection(db, 'applications'), orderBy('created_at', 'desc'))
        const snap = await getDocs(q)
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setApplications(data)
        setLoading(false)
    }

    useEffect(() => { fetchApplications() }, [])

    useEffect(() => {
        let list = [...applications]
        if (filterStatus !== 'all') list = list.filter(a => a.status === filterStatus)
        if (filterType   !== 'all') list = list.filter(a => a.program_type === filterType)
        if (search.trim())          list = list.filter(a =>
            a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            a.email?.toLowerCase().includes(search.toLowerCase()) ||
            a.destination?.toLowerCase().includes(search.toLowerCase())
        )
        setFiltered(list)
    }, [applications, filterStatus, filterType, search])

    const updateStatus = async (id, newStatus) => {
        setUpdating(id)
        await updateDoc(doc(db, 'applications', id), { status: newStatus })
        setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a))
        setUpdating(null)
    }

    const handleLogout = async () => { await logout(); navigate('/') }

    const total      = applications.length
    const pending    = applications.filter(a => a.status === 'pending').length
    const approved   = applications.filter(a => a.status === 'approved').length
    const rejected   = applications.filter(a => a.status === 'rejected').length
    const processing = applications.filter(a => a.status === 'processing').length

    return (
        <main>
            {/* Admin Hero */}
            <div className="page-hero dashboard-hero" style={{ minHeight: 220 }}>
                <div className="page-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600&auto=format&fit=crop)' }} />
                <div className="container page-hero-content" style={{ textAlign: 'left' }}>
                    <div className="dashboard-welcome">
                        <div className="user-avatar-large" style={{ background: 'linear-gradient(135deg,#1e3a5f,#0ea5e9)' }}>
                            <Shield size={32} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', marginBottom: '.25rem' }}>Admin Dashboard</h1>
                            <p>Manage all applications · Logged in as <strong>{currentUser?.email}</strong></p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="dashboard">
                <div className="container">
                    {/* Header row */}
                    <div className="dashboard-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                            <ClipboardList size={24} color="var(--navy)" />
                            <h2>All Applications</h2>
                        </div>
                        <div className="dashboard-actions">
                            <button onClick={fetchApplications} className="btn btn-outline">
                                <RefreshCw size={16} /> Refresh
                            </button>
                            <button onClick={handleLogout} className="btn btn-outline">
                                <LogOut size={18} /> Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="dashboard-stats" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                        {[
                            { label: 'Total',      value: total,      color: 'var(--navy)',   icon: <Users size={18} /> },
                            { label: 'Pending',    value: pending,    color: '#d97706',        icon: <Clock size={18} /> },
                            { label: 'Processing', value: processing, color: '#7c3aed',        icon: <Clock size={18} /> },
                            { label: 'Approved',   value: approved,   color: '#16a34a',        icon: <CheckCircle size={18} /> },
                            { label: 'Rejected',   value: rejected,   color: '#dc2626',        icon: <XCircle size={18} /> },
                        ].map(({ label, value, color, icon }) => (
                            <div key={label} className="dash-stat">
                                <div className="dash-stat-label" style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                                    {icon} {label}
                                </div>
                                <div className="dash-stat-value" style={{ color }}>{value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Filter bar */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
                        <div className="input-with-icon" style={{ flex: '1 1 260px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', padding: '0 1rem' }}>
                            <Search size={16} color="#64748b" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by name, email, destination..."
                                style={{ border: 'none', background: 'transparent', padding: '.6rem .5rem', outline: 'none', width: '100%' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                                <Filter size={15} color="#64748b" />
                                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                                    style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '.45rem .75rem', fontSize: '.875rem', background: '#fff', cursor: 'pointer' }}>
                                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                </select>
                            </div>
                            <select value={filterType} onChange={e => setFilterType(e.target.value)}
                                style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '.45rem .75rem', fontSize: '.875rem', background: '#fff', cursor: 'pointer' }}>
                                <option value="all">All Services</option>
                                <option value="study">Study Abroad</option>
                                <option value="student_visa">Student Visa</option>
                                <option value="tourist">Tourist Visa</option>
                                <option value="work">Work Visa</option>
                                <option value="scholarship">Scholarship</option>
                                <option value="residency">Residency</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="applications-table-wrap">
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '4rem' }}>
                                <Loader2 className="animate-spin" size={40} color="var(--navy)" />
                                <p style={{ marginTop: '1rem' }}>Loading applications...</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon"><ClipboardList size={48} /></div>
                                <h3>No applications found</h3>
                                <p>Try adjusting your search or filters.</p>
                            </div>
                        ) : (
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Applicant</th>
                                            <th>Email</th>
                                            <th>Destination</th>
                                            <th>Service</th>
                                            <th>Education</th>
                                            <th>Docs</th>
                                            <th>Submitted</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map(a => (
                                            <tr key={a.id}>
                                                <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{a.full_name}</td>
                                                <td style={{ fontSize: '.82rem', color: '#64748b' }}>{a.email}</td>
                                                <td>{a.destination}</td>
                                                <td style={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{a.program_type?.replace('_', ' ')}</td>
                                                <td style={{ fontSize: '.82rem' }}>{a.education_level}</td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap' }}>
                                                        {a.documents?.passport && <a href={a.documents.passport} target="_blank" rel="noreferrer" className="doc-link" title="Passport"><FileText size={13} /></a>}
                                                        {a.documents?.diploma  && <a href={a.documents.diploma}  target="_blank" rel="noreferrer" className="doc-link" title="Diploma"><FileText size={13} /></a>}
                                                        {a.documents?.id_card  && <a href={a.documents.id_card}  target="_blank" rel="noreferrer" className="doc-link" title="ID Card"><FileText size={13} /></a>}
                                                    </div>
                                                </td>
                                                <td style={{ whiteSpace: 'nowrap', fontSize: '.82rem' }}>
                                                    {a.created_at?.toDate ? a.created_at.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${statusColor[a.status] || 'status-pending'}`}>
                                                        {a.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {updating === a.id ? (
                                                        <Loader2 size={18} className="animate-spin" color="var(--navy)" />
                                                    ) : (
                                                        <div style={{ display: 'flex', gap: '.4rem' }}>
                                                            {a.status !== 'approved' && (
                                                                <button onClick={() => updateStatus(a.id, 'approved')}
                                                                    className="action-btn approve" title="Approve">
                                                                    <CheckCircle size={15} />
                                                                </button>
                                                            )}
                                                            {a.status !== 'processing' && (
                                                                <button onClick={() => updateStatus(a.id, 'processing')}
                                                                    className="action-btn process" title="Mark Processing">
                                                                    <Clock size={15} />
                                                                </button>
                                                            )}
                                                            {a.status !== 'rejected' && (
                                                                <button onClick={() => updateStatus(a.id, 'rejected')}
                                                                    className="action-btn reject" title="Reject">
                                                                    <XCircle size={15} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <p style={{ textAlign: 'right', marginTop: '1rem', color: '#94a3b8', fontSize: '.8rem' }}>
                        Showing {filtered.length} of {total} applications
                    </p>
                </div>
            </section>
        </main>
    )
}
