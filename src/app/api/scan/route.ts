import { NextResponse } from 'next/server';
import { executeScan } from '@/scanEngine';

export async function POST() {
  try {
    const verdict = await executeScan();
    return NextResponse.json(verdict);
  } catch (error) {
    return NextResponse.json(
      { error: 'Scan failed' },
      { status: 500 }
    );
  }
}
