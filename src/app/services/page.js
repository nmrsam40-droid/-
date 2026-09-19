export default function ServicesPage() {
  const services = [
    'إدارة طلبات الاشتراك',
    'إدارة المحفظة',
    'طلب السحب',
    'تجديد الاشتراك',
    'الإشعارات',
    'لوحة الإدارة',
    'التقارير والأداء',
    'التوثيق والوثائق',
  ];

  return (
    <main className="section">
      <div className="container">
        <div className="card">
          <span className="pill">خدماتنا</span>
          <h1 className="section-title">حلول متكاملة ومهنية</h1>
          <div className="four-grid">
            {services.map((service) => (
              <div className="card service-card" key={service}>
                <h3>{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
