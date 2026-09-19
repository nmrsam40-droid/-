import { NextResponse } from 'next/server';
import { createRenewalRequest } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST(req) {
  const user = await getAuthUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول أولًا' }, { status: 401 });
  }

  const body = await req.json();
  if (!body.new_package_id || !body.duration || !body.amount) {
    return NextResponse.json({ error: 'بيانات التجديد غير مكتملة' }, { status: 400 });
  }

  const request = createRenewalRequest({
    user_id: user.id,
    current_package_id: body.current_package_id || null,
    new_package_id: Number(body.new_package_id),
    duration: body.duration,
    amount: Number(body.amount),
  });

  const message = `🔄 طلب تجديد جديد\nرقم الطلب: ${request.request_number}\nالمبلغ: ${request.amount}\nالمدة: ${request.duration}\nالحالة: ${request.status}`;
  await sendTelegramMessage(message, [[{ text: '✅ قبول', callback_data: `approve:renewal:${request.id}` }, { text: '❌ رفض', callback_data: `reject:renewal:${request.id}` }]]);

  return NextResponse.json({ success: true, request }, { status: 201 });
}
