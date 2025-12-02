import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Agri-Advisor AI
        </Link>
        <div className="navbar-menu">
          {isAuthenticated && (
            <>
              <Link to="/" className="navbar-link">
                {t('selectLocation')}
              </Link>
              <Link to="/history" className="navbar-link">
                {t('history')}
              </Link>
            </>
          )}
          <div className="language-selector">
            <button onClick={() => changeLanguage('en')} className="lang-btn">EN</button>
            <button onClick={() => changeLanguage('hi')} className="lang-btn">HI</button>
          </div>
          {isAuthenticated ? (
            <div className="navbar-user">
              <span className="user-name">{user?.name}</span>
              <button onClick={handleLogout} className="logout-btn">
                {t('logout')}
              </button>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="navbar-link">
                {t('login')}
              </Link>
              <Link to="/register" className="navbar-link">
                {t('register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


