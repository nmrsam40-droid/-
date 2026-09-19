import { NextResponse } from 'next/server';
import { createSubscriptionRequest, getUserById } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST(req) {
  const authUser = await getAuthUserFromRequest(req);
  const body = await req.json();

  const full_name = body.full_name || '';
  const email = body.email || '';
  const phone = body.phone || '';
  const country_id = Number(body.country_id || 1);
  const package_id = Number(body.package_id || 1);
  const amount = Number(body.amount || 0);

  if (!full_name || !email || !phone) {
    return NextResponse.json({ error: 'بيانات العميل غير مكتملة' }, { status: 400 });
  }

  const user = authUser || getUserById(1) || { id: 1 };
  const request = createSubscriptionRequest({
    user_id: user.id,
    full_name,
    email,
    phone,
    country_id,
    package_id,
    amount,
    status: 'pending',
  });

  const message = `💼 طلب اشتراك جديد\nرقم الطلب: ${request.request_number}\nالعميل: ${full_name}\nالبريد: ${email}\nالهاتف: ${phone}\nالمبلغ: ${amount}\nالحالة: ${request.status}\nالتاريخ: ${request.created_at}`;

  await sendTelegramMessage(message, [
    [{ text: '✅ قبول', callback_data: `approve_subscription:${request.id}` }, { text: '❌ رفض', callback_data: `reject_subscription:${request.id}` }],
  ]);

  return NextResponse.json({ success: true, request });
}
