import { NextResponse } from 'next/server';

export async function GET() {
  const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;
  const enabled = Boolean(process.env.CLERK_SECRET_KEY && publishableKey);

  return NextResponse.json({
    enabled,
    publishableKey: enabled ? publishableKey : null,
    providers: ['google'],
  });
}
