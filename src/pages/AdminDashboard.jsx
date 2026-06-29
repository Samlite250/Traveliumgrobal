import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    collection, getDocs, doc, updateDoc, orderBy, query, limit, serverTimestamp
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import {
    Shield, LogOut, Users, ClipboardList, CheckCircle, XCircle,
    Clock, Loader2, FileText, Search, Filter, RefreshCw, 
    ChevronDown, Download, ExternalLink, Calendar, Mail, Phone,
    Globe, BookOpen, User, MoreHorizontal, Check
} from 'lucide-react'

const STATUS_OPTIONS = ['all', 'pending', 'processing', 'approved', 'rejected']

const statusConfig = {
    pending: { class: 'st-pending', label: 'Pending', icon: <Clock size={14} /> },
    approved: { class: 'st-approved', label: 'Approved', icon: <CheckCircle size={14} /> },
    rejected: { class: 'st-rejected', label: 'Rejected', icon: <XCircle size={14} /> },
    processing: { class: 'st-processing', label: 'Processing', icon: <RefreshCw size={14} className="animate-spin-slow" /> }
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
    const [stats, setStats]               = useState({ total: 0, pending: 0, approved: 0, processing: 0 })

    const fetchApplications = async () => {
        setLoading(true)
        try {
            const q = query(collection(db, 'applications'), orderBy('created_at', 'desc'), limit(100))
            const snap = await getDocs(q)
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
            setApplications(data)
            
            // Calculate stats
            setStats({
                total: data.length,
                pending: data.filter(a => a.status === 'pending').length,
                approved: data.filter(a => a.status === 'approved').length,
                processing: data.filter(a => a.status === 'processing').length
            })
        } catch (err) {
            console.error("Admin fetch error:", err)
        }
        setLoading(false)
    }

    useEffect(() => { fetchApplications() }, [])

    useEffect(() => {
        let list = [...applications]
        if (filterStatus !== 'all') list = list.filter(a => a.status === filterStatus)
        if (filterType !== 'all')   list = list.filter(a => a.program_type === filterType)
        if (search.trim()) {
            const s = search.toLowerCase()
            list = list.filter(a =>
                a.full_name?.toLowerCase().includes(s) ||
                a.email?.toLowerCase().includes(s) ||
                a.destination?.toLowerCase().includes(s) ||
                a.user_email?.toLowerCase().includes(s)
            )
        }
        setFiltered(list)
    }, [applications, filterStatus, filterType, search])

    const updateStatus = async (id, newStatus) => {
        setUpdating(id)
        try {
            await updateDoc(doc(db, 'applications', id), { 
                status: newStatus,
                updated_at: serverTimestamp()
            })
            setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a))
        } catch (err) {
            console.error("Update error:", err)
        }
        setUpdating(null)
    }

    const handleLogout = async () => { await logout(); navigate('/') }

    return (
        <main className="admin-root">
            {/* Admin Header Ribbon */}
            <header className="admin-header">
                <div className="admin-container">
                    <div className="admin-logo-zone">
                        <div className="admin-badge">
                            <Shield size={18} />
                            <span>ADMIN PANEL</span>
                        </div>
                        <span className="divider">/</span>
                        <h1 className="admin-title">Application Management</h1>
                    </div>
                    
                    <div className="admin-user-zone">
                        <div className="admin-profile">
                            <div className="admin-avatar">{currentUser?.email?.charAt(0).toUpperCase()}</div>
                            <div className="admin-info">
                                <span className="email">{currentUser?.email}</span>
                                <span className="role">Primary Administrator</span>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="admin-logout-btn" title="Sign Out">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <section className="admin-content">
                <div className="admin-container">
                    {/* KPI Row */}
                    <div className="admin-kpi-row">
                        <div className="kpi-card">
                            <div className="kpi-icon blue"><Users size={24} /></div>
                            <div className="kpi-data">
                                <span className="label">Total Applications</span>
                                <span className="val">{stats.total}</span>
                            </div>
                        </div>
                        <div className="kpi-card">
                            <div className="kpi-icon orange"><Clock size={24} /></div>
                            <div className="kpi-data">
                                <span className="label">Pending Review</span>
                                <span className="val">{stats.pending}</span>
                            </div>
                        </div>
                        <div className="kpi-card">
                            <div className="kpi-icon purple"><RefreshCw size={24} /></div>
                            <div className="kpi-data">
                                <span className="label">In Processing</span>
                                <span className="val">{stats.processing}</span>
                            </div>
                        </div>
                        <div className="kpi-card">
                            <div className="kpi-icon green"><CheckCircle size={24} /></div>
                            <div className="kpi-data">
                                <span className="label">Total Approved</span>
                                <span className="val">{stats.approved}</span>
                            </div>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="admin-filter-bar">
                        <div className="search-box">
                            <Search size={18} className="s-icon" />
                            <input 
                                type="text"
                                placeholder="Search by name, email, or destination..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="filters-group">
                            <div className="filter-select-wrap">
                                <Filter size={14} className="f-icon" />
                                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div className="filter-select-wrap">
                                <BookOpen size={14} className="f-icon" />
                                <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                                    <option value="all">All Services</option>
                                    <option value="study">Study Abroad</option>
                                    <option value="student_visa">Student Visa</option>
                                    <option value="tourist">Tourist Visa</option>
                                    <option value="work">Work Visa</option>
                                    <option value="scholarship">Scholarship</option>
                                </select>
                            </div>
                            <button onClick={fetchApplications} className="refresh-btn" disabled={loading}>
                                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                            </button>
                        </div>
                    </div>

                    {/* Main Table Card */}
                    <div className="admin-table-card">
                        {loading ? (
                            <div className="admin-loading">
                                <Loader2 size={40} className="animate-spin" />
                                <p>Fetching applications...</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="admin-empty">
                                <ClipboardList size={60} />
                                <h3>No applications match your criteria</h3>
                                <p>Try adjusting your filters or search terms</p>
                            </div>
                        ) : (
                            <div className="admin-table-overflow">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Applicant & Contact</th>
                                            <th>Application Details</th>
                                            <th>Documents</th>
                                            <th>Submitted</th>
                                            <th>Status</th>
                                            <th className="actions-col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map(a => (
                                            <tr key={a.id} className={updating === a.id ? 'updating-row' : ''}>
                                                <td>
                                                    <div className="user-cell">
                                                        <div className="u-avatar">{a.full_name?.charAt(0) || 'U'}</div>
                                                        <div className="u-info">
                                                            <span className="n">{a.full_name}</span>
                                                            <span className="e">{a.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="app-cell">
                                                        <div className="destination-pill">
                                                            <Globe size={12} />
                                                            <span>{a.destination}</span>
                                                        </div>
                                                        <span className="service-type">{a.program_type?.replace('_', ' ')}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="doc-chip-group">
                                                        {a.documents?.passport && <a href={a.documents.passport} target="_blank" rel="noreferrer" className="d-chip" title="Passport"><FileText size={14} /></a>}
                                                        {a.documents?.diploma && <a href={a.documents.diploma} target="_blank" rel="noreferrer" className="d-chip" title="Diploma"><FileText size={14} /></a>}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="date-cell">
                                                        <Calendar size={12} />
                                                        <span>{a.created_at?.toDate ? a.created_at.toDate().toLocaleDateString() : '—'}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className={`status-pill-admin ${statusConfig[a.status]?.class || 'st-pending'}`}>
                                                        {statusConfig[a.status]?.icon}
                                                        <span>{statusConfig[a.status]?.label || a.status}</span>
                                                    </div>
                                                </td>
                                                <td className="actions-col">
                                                    <div className="admin-action-btns">
                                                        {a.status !== 'approved' && (
                                                            <button onClick={() => updateStatus(a.id, 'approved')} className="btn-act app" title="Approve">
                                                                <Check size={16} />
                                                            </button>
                                                        )}
                                                        {a.status !== 'processing' && (
                                                            <button onClick={() => updateStatus(a.id, 'processing')} className="btn-act pro" title="Process">
                                                                <RefreshCw size={16} />
                                                            </button>
                                                        )}
                                                        {a.status !== 'rejected' && (
                                                            <button onClick={() => updateStatus(a.id, 'rejected')} className="btn-act rej" title="Reject">
                                                                <XCircle size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div className="admin-table-footer">
                            <span>Showing {filtered.length} of {applications.length} results</span>
                            <span className="last-sync">Last updated: {new Date().toLocaleTimeString()}</span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
