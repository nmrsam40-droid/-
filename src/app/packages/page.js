:root {
  --bg: #f6f8fb;
  --panel: #ffffff;
  --primary: #0c4a5c;
  --primary-soft: #e8f3f7;
  --secondary: #d4a95b;
  --dark: #0d1b2a;
  --text: #152533;
  --muted: #5b6572;
  --border: #e7edf3;
  --green: #1d8b67;
  --soft-green: #eafaf3;
  --shadow: 0 12px 28px rgba(10, 25, 39, 0.08);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, sans-serif;
  color: var(--text);
  background: linear-gradient(180deg, #f9fbfd 0%, #f1f6fb 100%);
}

a { color: inherit; text-decoration: none; }
img { max-width: 100%; }
button, input, select, textarea { font: inherit; }
.container { width: min(1200px, calc(100% - 30px)); margin: 0 auto; }
.topbar {
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 30;
}
.nav-wrap {
  min-height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.brand-wrap {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  color: var(--primary);
}
.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary), #1f6276);
  color: white;
  font-size: 0.9rem;
}
.brand-text { font-size: 1.2rem; }
.main-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}
.nav-link {
  color: var(--text);
  padding: 8px 10px;
  border-radius: 10px;
  transition: 0.2s ease;
  font-size: 0.92rem;
}
.nav-link:hover { background: var(--primary-soft); }
.hero {
  padding: 64px 0 20px;
  background: linear-gradient(135deg, #fdfdfd 0%, #eef9fb 100%);
}
.hero-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 28px;
  align-items: center;
}
.hero h1 {
  margin: 12px 0 14px;
  font-size: clamp(2.2rem, 4vw, 4rem);
  line-height: 1.2;
  color: var(--dark);
}
.lead {
  font-size: 1.1rem;
  line-height: 1.9;
  color: var(--muted);
  max-width: 580px;
}
.pill {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 999px;
  background: var(--primary-soft);
  color: var(--primary);
  font-weight: 700;
  font-size: 0.8rem;
}
.soft-pill { background: var(--soft-green); color: var(--green); }
.button-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 20px; }
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 12px;
  padding: 12px 18px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}
.btn:hover { transform: translateY(-1px); }
.btn-primary {
  background: var(--primary);
  color: white;
}
.btn-secondary {
  background: white;
  border: 1px solid var(--border);
  color: var(--text);
}
.small-btn { margin-top: 14px; }
.card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 22px;
  box-shadow: var(--shadow);
  padding: 22px;
}
.company-card { background: linear-gradient(135deg, #ffffff 0%, #f4f9fb 100%); }
.company-overview {
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 18px;
}
.muted-label { margin: 0 0 8px; color: var(--muted); font-size: 0.82rem; }
.section { padding: 72px 0; }
.section-title {
  margin: 0 0 12px;
  color: var(--dark);
  font-size: clamp(1.9rem, 3vw, 2.7rem);
}
.section-subtitle {
  margin: 0 0 28px;
  color: var(--muted);
  line-height: 1.8;
  max-width: 820px;
}
.info-grid, .four-grid, .team-grid, .contact-grid {
  display: grid;
  gap: 20px;
}
.info-grid { grid-template-columns: repeat(3, minmax(0,1fr)); }
.four-grid { grid-template-columns: repeat(4, minmax(0,1fr)); }
.team-grid { grid-template-columns: repeat(3, minmax(0,1fr)); }
.contact-grid { grid-template-columns: repeat(3, minmax(0,1fr)); }
.glass-card { background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); }
.service-card h3, .team-card h3, .package-card h3 { margin-top: 0; }
.accordion-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.accordion-item {
  background: white;
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
}
.accordion-header {
  width: 100%;
  background: #fff;
  border: none;
  color: var(--dark);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  font-size: 1.02rem;
  font-weight: 700;
  cursor: pointer;
}
.accordion-body {
  border-top: 1px solid var(--border);
  padding: 20px;
}
.package-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 18px;
}
.package-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.package-return {
  margin: 0;
  font-size: 1.05rem;
  color: var(--primary);
  font-weight: 700;
}
.package-meta {
  color: var(--muted);
  font-size: 0.9rem;
}
.avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), #4a8ea0);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  margin-bottom: 12px;
}
@media (max-width: 900px) {
  .hero-grid, .info-grid, .four-grid, .team-grid, .package-grid, .contact-grid, .company-overview {
    grid-template-columns: 1fr;
  }
  .main-nav { justify-content: flex-start; }
  .nav-wrap { align-items: flex-start; padding: 12px 0; flex-direction: column; }
}

