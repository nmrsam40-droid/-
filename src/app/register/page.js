'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', telegram_username: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setStatus({ type: 'error', text: data.error || 'تعذر إنشاء الحساب' });
      return;
    }

    setStatus({ type: 'success', text: 'تم إنشاء الحساب بنجاح.' });
    setForm({ full_name: '', email: '', phone: '', password: '', telegram_username: '' });
  };

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="card">
          <span className="pill">إنشاء حساب</span>
          <h1 className="section-title">تسجيل عميل جديد</h1>
          <form onSubmit={handleSubmit}>
            <div className="field-grid">
              <label>
                الاسم الكامل
                <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
              </label>
              <label>
                الهاتف
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </label>
              <label style={{ gridColumn: '1 / -1' }}>
                البريد الإلكتروني
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </label>
              <label style={{ gridColumn: '1 / -1' }}>
                اسم مستخدم Telegram
                <input value={form.telegram_username} onChange={(e) => setForm({ ...form, telegram_username: e.target.value })} />
              </label>
              <label style={{ gridColumn: '1 / -1' }}>
                كلمة المرور
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={8} required />
              </label>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" disabled={loading}>{loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}</button>
            </div>
          </form>
          {status && <div className={`notice ${status.type}`}>{status.text}</div>}
        </div>
      </div>
    </main>
  );
}
