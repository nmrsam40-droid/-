import { NextResponse } from 'next/server';
import { getAuthUserFromRequest, authorizeRole } from '@/lib/auth';
import { getCompanyProfile, getPackagesForPublic } from '@/lib/db';

export async function GET() {
  const company = getCompanyProfile();
  const packages = getPackagesForPublic();
  return NextResponse.json({ company, packages });
}

export async function POST(req) {
  const user = await getAuthUserFromRequest();
  if (!authorizeRole(user, ['super_admin', 'employee'])) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  const body = await req.json();
  return NextResponse.json({ ok: true, payload: body });
}
