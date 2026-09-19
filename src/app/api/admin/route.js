import { NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req) {
  const body = await req.json();

  if (!body.email || !body.password || !body.full_name) {
    return NextResponse.json({ error: 'البيانات المطلوبة مفقودة' }, { status: 400 });
  }

  if (findUserByEmail(body.email)) {
    return NextResponse.json({ error: 'هذا البريد موجود مسبقًا' }, { status: 409 });
  }

  const passwordHash = await hashPassword(body.password);
  const user = createUser({
    full_name: body.full_name,
    email: body.email,
    phone: body.phone || '',
    password_hash: passwordHash,
    role: 'customer',
    is_active: 0,
  });

  return NextResponse.json({ success: true, user });
}
