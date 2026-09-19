'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setStatus({ type: 'error', text: data.error || 'تسجيل الدخول فشل' });
      return;
    }

    setStatus({ type: 'success', text: 'تم تسجيل الدخول بنجاح' });
    window.location.href = '/admin';
  };

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 620 }}>
        <div className="card">
          <span className="pill">تسجيل الدخول</span>
          <h1 className="section-title">الدخول إلى الحساب</h1>
          <form onSubmit={handleSubmit}>
            <div className="field-grid">
              <label>
                البريد الإلكتروني
                <input type="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </label>
              <label>
                كلمة المرور
                <input type="password" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              </label>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" disabled={loading}>{loading ? 'جاري الدخول...' : 'تسجيل الدخول'}</button>
            </div>
          </form>
          {status && <div className={`notice ${status.type}`}>{status.text}</div>}
        </div>
      </div>
    </main>
  );
}
