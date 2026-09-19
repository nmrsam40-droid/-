import { NextResponse } from 'next/server';
import { comparePassword, issueToken, sanitizeUser } from '@/lib/auth';
import { findUserByEmail } from '@/lib/db';

export async function POST(req) {
  const body = await req.json();
  const user = findUserByEmail(body.email);

  if (!user || !(await comparePassword(body.password, user.password_hash))) {
    return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 });
  }

  const token = issueToken({ id: user.id, email: user.email, role: user.role });
  const response = NextResponse.json({ success: true, user: sanitizeUser(user) });
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
