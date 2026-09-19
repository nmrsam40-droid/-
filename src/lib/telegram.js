import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { hashPassword } from './auth';

const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'data', 'hayat.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);

function createTables() {
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS company (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      tagline TEXT,
      phone TEXT,
      email TEXT,
      address TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS countries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      code TEXT,
      currency TEXT,
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      country_id INTEGER,
      name TEXT,
      description TEXT,
      price REAL,
      currency TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(country_id) REFERENCES countries(id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT,
      email TEXT UNIQUE,
      phone TEXT,
      password_hash TEXT,
      role TEXT DEFAULT 'customer',
      is_active INTEGER DEFAULT 0,
      country_id INTEGER,
      wallet_balance REAL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      last_login TEXT
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      full_name TEXT,
      email TEXT,
      phone TEXT,
      country_id INTEGER,
      package_id INTEGER,
      amount REAL,
      request_number TEXT,
      status TEXT DEFAULT 'pending',
      rejection_reason TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS withdrawals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      amount REAL,
      request_number TEXT,
      status TEXT DEFAULT 'pending',
      rejection_reason TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS renewals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      package_id INTEGER,
      amount REAL,
      request_number TEXT,
      status TEXT DEFAULT 'pending',
      rejection_reason TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT,
      message TEXT,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
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
}

export function ensureSeedData() {
  const companyCount = db.prepare('SELECT COUNT(*) as count FROM company').get().count;
  if (!companyCount) {
    db.prepare('INSERT INTO company (name, tagline, phone, email, address) VALUES (?, ?, ?, ?, ?)').run(
      'شركة الحياة للاستثمارات العامة',
      'منصة رقمية متكاملة لإدارة خدمات الشركة',
      '+966500000000',
      'contact@hayat-company.com',
      'السعودية'
    );
  }

  const countries = db.prepare('SELECT COUNT(*) as count FROM countries').get().count;
  if (!countries) {
    const inserts = [
      { name: 'السعودية', code: 'SA', currency: 'SAR', sort_order: 1 },
      { name: 'الإمارات', code: 'AE', currency: 'AED', sort_order: 2 },
      { name: 'الكويت', code: 'KW', currency: 'KWD', sort_order: 3 },
      { name: 'قطر', code: 'QA', currency: 'QAR', sort_order: 4 },
      { name: 'USDT', code: 'USDT', currency: 'USDT', sort_order: 5 },
    ];

    const stmt = db.prepare('INSERT INTO countries (name, code, currency, sort_order, is_active) VALUES (?, ?, ?, ?, 1)');
    for (const item of inserts) stmt.run(item.name, item.code, item.currency, item.sort_order);
  }

  const packagesCount = db.prepare('SELECT COUNT(*) as count FROM packages').get().count;
  if (!packagesCount) {
    const packageRows = [
      ['باقة البداية', 'خطة مناسبة للمشروعات الصغيرة', 1000, 'SAR', 1],
      ['باقة النمو', 'خطة توسع مع إدارة متقدمة', 2500, 'SAR', 1],
      ['باقة المتقدم', 'حلول متكاملة ومزايا إضافية', 5000, 'SAR', 1],
      ['باقة الإمارات', 'خطة مناسبة لعملاء الإمارات', 1100, 'AED', 2],
      ['باقة الكويت', 'خطة مناسبة لعملاء الكويت', 700, 'KWD', 3],
      ['باقة قطر', 'خطة مناسبة لعملاء قطر', 900, 'QAR', 4],
      ['باقة USDT', 'خطة رقمية بالدولار الرقمي', 100, 'USDT', 5],
    ];

    const stmt = db.prepare('INSERT INTO packages (name, description, price, currency, country_id) VALUES (?, ?, ?, ?, ?)');
    for (const row of packageRows) {
      const country = db.prepare('SELECT id FROM countries WHERE currency = ?').get(row[3]);
      stmt.run(row[0], row[1], row[2], row[3], country ? country.id : 1);
    }
  }

  const adminExists = db.prepare('SELECT COUNT(*) as count FROM users WHERE email = ?').get('admin@hayat.com').count;
  if (!adminExists) {
    const adminHash = await hashPassword('Admin@123456');
    db.prepare('INSERT INTO users (full_name, email, phone, password_hash, role, is_active, wallet_balance) VALUES (?, ?, ?, ?, ?, 1, 0)').run(
      'Super Admin',
      'admin@hayat.com',
      '+966500000001',
      adminHash,
      'super_admin'
    );
  }
}

createTables();
await ensureSeedData();

export function getCompanyProfile() {
  return db.prepare('SELECT * FROM company ORDER BY id DESC LIMIT 1').get();
}

export function getCountryCards() {
  const countries = db.prepare('SELECT * FROM countries ORDER BY sort_order').all();
  return countries.map((country) => ({
    ...country,
    packages: db.prepare('SELECT * FROM packages WHERE country_id = ? AND is_active = 1').all(country.id),
  }));
}

export function getPackagesForPublic() {
  return db.prepare(`
    SELECT p.*, c.name as country_name, c.currency
    FROM packages p
    LEFT JOIN countries c ON c.id = p.country_id
    WHERE p.is_active = 1
    ORDER BY p.id ASC
  `).all();
}

export function findUserByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
}

export function getUserById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

export function createUser({ full_name, email, phone, password_hash, role = 'customer', is_active = 0, country_id = null }) {
  const result = db.prepare(`
    INSERT INTO users (full_name, email, phone, password_hash, role, is_active, country_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(full_name, email.toLowerCase(), phone || '', password_hash, role, is_active ? 1 : 0, country_id);

  return getUserById(result.lastInsertRowid);
}

export function createSubscriptionRequest({ user_id, full_name, email, phone, country_id, package_id, amount, status = 'pending' }) {
  const request_number = `SUB-${Date.now()}`;
  const result = db.prepare(`
    INSERT INTO subscriptions (user_id, full_name, email, phone, country_id, package_id, amount, request_number, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(user_id, full_name, email, phone, country_id, package_id, amount, request_number, status);

  const record = db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(result.lastInsertRowid);
  addAuditLog({ actor_id: user_id, action: 'create_subscription', entity: 'subscriptions', entity_id: record.id, details: JSON.stringify({ request_number, amount, status }) });
  return record;
}

export function listPendingSubscriptions() {
  return db.prepare(`
    SELECT s.*, u.full_name, p.name as package_name
    FROM subscriptions s
    LEFT JOIN users u ON u.id = s.user_id
    LEFT JOIN packages p ON p.id = s.package_id
    WHERE s.status = 'pending'
    ORDER BY s.created_at DESC
  `).all();
}

export function getSubscriptionById(id) {
  return db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(id);
}

export function approveSubscriptionRequest(id, actorId) {
  const record = db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(id);
  if (!record) return null;

  db.prepare('UPDATE subscriptions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run('approved', id);
  db.prepare('UPDATE users SET is_active = 1 WHERE id = ?').run(record.user_id);
  addAuditLog({ actor_id: actorId, action: 'approve_subscription', entity: 'subscriptions', entity_id: record.id, details: JSON.stringify({ request_number: record.request_number }) });
  return getSubscriptionById(id);
}

export function rejectSubscriptionRequest(id, actorId, reason = 'رفض من الإدارة') {
  const record = db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(id);
  if (!record) return null;

  db.prepare('UPDATE subscriptions SET status = ?, rejection_reason = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run('rejected', reason, id);
  addAuditLog({ actor_id: actorId, action: 'reject_subscription', entity: 'subscriptions', entity_id: record.id, details: JSON.stringify({ request_number: record.request_number, reason }) });
  return getSubscriptionById(id);
}

export function createWithdrawalRequest({ user_id, amount, status = 'pending' }) {
  const request_number = `WTH-${Date.now()}`;
  const result = db.prepare('INSERT INTO withdrawals (user_id, amount, request_number, status) VALUES (?, ?, ?, ?)')
    .run(user_id, amount, request_number, status);
  const record = db.prepare('SELECT * FROM withdrawals WHERE id = ?').get(result.lastInsertRowid);
  addAuditLog({ actor_id: user_id, action: 'create_withdrawal', entity: 'withdrawals', entity_id: record.id, details: JSON.stringify({ request_number, amount }) });
  return record;
}

export function getWithdrawalById(id) {
  return db.prepare('SELECT * FROM withdrawals WHERE id = ?').get(id);
}

export function createRenewalRequest({ user_id, package_id, amount, status = 'pending' }) {
  const request_number = `REN-${Date.now()}`;
  const result = db.prepare('INSERT INTO renewals (user_id, package_id, amount, request_number, status) VALUES (?, ?, ?, ?, ?)')
    .run(user_id, package_id, amount, request_number, status);
  const record = db.prepare('SELECT * FROM renewals WHERE id = ?').get(result.lastInsertRowid);
  addAuditLog({ actor_id: user_id, action: 'create_renewal', entity: 'renewals', entity_id: record.id, details: JSON.stringify({ request_number, amount }) });
  return record;
}

export function getRenewalById(id) {
  return db.prepare('SELECT * FROM renewals WHERE id = ?').get(id);
}

export function addAuditLog({ actor_id, action, entity, entity_id, details }) {
  db.prepare('INSERT INTO audit_logs (actor_id, action, entity, entity_id, details) VALUES (?, ?, ?, ?, ?)')
    .run(actor_id, action, entity, entity_id, details || '{}');
}

export function getDbStats() {
  return {
    totalUsers: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
    totalSubscriptions: db.prepare('SELECT COUNT(*) as count FROM subscriptions').get().count,
    pendingSubscriptions: db.prepare('SELECT COUNT(*) as count FROM subscriptions WHERE status = "pending"').get().count,
  };
}

export function getNotificationsForUser(userId) {
  return db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC').all(userId);
}
