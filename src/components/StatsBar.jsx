import React, { useEffect, useRef, useState } from 'react'
import { GraduationCap, ClipboardCheck, School, Globe, Award } from 'lucide-react'

const stats = [
    { icon: <GraduationCap size={20} />, value: 15000, suffix: '+', label: 'Students Assisted' },
    { icon: <ClipboardCheck size={20} />, value: 9500, suffix: '+', label: 'Visa Approvals' },
    { icon: <School size={20} />, value: 200, suffix: '+', label: 'Partner Universities' },
    { icon: <Globe size={20} />, value: 20, suffix: '+', label: 'Countries Covered' },
    { icon: <Award size={20} />, value: 98, suffix: '%', label: 'Success Rate' },
]

function AnimatedNumber({ target, suffix }) {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const started = useRef(false)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true
                const duration = 1800
                const steps = 60
                const stepVal = target / steps
                let current = 0
                const timer = setInterval(() => {
                    current = Math.min(current + stepVal, target)
                    setCount(Math.floor(current))
                    if (current >= target) clearInterval(timer)
                }, duration / steps)
            }
        }, { threshold: 0.4 })
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [target])

    return (
        <span ref={ref} className="stat-value">{count.toLocaleString()}{suffix}</span>
    )
}

export default function StatsBar() {
    return (
        <div className="stats-bar">
            <div className="container">
                {stats.map((s, i) => (
                    <React.Fragment key={s.label}>
                        <div className="stat-item">
                            <div className="stat-icon">{s.icon}</div>
                            <div>
                                <AnimatedNumber target={s.value} suffix={s.suffix} />
                                <div className="stat-label">{s.label}</div>
                            </div>
                        </div>
                        {i < stats.length - 1 && <div className="stat-divider" />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}
