export default function LoadingScreen() {
    return (
        <div className="loading-screen">
            <div className="loading-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-logo">
                    <img src="/logo.png" alt="Travelium Global" className="spinner-logo-img" />
                </div>
            </div>
            <div className="loading-text">Travelium Global</div>
        </div>
    )
}
