import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    collection, doc, addDoc, updateDoc, setDoc, deleteDoc, orderBy, query,
    limit, serverTimestamp, onSnapshot
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import {
    Shield, LogOut, Users, ClipboardList, CheckCircle, XCircle,
    Clock, Loader2, FileText, Search, Filter, RefreshCw,
    Download, ExternalLink, Calendar, Mail, Phone,
    Globe, BookOpen, Check, MessageSquare,
    Trash2, Eye, EyeOff, PieChart, TrendingUp, Star,
    Settings, AlertTriangle, Send, X, Info, Menu, LayoutDashboard,
    FolderOpen, DollarSign, CreditCard, Plus, Edit3, Package, Lock
} from 'lucide-react'

const SERVICE_OPTIONS = [
    { value: 'all', label: 'All Services' },
    { value: 'study', label: 'Study Abroad' },
    { value: 'student_visa', label: 'Student Visa' },
    { value: 'tourist', label: 'Tourist Visa' },
    { value: 'work', label: 'Work Visa' },
    { value: 'scholarship', label: 'Scholarship' },
    { value: 'flight_booking', label: 'Flight Booking' },
    { value: 'residency', label: 'Permanent Residency' },
]

const statusConfig = {
    pending: { class: 'st-pending', label: 'Pending', icon: <Clock size={14} /> },
    approved: { class: 'st-approved', label: 'Approved', icon: <CheckCircle size={14} /> },
    rejected: { class: 'st-rejected', label: 'Rejected', icon: <XCircle size={14} /> },
    processing: { class: 'st-processing', label: 'Processing', icon: <RefreshCw size={14} className="animate-spin-slow" /> }
}

const navItems = [
    { key: 'overview', label: 'Overview', icon: <PieChart size={20} /> },
    { key: 'applications', label: 'Applications', icon: <ClipboardList size={20} />, badge: 'pending' },
    { key: 'documents', label: 'Documents', icon: <FolderOpen size={20} /> },
    { key: 'transactions', label: 'Transactions', icon: <DollarSign size={20} /> },
    { key: 'services', label: 'Services', icon: <Package size={20} /> },
    { key: 'messages', label: 'Messages', icon: <MessageSquare size={20} />, badge: 'unread' },
    { key: 'users', label: 'Users', icon: <Users size={20} /> },
    { key: 'settings', label: 'Settings', icon: <Settings size={20} /> },
]

