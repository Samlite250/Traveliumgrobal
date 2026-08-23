import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    Briefcase, DollarSign, Clock, MapPin, Building, Search, Filter,
    CheckCircle, ArrowRight, ShieldCheck, Star, Sparkles, Send, X, Globe, UserCheck
} from 'lucide-react'
import { useToast } from '../context/ToastContext'

// Comprehensive Countries Data with 5 High Payable Jobs & 5 Part Time Jobs per Country
export const JOBS_DATA = [
    {
        id: 'uae',
        country: 'Dubai (UAE)',
        flag: '🇦🇪',
        tagline: 'Tax-Free Income & Luxury Living',
        highPayableJobs: [
            {
                id: 'uae-hp-1',
                title: 'Senior Logistics & Supply Chain Manager',
                company: 'Emirates Cargo & Global Logistics',
                location: 'Dubai South / Jebel Ali',
                salary: 'AED 18,000 - 24,000 / month',
                type: 'Full-Time',
                experience: '3+ Years Exp.',
                requirements: ['Bachelor Degree or Diploma', 'Fluent English', 'Supply chain management & ERP experience']
            },
            {
                id: 'uae-hp-2',
                title: 'Luxury Hotel Operations Manager',
                company: 'Grand Palm Hospitality UAE',
                location: 'Downtown Dubai',
                salary: 'AED 20,000 - 28,000 / month',
                type: 'Full-Time',
                experience: '2+ Years Hospitality Exp.',
                requirements: ['Customer service excellence', 'Multi-lingual skills preferred', 'Team leadership experience']
            },
            {
                id: 'uae-hp-3',
                title: 'Cloud Systems Architect & IT Engineer',
                company: 'Apex Tech Gulf Solutions',
                location: 'Dubai Internet City',
                salary: 'AED 22,000 - 32,000 / month',
                type: 'Full-Time',
                experience: 'Senior Level',
                requirements: ['Cloud infrastructure expertise', 'Cybersecurity certification', 'Problem solving skills']
            },
            {
                id: 'uae-hp-4',
                title: 'Commercial Finance Analyst',
                company: 'Al-Mansoor Banking & Advisory',
                location: 'DIFC Financial District',
                salary: 'AED 19,500 - 26,000 / month',
                type: 'Full-Time',
                experience: '2+ Years Finance Exp.',
                requirements: ['Financial modeling & Excel', 'Accounting background', 'Analytical mindset']
            },
            {
                id: 'uae-hp-5',
                title: 'Civil & Structural Construction Site Engineer',
                company: 'Emaar Partner Contractors',
                location: 'Dubai Marina & Business Bay',
                salary: 'AED 21,000 - 29,000 / month',
                type: 'Full-Time',
                experience: 'Engineering Degree Required',
                requirements: ['CAD & Structural engineering software', 'Site supervision experience', 'Safety protocol compliance']
            }
        ],
        partTimeJobs: [
            {
                id: 'uae-pt-1',
                title: 'Specialty Barista & Cafe Host',
                company: 'Artisan Coffee Roasters Dubai',
                location: 'Dubai Mall & City Walk',
                salary: 'AED 45 - 60 / hour',
                type: 'Part-Time / Flexible',
                hours: '20-25 hrs / week',
                requirements: ['Friendly attitude & espresso knowledge', 'Flexible shift timings', 'Valid student or tourist visa']
            },
            {
                id: 'uae-pt-2',
                title: 'International Events & Expo Coordinator',
                company: 'Dubai World Trade Centre Events',
                location: 'Trade Centre / DWTC',
                salary: 'AED 55 - 75 / hour',
                type: 'Event / Shift Work',
                hours: 'Weekend & Evening shifts',
                requirements: ['Strong communication', 'Passionate about host duties', 'Quick learner']
            },
            {
                id: 'uae-pt-3',
                title: 'Retail Sales Specialist',
                company: 'Luxury Brands Galleria',
                location: 'Mall of the Emirates',
                salary: 'AED 50 - 65 / hour',
                type: 'Part-Time',
                hours: '15-30 hrs / week',
                requirements: ['Good communication skills', 'Customer focused', 'Neat appearance']
            },
            {
                id: 'uae-pt-4',
                title: 'Hotel Guest Relations Assistant',
                company: 'Beachfront Resorts Jumeirah',
                location: 'Jumeirah Beach Dubai',
                salary: 'AED 50 - 70 / hour',
                type: 'Part-Time / Shifts',
                hours: 'Flexible schedules',
                requirements: ['Welcome desk etiquette', 'Basic computer skills', 'Warm personality']
            },
            {
                id: 'uae-pt-5',
                title: 'Campus Academic Tutor',
                company: 'Knowledge Park Student Hub',
                location: 'Dubai Knowledge Park',
                salary: 'AED 65 - 90 / hour',
                type: 'Part-Time',
                hours: '10-20 hrs / week',
                requirements: ['Strong subject knowledge (Math/English/Coding)', 'Patient teaching approach', 'Good presentation']
            }
        ]
    },
    {
        id: 'canada',
        country: 'Canada',
        flag: '🇨🇦',
        tagline: 'High Standard of Living & PR Pathways',
        highPayableJobs: [
            {
                id: 'can-hp-1',
                title: 'Project Engineering Manager',
                company: 'Ontario Infrastructure Group',
                location: 'Toronto, ON',
                salary: '$95,000 - $125,000 / year',
                type: 'Full-Time',
                experience: 'Managerial',
                requirements: ['PMP or Engineering Degree', 'Project lifecycle management', 'Safety Standards compliance']
            },
            {
                id: 'can-hp-2',
                title: 'Registered Healthcare Specialist & Nurse',
                company: 'British Columbia Health Network',
                location: 'Vancouver, BC',
                salary: '$88,000 - $115,000 / year',
                type: 'Full-Time',
                experience: 'Licensed Professional',
                requirements: ['Nursing qualification', 'Patient care expertise', 'First Aid / CPR certification']
            },
            {
                id: 'can-hp-3',
                title: 'Senior Software Developer',
                company: 'Maple Leaf Digital Labs',
                location: 'Montreal & Remote, QC',
                salary: '$105,000 - $140,000 / year',
                type: 'Full-Time',
                experience: '3+ Years Tech',
                requirements: ['React, Node, Python proficiency', 'Git & Agile mindset', 'Bachelor in CS or equivalent']
            },
            {
                id: 'can-hp-4',
                title: 'Supply Chain & Procurement Lead',
                company: 'Great White North Distribution',
                location: 'Calgary, AB',
                salary: '$82,000 - $105,000 / year',
                type: 'Full-Time',
                experience: '2+ Years Logistics',
                requirements: ['Inventory management', 'Supplier negotiations', 'Logistics software']
            },
            {
                id: 'can-hp-5',
                title: 'Hospitality Operations Executive',
                company: 'Fairmont & Resort Alliance',
                location: 'Banff & Whistler, BC/AB',
                salary: '$75,000 - $98,000 / year',
                type: 'Full-Time',
                experience: 'Hospitality Background',
                requirements: ['Resort management experience', 'Guest satisfaction metrics', 'Staff leadership']
            }
        ],
        partTimeJobs: [
            {
                id: 'can-pt-1',
                title: 'University Campus Library Assistant',
                company: 'University of Toronto Student Services',
                location: 'Toronto, ON',
                salary: '$22 - $28 / hour',
                type: 'On-Campus Part Time',
                hours: '15-20 hrs / week',
                requirements: ['Valid Study Permit', 'Good organizational skills', 'Basic computer literacy']
            },
            {
                id: 'can-pt-2',
                title: 'Cafe & Bakery Shift Supervisor',
                company: 'Tim Hortons & Local Artisans',
                location: 'Vancouver & Surrey, BC',
                salary: '$21 - $26 / hour',
                type: 'Part-Time',
                hours: '20 hrs / week',
                requirements: ['Food safety awareness', 'Punctuality', 'Cash register experience']
            },
            {
                id: 'can-pt-3',
                title: 'Logistics & Warehousing Associate',
                company: 'Canada Post & Fulfillment Partners',
                location: 'Mississauga, ON',
                salary: '$23 - $29 / hour',
                type: 'Part-Time / Evening',
                hours: '15-25 hrs / week',
                requirements: ['Ability to lift package loads', 'Attention to detail', 'Team player']
            },
            {
                id: 'can-pt-4',
                title: 'Customer Experience Representative',
                company: 'Telus Student Partner Hub',
                location: 'Calgary, AB',
                salary: '$22 - $27 / hour',
                type: 'Part-Time / Remote',
                hours: '15-20 hrs / week',
                requirements: ['Clear voice & English fluency', 'Home internet connection', 'Customer care attitude']
            },
            {
                id: 'can-pt-5',
                title: 'Administrative Assistant Assistant',
                company: 'Community Learning Centre',
                location: 'Ottawa, ON',
                salary: '$24 - $30 / hour',
                type: 'Part-Time',
                hours: '20 hrs / week',
                requirements: ['Microsoft Office proficiency', 'Filing & correspondence', 'Polite phone demeanor']
            }
        ]
    },
    {
        id: 'uk',
        country: 'United Kingdom',
        flag: '🇬🇧',
        tagline: 'Skilled Worker Visas & Global Hub',
        highPayableJobs: [
            {
                id: 'uk-hp-1',
                title: 'Senior Fintech Software Engineer',
                company: 'London Financial Technologies',
                location: 'London (Canary Wharf), UK',
                salary: '£65,000 - £90,000 / year',
                type: 'Full-Time (Tier 2 Sponsor)',
                experience: '3+ Years Tech',
                requirements: ['JavaScript/TypeScript/Python', 'API Architecture', 'Financial sector knowledge']
            },
            {
                id: 'uk-hp-2',
                title: 'NHS Clinical Care Specialist',
                company: 'NHS Trust Hospitals',
                location: 'Manchester & Birmingham, UK',
                salary: '£42,000 - £60,000 / year',
                type: 'Full-Time (Health & Care Visa)',
                experience: 'Registered Professional',
                requirements: ['NMC / GMC registration or eligibility', 'Clinical experience', 'Compassionate care']
            },
            {
                id: 'uk-hp-3',
                title: 'Commercial Property & Estate Manager',
                company: 'Mayfair Realty Partners',
                location: 'London & Cambridge, UK',
                salary: '£55,000 - £78,000 / year',
                type: 'Full-Time',
                experience: '2+ Years Property',
                requirements: ['Real estate management', 'Client relations', 'Contract negotiation']
            },
            {
                id: 'uk-hp-4',
                title: 'Data Analytics Lead',
                company: 'British Retail Analytics',
                location: 'Edinburgh & Leeds, UK',
                salary: '£58,000 - £80,000 / year',
                type: 'Full-Time',
                experience: 'Data Science background',
                requirements: ['SQL, Tableau, Python', 'Data visualization', 'Business intelligence']
            },
            {
                id: 'uk-hp-5',
                title: 'International Marketing Director',
                company: 'Global Media Agency UK',
                location: 'London (Soho), UK',
                salary: '£62,000 - £85,000 / year',
                type: 'Full-Time',
                experience: 'Marketing Managerial',
                requirements: ['Digital campaigns', 'SEO & Brand strategy', 'Budget management']
            }
        ],
        partTimeJobs: [
            {
                id: 'uk-pt-1',
                title: 'University Campus Ambassador & Host',
                company: 'Kingston & Manchester Student Unions',
                location: 'London & Manchester, UK',
                salary: '£14 - £18 / hour',
                type: 'Part-Time (20 hrs limit)',
                hours: 'Up to 20 hrs / week',
                requirements: ['Tier 4 Student Visa', 'Enthusiastic & friendly', 'Good organization']
            },
            {
                id: 'uk-pt-2',
                title: 'High Street Retail Assistant',
                company: 'Marks & Spencer Partner Stores',
                location: 'Birmingham & Bristol, UK',
                salary: '£13 - £17 / hour',
                type: 'Part-Time',
                hours: '15-20 hrs / week',
                requirements: ['Cashier skills', 'Stock management', 'Punctuality']
            },
            {
                id: 'uk-pt-3',
                title: 'Boutique Hotel Front Desk Host',
                company: 'Heritage Hotels UK',
                location: 'Edinburgh & Bath, UK',
                salary: '£14 - £19 / hour',
                type: 'Weekend & Night Shift',
                hours: 'Flexible schedules',
                requirements: ['Customer welcoming demeanor', 'Check-in software', 'Telephone skills']
            },
            {
                id: 'uk-pt-4',
                title: 'Delivery & Logistics Helper',
                company: 'Royal Mail Partner Express',
                location: 'Leeds & Liverpool, UK',
                salary: '£14 - £18 / hour',
                type: 'Part-Time',
                hours: '15-20 hrs / week',
                requirements: ['Valid driving permit (optional)', 'Physical fitness', 'Map navigation']
            },
            {
                id: 'uk-pt-5',
                title: 'Private Language & Exam Tutor',
                company: 'Oxford Academic Guidance',
                location: 'Oxford & Cambridge, UK',
                salary: '£18 - £25 / hour',
                type: 'Part-Time',
                hours: '10-15 hrs / week',
                requirements: ['Academic qualifications', 'Patience', 'Good communication']
            }
        ]
    },
    {
        id: 'germany',
        country: 'Germany',
        flag: '🇩🇪',
        tagline: 'EU Blue Card & Strong Industrial Economy',
        highPayableJobs: [
            {
                id: 'ger-hp-1',
                title: 'Automotive & Embedded Systems Engineer',
                company: 'Bavarian Auto Tech',
                location: 'Munich & Stuttgart, Germany',
                salary: '€70,000 - €95,000 / year',
                type: 'Full-Time (EU Blue Card)',
                experience: 'Engineering Degree',
                requirements: ['C++/Python/MATLAB', 'Automotive safety standards', 'B2 English (German a plus)']
            },
            {
                id: 'ger-hp-2',
                title: 'Renewable Energy Project Manager',
                company: 'Nordic Wind & Solar Energy',
                location: 'Hamburg & Berlin, Germany',
                salary: '€65,000 - €88,000 / year',
                type: 'Full-Time',
                experience: '2+ Years Energy Sector',
                requirements: ['Project coordination', 'Regulatory knowledge', 'Engineering background']
            },
            {
                id: 'ger-hp-3',
                title: 'DevOps & Infrastructure Architect',
                company: 'Berlin Tech Ventures',
                location: 'Berlin & Remote, Germany',
                salary: '€75,000 - €105,000 / year',
                type: 'Full-Time',
                experience: '3+ Years Tech',
                requirements: ['Docker, Kubernetes, AWS/Azure', 'CI/CD pipelines', 'Team mentoring']
            },
            {
                id: 'ger-hp-4',
                title: 'Quality Assurance & Mechanical Engineer',
                company: 'Rheinland Precision Tools',
                location: 'Frankfurt & Cologne, Germany',
                salary: '€62,000 - €82,000 / year',
                type: 'Full-Time',
                experience: 'Mechanical Engineering',
                requirements: ['Quality control ISO standards', 'CAD software', 'Precision measurement']
            },
            {
                id: 'ger-hp-5',
                title: 'International Business Development Manager',
                company: 'EuroTrade Logistics GmbH',
                location: 'Frankfurt, Germany',
                salary: '€68,000 - €90,000 / year',
                type: 'Full-Time',
                experience: 'Business / Sales Exp.',
                requirements: ['Client acquisition', 'International sales strategy', 'Fluency in English']
            }
        ],
        partTimeJobs: [
            {
                id: 'ger-pt-1',
                title: 'Student Research Assistant (Werkstudent)',
                company: 'TU Munich & Fraunhofer Institute',
                location: 'Munich, Germany',
                salary: '€16 - €22 / hour',
                type: 'Werkstudent (20h max)',
                hours: '20 hrs / week',
                requirements: ['Enrolled German University Student', 'Research skills', 'Basic German or English']
            },
            {
                id: 'ger-pt-2',
                title: 'English Language Support Specialist',
                company: 'Berlin International Academy',
                location: 'Berlin, Germany',
                salary: '€18 - €25 / hour',
                type: 'Part-Time',
                hours: '15-20 hrs / week',
                requirements: ['Native or Fluent English', 'Teaching passion', 'Punctuality']
            },
            {
                id: 'ger-pt-3',
                title: 'Hospitality & Event Crew Member',
                company: 'Frankfurt Messe & Event Catering',
                location: 'Frankfurt, Germany',
                salary: '€15 - €20 / hour',
                type: 'Part-Time / Weekend',
                hours: 'Flexible hours',
                requirements: ['Teamwork', 'Positive attitude', 'Basic customer service']
            },
            {
                id: 'ger-pt-4',
                title: 'Logistics Fulfillment Assistant',
                company: 'Zalando Fulfillment Hub',
                location: 'Leipzig & Hamburg, Germany',
                salary: '€15 - €19 / hour',
                type: 'Part-Time / Evening',
                hours: '15-20 hrs / week',
                requirements: ['Order picking', 'Physical endurance', 'Reliability']
            },
            {
                id: 'ger-pt-5',
                title: 'Coffee Barista & Guest Host',
                company: 'Cologne Coffee Roasters',
                location: 'Cologne, Germany',
                salary: '€14 - €18 / hour',
                type: 'Part-Time',
                hours: '15 hrs / week',
                requirements: ['Service mindset', 'Friendliness', 'Espresso preparation']
            }
        ]
    },
    {
        id: 'usa',
        country: 'United States',
        flag: '🇺🇸',
        tagline: 'High Pay & Career Opportunities',
        highPayableJobs: [
            {
                id: 'usa-hp-1',
                title: 'Senior Full Stack Software Engineer',
                company: 'Silicon Valley Cloud Labs',
                location: 'San Francisco & Remote, CA',
                salary: '$120,000 - $165,000 / year',
                type: 'Full-Time (H-1B / O-1 Sponsor)',
                experience: '3+ Years Tech',
                requirements: ['React, Node, PostgreSQL', 'Cloud architecture', 'Problem solving']
            },
            {
                id: 'usa-hp-2',
                title: 'Healthcare & Clinical Laboratory Lead',
                company: 'Texas Medical Center Alliance',
                location: 'Houston, TX',
                salary: '$95,000 - $130,000 / year',
                type: 'Full-Time',
                experience: 'Licensed Professional',
                requirements: ['Clinical lab experience', 'Medical technology certification', 'Detail focus']
            },
            {
                id: 'usa-hp-3',
                title: 'Corporate Financial Risk Controller',
                company: 'Wall Street Capital Advisors',
                location: 'New York, NY',
                salary: '$110,000 - $150,000 / year',
                type: 'Full-Time',
                experience: 'Finance Degree',
                requirements: ['Risk assessment models', 'Excel & Bloomberg terminal', 'Regulatory compliance']
            },
            {
                id: 'usa-hp-4',
                title: 'Aerospace Systems Quality Inspector',
                company: 'Florida Flight Tech Corporation',
                location: 'Orlando & Tampa, FL',
                salary: '$88,000 - $118,000 / year',
                type: 'Full-Time',
                experience: 'Engineering Background',
                requirements: ['ISO 9001 audit standards', 'Inspection tools', 'Technical documentation']
            },
            {
                id: 'usa-hp-5',
                title: 'Logistics Operations Director',
                company: 'Midwest Freight & Supply Chain',
                location: 'Chicago, IL',
                salary: '$100,000 - $135,000 / year',
                type: 'Full-Time',
                experience: 'Supply Chain Exp.',
                requirements: ['Distribution network optimization', 'Fleet management', 'Budgeting']
            }
        ],
        partTimeJobs: [
            {
                id: 'usa-pt-1',
                title: 'University Campus Assistant (CPT / OPT)',
                company: 'NYU & Columbia Student Auxiliary',
                location: 'New York, NY',
                salary: '$20 - $26 / hour',
                type: 'On-Campus Part-Time',
                hours: '20 hrs / week max',
                requirements: ['F-1 Student Visa', 'Good academic standing', 'Communication skills']
            },
            {
                id: 'usa-pt-2',
                title: 'Specialty Retail Sales Specialist',
                company: 'Nordstrom & Brand Partners',
                location: 'Los Angeles, CA',
                salary: '$19 - $24 / hour',
                type: 'Part-Time',
                hours: '15-25 hrs / week',
                requirements: ['Customer service attitude', 'Point of Sale system', 'Team attitude']
            },
            {
                id: 'usa-pt-3',
                title: 'Hotel Front Office Concierge',
                company: 'Marriott Resort Group',
                location: 'Miami, FL',
                salary: '$18 - $25 / hour',
                type: 'Part-Time / Shift',
                hours: 'Flexible schedules',
                requirements: ['Guest relations etiquette', 'Bilingual skills a plus', 'Professional demeanor']
            },
            {
                id: 'usa-pt-4',
                title: 'E-Commerce Package Coordinator',
                company: 'Express Logistics USA',
                location: 'Chicago, IL',
                salary: '$19 - $25 / hour',
                type: 'Part-Time / Shift',
                hours: '15-20 hrs / week',
                requirements: ['Basic inventory scanning', 'Reliable attendance', 'Physical activity']
            },
            {
                id: 'usa-pt-5',
                title: 'Online & STEM Academic Tutor',
                company: 'Varsity Tutors Network',
                location: 'Remote / Nationwide',
                salary: '$22 - $32 / hour',
                type: 'Part-Time / Remote',
                hours: '10-20 hrs / week',
                requirements: ['Subject mastery in Math or Science', 'Clear communication', 'Laptop & Wifi']
            }
        ]
    },
    {
        id: 'australia',
        country: 'Australia',
        flag: '🇦🇺',
        tagline: 'High Minimum Wages & Great Quality of Life',
        highPayableJobs: [
            {
                id: 'aus-hp-1',
                title: 'Mining & Metallurgical Site Engineer',
                company: 'Pacific Mining Resources',
                location: 'Perth & Brisbane, WA/QLD',
                salary: 'AUD $110,000 - $145,000 / year',
                type: 'Full-Time (Subclass 482 Visa)',
                experience: 'Engineering Qualification',
                requirements: ['Resource engineering degree', 'Safety compliance', 'Field operation skills']
            },
            {
                id: 'aus-hp-2',
                title: 'Aged Care & Clinical Supervisor',
                company: 'Southern Cross Health Care',
                location: 'Sydney & Melbourne, NSW/VIC',
                salary: 'AUD $85,000 - $110,000 / year',
                type: 'Full-Time',
                experience: 'Licensed Nurse / Care Lead',
                requirements: ['AHPRA registration or eligibility', 'Care plan creation', 'Staff supervision']
            },
            {
                id: 'aus-hp-3',
                title: 'Cybersecurity Threat Analyst',
                company: 'Oceania Cyber Defense',
                location: 'Sydney, NSW',
                salary: 'AUD $105,000 - $135,000 / year',
                type: 'Full-Time',
                experience: '2+ Years Security',
                requirements: ['Network monitoring', 'Incident response', 'Security certs (CISSP/CEH)']
            },
            {
                id: 'aus-hp-4',
                title: 'Construction Project Estimator',
                company: 'Melbourne Build Corp',
                location: 'Melbourne, VIC',
                salary: 'AUD $90,000 - $120,000 / year',
                type: 'Full-Time',
                experience: 'Quantity Surveying Exp.',
                requirements: ['Cost estimation software', 'Subcontractor negotiations', 'Blueprint reading']
            },
            {
                id: 'aus-hp-5',
                title: 'Agri-Business & Export Specialist',
                company: 'Queensland Produce Exporters',
                location: 'Brisbane, QLD',
                salary: 'AUD $82,000 - $105,000 / year',
                type: 'Full-Time',
                experience: 'Agri-Business Background',
                requirements: ['Export regulations', 'Supply chain tracking', 'Client management']
            }
        ],
        partTimeJobs: [
            {
                id: 'aus-pt-1',
                title: 'Casual Hospitality & Event Waitstaff',
                company: 'Sydney Harbour Catering',
                location: 'Sydney, NSW',
                salary: 'AUD $29 - $36 / hour',
                type: 'Casual / Part-Time',
                hours: '15-24 hrs / week',
                requirements: ['RSA (Responsible Service of Alcohol)', 'Friendly attitude', 'Punctual']
            },
            {
                id: 'aus-pt-2',
                title: 'Campus Student Services Officer',
                company: 'Monash University Student Hub',
                location: 'Melbourne, VIC',
                salary: 'AUD $30 - $38 / hour',
                type: 'On-Campus Student Work',
                hours: '15-20 hrs / week',
                requirements: ['Subclass 500 Student Visa', 'Customer service', 'Basic admin skills']
            },
            {
                id: 'aus-pt-3',
                title: 'Specialty Cafe Barista',
                company: 'Melbourne Artisan Roasters',
                location: 'Melbourne, VIC',
                salary: 'AUD $28 - $35 / hour',
                type: 'Part-Time',
                hours: '20 hrs / week',
                requirements: ['Barista experience', 'Latte art is a plus', 'Good team player']
            },
            {
                id: 'aus-pt-4',
                title: 'Boutique Store Customer Associate',
                company: 'Gold Coast Retail Outlets',
                location: 'Gold Coast, QLD',
                salary: 'AUD $27 - $33 / hour',
                type: 'Part-Time / Weekend',
                hours: '15 hrs / week',
                requirements: ['Customer interaction', 'Point of sale operations', 'Stock organization']
            },
            {
                id: 'aus-pt-5',
                title: 'Aged & Disability Support Worker',
                company: 'CareAustralia Network',
                location: 'Adelaide & Perth, SA/WA',
                salary: 'AUD $32 - $40 / hour',
                type: 'Casual / Part-Time',
                hours: 'Flexible shifts',
                requirements: ['Certificate III in Individual Support or willing to obtain', 'Compassionate nature', 'First Aid']
            }
        ]
    }
]

