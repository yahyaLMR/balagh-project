import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function NewComplaint() {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setMessage(t('newComplaint.messages.maxImages'));
      return;
    }
    setImages(files);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      setMessage(t('newComplaint.messages.minImages'));
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      await axios.post('http://localhost:5000/api/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(t('newComplaint.messages.success'));
      setTitle('');
      setDescription('');
      setImages([]);
      document.getElementById('images').value = '';
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setMessage(t('newComplaint.messages.error'));
    }
  };

  return (
    <section className="px-4 py-10">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-white/50">{t('newComplaint.title')}</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">{t('newComplaint.subtitle')}</h2>
          <p className="mt-2 text-sm text-white/70">{t('newComplaint.description')}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/30 backdrop-blur">
          {message && (
            <p className={`rounded-2xl border px-4 py-2 text-sm font-medium ${message.includes('Failed') || message.includes('Please') ? 'border-red-400 bg-red-500/10 text-red-200' : 'border-emerald-400 bg-emerald-500/10 text-emerald-200'}`}>
              {message}
            </p>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-white/80">{t('newComplaint.form.title')}</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="input"
                placeholder={t('newComplaint.form.titlePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="images" className="text-sm font-medium text-white/80">{t('newComplaint.form.images')}</label>
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                required
                className="file:rounded-2xl file:border-0 file:bg-cyan-500/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              <p className="text-xs text-white/60">{t('newComplaint.form.imagesHelp')}</p>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-white/80">{t('newComplaint.form.description')}</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="input h-36 resize-y"
              placeholder={t('newComplaint.form.descriptionPlaceholder')}
            />
          </div>
          <div className="text-right">
            <button type="submit" className="btn-primary">{t('newComplaint.form.submitButton')}</button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default NewComplaint;