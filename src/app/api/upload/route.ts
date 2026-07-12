import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ error: 'This endpoint has been replaced. Use the new automation API routes.' }, { status: 410 })
}
