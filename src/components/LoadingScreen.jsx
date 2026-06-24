import { Plane } from 'lucide-react'

export default function LoadingScreen() {
    return (
        <div className="loading-screen">
            <div className="loading-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-logo">
                    <Plane size={28} className="plane-spin" transform="rotate(45)" />
                </div>
            </div>
            <div className="loading-text">Travelium Global</div>
        </div>
    )
}
