import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <main style={{
            minHeight: '80vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', textAlign: 'center',
            padding: '2rem', fontFamily: 'Inter, sans-serif'
        }}>
            <img src="/logo.png" alt="Travelium Global" style={{ width: '80px', marginBottom: '1.5rem', filter: 'drop-shadow(0 4px 16px rgba(11,25,44,0.18))' }} />
            <h1 style={{ fontSize: '5rem', fontWeight: '900', color: '#0B192C', margin: 0, lineHeight: 1 }}>404</h1>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#334155', marginTop: '0.5rem', marginBottom: '1rem' }}>Page Not Found</h2>
            <p style={{ color: '#64748b', maxWidth: '420px', marginBottom: '2rem', lineHeight: '1.7' }}>
                The page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>
            <Link to="/" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.8rem 2rem', borderRadius: '12px',
                background: 'linear-gradient(135deg, #0B192C 0%, #1e3a5f 100%)',
                color: '#FFD700', fontWeight: '800', textDecoration: 'none',
                fontSize: '0.95rem', boxShadow: '0 4px 20px rgba(11,25,44,0.25)'
            }}>
                ← Back to Home
            </Link>
        </main>
    )
}
