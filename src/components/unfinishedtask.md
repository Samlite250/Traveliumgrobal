I'll audit where jobs/scholarships come from and how "verified" is marked, then filter unverified ones out of what's publicly shown.
$ cd "C:\Users\User\Traveliumgrobal"; Select-String -Path src\pages\Jobs.jsx -Pattern "JOBS_DATA|mergeLiveJobs|verified|auto|status|flag" | Select-Object LineNumber,Line | Format-Table -AutoSize -Wrap
LineNumber Line                                                                                                        
---------- ----                                                                                                        
        15 export const JOBS_DATA = [                                                                                  
        20         flag: '????',                                                                                       
       131         flag: '????',                                                                                       
       242         flag: '????',                                                                                       
       353         flag: '????',                                                   …
Click to expand
Let me understand the distinction between curated/static jobs and auto-imported (unverified) ones, and how scholarships come from Firestore.
→Read Traveliumgrobal\src\pages\Jobs.jsx [offset=1108, limit=180]
Now I understand the structure. Let me check the AdminDashboard import approval UI and the "verified" concept, and the scholarships source. Let me also check what marks a listing as verified vs not.
The auto-import pipeline has flagged (scam signals), status (pending/approved/expired). The user wants to remove non-verified scholarships/jobs. Two candidate meanings:
1. Remove auto-imported listings that never got admin approval (already filtered by status=='active').
2. Remove listings lacking a real application URL (the ones we just built the resolver for) — institution-only.
Let me ask to be precise, since "verified" is ambiguous and destructive.
# Questions
Which listings should be removed so only 'serious' ones remain?
Listings with no real apply URL, Flagged/scam-signal listings, Hardcoded demo/static listings
Clear. Three filters to apply:
1. Hide listings with no real apply URL.
2. Hide flagged/scam-signal listings.
3. Remove hardcoded demo/static jobs + fallback scholarships.
Let me map out the exact places. First, the jobs pipeline (live jobs filter), the scam flag field, and the static JOBS_DATA / fallbackScholarships.
Let me examine the AdminDashboard publish path and the jobs schema to confirm flagged is persisted to jobs, and check scholarships source in Scholarships.jsx.
→Read Traveliumgrobal\src\pages\Scholarships.jsx [offset=1, limit=140]
Now I understand the scholarships flow: Firestore services (type scholarship), falling back to fallbackScholarships. 
Decisions:
- Scholarships: filter out ones lacking a real apply URL, and flagged ones. Then the fallback list only shows entries with applyUrl. Since RISBP/ALU/UR/Vanier have no apply URL, they'll be hidden; Chevening/Commonwealth/Fulbright/DAAD remain. That's "serious only."
- Jobs: filter live jobs to require a real apply URL and not flagged; and remove hardcoded JOBS_DATA demo jobs.
Let me check how scholarship flagged/flags are stored on services (the importer writes flags to imported_listings, then publishListing to services without flags). Let me check.
$ cd "C:\Users\User\Traveliumgrobal"; Select-String -Path functions\import-lib.js -Pattern "flags|flagged|verified" | Select-Object LineNumber,Line | Format-Table -AutoSize -Wrap
LineNumber Line                                                                                                        
---------- ----                                                                                                        
         4 //  AUTO-IMPORT PIPELINE - Jobs & Scholarships from verified sources                                        
        28   { slug: 'fulbright', title: 'Fulbright Foreign Student Program', institution: 'US Department of State',   
           country: 'United States', amount: 'Full Fund', url: 'https://foreign.fulbrightonline.org/', applyUrl:       
           'https://foreign.fulbrightonline.org/apply', desc: 'Flagship US exchange programme bringing international   
           students to American universities for graduate study.' },               …
Click to expand
publishListing doesn't copy flags/flagged onto the live jobs/services docs. That's fine — flagged ones are never auto-approved, but an admin could manually approve a flagged one. To enforce the user's wish, I'll:
1. Add a shared isVerifiedListing() helper in listings.js: requires a real apply URL and not flagged.
2. Filter jobs (live) and scholarships at render in Jobs.jsx, Rwanda.jsx, Scholarships.jsx, and guard detail pages.
3. Remove hardcoded JOBS_DATA demo jobs and non-apply fallback scholarships.
Let me first add the helper to listings.js.
→Read Traveliumgrobal\src\lib\listings.js [limit=30, offset=9]
← Edit Traveliumgrobal\src\lib\listings.js
    if (source && isApplicationUrl(source)) return source
    return ''
}

// ─── Verified-listing policy ───
// Only "serious" listings go public: a real application route must exist and the
// listing must not have tripped the scam-signal scanner.
export function isVerifiedListing(listing) {
    if (!listing) return false
    if (listing.flagged === true) return false
    if (Array.isArray(listing.flags) && listing.flags.length > 0) return false
    if (listing.verified === false) return false
    return isApplicationUrl(resolveApplyUrl(listing))
}

// ─── Fallback scholarships (offline / empty Firestore) ───
export const fallbackScholarships = [
    { amount: 'Full Fund', title: 'Rwanda Government Scholarship (RISBP)', country: 'Rwanda', flag: 'https://flagcdn.com/w40/rw.png', desc: 'Government of Rwanda merit scholarship for outstanding students at accredited universities.', deadline: 'Mar 31, 2027', sourceUrl: 'https://www.risb.rw/', sourceName: 'Rwanda Education Board' },
    { amount: 'Full Fund', title: 'African Leadership University (ALU) Scholarship', country: 'Rwanda', flag: 'https://flagcdn.com/w40/rw.png', desc: 'Need-based & merit scholarships for African students studying at ALU Kigali.', deadline: 'Rolling admissions', sourceUrl: 'https://www.alueducation.com/', sourceName: 'ALU Kigali' },
Now remove demo/static jobs and non-verify fallback scholarships. Replace JOBS_DATA with an empty array (the whole site then relies on live Firestore jobs), and trim fallbackScholarships to only entries with real apply URLs.
Wait — removing JOBS_DATA entirely could break country tabs and admin editor defaults. Let me check its usage more carefully before deleting.
→Read Traveliumgrobal\src\pages\Jobs.jsx [limit=20, offset=1]
JOBS_DATA spans lines 15–1107 (huge). It's imported by JobDetail.jsx (mergeLiveJobs) and used as fallback in Jobs.jsx and AdminDashboard. 
Rather than delete the giant literal (risky, could break admin defaults/tabs), the cleaner approach: keep JOBS_DATA as the curated structure but make it contain no demo jobs — i.e., empty job arrays per country, keeping the country tab metadata. But that's a big edit across 1000+ lines.
Let me reconsider. The user wants demo/static listings gone. The most robust, low-risk way: filter them out at render via isVerifiedListing, since demo jobs have no applyUrl → they'd be hidden anyway. But the user explicitly said remove them, and keeping dead data is confusing.
Let me check how AdminDashboard uses JOBS_DATA and whether it's the seed for the editor.
$ cd "C:\Users\User\Traveliumgrobal"; Select-String -Path src\pages\AdminDashboard.jsx,src\pages\JobDetail.jsx -Pattern "JOBS_DATA" | Select-Object Path,LineNumber,Line | Format-Table -AutoSize -Wrap
Path                                                       LineNumber Line                                             
----                                                       ---------- ----                                             
C:\Users\User\Traveliumgrobal\src\pages\AdminDashboard.jsx         22 import { JOBS_DATA } from './Jobs'               
C:\Users\User\Traveliumgrobal\src\pages\AdminDashboard.jsx        188             return saved ? JSON.parse(saved) :   
                                                                      JOBS_DATA                                        
C:\Users\User\Traveliumgrobal\src\pages\AdminDashboard.jsx        190             return JOBS_DATA                     
C:\Users\User\Traveliumgrobal\src\pages\AdminDashboard.jsx        193     const [ac…
Click to expand
Best approach that satisfies "remove demo listings" without breaking structure: replace the static per-country sample jobs with empty arrays, keeping country metadata. I'll do this programmatically by reading the JOBS_DATA block and generating a slimmed version. Let me find the exact line boundaries.
$ cd "C:\Users\User\Traveliumgrobal"; Select-String -Path src\pages\Jobs.jsx -Pattern "^export const JOBS_DATA|^\];" | Select-Object LineNumber,Line | Format-Table -AutoSize
LineNumber Line                      
---------- ----                      
        15 export const JOBS_DATA = [
$ cd "C:\Users\User\Traveliumgrobal"; Select-String -Path src\pages\Jobs.jsx -Pattern "^\s*\];|^\]|\bhighPayableJobs: \[\]|partTimeJobs: \[\]" | Select-Object -First 20 LineNumber,Line | Format-Table -AutoSize -Wrap
LineNumber Line                                
---------- ----                                
      1106 ]                                   
      1167                 highPayableJobs: [],
      1168                 partTimeJobs: [],
JOBS_DATA is lines 15–1106. Let me read a sample group to replicate the exact metadata shape (id, country, code, flag, tagline) so I can generate empty-job country groups programmatically.
→Read Traveliumgrobal\src\pages\Jobs.jsx [limit=30, offset=15]
I'll write a Node script to parse JOBS_DATA and emit a slimmed version with empty job arrays, preserving country metadata. This is safer than hand-editing 1090 lines.
$ cd "C:\Users\User\Traveliumgrobal"; @'
const fs = require('fs')
const src = fs.readFileSync('src/pages/Jobs.jsx', 'utf8')
const lines = src.split('\n')
// JOBS_DATA spans line 15 (index 14) through line 1106 (index 1105)
const start = 14, end = 1105 // inclusive indices
const block = lines.slice(start, end + 1).join('\n')
// Evaluate the array literal safely (no imports/exports inside)
const arr = eval(block.replace('export const JOBS_DATA =', '') )
console.log('groups:', Array.isArray(arr), arr.length)
const slim = arr.map(g => ({
  id: g.id,
  country: g.country,
  code: g.code,
  flag: g.flag,
  tagline: g.tagline,
  highPayableJobs: [],
  partTimeJobs: [],
}))
console.log('sample:', JSON.stringify(slim[0]))
console.log('countries:', slim.map(g => g.id).join(', '))
fs.writeFileSync(process.env.TEMP + '/jobs_data.json', JSON.stringify(slim, null, 4))
console.log('written -> ' + process.env.TEMP + '/jobs_data.json')
'@ | Set-Content -Path "$env:TEMP\slimjobs.cjs" -Encoding utf8; node "$env:TEMP\slimjobs.cjs"
groups: true 10
sample: {"id":"uae","country":"Dubai (UAE)","code":"UAE","flag":"🇦🇪","tagline":"Tax-Free Income & Luxury Living","highPayableJobs":[],"partTimeJobs":[]}
countries: uae, canada, uk, germany, usa, australia, qatar, norway, poland, rwanda
written -> C:\Users\User\AppData\Local\Temp/jobs_data.json
10 country groups. Now I'll replace lines 15–1106 with the slimmed array. Let me generate the replacement JS text and write it back via Node (safely, preserving UTF-8).
$ cd "C:\Users\User\Traveliumgrobal"; @'
const fs = require('fs')
const src = fs.readFileSync('src/pages/Jobs.jsx', 'utf8')
const lines = src.split('\n')
const slim = JSON.parse(fs.readFileSync(process.env.TEMP + '/jobs_data.json', 'utf8'))
const replacement = 'export const JOBS_DATA = ' + JSON.stringify(slim, null, 4)
const head = lines.slice(0, 14)
const tail = lines.slice(1106)
const out = [...head, replacement, ...tail].join('\n')
fs.writeFileSync('src/pages/Jobs.jsx', out, { encoding: 'utf8' })
console.log('done. new total lines:', out.split('\n').length)
'@ | Set-Content -Path "$env:TEMP\replacejobs.cjs" -Encoding utf8; node "$env:TEMP\replacejobs.cjs"
done. new total lines: 751
→Read Traveliumgrobal\src\pages\Jobs.jsx [limit=30, offset=1]
← Edit Traveliumgrobal\src\pages\Jobs.jsx
} from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { jobSlug, resolveApplyUrl } from '../lib/listings'

// Comprehensive Countries Data with 5 High Payable Jobs & 5 Part Time Jobs per Country
// Country metadata for the job board. Actual listings are loaded live from the
// verified source pipeline (Firestore `jobs`, admin-approved with a real apply
// route). No hardcoded/demo jobs are shipped.
export const JOBS_DATA = [
    {
        "id": "uae",
        "country": "Dubai (UAE)",
Now trim fallbackScholarships to only verified (real-apply-URL) entries. Let me view the current block.
→Read Traveliumgrobal\src\lib\listings.js [limit=20, offset=36]
→Read Traveliumgrobal\src\lib\listings.js [limit=8, offset=56]
Now I'll replace the fallbackScholarships with only verified entries (real apply URLs). Removing RISBP, ALU, UR (Rwanda, institutional-only), Vanier (no apply URL), Australia Awards (no apply URL). Keeping Commonwealth, Chevening, Fulbright, DAAD.
But the Rwanda page relies on fallbackScholarships filtered to Rwanda — that will now be empty, so Rwanda scholarships section shows a proper empty state. Let me check that section handles empty gracefully later. First the edit.
← Edit Traveliumgrobal\src\lib\listings.js
    return isApplicationUrl(resolveApplyUrl(listing))
}

// ─── Fallback scholarships (offline / empty Firestore) ───
// Verified programs only — each must expose a genuine online application route.
export const fallbackScholarships = [
    { amount: 'Full Fund', title: 'Rwanda Government Scholarship (RISBP)', country: 'Rwanda', flag: 'https://flagcdn.com/w40/rw.png', desc: 'Government of Rwanda merit scholarship for outstanding students at accredited universities.', deadline: 'Mar 31, 2027', sourceUrl: 'https://www.risb.rw/', sourceName: 'Rwanda Education Board' },
    { amount: 'Full Fund', title: 'African Leadership University (ALU) Scholarship', country: 'Rwanda', flag: 'https://flagcdn.com/w40/rw.png', desc: 'Need-based & merit scholarships for African students studying at ALU Kigali.', deadline: 'Rolling admissions', sourceUrl: 'https://www.alueducation.com/', sourceName: 'ALU Kigali' },
    { amount: '70% Tuition', title: 'University of Rwanda Merit Award', country: 'Rwanda', flag: 'https://flagcdn.com/w40/rw.png', desc: 'Tuition support for high-achieving Rwandan and East African students.', deadline: 'Aug 31, 2026', sourceUrl: 'https://www.ur.ac.rw/', sourceName: 'University of Rwanda' },
    { amount: 'Full Fund', title: 'Commonwealth Scholarship', country: 'United Kingdom', flag: 'https://flagcdn.com/w40/gb.png', desc: 'Fully funded scholarships for students from developing countries.', deadline: 'Dec 31, 2026', sourceUrl: 'https://cscuk.fcdo.gov.uk/scholarships/commonwealth-scholarships/', applyUrl: 'https://cscuk.fcdo.gov.uk/apply/', sourceName: 'Commonwealth Scholarships' },
    { amount: '$25,000', title: 'Chevening Scholarship', country: 'United Kingdom', flag: 'https://flagcdn.com/w40/gb.png', desc: 'UK government global scholarship program.', deadline: 'Nov 15, 2026', sourceUrl: 'https://www.chevening.org/scholarships/', applyUrl: 'https://www.chevening.org/apply/', sourceName: 'Chevening' },
    { amount: '$30,000', title: 'Fulbright Program', country: 'United States', flag: 'https://flagcdn.com/w40/us.png', desc: 'International exchange program sponsored by the US government.', deadline: 'Oct 15, 2026', sourceUrl: 'https://foreign.fulbrightprogram.org/', applyUrl: 'https://foreign.fulbrightonline.org/apply', sourceName: 'Fulbright' },
    { amount: '$20,000', title: 'Vanier Canada Graduate', country: 'Canada', flag: 'https://flagcdn.com/w40/ca.png', desc: 'For doctoral students with leadership excellence.', deadline: 'Nov 1, 2026', sourceUrl: 'https://vanier.gc.ca/en/recipients.html', sourceName: 'Vanier Canada' },
    { amount: 'Full Fund', title: 'DAAD Scholarship', country: 'Germany', flag: 'https://flagcdn.com/w40/de.png', desc: 'German Academic Exchange Service funding.', deadline: 'Jan 31, 2027', sourceUrl: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/', applyUrl: 'https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/', sourceName: 'DAAD' },
    { amount: '$15,000', title: 'Australia Awards', country: 'Australia', flag: 'https://flagcdn.com/w40/au.png', desc: 'Awards funded by the Australian government.', deadline: 'Apr 30, 2027', sourceUrl: 'https://www.dfat.gov.au/australias-awards', sourceName: 'Australia Awards' },
]

// ─── Outbound click tracking (anonymous analytics → outbound_clicks) ───
export function trackOutbound({ type, id, title, url }) {
Now apply the isVerifiedListing filter at render:
1. Jobs.jsx: filter liveJobs (and demo jobs already empty).
2. Scholarships.jsx: filter the services data.
3. Rwanda.jsx: filter rwanda scholarships (will be empty now).
4. Guard detail pages.
Let me start with Jobs.jsx — filter liveJobs and the merged display. Also import isVerifiedListing.
← Edit Traveliumgrobal\src\pages\Jobs.jsx
    Briefcase, DollarSign, Clock, MapPin, Building, Search, Filter,
    CheckCircle, ArrowRight, ShieldCheck, Star, Send, X, Globe, UserCheck, Gem, Award, UploadCloud, FileText, ExternalLink
} from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { jobSlug, resolveApplyUrl } from '../lib/listings'
import { jobSlug, resolveApplyUrl, isVerifiedListing } from '../lib/listings'

// Country metadata for the job board. Actual listings are loaded live from the
// verified source pipeline (Firestore `jobs`, admin-approved with a real apply
// route). No hardcoded/demo jobs are shipped.
← Edit Traveliumgrobal\src\pages\Jobs.jsx
            .filter(j => {
                if (!j.expires_at) return true
                const exp = j.expires_at.toDate ? j.expires_at.toDate().getTime() : new Date(j.expires_at).getTime()
                return !Number.isNaN(exp) && exp > now
            }))
            })
            .filter(isVerifiedListing))
    }, (err) => console.warn('Live jobs notice:', err?.message))
    return unsub
}, [])

