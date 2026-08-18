import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { createProfileForUser } from '@/lib/profile-service';

const APP_NAME = import.meta.env.VITE_APP_NAME || 'Morrow';

function BrandMark() {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center rounded-[13px] bg-[hsl(var(--accent))] shadow-[0_8px_24px_hsl(var(--accent)/.22)]" aria-hidden="true">
      <span className="absolute h-5 w-5 rounded-full border-[1.5px] border-[hsl(var(--foreground))]" />
      <span className="absolute h-2 w-2 rounded-full bg-[hsl(var(--primary))]" />
    </div>
  );
}

function AuthFrame({ children }: { children: ReactNode }) {
  return (
    <main className="texture min-h-[100dvh] px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] max-w-6xl flex-col overflow-hidden rounded-[28px] border border-[hsl(var(--border))] bg-[hsl(var(--card)/.65)] shadow-[0_24px_80px_hsl(var(--foreground)/.08)] lg:min-h-[calc(100dvh-4rem)] lg:flex-row">
        <section className="relative flex min-h-[280px] flex-1 flex-col justify-between overflow-hidden bg-[hsl(var(--primary))] p-7 text-[hsl(var(--primary-foreground))] sm:p-10 lg:min-h-0 lg:max-w-[47%] lg:p-12">
          <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full border border-[hsl(var(--accent)/.25)]" />
          <div className="absolute -right-8 top-0 h-56 w-56 rounded-full border border-[hsl(var(--accent)/.17)]" />
          <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[hsl(var(--accent)/.08)] blur-2xl" />
          <div className="relative flex items-center gap-3">
            <BrandMark />
            <span className="text-[15px] font-semibold tracking-[-.02em]">{APP_NAME}</span>
          </div>
          <div className="relative mt-12 max-w-sm lg:mt-auto lg:pb-6">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[.18em] text-[hsl(var(--accent))]">A quiet place to begin</p>
            <h1 className="font-serif text-4xl leading-[.98] tracking-[-.04em] sm:text-5xl">
              Keep the important things close.
            </h1>
            <p className="mt-6 max-w-xs text-sm leading-6 text-[hsl(var(--primary-foreground)/.72)]">
              {APP_NAME} is being prepared as a private space for the things you want to remember and act on.
            </p>
          </div>
          <p className="relative mt-10 hidden text-xs text-[hsl(var(--primary-foreground)/.46)] lg:block">Phase 01 · Foundation</p>
        </section>

        <section className="flex flex-1 items-center bg-[hsl(var(--card)/.72)] px-6 py-10 sm:px-12 lg:px-16">
          <div className="page-in mx-auto w-full max-w-[390px]">
            <div className="mb-9 lg:hidden">
              <div className="flex items-center gap-3">
                <BrandMark />
                <span className="text-[15px] font-semibold">{APP_NAME}</span>
              </div>
            </div>
            {children}
            <p className="mt-10 text-center text-[11px] leading-5 text-[hsl(var(--muted-foreground))]">
              Private by design. Your space is yours alone.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  autoComplete,
  disabled,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: typeof Mail;
  autoComplete: string;
  disabled: boolean;
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-xs font-semibold tracking-[.02em] text-[hsl(var(--foreground)/.78)]">{label}</span>
      <span className="group relative block">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[hsl(var(--muted-foreground))] transition-colors group-focus-within:text-[hsl(var(--primary))]" strokeWidth={1.7} />
        <input
          id={id}
          data-testid={`input-${id}`}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          required
          className="h-12 w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background)/.62)] pl-11 pr-4 text-sm text-[hsl(var(--foreground))] outline-none transition-[border,box-shadow,background] placeholder:text-[hsl(var(--muted-foreground)/.75)] focus:border-[hsl(var(--primary))] focus:bg-[hsl(var(--card))] focus:ring-4 focus:ring-[hsl(var(--primary)/.10)] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </span>
    </label>
  );
}

function PasswordField({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="block" htmlFor="password">
      <span className="mb-2 block text-xs font-semibold tracking-[.02em] text-[hsl(var(--foreground)/.78)]">Password</span>
      <span className="group relative block">
        <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[hsl(var(--muted-foreground))] transition-colors group-focus-within:text-[hsl(var(--primary))]" strokeWidth={1.7} />
        <input
          id="password"
          data-testid="input-password"
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="At least 6 characters"
          autoComplete="current-password"
          disabled={disabled}
          minLength={6}
          required
          className="h-12 w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background)/.62)] pl-11 pr-12 text-sm text-[hsl(var(--foreground))] outline-none transition-[border,box-shadow,background] placeholder:text-[hsl(var(--muted-foreground)/.75)] focus:border-[hsl(var(--primary))] focus:bg-[hsl(var(--card))] focus:ring-4 focus:ring-[hsl(var(--primary)/.10)] disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="button"
          data-testid="button-toggle-password"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
        >
          {visible ? <EyeOff size={17} strokeWidth={1.7} /> : <Eye size={17} strokeWidth={1.7} />}
        </button>
      </span>
    </label>
  );
}

