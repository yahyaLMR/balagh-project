import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-32 right-10 h-52 w-52 rounded-full bg-gradient-to-br from-cyan-500/70 to-blue-600/40 blur-3xl" />
        <div className="absolute bottom-0 left-20 h-64 w-64 rounded-full bg-gradient-to-br from-violet-500/60 to-indigo-700/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-10">
        <div className="glass-panel grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="info-pill">{t('home.features.transparent.title')}</p>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
              {t('home.welcome')} <span className="text-red-200">Balagh</span>
            </h1>
            <p className="text-lg text-white/80">{t('home.description')}</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/newComplaint" className="btn-primary">
                {t('home.submitButton')}
              </Link>
              <Link to="/login" className="btn-secondary">
                {t('home.adminLogin')}
              </Link>
            </div>
          </div>
          <div className="space-y-4 rounded-2xl border border-red-500/40 bg-gradient-to-b from-white/5 to-white/0 p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
              {t('home.features.fast.title')}
            </p>
            <p className="text-2xl font-semibold">{t('home.features.fast.description')}</p>
            <div className="space-y-3 text-sm text-white/80">
              <p>• {t('home.features.managed.title')}</p>
              <p>• {t('home.features.managed.description')}</p>
              <p>• {t('home.features.transparent.description')}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: t('home.features.fast.title'),
                body: t('home.features.fast.description'),
                accent: 'text-red-200',
              },
              {
                title: t('home.features.transparent.title'),
                body: t('home.features.transparent.description'),
                accent: 'text-green-200',
              },
              {
                title: t('home.features.managed.title'),
                body: t('home.features.managed.description'),
                accent: 'text-red-200',
              },
            ].map((feature) => (
              <div key={feature.title} className="feature-card">
                <p className="text-xs uppercase tracking-widest text-red-100">Highlights</p>
                <h3 className={`mt-3 text-xl font-semibold ${feature.accent}`}>{feature.title}</h3>
                <p className="mt-2 text-sm text-white/70">{feature.body}</p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

export default Home;