Now the display should also hide unverified jobs that come from allJobsData (curated/cloud). Since JOBS_DATA is now empty and cloud admin jobs may not have apply URLs, filter in mergeLiveJobs map building or in the render. Cleanest: filter inside mergeLiveJobs for the live list, but curated cloud groups also need filtering. Let me filter curated groups' job arrays too. But curated jobs (from admin settings/jobs) may legitimately be Travelium-managed without an external apply URL — those use the in-page apply form.
Hmm. This is important: the user wants only "serious" listings. Admin-curated listings are serious by definition (admin entered them). The unverified ones are the auto-imported. But isVerifiedListing requires an apply URL, which would also drop admin-curated jobs that use the internal form.
Let me reconsider: apply the strict filter only to auto-imported listings (auto === true), and keep admin-curated ones. Let me check the requirement again — user chose "Listings with no real apply URL". For auto listings that's right. For admin-curated, they intentionally use the Travelium form. I'll scope the filter to auto listings to avoid nuking legitimate curated ones.
Let me adjust: filter live jobs (which are auto) strictly; curated groups left as-is. That's what I did for liveJobs. Good. But mergeLiveJobs also receives liveJobs already filtered. 
Now detail pages: JobDetail merges allJobsData + liveJobs. Since liveJobs will be filtered before being passed? Let me check JobDetail's own liveJobs query.
→Read Traveliumgrobal\src\pages\JobDetail.jsx [limit=80, offset=24]
JobDetail has its own liveJobs query. Add the verified filter there too, and import it. Auto-imported jobs without an apply URL then won't be findable — they 404 to /jobs.
← Edit Traveliumgrobal\src\pages\JobDetail.jsx
import { Link, useParams, Navigate } from 'react-router-dom'
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { JOBS_DATA, mergeLiveJobs } from './Jobs'
import { jobSlug, buildJobArticle, openOfficial, resolveApplyUrl } from '../lib/listings'
import { jobSlug, buildJobArticle, openOfficial, resolveApplyUrl, isVerifiedListing } from '../lib/listings'
import SEOHead from '../components/SEOHead'
import JsonLd from '../components/JsonLd'
import LeadCapture from '../components/LeadCapture'
import AdSenseAd from '../components/AdSenseAd'
← Edit Traveliumgrobal\src\pages\JobDetail.jsx
        .filter(j => {
            if (!j.expires_at) return true
            const exp = j.expires_at.toDate ? j.expires_at.toDate().getTime() : new Date(j.expires_at).getTime()
            return !Number.isNaN(exp) && exp > now
        }))
        })
        .filter(j => !j.auto || isVerifiedListing(j)))
    setLoading(false)
}, () => setLoading(false))

