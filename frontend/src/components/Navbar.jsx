import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Flag } from 'lucide-react';

function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  })();

  const activeLinkClass = (path) => {
    const base = 'transition text-sm font-semibold';
    return location.pathname === path ? `${base} text-white` : `${base} text-white/70 hover:text-white`;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-red-600/50 bg-gradient-to-r from-red-700/95 via-slate-950 to-green-900/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Flag className="h-5 w-5 text-white/80" />
          <span className="text-lg font-bold tracking-tight text-white">Balagh</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link to="/newComplaint" className={activeLinkClass('/newComplaint')}>{t('navbar.submit')}</Link>
          {user ? (
            <>
              <Link to="/manage-complaints" className={activeLinkClass('/manage-complaints')}>{t('navbar.manage')}</Link>
              <button onClick={handleLogout} className="btn-secondary !px-3 !py-1 text-xs">{t('navbar.logout')}</button>
            </>
          ) : (
            <Link to="/login" className={activeLinkClass('/login')}>{t('navbar.admin')}</Link>
          )}
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            value={i18n.language}
            className="modern-select"
          >
            <option value="en">EN</option>
            <option value="fr">FR</option>
            <option value="ar">AR</option>
          </select>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;