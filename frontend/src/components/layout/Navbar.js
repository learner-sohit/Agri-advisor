import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLang, setActiveLang] = useState(localStorage.getItem('language') || 'en');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', icon: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी', icon: '🇮🇳' },
    { code: 'ta', label: 'தமிழ்', icon: '🇮🇳' },
    { code: 'te', label: 'తెలుగు', icon: '🇮🇳' },
    { code: 'kn', label: 'ಕನ್ನಡ', icon: '🇮🇳' },
    { code: 'ml', label: 'മലയാളം', icon: '🇮🇳' },
    { code: 'gu', label: 'ગુજરાતી', icon: '🇮🇳' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ', icon: '🇮🇳' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    setActiveLang(lng);
    setLangDropdownOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="brand-icon">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          <span className="brand-text">Agri-Advisor</span>
        </Link>

        {/* Hamburger Menu */}
        <button 
          className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navbar Menu */}
        <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          {/* Navigation Links */}
          <div className="navbar-links">
            {isAuthenticated && (
              <>
                <Link 
                  to="/" 
                  className="navbar-link"
                  onClick={closeMobileMenu}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <span>{t('selectLocation')}</span>
                </Link>
                <Link 
                  to="/history" 
                  className="navbar-link"
                  onClick={closeMobileMenu}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{t('history')}</span>
                </Link>
              </>
            )}
          </div>

          {/* Language Selector Dropdown */}
          <div className="language-dropdown">
            <button
              className="lang-toggle"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              title="Select Language"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span>{activeLang.toUpperCase()}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`chevron ${langDropdownOpen ? 'open' : ''}`}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {langDropdownOpen && (
              <div className="lang-dropdown-menu">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`lang-option ${activeLang === lang.code ? 'active' : ''}`}
                    onClick={() => changeLanguage(lang.code)}
                  >
                    <span className="lang-icon">{lang.icon}</span>
                    <span className="lang-label">{lang.label}</span>
                    {activeLang === lang.code && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="checkmark">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Section */}
          <div className="navbar-right">
            {isAuthenticated ? (
              <div className="navbar-user">
                <div className="user-avatar">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="user-info">
                  <span className="user-name">{user?.name}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="logout-btn"
                  title={t('logout')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="navbar-auth">
                <Link 
                  to="/login" 
                  className="navbar-link"
                  onClick={closeMobileMenu}
                >
                  {t('login')}
                </Link>
                <Link 
                  to="/register" 
                  className="navbar-link auth-register"
                  onClick={closeMobileMenu}
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;