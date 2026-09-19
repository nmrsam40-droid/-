'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState(null);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus({ type: 'error', text: data.error || 'فشل تسجيل الدخول' });
      return;
    }
    setStatus({ type: 'success', text: 'تم تسجيل الدخول بنجاح' });
    window.location.href = '/admin';
  };

  return (
    <main className="section">
      <div className="container">
        <div className="form-wrap" style={{ maxWidth: 560, margin: '0 auto' }}>
          <span className="pill">تسجيل الدخول</span>
          <h1 className="section-title">الدخول إلى النظام</h1>
          <form onSubmit={onSubmit}>
            <div className="input-grid" style={{ gridTemplateColumns: '1fr' }}>
              <label>
                البريد الإلكتروني
                <input name="email" value={form.email} onChange={onChange} required />
              </label>
              <label>
                كلمة المرور
                <input type="password" name="password" value={form.password} onChange={onChange} required />
              </label>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary">تسجيل الدخول</button>
            </div>
          </form>
          {status && <div className={`notice ${status.type}`}>{status.text}</div>}
        </div>
      </div>
    </main>
  );
}
