import { NextResponse } from 'next/server';
import { createWithdrawalRequest } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST(req) {
  const user = await getAuthUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول أولًا' }, { status: 401 });
  }

  const body = await req.json();
  const amount = Number(body.amount || 0);
  if (!amount) {
    return NextResponse.json({ error: 'المبلغ غير صحيح' }, { status: 400 });
  }

  const request = createWithdrawalRequest({ user_id: user.id, amount, status: 'pending' });
  const message = `💸 طلب سحب جديد\nرقم الطلب: ${request.request_number}\nالمبلغ: ${amount}\nالعميل: ${user.full_name}\nالحالة: pending`; 
  await sendTelegramMessage(message, [[{ text: '✅ قبول', callback_data: `approve_withdrawal:${request.id}` }, { text: '❌ رفض', callback_data: `reject_withdrawal:${request.id}` }]]);

  return NextResponse.json({ success: true, request });
}
