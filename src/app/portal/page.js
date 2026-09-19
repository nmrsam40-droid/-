import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="section">
      <div className="container">
        <div className="card">
          <span className="pill">مبنى الموقع</span>
          <h1 className="section-title">تم إنشاء أساس الموقع بنجاح</h1>
          <p className="section-subtitle">
            تم تجهيز الصفحة الرئيسية، الصفحات الثابتة، لوحة الإدارة، تسجيل الدخول، الطلبات، والهيكل العام للنظام.
          </p>
          <div className="button-row">
            <Link href="/" className="btn btn-primary">الرئيسية</Link>
            <Link href="/login" className="btn btn-secondary">تسجيل الدخول</Link>
            <Link href="/register" className="btn btn-secondary">إنشاء حساب</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
