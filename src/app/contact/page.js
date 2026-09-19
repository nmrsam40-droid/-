export default function ContactPage() {
  return (
    <main className="section">
      <div className="container">
        <div className="card">
          <span className="pill">موقع الشركة</span>
          <h1 className="section-title">معلومات التواصل</h1>
          <div className="info-grid">
            <div>
              <h3>عنوان الشركة</h3>
              <p className="muted">لا توجد بيانات عنوان مكتب أو موقع إلكتروني تم إدخاله في المشروع الحالي، لذلك تم إخفاء أي عنوان غير موثّق.</p>
            </div>
            <div>
              <h3>الهاتف</h3>
              <p className="muted">+966 500 000 000</p>
            </div>
            <div>
              <h3>البريد</h3>
              <p className="muted">contact@hayat-company.com</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
