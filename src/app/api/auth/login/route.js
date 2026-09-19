import { NextResponse } from 'next/server';
import { createUser, getUserByEmail, getUserById } from '@/lib/db';
import { comparePassword, hashPassword, issueToken, sanitizeUser } from '@/lib/auth';

export async function POST(req) {
  const body = await req.json();
  const email = body.email?.toLowerCase();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبة' }, { status: 400 });
  }

  const user = getUserByEmail(email);
  if (!user || !(await comparePassword(password, user.password_hash))) {
    return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 });
  }

  if (user.role === 'client' && user.is_active !== 1) {
    return NextResponse.json({ error: 'الحساب معطل حتى اعتماد طلب الاشتراك' }, { status: 403 });
  }

  const token = issueToken({ id: user.id, email: user.email, role: user.role, full_name: user.full_name });
  const response = NextResponse.json({ success: true, user: sanitizeUser(user) });
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
