import { getCompanyProfile, getCountryCards } from '@/lib/db';
import Link from 'next/link';

export default function HomePage() {
  const company = getCompanyProfile();
  const countries = getCountryCards();

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="pill">نظام متكامل ومصادق</span>
            <h1>{company.name}</h1>
            <p className="lead">{company.tagline}</p>
            <div className="button-row">
              <Link href="/subscribe" className="btn btn-primary">ابدأ الآن</Link>
              <Link href="/packages" className="btn btn-secondary">استعرض الباقات</Link>
            </div>
          </div>
          <div className="card">
            <p className="muted">إحصائيات الشركة</p>
            <div className="metric-grid">
              <div className="metric-box">
                <strong>120+</strong>
                <span>عملاء</span>
              </div>
              <div className="metric-box">
                <strong>8</strong>
                <span>دول</span>
              </div>
              <div className="metric-box">
                <strong>4.8</strong>
                <span>تقييم</span>
              </div>
              <div className="metric-box">
                <strong>24/7</strong>
                <span>دعم</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">الدول المتاحة</h2>
          <p className="section-subtitle">تظهر الباقات حسب الدولة المفتوحة فعليًا.</p>
          <div className="columns-grid">
            {countries.map((country) => (
              <div className="card" key={country.id}>
                <span className="pill">{country.currency}</span>
                <h3>{country.name}</h3>
                <p className="muted">{country.is_active ? 'متاحة الآن' : 'مغلقة مؤقتًا'}</p>
                <ul className="clean">
                  {country.packages.map((packageItem) => (
                    <li key={packageItem.id}>{packageItem.name} — {packageItem.price} {country.currency}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">لماذا نحن</h2>
          <div className="info-grid">
            <div className="card">
              <h3>قيمة واضحة</h3>
              <p className="muted">نركز على الشفافية والاهتمام بالعميل مع إدارة دقيقة للتجربة الاستثمارية.</p>
            </div>
            <div className="card">
              <h3>تجربة متكاملة</h3>
              <p className="muted">من طلب الاشتراك إلى متابعة الطلبات والسحب والتجديد، كل شيء في مكان واحد.</p>
            </div>
            <div className="card">
              <h3>تدقيق واستقرار</h3>
              <p className="muted">نقوم بتوثيق العمليات وإدارة الطلبات من خلال نظام سجل audit log متكامل.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
