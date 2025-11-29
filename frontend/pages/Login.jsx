import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({full_name: response.data.full_name, email: response.data.email}));
      navigate('/manage-complaints');
    } catch (err) {
      console.error('Login failed:', err);
      setError(t('login.error'));
    }
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4">
      <div className="glass-panel w-full max-w-md">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white">{t('login.title')}</h2>
          <p className="text-sm text-white/70">{t('login.subtitle')}</p>
        </div>
        {error && <p className="mt-4 rounded-2xl border border-red-500/60 bg-red-500/10 px-4 py-2 text-sm text-red-200">{error}</p>}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-white/80">{t('login.email')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
              placeholder="admin@admin.com"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-white/80">{t('login.password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary w-full">{t('login.loginButton')}</button>
        </form>
      </div>
      <p className="text-center text-xs uppercase tracking-[0.4em] text-white/50">
        {t('login.subtitle')}
      </p>
    </div>
  );
}

export default Login;