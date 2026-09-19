import test from 'node:test';
import assert from 'node:assert/strict';
import { createUser, createSubscriptionRequest, approveSubscriptionRequest, rejectSubscriptionRequest, getUserByEmail } from '../src/lib/db.js';
import { hashPassword } from '../src/lib/auth.js';

test('register and approve flow', async () => {
  const passwordHash = await hashPassword('Password123');
  const user = createUser({
    full_name: 'Tester User',
    email: 'tester@example.com',
    phone: '0500000000',
    password_hash: passwordHash,
    role: 'client',
    is_active: 0,
  });

  const sub = createSubscriptionRequest({
    full_name: user.full_name,
    phone: user.phone,
    country_id: 1,
    package_id: 1,
    currency: 'SAR',
    amount: 1000,
    bank_or_wallet: 'bank account',
    user_id: user.id,
  });

  assert.equal(sub.status, 'pending');
  const approved = approveSubscriptionRequest(sub.id, user.id);
  assert.equal(approved.status, 'approved');
  const record = getUserByEmail('tester@example.com');
  assert.equal(record.is_active, 1);
});

test('reject flow', async () => {
  const passwordHash = await hashPassword('Password456');
  const user = createUser({
    full_name: 'Reject User',
    email: 'rejectuser@example.com',
    phone: '0555555555',
    password_hash: passwordHash,
    role: 'client',
    is_active: 0,
  });

  const sub = createSubscriptionRequest({
    full_name: user.full_name,
    phone: user.phone,
    country_id: 2,
    package_id: 2,
    currency: 'AED',
    amount: 2000,
    bank_or_wallet: 'wallet',
    user_id: user.id,
  });

  const rejected = rejectSubscriptionRequest(sub.id, user.id, 'معلومات غير مكتملة');
  assert.equal(rejected.status, 'rejected');
});
