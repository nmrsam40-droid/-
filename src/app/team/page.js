export default function TeamPage() {
  const team = [
    ['أحمد الغامدي', 'المدير التنفيذي'],
    ['سارة السليم', 'مديرة العلاقات'],
    ['عبدالله الحارثي', 'مدير العمليات'],
  ];

  return (
    <main className="section">
      <div className="container">
        <div className="card">
          <span className="pill">فريق العمل</span>
          <h1 className="section-title">خبراء الشركة</h1>
          <div className="team-grid">
            {team.map(([name, role]) => (
              <div className="card team-card" key={name}>
                <div className="avatar">{name.charAt(0)}</div>
                <h3>{name}</h3>
                <p className="muted">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
