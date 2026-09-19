import { NextResponse } from 'next/server';
import { createSubscriptionRequest, createWithdrawalRequest, createRenewalRequest } from '@/lib/db';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST(req) {
  const body = await req.json();

  if (!body.full_name || !body.phone || !body.country_id || !body.package_id || !body.currency || !body.amount || !body.bank_or_wallet) {
    return NextResponse.json({ error: 'يرجى إكمال جميع بيانات الطلب' }, { status: 400 });
  }

  const request = createSubscriptionRequest({
    full_name: body.full_name,
    phone: body.phone,
    country_id: Number(body.country_id),
    package_id: Number(body.package_id),
    currency: body.currency,
    amount: Number(body.amount),
    bank_or_wallet: body.bank_or_wallet,
    telegram_username: body.telegram_username || '',
  });

  const message = `💼 طلب اشتر��ك جديد\nرقم الطلب: ${request.request_number}\nالعميل: ${request.full_name}\nالهاتف: ${request.phone}\nالمبلغ: ${request.amount} ${request.currency}\nالحالة: ${request.status}`;
  await sendTelegramMessage(message, [[{ text: '✅ قبول', callback_data: `approve:subscription:${request.id}` }, { text: '❌ رفض', callback_data: `reject:subscription:${request.id}` }]]);

  return NextResponse.json({ success: true, request }, { status: 201 });
}
