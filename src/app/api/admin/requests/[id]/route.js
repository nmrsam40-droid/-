import { NextResponse } from 'next/server';
import { getAuthUserFromRequest, authorizeRole } from '@/lib/auth';
import { approveSubscriptionRequest, rejectSubscriptionRequest } from '@/lib/db';

export async function POST(req, { params }) {
  const user = await getAuthUserFromRequest();
  if (!authorizeRole(user, ['super_admin', 'employee'])) {
    return NextResponse.json({ error: 'غير مصرح لك' }, { status: 403 });
  }

  const body = await req.json();
  const id = Number(params.id);
  const action = body.action;

  if (action === 'approve') {
    const updated = approveSubscriptionRequest(id, user.id);
    return NextResponse.json({ success: true, message: 'تم قبول الطلب', request: updated });
  }

  if (action === 'reject') {
    const updated = rejectSubscriptionRequest(id, user.id, body.reason || 'رفض من الإدارة');
    return NextResponse.json({ success: true, message: 'تم رفض الطلب', request: updated });
  }

  return NextResponse.json({ error: 'إجراء غير صحيح' }, { status: 400 });
}
