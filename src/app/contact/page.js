export default function ContactPage() {
  return (
    <main className="section">
      <div className="container">
        <div className="card">
          <span className="pill">التواصل</span>
          <h1 className="section-title">بيانات التواصل</h1>
          <div className="info-grid contact-grid">
            <div className="card glass-card">
              <h3>واتساب</h3>
              <p className="muted">+966 59 682 6260</p>
            </div>
            <div className="card glass-card">
              <h3>Telegram</h3>
              <p className="muted">@Abukhalid_com</p>
            </div>
            <div className="card glass-card">
              <h3>البريد</h3>
              <p className="muted">alhayatsar@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