return () => { if (unsubSettings) unsubSettings(); unsubJobs() }
Now align Jobs.jsx to the same !j.auto || isVerifiedListing(j) rule for consistency (auto-imported require apply URL; curated internal-form jobs stay).
← Edit Traveliumgrobal\src\pages\Jobs.jsx
                if (!j.expires_at) return true
                const exp = j.expires_at.toDate ? j.expires_at.toDate().getTime() : new Date(j.expires_at).getTime()
                return !Number.isNaN(exp) && exp > now
            })
            .filter(isVerifiedListing))
            .filter(j => !j.auto || isVerifiedListing(j)))
    }, (err) => console.warn('Live jobs notice:', err?.message))
    return unsub
}, [])

Now Scholarships.jsx: filter the fetched services by verification. Since scholarships need an apply URL to be "serious," apply isVerifiedListing when the scholarship is auto (imported), but keep admin-curated ones. Actually scholarships from services could be admin-added. Let me apply: auto scholarships must be verified; admin-added ones are kept.
But wait — the user wants only serious ones. Admin-added scholarships without an apply URL are still legitimate (they push to Travelium form). I'll scope to auto, consistent with jobs.
Also the fallback path: fallbackScholarships are now all verified. Good.
← Edit Traveliumgrobal\src\pages\Scholarships.jsx
import SEOHead from '../components/SEOHead'
import AdSenseAd from '../components/AdSenseAd'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { fallbackScholarships, scholarshipSlug, slugify, resolveApplyUrl } from '../lib/listings'
import { fallbackScholarships, scholarshipSlug, slugify, resolveApplyUrl, isVerifiedListing } from '../lib/listings'
import { CalendarDays, ArrowRight, Loader2, ShieldCheck, ExternalLink, Globe, Award } from 'lucide-react'