function formatDate(ts) {
    if (!ts) return '\u2014'
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatDateShort(ts) {
    if (!ts) return '\u2014'
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function timeAgo(ts) {
    if (!ts) return ''
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    const sec = (Date.now() - d.getTime()) / 1000
    if (sec < 60) return 'just now'
    if (sec < 3600) return `${Math.floor(sec / 60)}m ago`
    if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`
    return `${Math.floor(sec / 86400)}d ago`
}

export default function AdminDashboard() {
    const { currentUser, logout } = useAuth()
    const toast = useToast()
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState('overview')
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterType, setFilterType] = useState('all')
    const [updating, setUpdating] = useState(null)
    const [selectedApp, setSelectedApp] = useState(null)
    const [selectedMsg, setSelectedMsg] = useState(null)
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const [statusNote, setStatusNote] = useState('')
    const [showNoteInput, setShowNoteInput] = useState(null)
    const [messageFilter, setMessageFilter] = useState('all')

    const [applications, setApplications] = useState([])
    const [contacts, setContacts] = useState([])
    const [services, setServices] = useState([])
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    // Settings state
    const [siteSettings, setSiteSettings] = useState(null)
    const [settingsSaved, setSettingsSaved] = useState(false)
    const [settingsForm, setSettingsForm] = useState({})

    // Service editor state
    const [editingService, setEditingService] = useState(null)
    const [serviceForm, setServiceForm] = useState({ name: '', type: 'visa', description: '', price: '', features: '', active: true, featured: false, country: '', flag: '', deadline: '', img: '' })
    const [showServiceEditor, setShowServiceEditor] = useState(false)
    // Transaction editor state
    const [editingTx, setEditingTx] = useState(null)
    const [txForm, setTxForm] = useState({ applicant_name: '', email: '', service_type: '', amount: '', currency: 'USD', status: 'pending', payment_method: '', notes: '' })
    const [showTxEditor, setShowTxEditor] = useState(false)

    useEffect(() => {
        if (!db) { setLoading(false); return }
        const unsubApps = onSnapshot(
            query(collection(db, 'applications'), orderBy('created_at', 'desc'), limit(200)),
            (snap) => { setApplications(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false) },
            (err) => { console.error('Realtime apps error:', err); setLoading(false) }
        )
        const unsubMsgs = onSnapshot(
            query(collection(db, 'contacts'), orderBy('created_at', 'desc'), limit(200)),
            (snap) => setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
            (err) => console.error('Realtime contacts error:', err)
        )
        const unsubServices = onSnapshot(
            query(collection(db, 'services'), orderBy('created_at', 'desc')),
            (snap) => setServices(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
            (err) => console.error('Realtime services error:', err)
        )
        const unsubTx = onSnapshot(
            query(collection(db, 'transactions'), orderBy('created_at', 'desc'), limit(200)),
            (snap) => setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
            (err) => console.error('Realtime transactions error:', err)
        )
        const unsubSettings = onSnapshot(doc(db, 'settings', 'site'), (snap) => {
            const data = snap.exists() ? snap.data() : {}
            const defaults = {
                siteName: 'TRAVELIUM', tagline: 'Global',
                description: 'Your trusted partner for global career transformation, study abroad, visa services, and travel solutions.',
                logoUrl: '', faviconUrl: '',
                metaTitle: 'Travelium | Global Education & Travel Opportunities',
                metaDescription: 'Travelium — Your Gateway to Global Education and Travel Opportunities. Study abroad, visa services, scholarships and more.',
                metaKeywords: 'travel, visa, study abroad, scholarship, work visa, flight booking',
                googleAnalyticsId: '',
                supportEmail: 'traveliumgrobal@gmail.com', supportPhone: '+250 782 531 515',
                address: '123 Global Avenue, Suite 400, New York, NY 10001, USA',
                workingHours: 'Mon – Sat: 9:00 AM – 7:00 PM',
                headquarters: 'Headquartered in Kigali, Rwanda',
                copyright: 'Travelium Global. Licensed Recruitment & Travel Agency.',
                linkedin: '#', twitter: '#', youtube: '#', instagram: '#', facebook: '#',
                whatsappNumbers: [
                    { label: 'Visas & General Inquiries', number: '250782531515' },
                    { label: 'Jobs & Recruitment', number: '250796230619' },
                    { label: 'Air Ticketing', number: '250793658206' },
                ],
                adminEmails: ['traveliumgrobal@gmail.com', 'samlite250@gmail.com'],
                maintenanceMode: false,
            }
            const merged = { ...defaults, ...data }
            setSiteSettings(merged)
            setSettingsForm(prev => Object.keys(prev).length ? prev : merged)
        }, (err) => console.error('Settings error:', err))
        return () => { unsubApps(); unsubMsgs(); unsubServices(); unsubTx(); unsubSettings() }
    }, [])

    const stats = useMemo(() => ({
        total: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        approved: applications.filter(a => a.status === 'approved').length,
        processing: applications.filter(a => a.status === 'processing').length,
        rejected: applications.filter(a => a.status === 'rejected').length,
        unread: contacts.filter(m => !m.read).length,
        uniqueUsers: new Set(applications.map(a => a.user_email || a.email).filter(Boolean)).size,
        flightBookings: applications.filter(a => a.program_type === 'flight_booking').length,
        visaApps: applications.filter(a => ['study', 'student_visa', 'tourist', 'work', 'residency'].includes(a.program_type)).length,
    }), [applications, contacts])

    const badgeCount = (key) => {
        if (key === 'pending') return stats.pending
        if (key === 'unread') return stats.unread
        return null
    }

    const filtered = useMemo(() => {
        let list = [...applications]
        if (filterStatus !== 'all') list = list.filter(a => a.status === filterStatus)
        if (filterType !== 'all') list = list.filter(a => a.program_type === filterType)
        if (search.trim()) {
            const s = search.toLowerCase()
            list = list.filter(a =>
                a.full_name?.toLowerCase().includes(s) ||
                a.email?.toLowerCase().includes(s) ||
                a.destination?.toLowerCase().includes(s) ||
                a.user_email?.toLowerCase().includes(s) ||
                a.phone?.toLowerCase().includes(s)
            )
        }
        return list
    }, [applications, filterStatus, filterType, search])

    const filteredMessages = useMemo(() => {
        if (messageFilter === 'unread') return contacts.filter(m => !m.read)
        if (messageFilter === 'read') return contacts.filter(m => m.read)
        return contacts
    }, [contacts, messageFilter])

    const usersList = useMemo(() => {
        const map = new Map()
        applications.forEach(a => {
            const key = a.user_email || a.email
            if (!key) return
            if (!map.has(key)) {
                map.set(key, { email: key, name: a.full_name || 'Unknown', phone: a.phone || '', userId: a.user_id, appCount: 0, lastActive: a.created_at })
            }
            const entry = map.get(key)
            entry.appCount++
            if (a.created_at && (!entry.lastActive || a.created_at.toDate?.() > entry.lastActive.toDate?.())) {
                entry.lastActive = a.created_at
            }
        })
        return Array.from(map.values()).sort((a, b) => b.appCount - a.appCount)
    }, [applications])

    const updateStatus = async (id, newStatus) => {
        setUpdating(id)
        try {
            const updateData = { status: newStatus, updated_at: serverTimestamp() }
            if (statusNote.trim()) updateData.admin_note = statusNote.trim()
            await updateDoc(doc(db, 'applications', id), updateData)
            toast(`Application ${newStatus}.`, 'success')
            setStatusNote('')
            setShowNoteInput(null)
        } catch (err) { console.error('Update error:', err); toast('Failed to update status.', 'error') }
        setUpdating(null)
    }

    const deleteApplication = async (id) => {
        try {
            await deleteDoc(doc(db, 'applications', id))
            toast('Application deleted.', 'success')
            setDeleteConfirm(null)
            setSelectedApp(null)
        } catch (err) { console.error('Delete error:', err); toast('Failed to delete application.', 'error') }
    }

    const markMessageRead = async (id, read = true) => {
        try { await updateDoc(doc(db, 'contacts', id), { read, read_at: serverTimestamp(), read_by: currentUser?.email }); toast(read ? 'Marked as read.' : 'Marked as unread.', 'info') }
        catch (err) { console.error('Mark read error:', err); toast('Failed to update message.', 'error') }
    }

    const deleteMessage = async (id) => {
        try { await deleteDoc(doc(db, 'contacts', id)); setSelectedMsg(null); toast('Message deleted.', 'success') }
        catch (err) { console.error('Delete message error:', err); toast('Failed to delete message.', 'error') }
    }

    // ── Service CRUD ──
    const saveService = async () => {
        const data = {
            ...serviceForm,
            price: parseFloat(serviceForm.price) || 0,
            features: serviceForm.features.split('\n').filter(Boolean),
            updated_at: serverTimestamp()
        }
        try {
            if (editingService) {
                await updateDoc(doc(db, 'services', editingService.id), data)
            } else {
                await addDoc(collection(db, 'services'), { ...data, created_at: serverTimestamp() })
            }
            setShowServiceEditor(false); setEditingService(null)
            setServiceForm({ name: '', type: 'visa', description: '', price: '', features: '', active: true, featured: false, country: '', flag: '', deadline: '', img: '' })
            toast(editingService ? 'Service updated.' : 'Service created.', 'success')
        } catch (err) { console.error('Service save error:', err); toast('Failed to save service.', 'error') }
    }
    const editService = (s) => {
        setEditingService(s)
        setServiceForm({ name: s.name || '', type: s.type || 'visa', description: s.description || '', price: String(s.price || ''), features: (s.features || []).join('\n'), active: s.active !== false, featured: s.featured || false, country: s.country || '', flag: s.flag || '', deadline: s.deadline || '', img: s.img || '' })
        setShowServiceEditor(true)
    }
    const deleteService = async (id) => {
        try { await deleteDoc(doc(db, 'services', id)); toast('Service deleted.', 'success') }
        catch (err) { console.error('Service delete error:', err); toast('Failed to delete service.', 'error') }
    }

    // ── Transaction CRUD ──
    const saveTx = async () => {
        const data = { ...txForm, amount: parseFloat(txForm.amount) || 0, updated_at: serverTimestamp() }
        try {
            if (editingTx) {
                await updateDoc(doc(db, 'transactions', editingTx.id), data)
            } else {
                await addDoc(collection(db, 'transactions'), { ...data, created_at: serverTimestamp() })
            }
            setShowTxEditor(false); setEditingTx(null)
            setTxForm({ applicant_name: '', email: '', service_type: '', amount: '', currency: 'USD', status: 'pending', payment_method: '', notes: '' })
            toast(editingTx ? 'Transaction updated.' : 'Transaction created.', 'success')
        } catch (err) { console.error('Tx save error:', err); toast('Failed to save transaction.', 'error') }
    }
    const editTx = (t) => {
        setEditingTx(t)
        setTxForm({ applicant_name: t.applicant_name || '', email: t.email || '', service_type: t.service_type || '', amount: String(t.amount || ''), currency: t.currency || 'USD', status: t.status || 'pending', payment_method: t.payment_method || '', notes: t.notes || '' })
        setShowTxEditor(true)
    }
    const deleteTx = async (id) => {
        try { await deleteDoc(doc(db, 'transactions', id)); toast('Transaction deleted.', 'success') }
        catch (err) { console.error('Tx delete error:', err); toast('Failed to delete transaction.', 'error') }
    }

    // ── Settings CRUD ──
    const ALLOWED_SETTINGS = [
        'description', 'logoUrl', 'faviconUrl', 'copyright',
        'supportEmail', 'supportPhone', 'address', 'workingHours', 'headquarters',
        'whatsappNumbers', 'linkedin', 'twitter', 'youtube', 'instagram', 'facebook',

    ]
    const saveSettings = async () => {
        const payload = {}
        ALLOWED_SETTINGS.forEach(k => { if (k in settingsForm) payload[k] = settingsForm[k] })
        if (settingsForm.whatsappNumbers) {
            payload.whatsappNumbers = settingsForm.whatsappNumbers.filter(w => w.number?.trim())
            payload.whatsappNumbers.forEach(w => { w.number = w.number.replace(/[^0-9+]/g, '') })
        }
        if (payload.supportEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.supportEmail)) {
            return alert('Invalid support email address.')
        }
        if (payload.logoUrl && !/^https?:\/\/.+/.test(payload.logoUrl)) {
            return alert('Logo URL must start with http:// or https://')
        }
        if (payload.faviconUrl && !/^https?:\/\/.+/.test(payload.faviconUrl)) {
            return alert('Favicon URL must start with http:// or https://')
        }
        try {
            await setDoc(doc(db, 'settings', 'site'), { ...payload, updated_at: serverTimestamp(), updated_by: currentUser?.email }, { merge: true })
            toast('Settings saved.', 'success')
            setSettingsForm(prev => ({ ...prev, ...payload }))
        } catch (err) { console.error('Settings save error:', err); toast('Failed to save settings.', 'error') }
    }
    const initSettings = () => {
        const clean = {}
        ALLOWED_SETTINGS.forEach(k => { if (k in siteSettings) clean[k] = siteSettings[k] })
        setSettingsForm(clean)
    }

    const exportCSV = () => {
        const headers = ['ID', 'Name', 'Email', 'Phone', 'Destination', 'Service', 'Status', 'Submitted', 'Nationality', 'Education']
        const rows = filtered.map(a => [
            a.id, a.full_name || '', a.email || '', a.phone || '',
            a.destination || '', a.program_type || '', a.status || '',
            formatDate(a.created_at), a.nationality || '', a.education_level || ''
        ])
        const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = `applications_${new Date().toISOString().slice(0, 10)}.csv`
        a.click(); URL.revokeObjectURL(url)
    }

    const handleLogout = async () => { await logout(); toast('Logged out.', 'info'); navigate('/') }

    const recentActivity = useMemo(() => {
        const items = []
        applications.filter(a => a.updated_at || a.created_at).slice(0, 10).forEach(a => {
            items.push({ type: a.status === 'pending' ? 'new' : 'updated', app: a, date: a.updated_at || a.created_at })
        })
        contacts.filter(m => !m.read).slice(0, 5).forEach(m => {
            items.push({ type: 'message', msg: m, date: m.created_at })
        })
        items.sort((a, b) => {
            const da = a.date?.toDate ? a.date.toDate() : new Date()
            const db2 = b.date?.toDate ? b.date.toDate() : new Date()
            return db2 - da
        })
        return items.slice(0, 15)
    }, [applications, contacts])

    const switchTab = (key) => {
        setActiveTab(key)
        setSidebarOpen(false)
    }

    const pageTitle = navItems.find(n => n.key === activeTab)?.label || 'Dashboard'

    const renderOverview = () => (
        <>
            <div className="admin-kpi-row">
                <div className="kpi-card">
                    <div className="kpi-icon blue"><ClipboardList size={24} /></div>
                    <div className="kpi-data">
                        <span className="label">Total Applications</span>
                        <span className="val">{stats.total}</span>
                        <span className="kpi-sub">{stats.visaApps} visa \u2022 {stats.flightBookings} flights</span>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon orange"><Clock size={24} /></div>
                    <div className="kpi-data">
                        <span className="label">Pending Review</span>
                        <span className="val">{stats.pending}</span>
                        <span className="kpi-sub">{stats.processing} in processing</span>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon green"><CheckCircle size={24} /></div>
                    <div className="kpi-data">
                        <span className="label">Approved</span>
                        <span className="val">{stats.approved}</span>
                        <span className="kpi-sub">{stats.rejected} rejected</span>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon purple"><Users size={24} /></div>
                    <div className="kpi-data">
                        <span className="label">Unique Users</span>
                        <span className="val">{stats.uniqueUsers}</span>
                        <span className="kpi-sub">{stats.unread} unread messages</span>
                    </div>
                </div>
            </div>
            <div className="admin-dash-grid">
                <div className="admin-table-card">
                    <div className="card-header">
                        <div className="card-title-group">
                            <TrendingUp size={20} className="title-icon" />
                            <h3>Recent Activity</h3>
                        </div>
                    </div>
                    <div className="recent-activity">
                        {loading ? (
                            <div className="admin-loading"><Loader2 size={24} className="animate-spin" /></div>
                        ) : recentActivity.length === 0 ? (
                            <div className="admin-empty" style={{ padding: '2rem' }}><Info size={40} /><p>No recent activity</p></div>
                        ) : (
                            recentActivity.map((item, i) => (
                                <div key={i} className="activity-item">
                                    <div className={`activity-icon ${item.type === 'message' ? 'msg' : item.app?.status === 'pending' ? 'new' : 'updated'}`}>
                                        {item.type === 'message' ? <Mail size={14} /> : item.app?.status === 'pending' ? <Star size={14} /> : <RefreshCw size={14} />}
                                    </div>
                                    <div className="activity-content">
                                        {item.type === 'message' ? (
                                            <><strong>{item.msg?.name}</strong> sent a message</>
                                        ) : (
                                            <><strong>{item.app?.full_name || 'Someone'}</strong> {item.app?.status === 'pending' ? 'submitted' : 'updated'} an application{item.app?.program_type && <> for <em>{item.app.program_type.replace(/_/g, ' ')}</em></>}</>
                                        )}
                                        <span className="activity-time">{timeAgo(item.date)}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="admin-table-card">
                    <div className="card-header">
                        <div className="card-title-group">
                            <PieChart size={20} className="title-icon" />
                            <h3>Status Breakdown</h3>
                        </div>
                    </div>
                    <div className="status-breakdown">
                        {[
                            { label: 'Pending', count: stats.pending, color: '#b45309', bg: '#fef3c7' },
                            { label: 'Processing', count: stats.processing, color: '#6d28d9', bg: '#ede9fe' },
                            { label: 'Approved', count: stats.approved, color: '#15803d', bg: '#dcfce7' },
                            { label: 'Rejected', count: stats.rejected, color: '#b91c1c', bg: '#fee2e2' },
                        ].map(s => {
                            const pct = stats.total ? Math.round(s.count / stats.total * 100) : 0
                            return (
                                <div key={s.label} className="status-bar-row">
                                    <div className="sbr-label"><span className="sbr-dot" style={{ background: s.color }} /><span>{s.label}</span></div>
                                    <div className="sbr-bar-track"><div className="sbr-bar-fill" style={{ width: `${pct}%`, background: s.color }} /></div>
                                    <span className="sbr-count">{s.count} ({pct}%)</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )

    const renderApplications = () => (
        <>
            <div className="admin-filter-bar">
                <div className="search-box">
                    <Search size={18} className="s-icon" />
                    <input type="text" placeholder="Search by name, email, or destination..." value={search} onChange={e => setSearch(e.target.value)} />
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
                            {SERVICE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                    <button onClick={exportCSV} className="filter-btn" title="Export CSV"><Download size={18} /></button>
                </div>
            </div>
            <div className="admin-table-card">
                {loading ? (
                    <div className="admin-loading"><Loader2 size={40} className="animate-spin" /><p>Loading applications...</p></div>
                ) : filtered.length === 0 ? (
                    <div className="admin-empty"><ClipboardList size={60} /><h3>No applications match your criteria</h3><p>Try adjusting your filters or search terms</p></div>
                ) : (
                    <>
                        <div className="admin-table-overflow">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Applicant</th>
                                        <th>Contact</th>
                                        <th>Service</th>
                                        <th>Destination</th>
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
                                                    <div className="u-info"><span className="n">{a.full_name || 'Unknown'}</span><span className="e">{a.nationality || ''}</span></div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="contact-info-cell">
                                                    <span><Mail size={11} /> {a.email || '\u2014'}</span>
                                                    {a.phone && <span><Phone size={11} /> {a.phone}</span>}
                                                </div>
                                            </td>
                                            <td><span className="service-type">{a.program_type?.replace(/_/g, ' ') || '\u2014'}</span></td>
                                            <td><div className="destination-pill"><Globe size={12} /><span>{a.destination || '\u2014'}</span></div></td>
                                            <td><div className="date-cell"><Calendar size={12} /><span>{formatDate(a.created_at)}</span></div></td>
                                            <td>
                                                <div className={`status-pill-admin ${statusConfig[a.status]?.class || 'st-pending'}`}>
                                                    {statusConfig[a.status]?.icon}<span>{statusConfig[a.status]?.label || a.status}</span>
                                                </div>
                                            </td>
                                            <td className="actions-col">
                                                <div className="admin-action-btns">
                                                    <button onClick={() => setSelectedApp(a)} className="btn-act view" title="View Details"><Eye size={16} /></button>
                                                    {a.status !== 'approved' && <button onClick={() => { setShowNoteInput(a.id); updateStatus(a.id, 'approved') }} className="btn-act app" title="Approve"><Check size={16} /></button>}
                                                    {a.status !== 'processing' && <button onClick={() => { setShowNoteInput(a.id); updateStatus(a.id, 'processing') }} className="btn-act pro" title="Process"><RefreshCw size={16} /></button>}
                                                    {a.status !== 'rejected' && <button onClick={() => { setShowNoteInput(a.id); updateStatus(a.id, 'rejected') }} className="btn-act rej" title="Reject"><XCircle size={16} /></button>}
                                                    <button onClick={() => setDeleteConfirm(a.id)} className="btn-act del" title="Delete"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="admin-table-footer">
                            <span>Showing {filtered.length} of {applications.length} results</span>
                            <span className="last-sync">Live \u2014 updates in real time</span>
                        </div>
                    </>
                )}
            </div>
        </>
    )

    const renderMessages = () => (
        <div className="admin-split-layout">
            <div className="admin-table-card msg-list-panel">
                <div className="card-header">
                    <div className="card-title-group"><MessageSquare size={20} className="title-icon" /><h3>Contact Messages</h3></div>
                    <div className="filters-group">
                        <div className="filter-select-wrap">
                            <select value={messageFilter} onChange={e => setMessageFilter(e.target.value)}>
                                <option value="all">All ({contacts.length})</option>
                                <option value="unread">Unread ({stats.unread})</option>
                                <option value="read">Read ({contacts.length - stats.unread})</option>
                            </select>
                        </div>
                    </div>
                </div>
                {filteredMessages.length === 0 ? (
                    <div className="admin-empty" style={{ padding: '3rem' }}><MessageSquare size={50} /><h3>No messages found</h3><p>Contact form submissions will appear here.</p></div>
                ) : (
                    <div className="msg-list">
                        {filteredMessages.map(m => (
                            <div key={m.id} className={`msg-item ${!m.read ? 'unread' : ''} ${selectedMsg?.id === m.id ? 'selected' : ''}`} onClick={() => { setSelectedMsg(m); if (!m.read) markMessageRead(m.id, true) }}>
                                <div className="msg-item-avatar">{m.name?.charAt(0) || '?'}</div>
                                <div className="msg-item-content">
                                    <div className="msg-item-header"><span className="msg-item-name">{m.name || 'Unknown'}</span><span className="msg-item-time">{timeAgo(m.created_at)}</span></div>
                                    <span className="msg-item-subject">{m.subject || 'General'}</span>
                                    <span className="msg-item-preview">{m.message?.slice(0, 80)}...</span>
                                </div>
                                {!m.read && <div className="msg-unread-dot" />}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {selectedMsg ? (
                <div className="admin-table-card msg-detail-panel">
                    <div className="card-header">
                        <div className="card-title-group"><Mail size={20} className="title-icon" /><h3>Message Details</h3></div>
                        <div className="msg-detail-actions">
                            {selectedMsg.read && <button onClick={() => markMessageRead(selectedMsg.id, false)} className="filter-btn" title="Mark unread"><EyeOff size={16} /></button>}
                            <button onClick={() => deleteMessage(selectedMsg.id)} className="filter-btn del" title="Delete"><Trash2 size={16} /></button>
                            <button onClick={() => setSelectedMsg(null)} className="filter-btn" title="Close"><X size={16} /></button>
                        </div>
                    </div>
                    <div className="msg-detail-body">
                        <div className="msg-detail-header"><h2>{selectedMsg.name || 'Unknown'}</h2><span className="msg-detail-subject">{selectedMsg.subject || 'General Inquiry'}</span></div>
                        <div className="msg-detail-meta">
                            <div className="msg-meta-item"><Mail size={14} /><a href={`mailto:${selectedMsg.email}`}>{selectedMsg.email}</a></div>
                            {selectedMsg.phone && <div className="msg-meta-item"><Phone size={14} /><a href={`tel:${selectedMsg.phone}`}>{selectedMsg.phone}</a></div>}
                            <div className="msg-meta-item"><Calendar size={14} /><span>{formatDate(selectedMsg.created_at)}</span></div>
                            {selectedMsg.read && <div className="msg-meta-item"><Eye size={14} /><span>Read {timeAgo(selectedMsg.read_at)}</span></div>}
                        </div>
                        <div className="msg-detail-message"><p>{selectedMsg.message}</p></div>
                        <div className="msg-detail-reply">
                            <a href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject || 'Your Inquiry'}`} className="admin-btn-primary"><Send size={16} /> Reply via Email</a>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="admin-table-card msg-detail-panel msg-select-hint">
                    <div className="admin-empty"><Mail size={50} /><h3>Select a message</h3><p>Click on a message from the list to view its details.</p></div>
                </div>
            )}
        </div>
    )

    const renderUsers = () => (
        <div className="admin-table-card">
            <div className="card-header">
                <div className="card-title-group"><Users size={20} className="title-icon" /><h3>Registered Users</h3></div>
                <span className="card-badge">{stats.uniqueUsers} unique</span>
            </div>
            {usersList.length === 0 ? (
                <div className="admin-empty"><Users size={60} /><h3>No users yet</h3><p>Users who submit applications will appear here.</p></div>
            ) : (
                <>
                    <div className="admin-table-overflow">
                        <table className="admin-table">
                            <thead>
                                <tr><th>User</th><th>Email</th><th>Phone</th><th>Applications</th><th>Last Active</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {usersList.map(u => {
                                    const latestStatus = applications.filter(a => (a.user_email || a.email) === u.email)
                                        .sort((a, b) => {
                                            const da = a.updated_at?.toDate?.() || a.created_at?.toDate?.() || new Date(0)
                                            const db2 = b.updated_at?.toDate?.() || b.created_at?.toDate?.() || new Date(0)
                                            return db2 - da
                                        })[0]?.status
                                    return (
                                        <tr key={u.email}>
                                            <td><div className="user-cell"><div className="u-avatar">{u.name?.charAt(0) || 'U'}</div><div className="u-info"><span className="n">{u.name}</span></div></div></td>
                                            <td><span className="user-email-cell">{u.email}</span></td>
                                            <td><span className="user-phone-cell">{u.phone || '\u2014'}</span></td>
                                            <td><span className="user-count-cell">{u.appCount}</span></td>
                                            <td><div className="date-cell"><Calendar size={12} /><span>{formatDateShort(u.lastActive)}</span></div></td>
                                            <td>{latestStatus ? <div className={`status-pill-admin ${statusConfig[latestStatus]?.class || 'st-pending'}`}>{statusConfig[latestStatus]?.icon}<span>{statusConfig[latestStatus]?.label || latestStatus}</span></div> : <span className="text-muted">\u2014</span>}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="admin-table-footer"><span>{usersList.length} unique users</span></div>
                </>
            )}
        </div>
    )

    const renderSettings = () => {
        const sf = (key) => settingsForm[key] !== undefined ? settingsForm[key] : siteSettings?.[key] ?? ''
        const set = (key, val) => setSettingsForm(f => ({ ...f, [key]: val }))
        const whatsAppNumbers = settingsForm.whatsappNumbers || siteSettings?.whatsappNumbers || []
        const protectedNote = (label, value) => (
            <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lock size={12} style={{ opacity: 0.5 }} /> {label} <span className="status-badge-live" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>Protected</span></label>
                <div className="protected-value">{value}</div>
            </div>
        )
        return (
            <>
                <div className="admin-filter-bar">
                    <div className="filters-group">
                        <button className="admin-btn-primary" onClick={initSettings}><RefreshCw size={16} /> Reset Form</button>
                        <button className="admin-btn-success" onClick={saveSettings}><Check size={16} /> Save Changes</button>
                        {settingsSaved && <span className="save-toast">Settings saved!</span>}
                    </div>
                </div>

                {/* ── Branding (read-only) ── */}
                <div className="admin-table-card">
                    <div className="card-header"><div className="card-title-group"><Globe size={18} className="title-icon" /><h3>Branding</h3></div></div>
                    <div className="settings-body">
                        <div className="form-row">
                            {protectedNote('Site Name', 'TRAVELIUM')}
                            {protectedNote('Tagline', 'Grobal')}
                        </div>
                        {protectedNote('Site ID', 'traveliumgrobal')}
                        <div className="form-group"><label>Site Description</label><textarea className="admin-note-input" rows="2" value={sf('description')} onChange={e => set('description', e.target.value)} /></div>
                        <div className="form-row">
                            <div className="form-group"><label>Logo URL</label><input className="admin-note-input" value={sf('logoUrl')} onChange={e => set('logoUrl', e.target.value)} placeholder="https://..." /></div>
                            <div className="form-group"><label>Favicon URL</label><input className="admin-note-input" value={sf('faviconUrl')} onChange={e => set('faviconUrl', e.target.value)} placeholder="https://..." /></div>
                        </div>
                        <div className="form-group"><label>Copyright Text</label><input className="admin-note-input" value={sf('copyright')} onChange={e => set('copyright', e.target.value)} /></div>
                    </div>
                </div>

                {/* ── Contact ── */}
                <div className="admin-table-card">
                    <div className="card-header"><div className="card-title-group"><Mail size={18} className="title-icon" /><h3>Contact</h3></div></div>
                    <div className="settings-body">
                        <div className="form-row">
                            <div className="form-group"><label>Support Email</label><input className="admin-note-input" type="email" value={sf('supportEmail')} onChange={e => set('supportEmail', e.target.value)} /></div>
                            <div className="form-group"><label>Support Phone</label><input className="admin-note-input" value={sf('supportPhone')} onChange={e => set('supportPhone', e.target.value)} /></div>
                        </div>
                        <div className="form-group"><label>Address</label><textarea className="admin-note-input" rows="2" value={sf('address')} onChange={e => set('address', e.target.value)} /></div>
                        <div className="form-row">
                            <div className="form-group"><label>Working Hours</label><input className="admin-note-input" value={sf('workingHours')} onChange={e => set('workingHours', e.target.value)} /></div>
                            <div className="form-group"><label>Headquarters</label><input className="admin-note-input" value={sf('headquarters')} onChange={e => set('headquarters', e.target.value)} /></div>
                        </div>
                        <div className="form-group"><label>WhatsApp Numbers</label>
                            {whatsAppNumbers.map((w, i) => (
                                <div key={i} className="form-row" style={{ marginBottom: '0.5rem' }}>
                                    <div className="form-group"><input className="admin-note-input" placeholder="Label" value={w.label} onChange={e => {
                                        const arr = [...whatsAppNumbers]; arr[i] = { ...arr[i], label: e.target.value }; set('whatsappNumbers', arr)
                                    }} /></div>
                                    <div className="form-group"><input className="admin-note-input" placeholder="Number (digits only)" value={w.number} onChange={e => {
                                        const arr = [...whatsAppNumbers]; arr[i] = { ...arr[i], number: e.target.value }; set('whatsappNumbers', arr)
                                    }} /></div>
                                    <button className="btn-act rej" onClick={() => set('whatsappNumbers', whatsAppNumbers.filter((_, j) => j !== i))} title="Remove"><X size={14} /></button>
                                </div>
                            ))}
                            <button className="admin-btn-secondary" style={{ marginTop: '0.5rem' }} onClick={() => set('whatsappNumbers', [...whatsAppNumbers, { label: '', number: '' }])}><Plus size={14} /> Add Number</button>
                        </div>
                    </div>
                </div>

                {/* ── Social Media ── */}
                <div className="admin-table-card">
                    <div className="card-header"><div className="card-title-group"><TrendingUp size={18} className="title-icon" /><h3>Social Media</h3></div></div>
                    <div className="settings-body">
                        <div className="form-row">
                            <div className="form-group"><label>LinkedIn</label><input className="admin-note-input" value={sf('linkedin')} onChange={e => set('linkedin', e.target.value)} placeholder="https://linkedin.com/..." /></div>
                            <div className="form-group"><label>Twitter / X</label><input className="admin-note-input" value={sf('twitter')} onChange={e => set('twitter', e.target.value)} placeholder="https://twitter.com/..." /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label>YouTube</label><input className="admin-note-input" value={sf('youtube')} onChange={e => set('youtube', e.target.value)} placeholder="https://youtube.com/..." /></div>
                            <div className="form-group"><label>Instagram</label><input className="admin-note-input" value={sf('instagram')} onChange={e => set('instagram', e.target.value)} placeholder="https://instagram.com/..." /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label>Facebook</label><input className="admin-note-input" value={sf('facebook')} onChange={e => set('facebook', e.target.value)} placeholder="https://facebook.com/..." /></div>
                            <div className="form-group" />
                        </div>
                    </div>
                </div>

                {/* ── System Info ── */}
                <div className="admin-table-card">
                    <div className="card-header"><div className="card-title-group"><Info size={18} className="title-icon" /><h3>System</h3></div></div>
                    <div className="settings-body">
                        <div className="form-row">
                            <div className="setting-item"><div className="setting-info"><span className="setting-label">Authenticated as</span></div><div className="setting-value"><span className="current-user-badge">{currentUser?.email}</span></div></div>
                            <div className="setting-item"><div className="setting-info"><span className="setting-label">Real-time Sync</span></div><div className="setting-value"><span className="status-badge-live">Active</span></div></div>
                        </div>
                        <div className="setting-item">
                            <div className="setting-info"><span className="setting-label">Data Collections</span></div>
                            <div className="setting-value"><div className="admin-emails-list"><span className="admin-email-chip">applications</span><span className="admin-email-chip">contacts</span><span className="admin-email-chip">services</span><span className="admin-email-chip">transactions</span><span className="admin-email-chip">settings</span></div></div>
                        </div>
                        <div className="setting-item">
                            <div className="setting-info"><span className="setting-label">Security</span></div>
                            <div className="setting-value"><span className="status-badge-live" style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>Protected</span></div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    // ── DOCUMENTS TAB ──
    const renderDocuments = () => {
        const allDocs = applications.flatMap(a => {
            const docs = []
            if (a.documents?.passport) docs.push({ type: 'Passport', url: a.documents.passport, name: a.full_name || 'Unknown', email: a.email, appId: a.id, date: a.created_at, program: a.program_type })
            if (a.documents?.diploma) docs.push({ type: 'Diploma', url: a.documents.diploma, name: a.full_name || 'Unknown', email: a.email, appId: a.id, date: a.created_at, program: a.program_type })
            if (a.documents?.id_card) docs.push({ type: 'ID Card', url: a.documents.id_card, name: a.full_name || 'Unknown', email: a.email, appId: a.id, date: a.created_at, program: a.program_type })
            return docs
        })
        return (
            <div className="admin-table-card">
                <div className="card-header"><div className="card-title-group"><FolderOpen size={20} className="title-icon" /><h3>Uploaded Documents</h3></div><span className="card-badge">{allDocs.length} files</span></div>
                {allDocs.length === 0 ? (
                    <div className="admin-empty"><FileText size={60} /><h3>No documents uploaded</h3><p>Applications with document uploads will appear here.</p></div>
                ) : (
                    <>
                        <div className="admin-table-overflow">
                            <table className="admin-table">
                                <thead><tr><th>Type</th><th>Applicant</th><th>Email</th><th>Service</th><th>Date</th><th>Preview</th></tr></thead>
                                <tbody>
                                    {allDocs.map((d, i) => (
                                        <tr key={`${d.appId}-${i}`}>
                                            <td><span className="doc-type-badge">{d.type}</span></td>
                                            <td>{d.name}</td>
                                            <td><span className="text-muted">{d.email}</span></td>
                                            <td><span className="service-type">{d.program?.replace(/_/g, ' ')}</span></td>
                                            <td><div className="date-cell"><Calendar size={12} /><span>{formatDateShort(d.date)}</span></div></td>
                                            <td><a href={d.url} target="_blank" rel="noreferrer" className="doc-link-sm"><FileText size={14} /> View <ExternalLink size={11} /></a></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="admin-table-footer"><span>{allDocs.length} documents across {applications.length} applications</span></div>
                    </>
                )}
            </div>
        )
    }

    // ── TRANSACTIONS TAB ──
    const renderTransactions = () => {
        const txStatusClass = { paid: 'st-approved', pending: 'st-pending', refunded: 'st-rejected' }
        return (
            <>
                <div className="admin-filter-bar">
                    <div className="filters-group">
                        <button className="admin-btn-primary" onClick={() => { setEditingTx(null); setTxForm({ applicant_name: '', email: '', service_type: '', amount: '', currency: 'USD', status: 'pending', payment_method: '', notes: '' }); setShowTxEditor(true) }}>
                            <Plus size={16} /> New Transaction
                        </button>
                    </div>
                    <span className="card-badge">{transactions.length} records</span>
                </div>
                <div className="admin-table-card">
                    {transactions.length === 0 ? (
                        <div className="admin-empty"><DollarSign size={60} /><h3>No transactions yet</h3><p>Add your first transaction record using the button above.</p></div>
                    ) : (
                        <>
                            <div className="admin-table-overflow">
                                <table className="admin-table">
                                    <thead><tr><th>Name</th><th>Email</th><th>Service</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th className="actions-col">Actions</th></tr></thead>
                                    <tbody>
                                        {transactions.map(t => (
                                            <tr key={t.id}>
                                                <td><strong>{t.applicant_name}</strong></td>
                                                <td><span className="text-muted">{t.email}</span></td>
                                                <td><span className="service-type">{t.service_type?.replace(/_/g, ' ')}</span></td>
                                                <td><strong>{t.currency || 'USD'} {t.amount?.toFixed(2)}</strong></td>
                                                <td><span className="text-muted">{t.payment_method || '\u2014'}</span></td>
                                                <td><div className={`status-pill-admin ${txStatusClass[t.status] || 'st-pending'}`}>{t.status}</div></td>
                                                <td><div className="date-cell"><Calendar size={12} /><span>{formatDateShort(t.created_at)}</span></div></td>
                                                <td>
                                                    <div className="admin-action-btns">
                                                        <button className="btn-act pro" onClick={() => editTx(t)} title="Edit"><Edit3 size={14} /></button>
                                                        <button className="btn-act rej" onClick={() => deleteTx(t.id)} title="Delete"><Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="admin-table-footer">
                                <span>{transactions.length} transactions</span>
                                <span className="last-sync">Total: {transactions.reduce((s, t) => s + (t.amount || 0), 0).toLocaleString()} {transactions[0]?.currency || 'USD'}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Transaction Editor Modal */}
                {showTxEditor && (
                    <div className="admin-modal-overlay" onClick={() => { setShowTxEditor(false); setEditingTx(null) }}>
                        <div className="admin-modal admin-modal-sm" onClick={e => e.stopPropagation()}>
                            <div className="admin-modal-header">
                                <div className="modal-title-group"><DollarSign size={20} className="title-icon" /><h3>{editingTx ? 'Edit Transaction' : 'New Transaction'}</h3></div>
                                <button onClick={() => { setShowTxEditor(false); setEditingTx(null) }} className="modal-close-btn"><X size={18} /></button>
                            </div>
                            <div className="admin-modal-body">
                                <div className="form-row">
                                    <div className="form-group"><label>Applicant Name</label><input className="admin-note-input" value={txForm.applicant_name} onChange={e => setTxForm(f => ({ ...f, applicant_name: e.target.value }))} placeholder="Full name" /></div>
                                    <div className="form-group"><label>Email</label><input className="admin-note-input" type="email" value={txForm.email} onChange={e => setTxForm(f => ({ ...f, email: e.target.value }))} placeholder="Email address" /></div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group"><label>Service Type</label>
                                        <select className="admin-note-input" value={txForm.service_type} onChange={e => setTxForm(f => ({ ...f, service_type: e.target.value }))}>
                                            <option value="">Select service...</option>
                                            {SERVICE_OPTIONS.filter(s => s.value !== 'all').map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group"><label>Amount</label><input className="admin-note-input" type="number" step="0.01" value={txForm.amount} onChange={e => setTxForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" /></div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group"><label>Currency</label>
                                        <select className="admin-note-input" value={txForm.currency} onChange={e => setTxForm(f => ({ ...f, currency: e.target.value }))}>
                                            <option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="RWF">RWF</option>
                                        </select>
                                    </div>
                                    <div className="form-group"><label>Status</label>
                                        <select className="admin-note-input" value={txForm.status} onChange={e => setTxForm(f => ({ ...f, status: e.target.value }))}>
                                            <option value="pending">Pending</option><option value="paid">Paid</option><option value="refunded">Refunded</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group"><label>Payment Method</label><input className="admin-note-input" value={txForm.payment_method} onChange={e => setTxForm(f => ({ ...f, payment_method: e.target.value }))} placeholder="e.g. Momo, Bank Transfer, Cash" /></div>
                                <div className="form-group"><label>Notes</label><textarea className="admin-note-input" rows="2" value={txForm.notes} onChange={e => setTxForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes..." /></div>
                            </div>
                            <div className="admin-modal-footer">
                                <button onClick={() => { setShowTxEditor(false); setEditingTx(null) }} className="admin-btn-secondary">Cancel</button>
                                <button onClick={saveTx} className="admin-btn-primary"><Check size={16} /> {editingTx ? 'Update' : 'Save'} Transaction</button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        )
    }

    // ── SERVICES TAB ──
    const renderServices = () => {
        const grouped = {}
        services.forEach(s => {
            if (!grouped[s.type]) grouped[s.type] = []
            grouped[s.type].push(s)
        })
        const typeLabels = { visa: 'Visa Services', flight: 'Flight Services', study: 'Study Abroad', scholarship: 'Scholarship', other: 'Other Services' }
        return (
            <>
                <div className="admin-filter-bar">
                    <div className="filters-group">
                        <button className="admin-btn-primary" onClick={() => { setEditingService(null); setServiceForm({ name: '', type: 'visa', description: '', price: '', features: '', active: true, featured: false, country: '', flag: '', deadline: '', img: '' }); setShowServiceEditor(true) }}>
                            <Plus size={16} /> New Service
                        </button>
                    </div>
                    <span className="card-badge">{services.length} services</span>
                </div>
                {Object.entries(grouped).length === 0 ? (
                    <div className="admin-table-card">
                        <div className="admin-empty"><Package size={60} /><h3>No services yet</h3><p>Create visa, flight, study, and other service offerings.</p></div>
                    </div>
                ) : (
                    Object.entries(grouped).map(([type, items]) => (
                        <div key={type} className="admin-table-card" style={{ marginBottom: '1rem' }}>
                            <div className="card-header"><div className="card-title-group"><Package size={18} className="title-icon" /><h3>{typeLabels[type] || type}</h3></div><span className="card-badge">{items.length} items</span></div>
                            <div className="admin-table-overflow">
                                <table className="admin-table">
                                    <thead><tr><th>Name</th><th>Description</th><th>Price</th><th>Features</th><th>Status</th><th className="actions-col">Actions</th></tr></thead>
                                    <tbody>
                                        {items.map(s => (
                                            <tr key={s.id}>
                                                <td><strong>{s.name}</strong></td>
                                                <td><span className="text-muted" style={{ maxWidth: 200, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.description}</span></td>
                                                <td><strong>{s.price ? `$${s.price}` : '\u2014'}</strong></td>
                                                <td><span className="text-muted">{(s.features || []).length} features</span></td>
                                                <td><div className={`status-pill-admin ${s.active !== false ? 'st-approved' : 'st-rejected'}`}>{s.active !== false ? 'Active' : 'Inactive'}</div></td>
                                                <td>
                                                    <div className="admin-action-btns">
                                                        <button className="btn-act pro" onClick={() => editService(s)} title="Edit"><Edit3 size={14} /></button>
                                                        <button className="btn-act rej" onClick={() => deleteService(s.id)} title="Delete"><Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                )}

                {/* Service Editor Modal */}
                {showServiceEditor && (
                    <div className="admin-modal-overlay" onClick={() => { setShowServiceEditor(false); setEditingService(null) }}>
                        <div className="admin-modal admin-modal-sm" onClick={e => e.stopPropagation()}>
                            <div className="admin-modal-header">
                                <div className="modal-title-group"><Package size={20} className="title-icon" /><h3>{editingService ? 'Edit Service' : 'New Service'}</h3></div>
                                <button onClick={() => { setShowServiceEditor(false); setEditingService(null) }} className="modal-close-btn"><X size={18} /></button>
                            </div>
                            <div className="admin-modal-body">
                                <div className="form-row">
                                    <div className="form-group"><label>Service Name</label><input className="admin-note-input" value={serviceForm.name} onChange={e => setServiceForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. US Tourist Visa" /></div>
                                    <div className="form-group"><label>Type</label>
                                        <select className="admin-note-input" value={serviceForm.type} onChange={e => setServiceForm(f => ({ ...f, type: e.target.value }))}>
                                            <option value="visa">Visa Services</option><option value="flight">Flight Services</option>
                                            <option value="study">Study Abroad</option><option value="scholarship">Scholarship</option><option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group"><label>Description</label><textarea className="admin-note-input" rows="2" value={serviceForm.description} onChange={e => setServiceForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description of this service..." /></div>
                                <div className="form-row">
                                    <div className="form-group"><label>Price (USD)</label><input className="admin-note-input" type="number" step="0.01" value={serviceForm.price} onChange={e => setServiceForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" /></div>
                                    <div className="form-group"><label>Active</label>
                                        <select className="admin-note-input" value={serviceForm.active ? 'yes' : 'no'} onChange={e => setServiceForm(f => ({ ...f, active: e.target.value === 'yes' }))}>
                                            <option value="yes">Active</option><option value="no">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group"><label>Featured</label>
                                        <select className="admin-note-input" value={serviceForm.featured ? 'yes' : 'no'} onChange={e => setServiceForm(f => ({ ...f, featured: e.target.value === 'yes' }))}>
                                            <option value="no">No</option><option value="yes">Yes</option>
                                        </select>
                                    </div>
                                    <div className="form-group"><label>Image URL</label><input className="admin-note-input" value={serviceForm.img} onChange={e => setServiceForm(f => ({ ...f, img: e.target.value }))} placeholder="https://images.unsplash.com/..." /></div>
                                </div>
                                {serviceForm.type === 'scholarship' && (
                                    <div className="form-row">
                                        <div className="form-group"><label>Country</label><input className="admin-note-input" value={serviceForm.country} onChange={e => setServiceForm(f => ({ ...f, country: e.target.value }))} placeholder="e.g. United Kingdom" /></div>
                                        <div className="form-group"><label>Flag URL</label><input className="admin-note-input" value={serviceForm.flag} onChange={e => setServiceForm(f => ({ ...f, flag: e.target.value }))} placeholder="https://flagcdn.com/w40/gb.png" /></div>
                                    </div>
                                )}
                                {serviceForm.type === 'scholarship' && (
                                    <div className="form-row">
                                        <div className="form-group"><label>Deadline</label><input className="admin-note-input" value={serviceForm.deadline} onChange={e => setServiceForm(f => ({ ...f, deadline: e.target.value }))} placeholder="e.g. Dec 31, 2026" /></div>
                                        <div className="form-group" />
                                    </div>
                                )}
                                <div className="form-group"><label>Features (one per line)</label><textarea className="admin-note-input" rows="4" value={serviceForm.features} onChange={e => setServiceForm(f => ({ ...f, features: e.target.value }))} placeholder="Free consultation&#10;Fast processing&#10;Online tracking" /></div>
                            </div>
                            <div className="admin-modal-footer">
                                <button onClick={() => { setShowServiceEditor(false); setEditingService(null) }} className="admin-btn-secondary">Cancel</button>
                                <button onClick={saveService} className="admin-btn-primary"><Check size={16} /> {editingService ? 'Update' : 'Create'} Service</button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        )
    }

    return (
        <div className="admin-layout">
            {/* Sidebar Overlay (mobile) */}
            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-brand">
                    <div className="sidebar-logo">
                        <Shield size={22} />
                    </div>
                    <div className="sidebar-brand-text">
                        <span>Travelium</span>
                        <small>Admin Panel</small>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => {
                        const count = badgeCount(item.badge)
                        return (
                            <button
                                key={item.key}
                                className={`nav-item ${activeTab === item.key ? 'active' : ''}`}
                                onClick={() => switchTab(item.key)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                                {count > 0 && <span className="nav-badge">{count}</span>}
                            </button>
                        )
                    })}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-pill-large">
                        <div className="avatar-initials">{currentUser?.email?.charAt(0).toUpperCase() || 'A'}</div>
                        <div className="user-details">
                            <span className="user-name">{currentUser?.email?.split('@')[0] || 'Admin'}</span>
                            <span className="user-role">Administrator</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="main-header">
                    <div className="main-header-left">
                        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
                            <Menu size={22} />
                        </button>
                        <div className="main-header-title">
                            <h1>{pageTitle}</h1>
                            <p>Manage your Travelium platform</p>
                        </div>
                    </div>
                    <div className="main-header-right">
                        <div className="header-user-info">
                            <span className="header-email">{currentUser?.email}</span>
                        </div>
                        <div className="header-avatar">{currentUser?.email?.charAt(0).toUpperCase() || 'A'}</div>
                    </div>
                </header>

                <div className="main-content">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'applications' && renderApplications()}
                    {activeTab === 'documents' && renderDocuments()}
                    {activeTab === 'transactions' && renderTransactions()}
                    {activeTab === 'services' && renderServices()}
                    {activeTab === 'messages' && renderMessages()}
                    {activeTab === 'users' && renderUsers()}
                    {activeTab === 'settings' && renderSettings()}
                </div>
            </main>

            {/* Application Detail Modal */}
            {selectedApp && (
                <div className="admin-modal-overlay" onClick={() => { setSelectedApp(null); setStatusNote('') }}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <div className="modal-title-group"><FileText size={22} className="title-icon" /><h3>Application Details</h3></div>
                            <button onClick={() => { setSelectedApp(null); setStatusNote('') }} className="modal-close-btn"><X size={20} /></button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="detail-section">
                                <h4>Personal Information</h4>
                                <div className="detail-grid">
                                    <div className="detail-item"><label>Full Name</label><span>{selectedApp.full_name || '\u2014'}</span></div>
                                    <div className="detail-item"><label>Email</label><span><a href={`mailto:${selectedApp.email}`}>{selectedApp.email || '\u2014'}</a></span></div>
                                    <div className="detail-item"><label>Phone</label><span><a href={`tel:${selectedApp.phone}`}>{selectedApp.phone || '\u2014'}</a></span></div>
                                    <div className="detail-item"><label>Nationality</label><span>{selectedApp.nationality || '\u2014'}</span></div>
                                    <div className="detail-item"><label>Education</label><span>{selectedApp.education_level || '\u2014'}</span></div>
                                    <div className="detail-item"><label>User ID</label><span className="text-mono">{selectedApp.user_id || '\u2014'}</span></div>
                                </div>
                            </div>
                            <div className="detail-section">
                                <h4>Application Details</h4>
                                <div className="detail-grid">
                                    <div className="detail-item"><label>Service Type</label><span className="service-type">{selectedApp.program_type?.replace(/_/g, ' ') || '\u2014'}</span></div>
                                    <div className="detail-item"><label>Destination</label><span><Globe size={14} /> {selectedApp.destination || '\u2014'}</span></div>
                                    <div className="detail-item"><label>Status</label><div className={`status-pill-admin ${statusConfig[selectedApp.status]?.class || 'st-pending'}`}>{statusConfig[selectedApp.status]?.icon}<span>{statusConfig[selectedApp.status]?.label || selectedApp.status}</span></div></div>
                                    <div className="detail-item"><label>Submitted</label><span>{formatDate(selectedApp.created_at)}</span></div>
                                    <div className="detail-item"><label>Last Updated</label><span>{formatDate(selectedApp.updated_at)}</span></div>
                                    {selectedApp.admin_note && <div className="detail-item"><label>Admin Note</label><span className="admin-note-text">{selectedApp.admin_note}</span></div>}
                                </div>
                            </div>
                            {selectedApp.message && (
                                <div className="detail-section"><h4>Additional Message</h4><div className="detail-message-box"><p>{selectedApp.message}</p></div></div>
                            )}
                            {selectedApp.documents && (
                                <div className="detail-section">
                                    <h4>Documents</h4>
                                    <div className="detail-docs">
                                        {selectedApp.documents.passport && <a href={selectedApp.documents.passport} target="_blank" rel="noreferrer" className="doc-link"><FileText size={16} /> View Passport <ExternalLink size={12} /></a>}
                                        {selectedApp.documents.diploma && <a href={selectedApp.documents.diploma} target="_blank" rel="noreferrer" className="doc-link"><FileText size={16} /> View Diploma <ExternalLink size={12} /></a>}
                                        {selectedApp.documents.id_card && <a href={selectedApp.documents.id_card} target="_blank" rel="noreferrer" className="doc-link"><FileText size={16} /> View ID Card <ExternalLink size={12} /></a>}
                                        {!selectedApp.documents.passport && !selectedApp.documents.diploma && !selectedApp.documents.id_card && <span className="text-muted">No documents uploaded</span>}
                                    </div>
                                </div>
                            )}
                            {selectedApp.program_type === 'flight_booking' && (
                                <div className="detail-section">
                                    <h4>Flight Details</h4>
                                    <div className="detail-grid">
                                        <div className="detail-item"><label>Trip Type</label><span>{selectedApp.trip_type || '\u2014'}</span></div>
                                        <div className="detail-item"><label>Origin</label><span>{selectedApp.origin || '\u2014'}</span></div>
                                        <div className="detail-item"><label>Departure</label><span>{selectedApp.departure_date || '\u2014'}</span></div>
                                    </div>
                                </div>
                            )}
                            {showNoteInput === selectedApp.id && (
                                <div className="detail-section">
                                    <h4>Status Note (optional)</h4>
                                    <input type="text" className="admin-note-input" placeholder="Add a note about this status change..." value={statusNote} onChange={e => setStatusNote(e.target.value)} />
                                </div>
                            )}
                        </div>
                        <div className="admin-modal-footer">
                            <div className="modal-actions-left">
                                <button onClick={() => { setDeleteConfirm(selectedApp.id); setSelectedApp(null) }} className="admin-btn-danger"><Trash2 size={16} /> Delete</button>
                            </div>
                            <div className="modal-actions-right">
                                <button onClick={() => { setSelectedApp(null); setStatusNote('') }} className="admin-btn-secondary">Close</button>
                                {selectedApp.status !== 'processing' && <button onClick={() => updateStatus(selectedApp.id, 'processing')} className="admin-btn-primary" disabled={updating === selectedApp.id}><RefreshCw size={16} /> Process</button>}
                                {selectedApp.status !== 'approved' && <button onClick={() => updateStatus(selectedApp.id, 'approved')} className="admin-btn-success" disabled={updating === selectedApp.id}><Check size={16} /> Approve</button>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deleteConfirm && (
                <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="admin-modal admin-modal-sm" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <div className="modal-title-group"><AlertTriangle size={22} style={{ color: 'var(--error)' }} /><h3>Confirm Delete</h3></div>
                        </div>
                        <div className="admin-modal-body"><p>Are you sure you want to delete this application? This action cannot be undone.</p></div>
                        <div className="admin-modal-footer">
                            <button onClick={() => setDeleteConfirm(null)} className="admin-btn-secondary">Cancel</button>
                            <button onClick={() => deleteApplication(deleteConfirm)} className="admin-btn-danger"><Trash2 size={16} /> Delete Permanently</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
