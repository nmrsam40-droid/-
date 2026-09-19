export default function NotificationsPage() {
  return (
    <main className="section">
      <div className="container">
        <div className="card">
          <span className="pill">الإشعارات</span>
          <h1 className="section-title">إشعارات الحساب</h1>
          <ul className="notification-list">
            <li>تم اعتماد طلب الاشتراك بنجاح.</li>
            <li>تم إرسال طلب السحب إلى الإدارة.</li>
            <li>تم تحديث حالة حسابك في النظام.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
