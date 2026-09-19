import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const databasePath = process.env.DB_PATH || path.join(process.cwd(), 'data', 'hayat.db');
fs.mkdirSync(path.dirname(databasePath), { recursive: true });

export const db = new Database(databasePath);
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS company_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1), name TEXT NOT NULL, english_name TEXT NOT NULL,
  country TEXT, city TEXT, commercial_register TEXT, whatsapp TEXT, telegram TEXT,
  email TEXT, working_hours TEXT, tagline TEXT, logo_url TEXT, updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS countries (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, flag TEXT, code TEXT NOT NULL UNIQUE,
  currency TEXT NOT NULL, is_active INTEGER NOT NULL DEFAULT 1, sort_order INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT, country_id INTEGER NOT NULL, package_name TEXT NOT NULL,
  investment_amount REAL NOT NULL, displayed_return REAL NOT NULL, duration TEXT NOT NULL,
  description TEXT, active INTEGER NOT NULL DEFAULT 1, sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY(country_id) REFERENCES countries(id)
);
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT, full_name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
  phone TEXT, telegram_username TEXT, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'client',
  is_active INTEGER NOT NULL DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS subscription_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT, request_number TEXT NOT NULL UNIQUE, user_id INTEGER,
  full_name TEXT NOT NULL, phone TEXT NOT NULL, country_id INTEGER, package_id INTEGER,
  bank_or_wallet TEXT NOT NULL, telegram_username TEXT, currency TEXT NOT NULL, amount REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', rejection_reason TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS wallets (
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL UNIQUE, package_id INTEGER,
  principal REAL NOT NULL DEFAULT 0, recorded_profits REAL NOT NULL DEFAULT 0, start_date TEXT,
  end_date TEXT, duration TEXT, status TEXT NOT NULL DEFAULT 'pending', FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT, request_number TEXT NOT NULL UNIQUE, user_id INTEGER NOT NULL,
  beneficiary_name TEXT NOT NULL, phone TEXT NOT NULL, country TEXT NOT NULL, bank_or_wallet TEXT NOT NULL,
  investment_username TEXT, amount REAL NOT NULL, currency TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
  rejection_reason TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS renewal_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT, request_number TEXT NOT NULL UNIQUE, user_id INTEGER NOT NULL,
  current_package_id INTEGER, new_package_id INTEGER, duration TEXT NOT NULL, amount REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', rejection_reason TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, type TEXT NOT NULL,
  amount REAL NOT NULL, currency TEXT NOT NULL, description TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, title TEXT NOT NULL, message TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT, actor_id INTEGER, action TEXT NOT NULL, entity TEXT NOT NULL,
  entity_id INTEGER, details TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

const countries = [
  ['السعودية', '🇸🇦', 'SA', 'SAR', 1], ['الإمارات', '🇦🇪', 'AE', 'AED', 2],
  ['الكويت', '🇰🇼', 'KW', 'KWD', 3], ['قطر', '🇶🇦', 'QA', 'QAR', 4], ['USDT', '🪙', 'USDT', 'USDT', 5],
];
const packages = {
  SA: [['برونزية',1000,450],['برونزية',1500,560],['برونزية',2000,720],['فضية',3000,1000],['فضية',5000,1800],['فضية',7000,2200],['ذهبية',10000,3700],['ذهبية',15000,4750]],
  AE: [['برونزية',1500,570],['فضية',2000,940],['فضية',3000,1410],['ذهبية',5000,2370],['ذهبية',7000,3400]],
  KW: [['برونزية',120,35],['فضية',245,80],['ذهبية',410,130],['ماسية',575,160],['بلاتينية',822,300],['ملكية',1230,400]],
  QA: [['برونزية',1500,550],['فضية',2000,900],['فضية',3000,1400],['ذهبية',5000,2350],['ذهبية',7000,3400],['ذهبية',10000,4900]],
  USDT: [['Starter',250,80],['Standard',500,160],['Professional',1000,320],['Premium',2500,800],['VIP',5000,1600],['Elite',10000,3200]],
};

function seed() {
  if (!db.prepare('SELECT 1 FROM company_settings WHERE id=1').get()) db.prepare(`INSERT INTO company_settings (id,name,english_name,country,city,commercial_register,whatsapp,telegram,email,working_hours,tagline) VALUES (1,?,?,?,?,?,?,?,?,?,?)`).run('شركة الحياة للاستثمارات العامة','ALHAYAT Company','المملكة العربية السعودية','الرياض','1010335176','+966 59 682 6260','@Abukhalid_com','alhayatsar@gmail.com','1 PM إلى 1 AM','حلول استثمارية وإدارية رقمية متكاملة');
  if (!db.prepare('SELECT 1 FROM countries LIMIT 1').get()) { const s=db.prepare('INSERT INTO countries (name,flag,code,currency,sort_order) VALUES (?,?,?,?,?)'); countries.forEach((c)=>s.run(...c)); }
  if (!db.prepare('SELECT 1 FROM packages LIMIT 1').get()) { const s=db.prepare('INSERT INTO packages (country_id,package_name,investment_amount,displayed_return,duration,description,sort_order) VALUES (?,?,?,?,?,?,?)'); Object.entries(packages).forEach(([code, rows])=>{ const country=db.prepare('SELECT id FROM countries WHERE code=?').get(code); rows.forEach((p,i)=>s.run(country.id,p[0],p[1],p[2],'يومي','عائد معروض/متوقع وفق إعدادات النظام',i)); }); }
  if (!db.prepare("SELECT 1 FROM users WHERE email='admin@hayat.com'").get()) db.prepare('INSERT INTO users (full_name,email,phone,password_hash,role,is_active) VALUES (?,?,?,?,?,1)').run('Super Admin','admin@hayat.com','+966500000001',bcrypt.hashSync('Admin@123456',10),'super_admin');
}
seed();

