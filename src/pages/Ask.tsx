import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Helmet } from 'react-helmet-async';

export default function AskPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('questions').insert({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Helmet>
        <title>Soru Sor | YardımRehberi.com</title>
        <meta name="description" content="Her türlü soru, öneri veya destek talebinizi bize iletebilirsiniz. YardımRehberi topluluğu size yardımcı olmaktan mutluluk duyar." />
        <meta name="keywords" content="soru sor, destek, iletişim, YardımRehberi" />
        <link rel="canonical" href="https://yardimrehberi.com/soru-sor" />
        <meta property="og:title" content="Soru Sor | YardımRehberi.com" />
        <meta property="og:description" content="Her türlü soru, öneri veya destek talebinizi bize iletebilirsiniz. YardımRehberi topluluğu size yardımcı olmaktan mutluluk duyar." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yardimrehberi.com/soru-sor" />
        <meta property="og:image" content="https://yardimrehberi.com/og-default.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Soru Sor | YardımRehberi.com" />
        <meta name="twitter:description" content="Her türlü soru, öneri veya destek talebinizi bize iletebilirsiniz. YardımRehberi topluluğu size yardımcı olmaktan mutluluk duyar." />
        <meta name="twitter:image" content="https://yardimrehberi.com/og-default.jpg" />
      </Helmet>
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Soru Sor</h1>
        <p className="text-gray-600 mb-6">Her türlü soru, öneri veya destek talebinizi bize iletebilirsiniz.</p>
        {success && <div className="bg-green-50 text-green-700 px-4 py-2 rounded mb-4">Sorunuz başarıyla iletildi. Teşekkürler!</div>}
        {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Gönderiliyor...' : 'Sorunu Gönder'}
          </button>
        </form>
      </div>
    </div>
  );
} 