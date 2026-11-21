'use client';

import { useEffect, useState } from 'react';
import { Check, Loader2, LogIn, X } from 'lucide-react';
import styles from './kin.module.css';

type KinUser = { id: string; name: string; email: string; imageUrl: string };

let clerkLoading: Promise<Window['Clerk']> | null = null;

async function loadClerk() {
  if (!clerkLoading) {
    clerkLoading = (async () => {
      const configResponse = await fetch('/api/auth/clerk/config');
      const config = (await configResponse.json()) as {
        enabled: boolean;
        publishableKey: string | null;
      };

      if (!config.enabled || !config.publishableKey) {
        throw new Error('Google sign-in is not configured yet.');
      }

      if (!window.Clerk) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src =
            'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Could not load Clerk.'));
          document.head.append(script);
        });
      }

      if (!window.Clerk) throw new Error('Clerk is unavailable.');
      await window.Clerk.load();
      return window.Clerk;
    })();
  }

  return clerkLoading;
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function AccountControl() {
  const [user, setUser] = useState<KinUser | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const restore = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = (await response.json()) as { user: KinUser | null };
        setUser(data.user);

        if (!window.location.search.includes('__clerk_status')) return;
        const clerk = await loadClerk();
        await clerk?.handleRedirectCallback?.();
        const token = await clerk?.session?.getToken();
        if (!token) throw new Error('Google sign-in did not return a session.');

        const exchange = await fetch('/api/auth/clerk/exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const result = (await exchange.json()) as {
          user?: KinUser;
          error?: string;
        };
        if (!exchange.ok || !result.user) {
          throw new Error(result.error ?? 'Could not finish Google sign-in.');
        }
        setUser(result.user);
        window.history.replaceState(
          {},
          '',
          window.location.pathname + window.location.hash,
        );
      } catch (restoreError) {
        setError(
          restoreError instanceof Error
            ? restoreError.message
            : 'Could not restore your account.',
        );
      }
    };

    void restore();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const clerk = await loadClerk();
      await clerk?.client?.signIn?.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: `${window.location.origin}/`,
        redirectUrlComplete: `${window.location.origin}/`,
      });
    } catch (signInError) {
      setError(
        signInError instanceof Error
          ? signInError.message
          : 'Google sign-in could not start.',
      );
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    const clerk = await loadClerk().catch(() => null);
    await clerk?.signOut?.();
    setUser(null);
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <button
        className={styles.account}
        aria-label={user ? `Open account for ${user.name}` : 'Open account'}
        onClick={() => setOpen(true)}
      >
        {user?.imageUrl ? (
          // Clerk-hosted profile images are already optimized and user-specific.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.imageUrl} alt="" />
        ) : (
          <span>{user ? initials(user.name) : 'VP'}</span>
        )}
        <b>{user ? user.name.split(' ')[0] : 'Account'}</b>
      </button>

      {open && (
        <div className={styles.accountBackdrop} role="presentation" onMouseDown={() => setOpen(false)}>
          <section className={styles.accountModal} role="dialog" aria-modal="true" aria-labelledby="account-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className={styles.accountClose} aria-label="Close account" onClick={() => setOpen(false)}><X size={18} /></button>
            {user ? (
              <>
                <div className={styles.accountHero}>
                  {user.imageUrl ? (
                    // Clerk-hosted profile images are already optimized and user-specific.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.imageUrl} alt="" />
                  ) : <span>{initials(user.name)}</span>}
                  <div><p className={styles.accountEyebrow}>YOUR KIN ACCOUNT</p><h2 id="account-title">{user.name}</h2><p>{user.email}</p></div>
                </div>
                <div className={styles.accountConnected}><Check size={17} /><div><strong>Google connected</strong><p>Your identity is ready for shared plans and connected services.</p></div></div>
                <button className={styles.accountSignOut} onClick={() => void signOut()} disabled={loading}><LogIn size={17} /> Sign out</button>
              </>
            ) : (
              <>
                <p className={styles.accountEyebrow}>WELCOME TO KIN</p>
                <h2 id="account-title">Keep your plans together.</h2>
                <p className={styles.accountCopy}>Sign in with Google to keep your shared plans connected across devices.</p>
                <button className={styles.googleButton} onClick={() => void signInWithGoogle()} disabled={loading}>
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <span className={styles.googleMark}>G</span>}
                  {loading ? 'Opening Google…' : 'Continue with Google'}
                </button>
                {error && <p className={styles.accountError} role="alert">{error}</p>}
                <p className={styles.accountFineprint}>You can use Kin in guest mode while account setup is unavailable.</p>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}
