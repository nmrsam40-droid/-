import { NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/db';
import { hashPassword, sanitizeUser } from '@/lib/auth';

export async function POST(req) {
  const body = await req.json();

  if (!body.full_name || !body.email || !body.password || body.password.length < 8) {
    return NextResponse.json({ error: 'الاسم والبريد وكلمة المرور من 8 أحرف مطلوبة' }, { status: 400 });
  }

  if (getUserByEmail(body.email)) {
    return NextResponse.json({ error: 'هذا البريد مستخدم مسبقًا' }, { status: 409 });
  }

  const user = createUser({
    full_name: body.full_name,
    email: body.email,
    phone: body.phone || '',
    telegram_username: body.telegram_username || '',
    password_hash: await hashPassword(body.password),
    role: 'client',
    is_active: 0,
  });

  return NextResponse.json({ success: true, user: sanitizeUser(user) }, { status: 201 });
}
