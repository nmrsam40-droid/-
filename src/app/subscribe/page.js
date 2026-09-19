'use client';

import { useEffect, useState } from 'react';

const countryPackages = {
  SA: [
    { name: 'برونزية', amount: 1000, returnDaily: 450 },
    { name: 'برونزية', amount: 1500, returnDaily: 560 },
    { name: 'برونزية', amount: 2000, returnDaily: 720 },
    { name: 'فضية', amount: 3000, returnDaily: 1000 },
    { name: 'فضية', amount: 5000, returnDaily: 1800 },
    { name: 'فضية', amount: 7000, returnDaily: 2200 },
    { name: 'ذهبية', amount: 10000, returnDaily: 3700 },
    { name: 'ذهبية', amount: 15000, returnDaily: 4750 },
  ],
  AE: [
    { name: 'برونزية', amount: 1500, returnDaily: 570 },
    { name: 'فضية', amount: 2000, returnDaily: 940 },
    { name: 'فضية', amount: 3000, returnDaily: 1410 },
    { name: 'ذهبية', amount: 5000, returnDaily: 2370 },
    { name: 'ذهبية', amount: 7000, returnDaily: 3400 },
  ],
  KW: [
    { name: 'برونزية', amount: 120, returnDaily: 35 },
    { name: 'فضية', amount: 245, returnDaily: 80 },
    { name: 'ذهبية', amount: 410, returnDaily: 130 },
    { name: 'ماسية', amount: 575, returnDaily: 160 },
    { name: 'بلاتينية', amount: 822, returnDaily: 300 },
    { name: 'ملكية', amount: 1230, returnDaily: 400 },
  ],
  QA: [
    { name: 'برونزية', amount: 1500, returnDaily: 550 },
    { name: 'فضية', amount: 2000, returnDaily: 900 },
    { name: 'فضية', amount: 3000, returnDaily: 1400 },
    { name: 'ذهبية', amount: 5000, returnDaily: 2350 },
    { name: 'ذهبية', amount: 7000, returnDaily: 3400 },
    { name: 'ذهبية', amount: 10000, returnDaily: 4900 },
  ],
  USDT: [
    { name: 'Starter', amount: 250, returnDaily: 80 },
    { name: 'Standard', amount: 500, returnDaily: 160 },
    { name: 'Professional', amount: 1000, returnDaily: 320 },
    { name: 'Premium', amount: 2500, returnDaily: 800 },
    { name: 'VIP', amount: 5000, returnDaily: 1600 },
    { name: 'Elite', amount: 10000, returnDaily: 3200 },
  ],
};

const countryNames = {
  SA: 'السعودية',
  AE: 'الإمارات',
  KW: 'الكويت',
  QA: 'قطر',
  USDT: 'USDT',
};

const currencyMap = {
  SA: 'SAR',
  AE: 'AED',
  KW: 'KWD',
  QA: 'QAR',
  USDT: 'USDT',
};

export default function SubscribePage() {
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    country: 'SA',
    packageName: 'برونزية',
    amount: 1000,
    bank_or_wallet: '',
    telegram_username: '',
    currency: 'SAR',
  });
  const [reviewOpen, setReviewOpen] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const countryCode = form.country;
    const defaultPkg = countryPackages[countryCode][0];
    setForm((prev) => ({
      ...prev,
      currency: currencyMap[countryCode],
      packageName: defaultPkg.name,
      amount: defaultPkg.amount,
    }));
  }, [form.country]);

  const packageOptions = countryPackages[form.country] || [];

  const handleSubmit = async () => {
    setLoading(true);
    setStatus(null);

    const response = await fetch('/api/subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: form.full_name,
        phone: form.phone,
        country_id: { SA: 1, AE: 2, KW: 3, QA: 4, USDT: 5 }[form.country],
        package_id: 1,
        currency: form.currency,
        amount: Number(form.amount),
        bank_or_wallet: form.bank_or_wallet,
        telegram_username: form.telegram_username,
      }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setStatus({ type: 'error', text: data.error || 'تعذر إرسال الطلب' });
      return;
    }

    setStatus({ type: 'success', text: `تم إرسال طلب الاشتراك بنجاح، رقم الطلب: ${data.request.request_number}` });
    setReviewOpen(false);
  };

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 820 }}>
        <div className="card">
          <span className="pill">طلب الاشتراك</span>
          <h1 className="section-title">إرسال طلب اشتراك جديد</h1>

          <div className="field-grid">
            <label>
              الاسم الكامل
              <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
            </label>
            <label>
              رقم الهاتف
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </label>
            <label>
              الدولة
              <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                {Object.entries(countryNames).map(([code, name]) => (
                  <option value={code} key={code}>{name}</option>
                ))}
              </select>
            </label>
            <label>
              العملة
              <input value={form.currency} readOnly />
            </label>
            <label>
              اسم مستخدم Telegram
              <input value={form.telegram_username} onChange={(e) => setForm({ ...form, telegram_username: e.target.value })} />
            </label>
            <label>
              الحساب البنكي أو اسم المحفظة
              <input value={form.bank_or_wallet} onChange={(e) => setForm({ ...form, bank_or_wallet: e.target.value })} required />
            </label>
            <label style={{ gridColumn: '1 / -1' }}>
              الباقة
              <select value={form.packageName} onChange={(e) => {
                const pkg = packageOptions.find((item) => item.name === e.target.value);
                setForm({ ...form, packageName: e.target.value, amount: pkg?.amount || 0 });
              }}>
                {packageOptions.map((item) => (
                  <option value={item.name} key={item.name + item.amount}>{item.name} — {item.amount} {form.currency}</option>
                ))}
              </select>
            </label>
            <label style={{ gridColumn: '1 / -1' }}>
              مبلغ الاشتراك
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} required />
            </label>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" onClick={() => setReviewOpen(true)}>مراجعة البيانات</button>
          </div>

          {reviewOpen && (
            <div className="card review-box">
              <h3>مراجعة الطلب</h3>
              <p><strong>اسم العميل:</strong> {form.full_name}</p>
              <p><strong>الهاتف:</strong> {form.phone}</p>
              <p><strong>الدولة:</strong> {countryNames[form.country]}</p>
              <p><strong>الباقة:</strong> {form.packageName}</p>
              <p><strong>المبلغ:</strong> {form.amount} {form.currency}</p>
              <p><strong>الحساب:</strong> {form.bank_or_wallet}</p>
              <p><strong>Telegram:</strong> {form.telegram_username || 'غير محدد'}</p>
              <div className="button-row">
                <button className="btn btn-secondary" onClick={() => setReviewOpen(false)}>تعديل البيانات</button>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? 'جاري الإرسال...' : 'إرسال طلب الاشتراك'}</button>
              </div>
            </div>
          )}

          {status && <div className={`notice ${status.type}`}>{status.text}</div>}
        </div>
      </div>
    </main>
  );
}
