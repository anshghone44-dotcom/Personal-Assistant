import { useEffect, useState } from 'react';
import { Check, LogOut, RefreshCw } from 'lucide-react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { getProfile, type Profile } from '@/lib/profile-service';

const APP_NAME = import.meta.env.VITE_APP_NAME || 'Morrow';

function ShellLogo() {
  return (
    <div className="relative flex h-9 w-9 items-center justify-center rounded-[11px] bg-[hsl(var(--accent))]" aria-hidden="true">
      <span className="absolute h-[18px] w-[18px] rounded-full border-[1.5px] border-[hsl(var(--foreground))]" />
      <span className="absolute h-[7px] w-[7px] rounded-full bg-[hsl(var(--primary))]" />
    </div>
  );
}

function AppLoading() {
  return (
    <div data-testid="status-auth-loading" className="min-h-[100dvh] bg-background px-5 py-6">
      <div className="mx-auto max-w-5xl">
        <div className="h-9 w-28 animate-pulse rounded-lg bg-[hsl(var(--muted))]" />
        <div className="mt-24 max-w-xl space-y-4">
          <div className="h-3 w-24 animate-pulse rounded bg-[hsl(var(--muted))]" />
          <div className="h-14 w-80 animate-pulse rounded-xl bg-[hsl(var(--muted))]" />
          <div className="h-5 w-96 max-w-full animate-pulse rounded bg-[hsl(var(--muted))]" />
        </div>
      </div>
    </div>
  );
}

export function AppPage() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileRetry, setProfileRetry] = useState(0);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    setProfileLoading(true);
    setProfileError(null);
    getProfile(user.id)
      .then((nextProfile) => {
        if (active) setProfile(nextProfile);
      })
      .catch((error: unknown) => {
        if (active) setProfileError(error instanceof Error ? error.message : 'We could not load your profile.');
      })
      .finally(() => {
        if (active) setProfileLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user, profileRetry]);

  useEffect(() => {
    if (!authLoading && !user) setLocation('/login');
  }, [authLoading, user, setLocation]);

  if (authLoading || !user) return <AppLoading />;

  const displayName = profile?.name || user.user_metadata?.name || user.email || 'there';
  const initials = displayName.slice(0, 1).toUpperCase();

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      setLocation('/login');
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Could not sign out. Please try again.');
      setSigningOut(false);
    }
  }

  return (
    <main className="texture min-h-[100dvh] bg-background">
      <header className="border-b border-[hsl(var(--border)/.82)] bg-[hsl(var(--background)/.76)]">
        <div className="mx-auto flex h-[76px] max-w-5xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <ShellLogo />
            <span className="text-[15px] font-semibold tracking-[-.02em]">{APP_NAME}</span>
          </div>
          <div className="flex items-center gap-3">
            <div data-testid="text-user-identity" className="hidden text-right sm:block">
              <p className="max-w-[180px] truncate text-sm font-semibold text-[hsl(var(--foreground))]">{displayName}</p>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))]">Personal space</p>
            </div>
            <div data-testid="avatar-user" className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-xs font-bold text-[hsl(var(--primary-foreground))]">{initials}</div>
            <button type="button" data-testid="button-logout" onClick={handleSignOut} disabled={signingOut} className="ml-1 inline-flex h-9 items-center gap-2 rounded-lg px-2.5 text-xs font-semibold text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted)/.7)] hover:text-[hsl(var(--foreground))] disabled:cursor-not-allowed disabled:opacity-60">
              <LogOut size={15} strokeWidth={1.8} />
              <span className="hidden sm:inline">{signingOut ? 'Signing out…' : 'Sign out'}</span>
            </button>
          </div>
        </div>
      </header>

      <section className="page-in mx-auto max-w-5xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
        <div className="max-w-2xl">
          <div className="mb-8 flex items-center gap-3">
            <span className="breathe flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--accent)/.22)] text-[hsl(var(--primary))]">
              <Check size={15} strokeWidth={2.4} />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[.16em] text-[hsl(var(--primary))]">Foundation ready</span>
          </div>
          <h1 data-testid="text-welcome" className="font-serif text-5xl leading-[.98] tracking-[-.055em] text-[hsl(var(--foreground))] sm:text-7xl">
            Welcome to {APP_NAME}
          </h1>
          <p data-testid="text-preparation-message" className="mt-7 max-w-lg text-base leading-7 text-[hsl(var(--muted-foreground))] sm:text-lg">
            Your personal AI assistant is being prepared.
          </p>
        </div>

        <div className="mt-16 grid gap-5 border-t border-[hsl(var(--border))] pt-6 sm:mt-24 sm:grid-cols-[1fr_auto] sm:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">Signed in as</p>
            <p data-testid="text-signed-in-email" className="mt-2 break-all text-sm text-[hsl(var(--foreground)/.82)]">{user.email}</p>
            {profileLoading && <div data-testid="status-profile-loading" className="mt-3 h-3 w-36 animate-pulse rounded bg-[hsl(var(--muted))]" />}
            {profileError && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[hsl(var(--destructive))]">
                <span data-testid="status-profile-error">{profileError}</span>
                <button type="button" data-testid="button-retry-profile" onClick={() => setProfileRetry((current) => current + 1)} className="inline-flex items-center gap-1 font-semibold underline underline-offset-2">
                  <RefreshCw size={12} /> Retry
                </button>
              </div>
            )}
          </div>
          <p className="max-w-[220px] text-xs leading-5 text-[hsl(var(--muted-foreground))] sm:text-right">
            This temporary home is intentionally quiet while the next phase takes shape.
          </p>
        </div>
      </section>
    </main>
  );
}