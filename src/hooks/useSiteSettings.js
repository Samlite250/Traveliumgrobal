import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'

const defaults = {
  siteName: 'TRAVELIUM',
  tagline: 'Global',
  description: 'Your trusted partner for global career transformation, study abroad, visa services, and travel solutions.',
  logoUrl: '',
  faviconUrl: '',
  metaTitle: 'Travelium | Global Education & Travel Opportunities',
  metaDescription: 'Travelium — Your Gateway to Global Education and Travel Opportunities. Study abroad, visa services, scholarships and more.',
  metaKeywords: 'travel, visa, study abroad, scholarship, work visa, flight booking',
  googleAnalyticsId: '',
  supportEmail: 'traveliumgrobal@gmail.com',
  supportPhone: '+250 782 531 515',
  address: '123 Global Avenue, Suite 400, New York, NY 10001, USA',
  workingHours: 'Mon \u2013 Sat: 9:00 AM \u2013 7:00 PM',
  headquarters: 'Headquartered in Kigali, Rwanda',
  copyright: 'Travelium Global. Licensed Recruitment & Travel Agency.',
  linkedin: '#',
  twitter: '#',
  youtube: '#',
  instagram: '#',
  facebook: '#',
  whatsappNumbers: [
    { label: 'Visas & General Inquiries', number: '250782531515' },
    { label: 'Jobs & Recruitment', number: '250796230619' },
    { label: 'Air Ticketing', number: '250793658206' },
  ],
  adminEmails: ['traveliumgrobal@gmail.com', 'samlite250@gmail.com'],
  maintenanceMode: false,
}

export default function useSiteSettings() {
  const [settings, setSettings] = useState(defaults)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!db) { setLoading(false); return }
    const unsub = onSnapshot(doc(db, 'settings', 'site'), (snap) => {
      if (snap.exists()) {
        setSettings({ ...defaults, ...snap.data() })
      } else {
        setSettings(defaults)
      }
      setLoading(false)
    }, () => { setSettings(defaults); setLoading(false) })
    return unsub
  }, [])

  return { settings, loading }
}