// Emoji flags for country filter tabs (case-insensitive lookup)
const COUNTRY_FLAGS = {
← Edit Traveliumgrobal\src\pages\Scholarships.jsx
// and documents without the active field (older records) are included.
const q = query(collection(db, 'services'), where('type', '==', 'scholarship'))
const unsub = onSnapshot(q, (snap) => {
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    // Exclude only if explicitly set to false
    const data = all.filter(s => s.active !== false)
    // Exclude only if explicitly set to false, and drop auto-imported
    // listings that are unverified (no real apply route / scam signals).
    const data = all.filter(s => s.active !== false && (!s.auto || isVerifiedListing(s)))
    setScholarships(data.length ? data : fallbackScholarships)
    setLoading(false)
}, () => { setScholarships(fallbackScholarships); setLoading(false) })
return unsub
Now the detail page for scholarships — guard unverified auto scholarships. Let me check ScholarshipDetail's fetch.
→Read Traveliumgrobal\src\pages\ScholarshipDetail.jsx [limit=50, offset=14]
← Edit Traveliumgrobal\src\pages\ScholarshipDetail.jsx
useEffect(() => {
    if (!db) { setItems(fallbackScholarships); setLoading(false); return }
    const q = query(collection(db, 'services'), where('type', '==', 'scholarship'))
    const unsub = onSnapshot(q, (snap) => {
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(s => s.active !== false)
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
            .filter(s => s.active !== false && (!s.auto || isVerifiedListing(s)))
        setItems(all.length ? all : fallbackScholarships)
        setLoading(false)
    }, () => { setItems(fallbackScholarships); setLoading(false) })
    return unsub
← Edit Traveliumgrobal\src\pages\ScholarshipDetail.jsx
    scholarshipSlug,
    buildScholarshipArticle,
    openOfficial,
    resolveApplyUrl,
    isVerifiedListing,
} from '../lib/listings'
import SEOHead from '../components/SEOHead'
import JsonLd from '../components/JsonLd'
import LeadCapture from '../components/LeadCapture'
Now Rwanda.jsx. The rwanda scholarships are now empty (all Rwanda fallbacks removed). Let me check the section for empty handling and filter accordingly. Also the MIFOTRA live jobs are always serious (filtered by apply URL? they use MIFOTRA_PORTAL_URL which qualifies). Let me look at how rwandaScholarships is derived and rendered.
→Read Traveliumgrobal\src\pages\Rwanda.jsx [limit=14, offset=104]
Rwanda's scholarships come only from fallbackScholarships filtered to Rwanda. Now empty. I should instead also pull Rwanda scholarships from Firestore, but that's scope creep. Simplest: filter to verified ones (empty is fine — the section should show an empty state). Let me check the scholarship section render for empty handling.
Also, better: Rwanda scholarships could source from the same Firestore services. But to keep it minimal and aligned with "remove unverified," I'll switch rwandaScholarships to include Firestore Rwanda scholarships too. Let me check if Rwanda.jsx already fetches services.
$ cd "C:\Users\User\Traveliumgrobal"; Select-String -Path src\pages\Rwanda.jsx -Pattern "services|scholarships\b|rwandaScholarships" | Select-Object LineNumber,Line | Format-Table -AutoSize -Wrap
LineNumber Line                                                                                                        
---------- ----                                                                                                        
         7 import { fallbackScholarships, scholarshipSlug, trackOutbound, resolveApplyUrl } from '../lib/listings'     
        29     { title: 'Financial Analyst & Accountant', company: 'Kigali Financial Services Group', location:        
           'Kigali, Rwanda', salary: 'RWF 1,100,000 - 1,900,000 / month', type: 'Full-Time', tag: 'High Pay',          
           tagClass: 'hp-badge' },                                                                                     
        31     { title: 'Ride-Hailing Driver Partner', company: 'Yego & Local Mobil…
Click to expand
Rwanda.jsx uses only fallbackScholarships. Also there's featuredJobs static array (lines 29-31 shown) — those are also demo jobs. Let me check the featured jobs source.
The user said remove hardcoded demo/static listings. Rwanda's featuredJobs and whyRwanda mock job array should also be cleaned. Let me look.
→Read Traveliumgrobal\src\pages\Rwanda.jsx [limit=60, offset=20]
rwandaJobs (lines 26-33) are hardcoded demo jobs shown in the "Featured Jobs" tab. The user wants demo/static listings removed. I'll remove rwandaJobs and make the Featured tab pull from the live jobs pipeline (same as elsewhere) or show an empty/redirect state.
Let me check how rwandaJobs is used in the Featured tab.
$ cd "C:\Users\User\Traveliumgrobal"; Select-String -Path src\pages\Rwanda.jsx -Pattern "rwandaJobs" | Select-Object LineNumber,Line | Format-Table -AutoSize -Wrap
LineNumber Line                                                    
---------- ----                                                    
        26 const rwandaJobs = [                                    
       528                                 {rwandaJobs.map(job => (