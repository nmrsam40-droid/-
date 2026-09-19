import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'data', 'hayat.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS company_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT NOT NULL,
      english_name TEXT,
      country TEXT,
      city TEXT,
      commercial_register TEXT,
      whatsapp TEXT,
      telegram TEXT,
      email TEXT,
      working_hours TEXT,
      tagline TEXT,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS countries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      flag TEXT,
      code TEXT UNIQUE NOT NULL,
      currency TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      country_id INTEGER NOT NULL,
      package_name TEXT NOT NULL,
      investment_amount REAL NOT NULL,
      displayed_return REAL NOT NULL,
      duration TEXT NOT NULL,
      description TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(country_id) REFERENCES countries(id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      telegram_username TEXT,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'client',
      is_active INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS subscription_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_number TEXT NOT NULL UNIQUE,
      user_id INTEGER,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      country_id INTEGER,
      package_id INTEGER,
      bank_or_wallet TEXT,
      telegram_username TEXT,
      currency TEXT,
      amount REAL,
      status TEXT NOT NULL DEFAULT 'pending',
      rejection_reason TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS wallet_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      package_id INTEGER,
      principal REAL NOT NULL DEFAULT 0,
      recorded_profits REAL NOT NULL DEFAULT 0,
      start_date TEXT,
      end_date TEXT,
      duration TEXT,
      status TEXT NOT NULL DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS withdrawal_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_number TEXT NOT NULL UNIQUE,
      user_id INTEGER NOT NULL,
      beneficiary_name TEXT NOT NULL,
      phone TEXT,
      country TEXT,
      bank_or_wallet TEXT,
      investment_username TEXT,
      amount REAL,
      currency TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      rejection_reason TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS renewal_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_number TEXT NOT NULL UNIQUE,
      user_id INTEGER NOT NULL,
      current_package_id INTEGER,
      new_package_id INTEGER,
      duration TEXT,
      amount REAL,
      status TEXT NOT NULL DEFAULT 'pending',
      rejection_reason TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT,
      message TEXT,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor_id INTEGER,
      action TEXT,
      entity TEXT,
      entity_id INTEGER,
      details TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const companyCount = db.prepare('SELECT COUNT(*) AS count FROM company_settings').get().count;
  if (companyCount === 0) {
    db.prepare(`
      INSERT INTO company_settings (
        id, name, english_name, country, city, commercial_register, whatsapp, telegram, email, working_hours, tagline
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      1,
      'شركة الحياة للاستثمارات العامة',
      'ALHAYAT Company',
      'المملكة العربية السعودية',
      'الرياض',
      '1010335176',
      '+966 59 682 6260',
      '@Abukhalid_com',
      'alhayatsar@gmail.com',
      '1 PM إلى 1 AM',
      'حلول استثمارية وإدارية رقمية متكاملة.'
    );
  }

  const countryCount = db.prepare('SELECT COUNT(*) AS count FROM countries').get().count;
  if (countryCount === 0) {
    const countries = [
      ['السعودية', '🇸🇦', 'SA', 'SAR', 1],
      ['الإمارات', '🇦🇪', 'AE', 'AED', 2],
      ['الكويت', '🇰🇼', 'KW', 'KWD', 3],
      ['قطر', '🇶🇦', 'QA', 'QAR', 4],
      ['USDT', '🪙', 'USDT', 'USDT', 5],
    ];

    const stmt = db.prepare('INSERT INTO countries (name, flag, code, currency, sort_order) VALUES (?, ?, ?, ?, ?)');
    for (const row of countries) stmt.run(row[0], row[1], row[2], row[3], row[4]);
  }

  const packageCount = db.prepare('SELECT COUNT(*) AS count FROM packages').get().count;
  if (packageCount === 0) {
    const packageData = [
      [1, 'برونزية', 1000, 450, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 1],
      [1, 'برونزية', 1500, 560, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 2],
      [1, 'برونزية', 2000, 720, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 3],
      [1, 'فضية', 3000, 1000, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 4],
      [1, 'فضية', 5000, 1800, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 5],
      [1, 'فضية', 7000, 2200, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 6],
      [1, 'ذهبية', 10000, 3700, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 7],
      [1, 'ذهبية', 15000, 4750, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 8],
      [2, 'برونزية', 1500, 570, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 1],
      [2, 'فضية', 2000, 940, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 2],
      [2, 'فضية', 3000, 1410, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 3],
      [2, 'ذهبية', 5000, 2370, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 4],
      [2, 'ذهبية', 7000, 3400, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 5],
      [3, 'برونزية', 120, 35, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 1],
      [3, 'فضية', 245, 80, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 2],
      [3, 'ذهبية', 410, 130, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 3],
      [3, 'ماسية', 575, 160, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 4],
      [3, 'بلاتينية', 822, 300, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 5],
      [3, 'ملكية', 1230, 400, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 6],
      [4, 'برونزية', 1500, 550, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 1],
      [4, 'فضية', 2000, 900, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 2],
      [4, 'فضية', 3000, 1400, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 3],
      [4, 'ذهبية', 5000, 2350, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 4],
      [4, 'ذهبية', 7000, 3400, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 5],
      [4, 'ذهبية', 10000, 4900, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 6],
      [5, 'Starter', 250, 80, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 1],
      [5, 'Standard', 500, 160, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 2],
      [5, 'Professional', 1000, 320, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 3],
      [5, 'Premium', 2500, 800, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 4],
      [5, 'VIP', 5000, 1600, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 5],
      [5, 'Elite', 10000, 3200, 'يومي', 'عرض/متوقع وفق البيانات المعروضة.', 6],
    ];

    const stmt = db.prepare('INSERT INTO packages (country_id, package_name, investment_amount, displayed_return, duration, description, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)');
    for (const row of packageData) stmt.run(...row);
  }

  const adminCount = db.prepare("SELECT COUNT(*) AS count FROM users WHERE email = 'admin@hayat.com'").get().count;
  if (adminCount === 0) {
    db.prepare('INSERT INTO users (full_name, email, phone, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?, 1)').run(
      'Super Admin',
      'admin@hayat.com',
      '+966500000000',
      bcrypt.hashSync('Admin@123456', 12),
      'super_admin'
    );
  }
}

initializeDatabase();

export function getCompanyProfile() {
  return db.prepare('SELECT * FROM company_settings WHERE id = 1').get();
}

export function getCountryCards() {
  const countries = db.prepare('SELECT * FROM countries ORDER BY sort_order').all();
  return countries.map((country) => ({
    ...country,
    packages: db.prepare('SELECT * FROM packages WHERE country_id = ? AND active = 1 ORDER BY sort_order').all(country.id),
  }));
}

export function getPackagesForPublic() {
  return db.prepare(`
    SELECT p.*, c.name AS country_name, c.currency, c.flag
    FROM packages p
    JOIN countries c ON c.id = p.country_id
    WHERE p.active = 1 AND c.is_active = 1
    ORDER BY c.sort_order, p.sort_order, p.id
  `).all();
}

export function getUserByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email);
}

export function getUserById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

export function createUser(data) {
  const result = db.prepare(`
    INSERT INTO users (full_name, email, phone, telegram_username, password_hash, role, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    data.full_name,
    data.email.toLowerCase(),
    data.phone || '',
    data.telegram_username || '',
    data.password_hash,
    data.role || 'client',
    data.is_active ? 1 : 0
  );

  return getUserById(result.lastInsertRowid);
}

export function createSubscriptionRequest(payload) {
  const requestNumber = `SUB-${Date.now()}`;
  const result = db.prepare(`
    INSERT INTO subscription_requests (
      request_number, user_id, full_name, phone, country_id, package_id, bank_or_wallet, telegram_username, currency, amount, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `).run(
    requestNumber,
    payload.user_id || null,
    payload.full_name,
    payload.phone,
    payload.country_id || 1,
    payload.package_id || 1,
    payload.bank_or_wallet || '',
    payload.telegram_username || '',
    payload.currency || 'SAR',
    Number(payload.amount || 0)
  );

  const record = db.prepare('SELECT * FROM subscription_requests WHERE id = ?').get(result.lastInsertRowid);
  addAuditLog({ actor_id: payload.user_id || null, action: 'create_subscription', entity: 'subscription_requests', entity_id: record.id, details: JSON.stringify(record) });
  return record;
}

export function getSubscriptionById(id) {
  return db.prepare('SELECT * FROM subscription_requests WHERE id = ?').get(id);
}

export function listPendingSubscriptions() {
  return db.prepare(`
    SELECT s.*, p.package_name, u.email
    FROM subscription_requests s
    LEFT JOIN packages p ON p.id = s.package_id
    LEFT JOIN users u ON u.id = s.user_id
    WHERE s.status = 'pending'
    ORDER BY s.created_at DESC
  `).all();
}

export function approveSubscriptionRequest(id, actorId) {
  const row = getSubscriptionById(id);
  if (!row) return null;

  db.prepare('UPDATE subscription_requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run('approved', id);
  db.prepare('UPDATE users SET is_active = 1 WHERE id = ?').run(row.user_id || 0);
  db.prepare(`
    INSERT INTO wallet_accounts (user_id, package_id, principal, recorded_profits, start_date, end_date, duration, status)
    VALUES (?, ?, ?, 0, CURRENT_DATE, DATE(CURRENT_DATE, '+30 days'), '30 days', 'active')
    ON CONFLICT(user_id) DO UPDATE SET package_id = excluded.package_id, principal = excluded.principal, status = 'active'
  `).run(row.user_id || 0, row.package_id || null, Number(row.amount || 0));

  addAuditLog({ actor_id: actorId, action: 'approve_subscription', entity: 'subscription_requests', entity_id: id, details: JSON.stringify({ request_number: row.request_number }) });
  return getSubscriptionById(id);
}

export function rejectSubscriptionRequest(id, actorId, reason = 'رفض من الإدارة') {
  const row = getSubscriptionById(id);
  if (!row) return null;

  db.prepare('UPDATE subscription_requests SET status = ?, rejection_reason = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run('rejected', reason, id);
  addAuditLog({ actor_id: actorId, action: 'reject_subscription', entity: 'subscription_requests', entity_id: id, details: JSON.stringify({ reason }) });
  return getSubscriptionById(id);
}

export function createWithdrawalRequest(payload) {
  const requestNumber = `WTH-${Date.now()}`;
  const result = db.prepare(`
    INSERT INTO withdrawal_requests (
      request_number, user_id, beneficiary_name, phone, country, bank_or_wallet, investment_username, amount, currency
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    requestNumber,
    payload.user_id,
    payload.beneficiary_name,
    payload.phone,
    payload.country,
    payload.bank_or_wallet,
    payload.investment_username || '',
    Number(payload.amount || 0),
    payload.currency || 'SAR'
  );

  const record = db.prepare('SELECT * FROM withdrawal_requests WHERE id = ?').get(result.lastInsertRowid);
  addAuditLog({ actor_id: payload.user_id, action: 'create_withdrawal', entity: 'withdrawal_requests', entity_id: record.id, details: JSON.stringify(record) });
  return record;
}

export function createRenewalRequest(payload) {
  const requestNumber = `REN-${Date.now()}`;
  const result = db.prepare(`
    INSERT INTO renewal_requests (request_number, user_id, current_package_id, new_package_id, duration, amount)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(requestNumber, payload.user_id, payload.current_package_id, payload.new_package_id, payload.duration, Number(payload.amount || 0));

  const record = db.prepare('SELECT * FROM renewal_requests WHERE id = ?').get(result.lastInsertRowid);
  addAuditLog({ actor_id: payload.user_id, action: 'create_renewal', entity: 'renewal_requests', entity_id: record.id, details: JSON.stringify(record) });
  return record;
}

export function addAuditLog({ actor_id, action, entity, entity_id, details }) {
  db.prepare('INSERT INTO audit_logs (actor_id, action, entity, entity_id, details) VALUES (?, ?, ?, ?, ?)').run(
    actor_id || null,
    action,
    entity,
    entity_id || null,
    details || '{}'
  );
}

export function getDbStats() {
  return {
    totalUsers: db.prepare('SELECT COUNT(*) AS count FROM users').get().count,
    totalSubscriptions: db.prepare('SELECT COUNT(*) AS count FROM subscription_requests').get().count,
    pendingSubscriptions: db.prepare('SELECT COUNT(*) AS count FROM subscription_requests WHERE status = "pending"').get().count,
  };
}
