import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '20px',
            padding: '3px 10px 3px 8px',
            cursor: 'pointer',
        }}>
            <Globe size={13} style={{ color: 'rgba(255,255,255,0.85)', flexShrink: 0 }} />
            <select
                value={i18n.resolvedLanguage || 'en'}
                onChange={changeLanguage}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    outline: 'none',
                    padding: 0,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                }}
            >
                <option value="en" style={{ background: '#1a2b5e', color: '#fff' }}>EN</option>
                <option value="fr" style={{ background: '#1a2b5e', color: '#fff' }}>FR</option>
                <option value="rw" style={{ background: '#1a2b5e', color: '#fff' }}>RW</option>
            </select>
        </div>
    );
};

export default LanguageSwitcher;
