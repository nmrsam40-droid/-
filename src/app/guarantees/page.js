export default function GuaranteesPage() {
  return (
    <main className="section">
      <div className="container">
        <div className="card">
          <span className="pill">الضمانات والوثائق</span>
          <h1 className="section-title">التوثيق والشفافية</h1>
          <div className="info-grid">
            <div className="card glass-card">
              <h3>وثائق الشركة</h3>
              <p className="muted">يتم إدارة الوثائق من داخل لوحة الإدارة مع القابلية للإخفاء أو الإظهار وتحديد التاريخ.</p>
            </div>
            <div className="card glass-card">
              <h3>عدم المبالغة</h3>
              <p className="muted">لا يتم تقديم أي ضمان أو عائد على أنه مضمون إلا إذا كان موثقًا قانونيًا داخل النظام.</p>
            </div>
            <div className="card glass-card">
              <h3>البيانات الفعلية</h3>
              <p className="muted">يتم فصل البيانات الفعلية من البيانات التوقعية لتجنب التزوير أو الادعاءات غير الموثقة.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
