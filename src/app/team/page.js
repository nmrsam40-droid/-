export default function TeamPage() {
  const team = [
    { name: 'أحمد عبدالله', role: 'المدير التنفيذي' },
    { name: 'سارة محمد', role: 'مديرة العلاقات' },
    { name: 'يوسف علي', role: 'مدير المشاريع' },
  ];

  return (
    <main className="section">
      <div className="container">
        <span className="pill">فريق ��لعمل</span>
        <h1 className="section-title">الخبراء وراء النظام</h1>
        <div className="team-grid">
          {team.map((member) => (
            <div className="card" key={member.name}>
              <h3>{member.name}</h3>
              <p className="muted">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
