export default function RenewPage() {
  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <div className="card">
          <span className="pill">تجديد الاشتراك</span>
          <h1 className="section-title">طلب تجديد الاشتراك</h1>
          <div className="field-grid">
            <label>
              الباقة الحالية
              <input defaultValue="الذهبية" readOnly />
            </label>
            <label>
              تاريخ الانتهاء
              <input defaultValue="2026-12-31" readOnly />
            </label>
            <label>
              مدة التجديد
              <select>
                <option>شهر</option>
                <option>3 أشهر</option>
                <option>6 أشهر</option>
                <option>12 شهر</option>
              </select>
            </label>
            <label>
              الباقة الجديدة
              <select>
                <option>برونزية</option>
                <option>فضية</option>
                <option>ذهبية</option>
              </select>
            </label>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary">إرسال طلب التجديد</button>
          </div>
        </div>
      </div>
    </main>
  );
}
