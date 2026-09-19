'use client';

import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({ stats: { totalUsers: 0, totalSubscriptions: 0, pendingSubscriptions: 0 }, pendingSubscriptions: [] });

  const loadData = async () => {
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
    loadData();
  }, []);

  const updateRequest = async (id, action, reason = '') => {
    const response = await fetch(`/api/admin/requests/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason }),
    });
    const payload = await response.json();
    if (!response.ok) {
      alert(payload.error || 'فشل التحديث');
      return;
    }
    alert(payload.message || 'تم تحديث الطلب');
    loadData();
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
        <div className="card">
          <span className="pill">لوحة الإدارة</span>
          <h1 className="section-title">لوحة الإدارة الداخلية</h1>
          <div className="stats-grid">
            <div className="stat-box">
              <strong>{data.stats.totalUsers}</strong>
              <span>إجمالي المستخدمين</span>
            </div>
            <div className="stat-box">
              <strong>{data.stats.totalSubscriptions}</strong>
              <span>إجمالي الطلبات</span>
            </div>
            <div className="stat-box">
              <strong>{data.stats.pendingSubscriptions}</strong>
              <span>طلبات معلقة</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <h3>طلبات الاشتراك</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>رقم الطلب</th>
                  <th>اسم العميل</th>
                  <th>الباقة</th>
                  <th>المبلغ</th>
                  <th>الحالة</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {data.pendingSubscriptions.length === 0 ? (
                  <tr><td colSpan="6">لا توجد طلبات معلقة</td></tr>
                ) : data.pendingSubscriptions.map((req) => (
                  <tr key={req.id}>
                    <td>{req.request_number}</td>
                    <td>{req.full_name}</td>
                    <td>{req.package_name || 'غير محدد'}</td>
                    <td>{req.amount}</td>
                    <td>{req.status}</td>
                    <td>
                      <button className="btn btn-primary small-btn" onClick={() => updateRequest(req.id, 'approve')}>قبول</button>
                      <button className="btn btn-secondary small-btn" onClick={() => updateRequest(req.id, 'reject', 'رفض من الإدارة')}>رفض</button>
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
