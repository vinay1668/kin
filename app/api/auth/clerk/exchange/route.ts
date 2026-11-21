import { createClerkClient, verifyToken } from '@clerk/backend';
import { NextResponse } from 'next/server';

const sessionCookie = 'kin_clerk_session';
const sessionMaxAge = 60 * 60 * 24 * 30;

function authorizedParties() {
  return String(process.env.CLERK_AUTHORIZED_PARTIES ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function profile(user: {
  id: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  imageUrl: string;
  primaryEmailAddressId: string | null;
  emailAddresses: Array<{ id: string; emailAddress: string }>;
}) {
  const email =
    user.emailAddresses.find((item) => item.id === user.primaryEmailAddressId)
      ?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? '';
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(' ') ||
    user.username ||
    email ||
    'Kin member';

  return { id: user.id, name, email, imageUrl: user.imageUrl };
}

export async function POST(request: Request) {
  const secretKey = process.env.CLERK_SECRET_KEY;
  const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;

  if (!secretKey || !publishableKey) {
    return NextResponse.json(
      { error: 'Clerk authentication is not configured' },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as { token?: string };
    if (!body.token) {
      return NextResponse.json(
        { error: 'Clerk session token is required' },
        { status: 401 },
      );
    }

    const verified = await verifyToken(body.token, {
      secretKey,
      ...(authorizedParties().length
        ? { authorizedParties: authorizedParties() }
        : {}),
    });
    const clerk = createClerkClient({ secretKey, publishableKey });
    const user = await clerk.users.getUser(verified.sub);
    const response = NextResponse.json({ user: profile(user) });

    response.cookies.set({
      name: sessionCookie,
      value: body.token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: sessionMaxAge,
    });

    return response;
  } catch (error) {
    console.error('Clerk session exchange failed:', error);
    return NextResponse.json(
      { error: 'Clerk session could not be verified' },
      { status: 401 },
    );
  }
}
