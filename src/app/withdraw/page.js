export default function WithdrawPage() {
  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <div className="card">
          <span className="pill">طلب سحب</span>
          <h1 className="section-title">طلب سحب الأرباح</h1>
          <div className="field-grid">
            <label>
              اسم المستفيد
              <input placeholder="اسم المستفيد" />
            </label>
            <label>
              الهاتف
              <input placeholder="رقم الهاتف" />
            </label>
            <label>
              الدولة
              <input placeholder="الدولة" />
            </label>
            <label>
              الحساب البنكي أو المحفظة
              <input placeholder="الحساب أو المحفظة" />
            </label>
            <label>
              المبلغ
              <input type="number" placeholder="0" />
            </label>
            <label>
              العملة
              <select>
                <option>SAR</option>
                <option>AED</option>
                <option>KWD</option>
                <option>QAR</option>
                <option>USDT</option>
              </select>
            </label>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary">إرسال طلب السحب</button>
          </div>
        </div>
      </div>
    </main>
  );
}