export const getCompanyProfile=()=>db.prepare('SELECT * FROM company_settings WHERE id=1').get();
export const getCountryCards=()=>db.prepare('SELECT * FROM countries ORDER BY sort_order').all().map(c=>({...c,packages:db.prepare('SELECT p.*,c.currency FROM packages p JOIN countries c ON c.id=p.country_id WHERE p.country_id=? AND p.active=1 ORDER BY p.sort_order,p.id').all(c.id)}));
export const getPackagesForPublic=()=>db.prepare('SELECT p.*,c.name country_name,c.currency,c.flag FROM packages p JOIN countries c ON c.id=p.country_id WHERE p.active=1 AND c.is_active=1 ORDER BY c.sort_order,p.sort_order,p.id').all();
export const findUserByEmail=(email)=>email?db.prepare('SELECT * FROM users WHERE lower(email)=lower(?)').get(email):null;
export const getUserById=(id)=>db.prepare('SELECT * FROM users WHERE id=?').get(id);
export const createUser=(u)=>{const r=db.prepare('INSERT INTO users (full_name,email,phone,password_hash,role,is_active,telegram_username) VALUES (?,?,?,?,?,?,?)').run(u.full_name,u.email.toLowerCase(),u.phone||'',u.password_hash,u.role||'client',u.is_active?1:0,u.telegram_username||'');return getUserById(r.lastInsertRowid);};
export const addAuditLog=(a)=>db.prepare('INSERT INTO audit_logs (actor_id,action,entity,entity_id,details) VALUES (?,?,?,?,?)').run(a.actor_id||null,a.action,a.entity,a.entity_id||null,a.details||'{}');
const number=(prefix)=>`${prefix}-${Date.now()}-${Math.floor(Math.random()*1000)}`;
export function createSubscriptionRequest(x){const r=db.prepare('INSERT INTO subscription_requests (request_number,user_id,full_name,phone,country_id,package_id,bank_or_wallet,telegram_username,currency,amount) VALUES (?,?,?,?,?,?,?,?,?,?)').run(number('SUB'),x.user_id||null,x.full_name,x.phone,x.country_id,x.package_id,x.bank_or_wallet||'',x.telegram_username||'',x.currency,x.amount); const row=db.prepare('SELECT * FROM subscription_requests WHERE id=?').get(r.lastInsertRowid); addAuditLog({actor_id:x.user_id,action:'create',entity:'subscription',entity_id:row.id,details:JSON.stringify(row)}); return row;}
export const getSubscriptionById=(id)=>db.prepare('SELECT * FROM subscription_requests WHERE id=?').get(id);
export const listPendingSubscriptions=()=>db.prepare('SELECT s.*,p.package_name,u.email FROM subscription_requests s LEFT JOIN packages p ON p.id=s.package_id LEFT JOIN users u ON u.id=s.user_id WHERE s.status="pending" ORDER BY s.created_at DESC').all();
function setRequest(id,status,reason,actor){const row=getSubscriptionById(id);if(!row)return null;db.prepare('UPDATE subscription_requests SET status=?,rejection_reason=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run(status,reason||null,id);if(status==='approved'&&row.user_id){db.prepare('UPDATE users SET is_active=1 WHERE id=?').run(row.user_id);db.prepare('INSERT INTO wallets (user_id,package_id,principal,status,start_date) VALUES (?,?,?,?,CURRENT_DATE) ON CONFLICT(user_id) DO UPDATE SET package_id=excluded.package_id,principal=excluded.principal,status="active"').run(row.user_id,row.package_id,row.amount,'active');}addAuditLog({actor_id:actor,action:status,entity:'subscription',entity_id:id,details:reason||''});return getSubscriptionById(id);}
export const approveSubscriptionRequest=(id,a)=>setRequest(id,'approved','',a); export const rejectSubscriptionRequest=(id,a,r)=>setRequest(id,'rejected',r,a);
export function createWithdrawalRequest(x){const r=db.prepare('INSERT INTO withdrawal_requests (request_number,user_id,beneficiary_name,phone,country,bank_or_wallet,investment_username,amount,currency) VALUES (?,?,?,?,?,?,?,?,?)').run(number('WTH'),x.user_id,x.beneficiary_name,x.phone,x.country,x.bank_or_wallet,x.investment_username||'',x.amount,x.currency);return db.prepare('SELECT * FROM withdrawal_requests WHERE id=?').get(r.lastInsertRowid);}
export function createRenewalRequest(x){const r=db.prepare('INSERT INTO renewal_requests (request_number,user_id,current_package_id,new_package_id,duration,amount) VALUES (?,?,?,?,?,?)').run(number('REN'),x.user_id,x.current_package_id||null,x.new_package_id,x.duration,x.amount);return db.prepare('SELECT * FROM renewal_requests WHERE id=?').get(r.lastInsertRowid);}
export const getDbStats=()=>({totalUsers:db.prepare('SELECT COUNT(*) count FROM users').get().count,totalSubscriptions:db.prepare('SELECT COUNT(*) count FROM subscription_requests').get().count,pendingSubscriptions:db.prepare('SELECT COUNT(*) count FROM subscription_requests WHERE status="pending"').get().count});
