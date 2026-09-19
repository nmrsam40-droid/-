import { NextResponse } from 'next/server';
import { createWithdrawalRequest } from '@/lib/db';
import { sendTelegramMessage } from '@/lib/telegram';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function POST(req) {
  const user = await getAuthUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 });
  }

  const body = await req.json();
  if (!body.beneficiary_name || !body.phone || !body.country || !body.amount || !body.currency || !body.bank_or_wallet) {
    return NextResponse.json({ error: 'بيانات طلب السحب غير مكتملة' }, { status: 400 });
  }

  const request = createWithdrawalRequest({
    user_id: user.id,
    beneficiary_name: body.beneficiary_name,
    phone: body.phone,
    country: body.country,
    bank_or_wallet: body.bank_or_wallet,
    investment_username: body.investment_username || '',
    amount: Number(body.amount),
    currency: body.currency,
  });

  const message = `💸 طلب سحب جديد\nرقم الطلب: ${request.request_number}\nالمستفيد: ${request.beneficiary_name}\nالمبلغ: ${request.amount} ${request.currency}\nالحالة: ${request.status}`;
  await sendTelegramMessage(message, [[{ text: '✅ قبول', callback_data: `approve:withdrawal:${request.id}` }, { text: '❌ رفض', callback_data: `reject:withdrawal:${request.id}` }]]);

  return NextResponse.json({ success: true, request }, { status: 201 });
}
