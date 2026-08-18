import { useEffect, useState, type ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { getProfile, type Profile } from '@/lib/profile-service';
import { BottomNavigation, Navigation, TopBar } from '@/components/assistant/Navigation';

function ShellLoading() {
  return <div className="min-h-[100dvh] bg-[hsl(var(--background))] p-6 lg:flex"><div className="hidden w-[224px] lg:block"><div className="skeleton h-9 w-28 rounded-xl" /></div><div className="flex-1"><div className="skeleton h-10 w-full rounded-xl" /><div className="mx-auto mt-24 max-w-xl space-y-4"><div className="skeleton h-3 w-24 rounded" /><div className="skeleton h-16 w-72 rounded-xl" /><div className="skeleton h-4 w-full rounded" /></div></div></div>;
}

export function AppShell({ children, title }: { children: ReactNode; title: string }) {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    setProfileError(null);
    getProfile(user.id).then((value) => { if (active) setProfile(value); }).catch((error: unknown) => { if (active) setProfileError(error instanceof Error ? error.message : 'Profile unavailable.'); });
    return () => { active = false; };
  }, [user, retry]);

  useEffect(() => { if (!authLoading && !user) setLocation('/login'); }, [authLoading, user, setLocation]);

  if (authLoading || !user) return <ShellLoading />;
  const displayName = profile?.name || user.user_metadata?.name || user.email || 'there';
  const initials = displayName.slice(0, 1).toUpperCase();
  async function handleSignOut() {
    setSigningOut(true);
    try { await signOut(); setLocation('/login'); } catch (error) { setProfileError(error instanceof Error ? error.message : 'Could not sign out.'); setSigningOut(false); }
  }
  return <div className="texture flex min-h-[100dvh] bg-background"><Navigation /><div className="min-w-0 flex-1 pb-[72px] lg:pb-0"><TopBar displayName={displayName} initials={initials} onSignOut={handleSignOut} signingOut={signingOut} title={title} />{profileError && <div className="mx-5 mt-4 flex items-center gap-2 rounded-xl border border-[hsl(var(--destructive)/.22)] bg-[hsl(var(--destructive)/.07)] px-3 py-2 text-xs text-[hsl(var(--destructive))] sm:mx-8 lg:mx-10"><span>Profile could not be loaded.</span><button type="button" data-testid="button-retry-profile" onClick={() => setRetry((value) => value + 1)} className="inline-flex items-center gap-1 font-semibold underline underline-offset-2"><RefreshCw size={12} /> Retry</button></div>}{children}</div><BottomNavigation /></div>;
}