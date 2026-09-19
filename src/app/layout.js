'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { getCompanyProfile, getCountryCards } from '@/lib/db';

const countryOrder = ['SA', 'AE', 'KW', 'QA', 'USDT'];

export default function HomePage() {
  const company = getCompanyProfile();
  const rawCountries = getCountryCards();
  const countries = useMemo(
    () =>
      [...rawCountries].sort(
        (a, b) => countryOrder.indexOf(a.code) - countryOrder.indexOf(b.code)
      ),
    [rawCountries]
  );
  const [openCountry, setOpenCountry] = useState('SA');

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="pill">شركة الحياة للاستثمارات العامة</span>
            <h1>{company?.english_name || 'ALHAYAT Company'}</h1>
            <p className="lead">
              {company?.tagline || 'نظام استثماري وإداري متكامل مصمم لتسهيل عمليات الاشتراك، المحفظة، السحب، التجديد، والإدارة داخل تطبيق موحد.'}
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
                <p className="muted-label">بريد إلكتروني</p>
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
            شركة الحياة للاستثمارات العامة تقدم خدمات استثمارية وإدارية متكاملة في المملكة العربية السعودية، مع تركيز على الشفافية، تجربة العميل، وإدارة الطلبات عبر نظام موحد وآمن.
          </p>
          <div className="info-grid">
            <div className="card glass-card">
              <h3>رؤيتنا</h3>
              <p className="muted">بناء علاقة موثوقة مع العملاء من خلال نظام كشف، متابعة، وإدارة دقيقة للطلبات والطلبات المالية.</p>
            </div>
            <div className="card glass-card">
              <h3>خدماتنا</h3>
              <p className="muted">إدارة الاشتراك، المحفظة، السحب، التجديد، الإشعارات، والتواصل الرقمي عبر واجهة موحدة.</p>
            </div>
            <div className="card glass-card">
              <h3>الالتزام</h3>
              <p className="muted">نلتزم بتقديم المعلومات والبيانات بشكل واضح دون ادعاء غير موثق أو ضمانات غير مسندة إلى أسس قانونية.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <h2 className="section-title">خدماتنا</h2>
          <div className="four-grid">
            {[
              'إدارة الطلبات',
              'محفظة العملاء',
              'طلب السحب',
              'تجديد الاشتراك',
              'الإشعارات',
              'لوحة الإدارة',
              'التوثيق وضمانات المعاملات',
              'التقارير والمخططات',
            ].map((service) => (
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
                <button
                  type="button"
                  className="accordion-header"
                  onClick={() => setOpenCountry(openCountry === country.code ? '' : country.code)}
                >
                  <span>
                    {country.flag || '🏛️'} {country.name} — {country.currency}
                  </span>
                  <span>{openCountry === country.code ? '−' : '+'}</span>
                </button>

                {openCountry === country.code && (
                  <div className="accordion-body">
                    <div className="package-grid">
                      {country.packages?.map((pkg) => (
                        <div className="card package-card" key={pkg.id}>
                          <span className="pill soft-pill">{pkg.package_name}</span>
                          <h3>{pkg.investment_amount} {pkg.currency}</h3>
                          <p className="package-return">العائد اليومي: {pkg.displayed_return} {pkg.currency}</p>
                          <p className="muted">{pkg.description || 'عرض/متوقع وفق البيانات المعروضة في النظام.'}</p>
                          <div className="package-meta">
                            <span>المدة: {pkg.duration}</span>
                          </div>
                          <Link href="/subscribe" className="btn btn-primary small-btn">طلب الاشتراك</Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
              <p className="muted">يتم عرض المعلومات المالية وفق البيانات الفعلية المسجلة في النظام، مع فصل البيانات التوقعية عن البيانات المحققة.</p>
            </div>
            <div className="card glass-card">
              <h3>الوثائق</h3>
              <p className="muted">تتم إدارة الوثائق من لوحة الإدارة، وإخفاء أو إظهار أي مستند وفق الحالة القانونية أو التشغيلية.</p>
            </div>
            <div className="card glass-card">
              <h3>عدم المبالغة</h3>
              <p className="muted">لا يُعرض أي ضمان أو عائد على أنه مضمون إلا إذا كان مستندًا قانونيًا موثقًا وعلمياً ثابتًا داخل النظام.</p>
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