function AuthError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div data-testid="status-auth-error" role="alert" className="rounded-xl border border-[hsl(var(--destructive)/.22)] bg-[hsl(var(--destructive)/.07)] px-4 py-3 text-sm leading-5 text-[hsl(var(--destructive))]">
      {message}
    </div>
  );
}

export function LoginPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (user) setLocation('/app');
  }, [user, setLocation]);

  if (user) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!isSupabaseConfigured) {
      setError('Authentication is not configured yet. Add the Supabase project keys to continue.');
      return;
    }
    setPending(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setPending(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    setLocation('/app');
  }

  return (
    <AuthFrame>
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[.16em] text-[hsl(var(--primary))]">Welcome back</p>
        <h2 className="font-serif text-4xl tracking-[-.04em] text-[hsl(var(--foreground))]">Sign in to your space.</h2>
        <p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Pick up where you left off.</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-9 space-y-5">
        <Field id="email" label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" icon={Mail} autoComplete="email" disabled={pending} />
        <PasswordField value={password} onChange={setPassword} disabled={pending} />
        <AuthError message={error} />
        <button type="submit" data-testid="button-submit-login" disabled={pending} className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] text-sm font-semibold text-[hsl(var(--primary-foreground))] shadow-[0_8px_20px_hsl(var(--primary)/.15)] transition-[transform,background,box-shadow] hover:-translate-y-0.5 hover:bg-[hsl(var(--primary)/.92)] hover:shadow-[0_12px_24px_hsl(var(--primary)/.2)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70">
          {pending ? 'Signing in…' : 'Sign in'}
          {!pending && <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />}
        </button>
      </form>
      <p className="mt-7 text-center text-sm text-[hsl(var(--muted-foreground))]">
        New here?{' '}
        <Link href="/signup" data-testid="link-signup" className="font-semibold text-[hsl(var(--primary))] underline decoration-[hsl(var(--accent))] decoration-2 underline-offset-4 transition-colors hover:text-[hsl(var(--foreground))]">
          Create an account
        </Link>
      </p>
    </AuthFrame>
  );
}

export function SignupPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (user) setLocation('/app');
  }, [user, setLocation]);

  if (user) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    if (!isSupabaseConfigured) {
      setError('Authentication is not configured yet. Add the Supabase project keys to continue.');
      return;
    }
    setPending(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { name: name.trim() } },
    });
    if (signUpError) {
      setPending(false);
      setError(signUpError.message);
      return;
    }
    if (data.user && data.session) {
      try {
        await createProfileForUser(data.user, name);
      } catch (profileError) {
        setPending(false);
        setError(profileError instanceof Error ? profileError.message : 'Your account was created, but your profile could not be saved.');
        return;
      }
      setPending(false);
      setLocation('/app');
      return;
    }
    setPending(false);
    setNotice('Your account is ready. Check your email to confirm it, then sign in.');
  }

  return (
    <AuthFrame>
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[.16em] text-[hsl(var(--primary))]">Start simply</p>
        <h2 className="font-serif text-4xl tracking-[-.04em] text-[hsl(var(--foreground))]">Make room for what matters.</h2>
        <p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Your private {APP_NAME} space starts here.</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-9 space-y-5">
        <Field id="name" label="Your name" value={name} onChange={setName} placeholder="How should we greet you?" icon={UserRound} autoComplete="name" disabled={pending} />
        <Field id="email" label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" icon={Mail} autoComplete="email" disabled={pending} />
        <PasswordField value={password} onChange={setPassword} disabled={pending} />
        {notice && <div data-testid="status-signup-notice" role="status" className="rounded-xl border border-[hsl(var(--primary)/.18)] bg-[hsl(var(--primary)/.06)] px-4 py-3 text-sm leading-5 text-[hsl(var(--primary))]">{notice}</div>}
        <AuthError message={error} />
        <button type="submit" data-testid="button-submit-signup" disabled={pending} className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] text-sm font-semibold text-[hsl(var(--primary-foreground))] shadow-[0_8px_20px_hsl(var(--primary)/.15)] transition-[transform,background,box-shadow] hover:-translate-y-0.5 hover:bg-[hsl(var(--primary)/.92)] hover:shadow-[0_12px_24px_hsl(var(--primary)/.2)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70">
          {pending ? 'Creating your space…' : 'Create account'}
          {!pending && <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />}
        </button>
      </form>
      <p className="mt-7 text-center text-sm text-[hsl(var(--muted-foreground))]">
        Already have an account?{' '}
        <Link href="/login" data-testid="link-login" className="font-semibold text-[hsl(var(--primary))] underline decoration-[hsl(var(--accent))] decoration-2 underline-offset-4 transition-colors hover:text-[hsl(var(--foreground))]">
          Sign in
        </Link>
      </p>
    </AuthFrame>
  );
}