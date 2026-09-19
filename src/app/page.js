import Link from 'next/link';
import { getCompanyProfile, getCountryCards } from '@/lib/db';

const countryOrder = ['SA', 'AE', 'KW', 'QA', 'USDT'];

export default function HomePage() {
  const company = getCompanyProfile();
  const countries = [...getCountryCards()].sort(
    (a, b) => countryOrder.indexOf(a.code) - countryOrder.indexOf(b.code)
  );

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="pill">شركة الحياة للاستثمارات العامة</span>
            <h1>{company?.english_name || 'ALHAYAT Company'}</h1>
            <p className="lead">
              {company?.tagline || 'منصة رقمية متكاملة لإدارة خدمات الشركة، الاشتراكات، المحفظة، السحب، التجديد، والإشعارات.'}
            </p>
            <div className="button-row">
              <Link href="/subscribe" className="btn btn-primary">طلب الاشتراك</Link>
              <Link href="/register" className="btn btn-secondary">إنشاء حساب</Link>
            </div>
          </div>

          <div className="card company-card">
            <div className="company-overview">
              <div>
                <p className="muted-label">اسم الشركة</p>
                <strong>{company?.name || 'شركة الحياة للاستثمارات العامة'}</strong>
              </div>
              <div>
                <p className="muted-label">المدينة</p>
                <strong>{company?.city || 'الرياض'}</strong>
              </div>
              <div>
                <p className="muted-label">السجل التجاري</p>
                <strong>{company?.commercial_register || '1010335176'}</strong>
              </div>
              <div>
                <p className="muted-label">واتساب</p>
                <strong>{company?.whatsapp || '+966 59 682 6260'}</strong>
              </div>
              <div>
                <p className="muted-label">البريد</p>
                <strong>{company?.email || 'alhayatsar@gmail.com'}</strong>
              </div>
              <div>
                <p className="muted-label">ساعات العمل</p>
                <strong>{company?.working_hours || '1 PM إلى 1 AM'}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="container">
          <h2 className="section-title">من نحن</h2>
          <p className="section-subtitle">
            شركة الحياة للاستثمارات العامة تقدم خدمات استثمارية وإدارية متكاملة في المملكة العربية السعودية، مع التركيز على الشفافية والتجربة الرقمية المستقرة.
          </p>
          <div className="info-grid">
            <div className="card glass-card">
              <h3>رؤيتنا</h3>
              <p className="muted">بناء نظام استثماري موثوق ومتكامل يساعد العملاء على متابعة الطلبات والملفات والعملات والربح بشكل واضح.</p>
            </div>
            <div className="card glass-card">
              <h3>خدماتنا</h3>
              <p className="muted">إدارة الاشتراكات، المحفظة، السحب، التجديد، الإشعارات، والتقارير داخل نظام واحد.</p>
            </div>
            <div className="card glass-card">
              <h3>التزامنا</h3>
              <p className="muted">لا نقدم ضمانات أو عوائد غير موثقة، بل نعرض المعلومات القائمة على البيانات الفعلية والوثائق المعتمدة.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <h2 className="section-title">خدماتنا</h2>
          <div className="four-grid">
            {['إدارة الطلبات', 'المحفظة', 'طلب السحب', 'تجديد الاشتراك', 'الإشعارات', 'لوحة الإدارة', 'التوثيق', 'تقارير الأداء'].map((service) => (
              <div className="card service-card" key={service}>
                <h3>{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="packages">
        <div className="container">
          <h2 className="section-title">الباقات</h2>
          <div className="accordion-stack">
            {countries.map((country) => (
              <div className="accordion-item" key={country.id}>
                <details open={country.code === 'SA'}>
                  <summary>{country.flag} {country.name} — {country.currency}</summary>
                  <div className="accordion-body">
                    <div className="package-grid">
                      {country.packages?.map((pkg) => (
                        <div className="card package-card" key={pkg.id}>
                          <span className="pill soft-pill">{pkg.package_name}</span>
                          <h3>{pkg.investment_amount} {pkg.currency}</h3>
                          <p className="package-return">العائد اليومي: {pkg.displayed_return} {pkg.currency}</p>
                          <p className="muted">{pkg.description || 'عرض/متوقع حسب البيانات الموجودة في النظام.'}</p>
                          <div className="package-meta">المدة: {pkg.duration}</div>
                          <Link href="/subscribe" className="btn btn-primary small-btn">طلب الاشتراك</Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="guarantees">
        <div className="container">
          <h2 className="section-title">الضمانات والوثائق</h2>
          <div className="info-grid">
            <div className="card glass-card">
              <h3>الاستقرار</h3>
              <p className="muted">يتم عرض البيانات بناءً على ما هو مسجّل فعليًا في النظام، مع فصل العائدات المتوقعة عن العائدات الفعلية.</p>
            </div>
            <div className="card glass-card">
              <h3>الوثائق</h3>
              <p className="muted">تدار الوثائق من داخل لوحة الإدارة مع إمكانية الإظهار والإخفاء وتحديد التاريخ والملف.</p>
            </div>
            <div className="card glass-card">
              <h3>عدم المبالغة</h3>
              <p className="muted">لا يتم التعبير عن أي ضمان أو عائد على أنه مضمون دون أن يكون هناك أساس قانوني موثّق.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="team">
        <div className="container">
          <h2 className="section-title">فريق العمل</h2>
          <div className="team-grid">
            {[
              ['أحمد الغامدي', 'المدير التنفيذي'],
              ['سارة السليم', 'مديرة العلاقات'],
              ['عبدالله الحارثي', 'مدير العمليات'],
            ].map(([name, role]) => (
              <div className="card team-card" key={name}>
                <div className="avatar">{name.charAt(0)}</div>
                <h3>{name}</h3>
                <p className="muted">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="contact">
        <div className="container">
          <h2 className="section-title">التواصل</h2>
          <div className="info-grid contact-grid">
            <div className="card glass-card">
              <h3>واتساب</h3>
              <p className="muted">{company?.whatsapp || '+966 59 682 6260'}</p>
            </div>
            <div className="card glass-card">
              <h3>Telegram</h3>
              <p className="muted">{company?.telegram || '@Abukhalid_com'}</p>
            </div>
            <div className="card glass-card">
              <h3>البريد</h3>
              <p className="muted">{company?.email || 'alhayatsar@gmail.com'}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
