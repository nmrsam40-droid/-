export default function ServicesPage() {
  const services = [
    'إدارة طلبات الاشتراك',
    'إدارة طلبات السحب',
    'إدارة تجديد الاشتراك',
    'متابعة حالة الطلب',
    'إدارة المحافظ',
    'إدارة الإشعارات',
  ];

  return (
    <main className="section">
      <div className="container">
        <div className="card">
          <span className="pill">خدماتنا</span>
          <h1 className="section-title">حلول متكاملة لخدمة العملاء</h1>
          <div className="four-grid">
            {services.map((service) => (
              <div className="card" key={service}>
                <h3>{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
