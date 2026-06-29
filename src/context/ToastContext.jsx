import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = {
    success: <CheckCircle size={18} />,
    error: <XCircle size={18} />,
    warning: <AlertTriangle size={18} />,
    info: <Info size={18} />,
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])
    const idRef = useRef(0)

    const remove = useCallback((id) => {
        setToasts(t => t.filter(toast => toast.id !== id))
    }, [])

    const showToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = ++idRef.current
        setToasts(t => [...t, { id, message, type }])
        setTimeout(() => remove(id), duration)
        return id
    }, [remove])

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <div className="toast-container">
                {toasts.map(t => (
                    <div key={t.id} className={`toast toast-${t.type}`}>
                        <span className="toast-icon">{ICONS[t.type] || ICONS.info}</span>
                        <span className="toast-msg">{t.message}</span>
                        <button className="toast-close" onClick={() => remove(t.id)}><X size={14} /></button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used within ToastProvider')
    return ctx
}

export default ToastContext
