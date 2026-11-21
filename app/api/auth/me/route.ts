import { createClerkClient, verifyToken } from '@clerk/backend';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const secretKey = process.env.CLERK_SECRET_KEY;
  const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;
  const token = (await cookies()).get('kin_clerk_session')?.value;

  if (!secretKey || !publishableKey || !token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const parties = String(process.env.CLERK_AUTHORIZED_PARTIES ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    const verified = await verifyToken(token, {
      secretKey,
      ...(parties.length ? { authorizedParties: parties } : {}),
    });
    const clerk = createClerkClient({ secretKey, publishableKey });
    const user = await clerk.users.getUser(verified.sub);
    const email =
      user.emailAddresses.find(
        (item) => item.id === user.primaryEmailAddressId,
      )?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? '';
    const name =
      [user.firstName, user.lastName].filter(Boolean).join(' ') ||
      user.username ||
      email ||
      'Kin member';

    return NextResponse.json({
      user: { id: user.id, name, email, imageUrl: user.imageUrl },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
