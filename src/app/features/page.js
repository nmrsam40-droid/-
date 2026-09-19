export default function FeaturesPage() {
  const features = [
    'واجهة متجاوبة للهاتف والكمبيوتر',
    'قاعدة بيانات مركزية',
    'لوحة إدارة داخل التطبيق',
    'صلاحيات Super Admin وEmployee وClient',
    'إشعارات داخل التطبيق',
    'تجميع الطلبات والعمليات في ملف واحد',
    'تكامل Telegram من Backend فقط',
    'سجل Audit Log كامل',
  ];

  return (
    <main className="section">
      <div className="container">
        <div className="card">
          <span className="pill">مميزاتنا</span>
          <h1 className="section-title">ميزات تصنع تجربة احترافية</h1>
          <div className="info-grid">
            {features.map((feature) => (
              <div className="card glass-card" key={feature}>
                <h3>{feature}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
