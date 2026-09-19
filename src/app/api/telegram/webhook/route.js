import { NextResponse } from 'next/server';
import { createRenewalRequest } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST(req) {
  const user = await getAuthUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول أولًا' }, { status: 401 });
  }

  const body = await req.json();
  const package_id = Number(body.package_id || 0);
  const amount = Number(body.amount || 0);

  if (!package_id || !amount) {
    return NextResponse.json({ error: 'بيانات التجديد غير مكتملة' }, { status: 400 });
  }

  const request = createRenewalRequest({ user_id: user.id, package_id, amount, status: 'pending' });
  const message = `🔄 طلب تجديد جديد\nرقم الطلب: ${request.request_number}\nالمبلغ: ${amount}\nالعميل: ${user.full_name}\nالحالة: pending`; 
  await sendTelegramMessage(message, [[{ text: '✅ قبول', callback_data: `approve_renewal:${request.id}` }, { text: '❌ رفض', callback_data: `reject_renewal:${request.id}` }]]);

  return NextResponse.json({ success: true, request });
}