export default function Jobs() {
    const { toast } = useToast()
    const [activeCountry, setActiveCountry] = useState(JOBS_DATA[0].id)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState('all') // 'all', 'highPayable', 'partTime'
    const [selectedJob, setSelectedJob] = useState(null)
    const [isApplying, setIsApplying] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        experienceYears: '1-2 years',
        coverNote: ''
    })

    const currentCountryData = JOBS_DATA.find(c => c.id === activeCountry) || JOBS_DATA[0]

    // Filter jobs based on search & filterType
    const filterJobList = (jobs) => {
        return jobs.filter(job => {
            const matchesSearch = !searchQuery ||
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.location.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesSearch
        })
    }

    const filteredHighPayable = filterType === 'partTime' ? [] : filterJobList(currentCountryData.highPayableJobs)
    const filteredPartTime = filterType === 'highPayable' ? [] : filterJobList(currentCountryData.partTimeJobs)

    const handleApplyClick = (job, categoryLabel) => {
        setSelectedJob({ ...job, countryName: currentCountryData.country, flag: currentCountryData.flag, categoryLabel })
        setIsApplying(true)
        setSubmitted(false)
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()
        if (!form.fullName || !form.email || !form.phone) {
            toast('Please fill out all required fields', 'error')
            return
        }

        setSubmitted(true)
        toast('Application submitted successfully! Our job team will review and contact you.', 'success')

        // Save local backup application
        try {
            const existing = JSON.parse(localStorage.getItem('travelium_job_applications') || '[]')
            existing.push({
                ...form,
                jobId: selectedJob?.id,
                jobTitle: selectedJob?.title,
                country: selectedJob?.countryName,
                submittedAt: new Date().toISOString()
            })
            localStorage.setItem('travelium_job_applications', JSON.stringify(existing))
        } catch (err) { }

        setTimeout(() => {
            setIsApplying(false)
            setSubmitted(false)
            setForm({ fullName: '', email: '', phone: '', experienceYears: '1-2 years', coverNote: '' })
        }, 2500)
    }

    return (
        <div className="jobs-page">
            {/* ── Hero Banner ── */}
            <section className="jobs-hero">
                <div className="container">
                    <div className="jobs-hero-badge">
                        <Sparkles size={16} /> Global Career Hub
                    </div>
                    <h1>Verified International Jobs &amp; Work Visas</h1>
                    <p>
                        Browse curated <strong>High Payable Careers</strong> and flexible <strong>Part-Time Opportunities</strong> across top global destinations.
                        Apply directly to start your visa and job placement process today.
                    </p>

                    {/* Search & Filter Bar */}
                    <div className="jobs-search-bar">
                        <div className="search-input-group">
                            <Search size={20} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search by job title, industry, or city..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className="clear-btn" onClick={() => setSearchQuery('')}><X size={16} /></button>
                            )}
                        </div>

                        <div className="filter-pills">
                            <button
                                className={`filter-pill ${filterType === 'all' ? 'active' : ''}`}
                                onClick={() => setFilterType('all')}
                            >
                                All Jobs
                            </button>
                            <button
                                className={`filter-pill ${filterType === 'highPayable' ? 'active' : ''}`}
                                onClick={() => setFilterType('highPayable')}
                            >
                                💎 High Payable Only
                            </button>
                            <button
                                className={`filter-pill ${filterType === 'partTime' ? 'active' : ''}`}
                                onClick={() => setFilterType('partTime')}
                            >
                                ⏱️ Part-Time Only
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Main Country Tabs & Jobs Section ── */}
            <section className="jobs-main-section">
                <div className="container">
                    {/* Country Selector Tabs */}
                    <div className="country-tabs-wrapper">
                        <div className="country-tabs-header">
                            <Globe size={18} /> Select Destination Country:
                        </div>
                        <div className="country-tabs-scroll">
                            {JOBS_DATA.map((c) => (
                                <button
                                    key={c.id}
                                    className={`country-tab-btn ${activeCountry === c.id ? 'active' : ''}`}
                                    onClick={() => setActiveCountry(c.id)}
                                >
                                    <span className="c-flag">{c.flag}</span>
                                    <span className="c-name">{c.country}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Country Banner Header */}
                    <div className="active-country-banner">
                        <div className="ac-title-wrap">
                            <span className="ac-flag">{currentCountryData.flag}</span>
                            <div>
                                <h2>Available Jobs in {currentCountryData.country}</h2>
                                <p className="ac-tagline">{currentCountryData.tagline}</p>
                            </div>
                        </div>
                        <div className="ac-stats-badge">
                            <UserCheck size={16} /> Verified Work Visa &amp; Permit Placement
                        </div>
                    </div>

                    {/* ── SECTION 1: HIGH PAYABLE JOBS ── */}
                    {filterType !== 'partTime' && (
                        <div className="job-category-section">
                            <div className="category-header hp-header">
                                <div className="cat-title">
                                    <span className="cat-icon-badge hp">💎</span>
                                    <div>
                                        <h3>High Payable Jobs ({filteredHighPayable.length})</h3>
                                        <p>Full-time, high-salary &amp; sponsored career roles</p>
                                    </div>
                                </div>
                                <span className="cat-pill hp">Full-Time / Executive</span>
                            </div>

                            {filteredHighPayable.length === 0 ? (
                                <div className="no-jobs-card">
                                    <Briefcase size={40} />
                                    <p>No high payable jobs matching your search in {currentCountryData.country}.</p>
                                </div>
                            ) : (
                                <div className="jobs-grid">
                                    {filteredHighPayable.map((job) => (
                                        <div key={job.id} className="job-card hp-card">
                                            <div className="job-card-top">
                                                <div className="job-badge hp-badge">💎 High Salary</div>
                                                <span className="job-country-tag">{currentCountryData.flag} {currentCountryData.country}</span>
                                            </div>

                                            <h4 className="job-title">{job.title}</h4>

                                            <div className="job-meta-row">
                                                <span className="job-company"><Building size={14} /> {job.company}</span>
                                                <span className="job-location"><MapPin size={14} /> {job.location}</span>
                                            </div>

                                            <div className="job-salary-box">
                                                <DollarSign size={18} />
                                                <span className="salary-text">{job.salary}</span>
                                            </div>

                                            <div className="job-req-list">
                                                <span className="req-label">Requirements:</span>
                                                <ul>
                                                    {job.requirements.map((req, idx) => (
                                                        <li key={idx}><CheckCircle size={12} /> {req}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="job-card-footer">
                                                <span className="exp-badge">{job.experience}</span>
                                                <button
                                                    className="btn-apply-job primary"
                                                    onClick={() => handleApplyClick(job, 'High Payable Job')}
                                                >
                                                    Apply Now <ArrowRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── SECTION 2: PART TIME JOBS ── */}
                    {filterType !== 'highPayable' && (
                        <div className="job-category-section" style={{ marginTop: '3.5rem' }}>
                            <div className="category-header pt-header">
                                <div className="cat-title">
                                    <span className="cat-icon-badge pt">⏱️</span>
                                    <div>
                                        <h3>Part-Time Jobs ({filteredPartTime.length})</h3>
                                        <p>Student-friendly, shift &amp; hourly flexible opportunities</p>
                                    </div>
                                </div>
                                <span className="cat-pill pt">Part-Time / Hourly</span>
                            </div>

                            {filteredPartTime.length === 0 ? (
                                <div className="no-jobs-card">
                                    <Clock size={40} />
                                    <p>No part-time jobs matching your search in {currentCountryData.country}.</p>
                                </div>
                            ) : (
                                <div className="jobs-grid">
                                    {filteredPartTime.map((job) => (
                                        <div key={job.id} className="job-card pt-card">
                                            <div className="job-card-top">
                                                <div className="job-badge pt-badge">⏱️ Flexible Hours</div>
                                                <span className="job-country-tag">{currentCountryData.flag} {currentCountryData.country}</span>
                                            </div>

                                            <h4 className="job-title">{job.title}</h4>

                                            <div className="job-meta-row">
                                                <span className="job-company"><Building size={14} /> {job.company}</span>
                                                <span className="job-location"><MapPin size={14} /> {job.location}</span>
                                            </div>

                                            <div className="job-salary-box pt-salary">
                                                <Clock size={18} />
                                                <span className="salary-text">{job.salary}</span>
                                                {job.hours && <span className="hours-sub">({job.hours})</span>}
                                            </div>

                                            <div className="job-req-list">
                                                <span className="req-label">Requirements:</span>
                                                <ul>
                                                    {job.requirements.map((req, idx) => (
                                                        <li key={idx}><CheckCircle size={12} /> {req}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="job-card-footer">
                                                <span className="exp-badge pt-exp">{job.type}</span>
                                                <button
                                                    className="btn-apply-job secondary"
                                                    onClick={() => handleApplyClick(job, 'Part-Time Job')}
                                                >
                                                    Apply Now <ArrowRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* ── JOB APPLICATION MODAL ── */}
            {isApplying && selectedJob && (
                <div className="job-modal-overlay" onClick={() => setIsApplying(false)}>
                    <div className="job-modal-card" onClick={(e) => e.stopPropagation()}>
                        <button className="job-modal-close" onClick={() => setIsApplying(false)}>
                            <X size={20} />
                        </button>

                        {submitted ? (
                            <div className="job-modal-success">
                                <CheckCircle size={56} className="success-icon" />
                                <h3>Application Submitted!</h3>
                                <p>You have applied for <strong>{selectedJob.title}</strong> in <strong>{selectedJob.countryName}</strong>.</p>
                                <p className="sub-text">Our employment officer will reach out to verify your credentials and assist with your work permit.</p>
                            </div>
                        ) : (
                            <>
                                <div className="job-modal-header">
                                    <div className="jm-flag">{selectedJob.flag}</div>
                                    <div>
                                        <span className="jm-cat-tag">{selectedJob.categoryLabel}</span>
                                        <h3>Apply for {selectedJob.title}</h3>
                                        <p>{selectedJob.company} • {selectedJob.location}</p>
                                    </div>
                                </div>

                                <div className="job-modal-summary">
                                    <div className="jms-item">
                                        <DollarSign size={16} /> <span>{selectedJob.salary}</span>
                                    </div>
                                    <div className="jms-item">
                                        <Briefcase size={16} /> <span>{selectedJob.type}</span>
                                    </div>
                                </div>

                                <form onSubmit={handleFormSubmit} className="job-apply-form">
                                    <div className="form-group-custom">
                                        <label>Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Jean Claude"
                                            value={form.fullName}
                                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-row-custom">
                                        <div className="form-group-custom">
                                            <label>Email Address *</label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="you@example.com"
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            />
                                        </div>

                                        <div className="form-group-custom">
                                            <label>Phone / WhatsApp *</label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="+250 78... or digits"
                                                value={form.phone}
                                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group-custom">
                                        <label>Relevant Experience</label>
                                        <select
                                            value={form.experienceYears}
                                            onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                                        >
                                            <option value="No experience (Entry level)">No experience (Entry level / Student)</option>
                                            <option value="1-2 years">1-2 years experience</option>
                                            <option value="3-5 years">3-5 years experience</option>
                                            <option value="5+ years">5+ years senior experience</option>
                                        </select>
                                    </div>

                                    <div className="form-group-custom">
                                        <label>Cover Note / Short Message (Optional)</label>
                                        <textarea
                                            rows="3"
                                            placeholder="Tell us briefly why you are interested in this job..."
                                            value={form.coverNote}
                                            onChange={(e) => setForm({ ...form, coverNote: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-actions-row">
                                        <button type="button" className="btn-cancel" onClick={() => setIsApplying(false)}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn-submit-apply">
                                            Submit Application <Send size={16} />
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
