import { NextResponse } from 'next/server';
import { getDbStats, listPendingSubscriptions } from '@/lib/db';
import { getAuthUserFromRequest, authorizeRole } from '@/lib/auth';

export async function GET(req) {
  const user = await getAuthUserFromRequest(req);

  if (!authorizeRole(user, ['super_admin', 'employee'])) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  const stats = getDbStats();
  const pendingSubscriptions = listPendingSubscriptions();

  return NextResponse.json({ stats, pendingSubscriptions });
}
