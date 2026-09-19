export default function WalletPage() {
  return (
    <main className="section">
      <div className="container">
        <div className="card">
          <span className="pill">محفظتي</span>
          <h1 className="section-title">المحفظة</h1>
          <div className="info-grid">
            <div className="card glass-card">
              <h3>رأس المال</h3>
              <p className="muted">0.00</p>
            </div>
            <div className="card glass-card">
              <h3>الأرباح المسجلة</h3>
              <p className="muted">0.00</p>
            </div>
            <div className="card glass-card">
              <h3>حالة الحساب</h3>
              <p className="muted">بانتظار الموافقة</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
