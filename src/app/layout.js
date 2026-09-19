import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'شركة الحياة للاستثمارات العامة',
  description: 'نظام إدارة متكامل للشركة',
};

const navItems = [
  { href: '/', label: 'الرئيسية' },
  { href: '/about', label: 'من نحن' },
  { href: '/services', label: 'خدماتنا' },
  { href: '/features', label: 'مميزات الشركة' },
  { href: '/packages', label: 'الباقات' },
  { href: '/guarantees', label: 'الضمانات' },
  { href: '/contact', label: 'موقع الشركة' },
  { href: '/team', label: 'فريق العمل' },
  { href: '/subscribe', label: 'طلب اشتراك' },
  { href: '/status', label: 'حالة الطلب' },
  { href: '/login', label: 'تسجيل دخول' },
  { href: '/admin', label: 'لوحة الإدارة' },
];

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <header className="topbar">
          <div className="container nav-wrap">
            <div className="brand-box">
              <Link href="/" className="brand">شركة الحياة</Link>
            </div>
            <nav className="main-nav" aria-label="رئيسية">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="nav-link">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
