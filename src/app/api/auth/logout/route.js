import test from 'node:test';
import assert from 'node:assert/strict';
import { createSubscriptionRequest, createUser, getDbStats, approveSubscriptionRequest, rejectSubscriptionRequest, findUserByEmail } from '../src/lib/db.js';
import { hashPassword } from '../src/lib/auth.js';

test('creates and approves a subscription', async () => {
  const passwordHash = await hashPassword('Password@123');
  const user = createUser({
    full_name: 'Test User',
    email: 'testuser@example.com',
    phone: '0500000000',
    password_hash: passwordHash,
    role: 'customer',
    is_active: 0,
  });

  const sub = createSubscriptionRequest({
    user_id: user.id,
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    country_id: 1,
    package_id: 1,
    amount: 1500,
    status: 'pending',
  });

  assert.equal(sub.status, 'pending');
  assert.ok(sub.request_number.startsWith('SUB-'));

  const approved = approveSubscriptionRequest(sub.id, user.id);
  assert.equal(approved.status, 'approved');

  const updatedUser = findUserByEmail('testuser@example.com');
  assert.equal(updatedUser.is_active, 1);

  const stats = getDbStats();
  assert.ok(stats.totalSubscriptions >= 1);
});

test('rejects a subscription with reason', async () => {
  const passwordHash = await hashPassword('Reject@123');
  const user = createUser({
    full_name: 'Reject User',
    email: 'rejectuser@example.com',
    phone: '0555555555',
    password_hash: passwordHash,
    role: 'customer',
    is_active: 0,
  });

  const sub = createSubscriptionRequest({
    user_id: user.id,
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    country_id: 2,
    package_id: 2,
    amount: 2500,
    status: 'pending',
  });

  const rejected = rejectSubscriptionRequest(sub.id, user.id, 'معلومات غير مكتملة');
  assert.equal(rejected.status, 'rejected');
  assert.match(rejected.rejection_reason, /غير مكتملة|إدارة/);
});
