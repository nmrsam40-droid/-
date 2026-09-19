'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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

    setStatus({ type: 'success', text: 'تم إنشاء الحساب بنجاح، يمكنك الآن تسجيل الدخول.' });
    setForm({ full_name: '', email: '', phone: '', password: '' });
  };

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <div className="form-wrap">
          <span className="pill">إنشاء حساب</span>
          <h1 className="section-title">تسجيل عميل جديد</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-grid">
              <label>
                الاسم الكامل
                <input name="full_name" value={form.full_name} onChange={handleChange} required />
              </label>
              <label>
                رقم الهاتف
                <input name="phone" value={form.phone} onChange={handleChange} required />
              </label>
              <label style={{ gridColumn: '1 / -1' }}>
                البريد الإلكتروني
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </label>
              <label style={{ gridColumn: '1 / -1' }}>
                كلمة المرور
                <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} />
              </label>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" disabled={loading}>
                {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
              </button>
            </div>
          </form>
          {status && <div className={`notice ${status.type}`}>{status.text}</div>}
        </div>
      </div>
    </main>
  );
}
