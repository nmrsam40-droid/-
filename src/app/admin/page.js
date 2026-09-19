'use client';

import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const response = await fetch('/api/admin');
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || 'غير مصرح لك بالدخول');
      setLoading(false);
      return;
    }
    setData(payload);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (id, action, reason = '') => {
    const response = await fetch(`/api/admin/requests/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason }),
    });
    const payload = await response.json();
    if (response.ok) {
      await load();
      alert(payload.message || 'تم تحديث الطلب');
      return;
    }
    alert(payload.error || 'تعذر تحديث الطلب');
  };

  if (loading) {
    return <main className="section"><div className="container"><div className="card">جاري تحميل لوحة الإدارة...</div></div></main>;
  }

  if (error) {
    return <main className="section"><div className="container"><div className="card"><h2>إذن غير متاح</h2><p>{error}</p></div></div></main>;
  }

  return (
    <main className="section">
      <div className="container">
        <span className="pill">لوحة الإدارة</span>
        <h1 className="section-title">لوحة الإدارة الداخلية</h1>

        <div className="admin-grid">
          <div className="stat-box"><strong>{data.stats.totalUsers}</strong><p>إجمالي المستخدمين</p></div>
          <div className="stat-box"><strong>{data.stats.totalSubscriptions}</strong><p>إجمالي الطلبات</p></div>
          <div className="stat-box"><strong>{data.stats.pendingSubscriptions}</strong><p>طلبات معلقة</p></div>
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <h3>طلبات الاشتراك المعلقة</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>رقم الطلب</th>
                  <th>العميل</th>
                  <th>الباقة</th>
                  <th>المبلغ</th>
                  <th>الحالة</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {data.pendingSubscriptions.length === 0 ? (
                  <tr><td colSpan="6">لا توجد طلبات معلقة</td></tr>
                ) : data.pendingSubscriptions.map((item) => (
                  <tr key={item.id}>
                    <td>{item.request_number}</td>
                    <td>{item.full_name}</td>
                    <td>{item.package_name}</td>
                    <td>{item.amount}</td>
                    <td>{item.status}</td>
                    <td>
                      <button className="btn btn-success" onClick={() => changeStatus(item.id, 'approve')}>قبول</button>
                      <button className="btn btn-danger" onClick={() => changeStatus(item.id, 'reject', 'رفض من لوحة الإدارة')}>رفض</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
