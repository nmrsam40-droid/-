import { NextResponse } from 'next/server';
import { authorizeRole, getAuthUserFromRequest } from '@/lib/auth';

export async function GET(req) {
  const user = await getAuthUserFromRequest(req);
  if (!authorizeRole(user, ['super_admin', 'employee'])) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  return NextResponse.json({ ok: true, user });
}
