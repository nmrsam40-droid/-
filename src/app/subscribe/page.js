'use client';

import { useState } from 'react';

export default function SubscribePage() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', country_id: '1', package_id: '1', amount: '1000' });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch('/api/subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage({ type: 'error', text: data.error || 'تعذر إرسال الطلب' });
      return;
    }

    setMessage({ type: 'success', text: `تم حفظ الطلب بنجاح: ${data.request.request_number}` });
  };

  return (
    <main className="section">
      <div className="container">
        <div className="form-wrap">
          <span className="pill">طلب الاشتراك</span>
          <h1 className="section-title">إرسال طلب جديد</h1>
          <form onSubmit={onSubmit}>
            <div className="input-grid">
              <label>
                الاسم الكامل
                <input name="full_name" value={form.full_name} onChange={onChange} required />
              </label>
              <label>
                البريد الإلكتروني
                <input type="email" name="email" value={form.email} onChange={onChange} required />
              </label>
              <label>
                الهاتف
                <input name="phone" value={form.phone} onChange={onChange} required />
              </label>
              <label>
                الدولة
                <select name="country_id" value={form.country_id} onChange={onChange}>
                  <option value="1">السعودية</option>
                  <option value="2">الإمارات</option>
                  <option value="3">الكويت</option>
                  <option value="4">قطر</option>
                  <option value="5">USDT</option>
                </select>
              </label>
              <label>
                الباقة
                <select name="package_id" value={form.package_id} onChange={onChange}>
                  <option value="1">باقة البداية</option>
                  <option value="2">باقة النمو</option>
                  <option value="3">باقة المتقدم</option>
                </select>
              </label>
              <label>
                المبلغ
                <input name="amount" value={form.amount} onChange={onChange} required />
              </label>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" disabled={loading}>{loading ? 'جاري الإرسال...' : 'إرسال الطلب'}</button>
            </div>
          </form>
          {message && <div className={`notice ${message.type}`}>{message.text}</div>}
        </div>
      </div>
    </main>
  );
}
