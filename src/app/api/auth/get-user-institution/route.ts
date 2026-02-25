import { NextRequest, NextResponse } from 'next/server';
import { getUserRoleAndInstitutionByEmail } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return NextResponse.json({ institutionId: null, role: null }, { status: 200 });
    }

    const info = await getUserRoleAndInstitutionByEmail(email.trim());

    if (info) {
      return NextResponse.json({ institutionId: info.institutionId, role: info.role }, { status: 200 });
    }

    return NextResponse.json({ institutionId: null, role: null }, { status: 200 });
  } catch (error) {
    console.error('Error determining user institution:', error);
    // Even on server error, avoid 5xx leaking to client logs during login
    return NextResponse.json({ institutionId: null, role: null }, { status: 200 });
  }
}


