export default function FeaturesPage() {
  const features = [
    'واجهة متجاوبة للهاتف والكمبيوتر',
    'لوحة إدارة داخل التطبيق',
    'قاعدة بيانات مركزية',
    'API حقيقي مع نظام صلاحيات',
    'إشعارات Telegram عبر Backend',
    'سجل Audit Log كامل',
  ];

  return (
    <main className="section">
      <div className="container">
        <div className="card">
          <span className="pill">مميزات الشركة</span>
          <h1 className="section-title">ميزات تعزز تجربة العميل والموظف</h1>
          <div className="info-grid">
            {features.map((feature) => (
              <div className="card" key={feature}>
                <h3>{feature}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
