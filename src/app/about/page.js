export default function AboutPage() {
  return (
    <main className="section">
      <div className="container">
        <div className="card">
          <span className="pill">من نحن</span>
          <h1 className="section-title">حول شركة الحياة للاستثمارات العامة</h1>
          <p className="section-subtitle">
            شركة متخصصة في تقديم خدمات استثمارية وإدارية متكاملة في المملكة العربية السعودية، مع إعطاء الأولوية للشفافية والراحة الرقمية للعملاء والموظفين.
          </p>
          <div className="info-grid">
            <div className="card glass-card">
              <h3>الرسالة</h3>
              <p className="muted">إدارة الخدمات والطلبات والعمليات بشكل آمن، موحد، ومتكامل داخل واجهة واحدة.</p>
            </div>
            <div className="card glass-card">
              <h3>الرؤية</h3>
              <p className="muted">بناء منظومة رقمية احترافية تدعم العملاء، الفريق الإداري، وأداء الشركة على مستوى عالي.</p>
            </div>
            <div className="card glass-card">
              <h3>القيم</h3>
              <p className="muted">الوضوح، الأمان، الثقة، وتقديم خدمة عالية الجودة داخل بيئة رقمية متكاملة.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
