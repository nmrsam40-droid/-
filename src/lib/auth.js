import { NextResponse } from 'next/server';
import { approveSubscriptionRequest, rejectSubscriptionRequest, getSubscriptionById, getWithdrawalById, getRenewalById } from '@/lib/db';

export async function POST(req) {
  const body = await req.json();

  if (body.callback_query) {
    const data = body.callback_query.data || '';
    const [action, type, idString] = data.split(':');
    const id = Number(idString);

    if (id && action === 'approve') {
      if (type === 'subscription') {
        approveSubscriptionRequest(id, 1);
      }
      if (type === 'withdrawal') {
        // placeholder for pending withdraw logic
      }
      if (type === 'renewal') {
        // placeholder for renewal logic
      }
    }

    if (id && action === 'reject') {
      if (type === 'subscription') {
        rejectSubscriptionRequest(id, 1, 'تم الرفض من Telegram');
      }
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
