import { NextResponse } from 'next/server';
import { approveSubscriptionRequest, rejectSubscriptionRequest } from '@/lib/db';

export async function POST(req) {
  const body = await req.json();
  const data = body.callback_query?.data || '';
  const [action, type, idRaw] = data.split(':');
  const id = Number(idRaw);

  if (!id || !action || !type) {
    return NextResponse.json({ ok: true });
  }

  if (type === 'subscription') {
    if (action === 'approve') approveSubscriptionRequest(id, 1);
    if (action === 'reject') rejectSubscriptionRequest(id, 1, 'تم الرفض من Telegram');
  }

  return NextResponse.json({ ok: true });
}
