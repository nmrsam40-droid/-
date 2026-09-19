import { NextResponse } from 'next/server';
import { getAuthUserFromRequest,authorizeRole } from '@/lib/auth';
import { getDbStats,listPendingSubscriptions } from '@/lib/db';
export async function GET(){const user=await getAuthUserFromRequest();if(!authorizeRole(user,['super_admin','employee']))return NextResponse.json({error:'غير مصرح'},{status:403});return NextResponse.json({stats:getDbStats(),pendingSubscriptions:listPendingSubscriptions()});}
