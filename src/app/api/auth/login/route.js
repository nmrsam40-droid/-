import { NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(req) {
  const user = await getAuthUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'غير مسجل' }, { status: 401 });
  }
  return NextResponse.json({ user });
}
