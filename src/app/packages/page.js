import { getPackagesForPublic } from '@/lib/db';

export default function PackagesPage() {
  const packages = getPackagesForPublic();

  return (
    <main className="section">
      <div className="container">
        <span className="pill">الباقات</span>
        <h1 className="section-title">الباقات المتاحة</h1>
        <div className="package-grid">
          {packages.map((pkg) => (
            <div className="card" key={pkg.id}>
              <h3>{pkg.name}</h3>
              <p className="muted">{pkg.country_name}</p>
              <strong>{pkg.price} {pkg.currency}</strong>
              <p>{pkg.description}</p>
              <a href="/subscribe" className="btn btn-primary">اختيار الباقة</a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
