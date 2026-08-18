import { CalendarDays, CircleUserRound, Clock3, House, LogOut, MessageCircle, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import type { ReactNode } from 'react';

const items = [
  { href: '/app', label: 'Talk', icon: MessageCircle },
  { href: '/app/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/app/reminders', label: 'Reminders', icon: Clock3 },
  { href: '/app/memory', label: 'Memory', icon: Sparkles },
];

function Mark() {
  return <span className="relative flex h-9 w-9 items-center justify-center rounded-[12px] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"><span className="absolute h-4 w-4 rounded-full border border-current" /><span className="h-1.5 w-1.5 rounded-full bg-current" /></span>;
}

export function Navigation() {
  const [location] = useLocation();
  return (
    <aside className="hidden w-[224px] shrink-0 flex-col border-r border-[hsl(var(--border)/.72)] bg-[hsl(var(--sidebar)/.76)] px-4 py-5 lg:flex">
      <Link href="/app" data-testid="link-brand" className="flex items-center gap-3 px-2">
        <Mark />
        <span className="text-[15px] font-semibold tracking-[-.03em]">Morrow</span>
      </Link>
      <p className="mb-3 mt-12 px-2 font-mono text-[9px] uppercase tracking-[.2em] text-[hsl(var(--muted-foreground)/.7)]">Your space</p>
      <nav className="space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === '/app' ? location === '/app' : location.startsWith(href);
          return <Link key={href} href={href} data-testid={`link-nav-${label.toLowerCase()}`} className={`group flex items-center gap-3 rounded-[11px] px-3 py-2.5 text-[12px] font-semibold transition-[background,color] ${active ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary)/.7)] hover:text-[hsl(var(--foreground))]'}`}><Icon size={16} strokeWidth={active ? 2 : 1.7} /><span>{label}</span>{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />}</Link>;
        })}
      </nav>
      <div className="mt-auto space-y-1">
        <Link href="/app/settings" data-testid="link-nav-settings" className={`group flex items-center gap-3 rounded-[11px] px-3 py-2.5 text-[12px] font-semibold transition-colors ${location.startsWith('/app/settings') ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary)/.7)] hover:text-[hsl(var(--foreground))]'}`}><CircleUserRound size={16} strokeWidth={1.7} /><span>Settings</span></Link>
        <div className="mx-2 mt-5 border-t border-[hsl(var(--border)/.65)] pt-4"><span className="font-mono text-[9px] uppercase tracking-[.16em] text-[hsl(var(--muted-foreground)/.65)]">Private space · 02</span></div>
      </div>
    </aside>
  );
}

export function BottomNavigation() {
  const [location] = useLocation();
  return <nav className="fixed inset-x-0 bottom-0 z-40 flex h-[72px] items-center justify-around border-t border-[hsl(var(--border)/.8)] bg-[hsl(var(--background)/.94)] px-3 backdrop-blur-xl lg:hidden">
    {items.map(({ href, label, icon: Icon }) => {
      const active = href === '/app' ? location === '/app' : location.startsWith(href);
      return <Link key={href} href={href} data-testid={`link-bottom-${label.toLowerCase()}`} className={`flex min-w-[62px] flex-col items-center gap-1.5 text-[9px] font-semibold tracking-[.01em] ${active ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`}><Icon size={18} strokeWidth={active ? 2 : 1.6} /><span>{label}</span></Link>;
    })}
  </nav>;
}

export function TopBar({ displayName, initials, onSignOut, signingOut, title }: { displayName: string; initials: string; onSignOut: () => void; signingOut: boolean; title: string }) {
  return <header className="flex h-[72px] items-center justify-between border-b border-[hsl(var(--border)/.62)] px-5 sm:px-8 lg:px-10">
    <div className="flex items-center gap-3 lg:hidden"><Mark /><span className="text-[15px] font-semibold tracking-[-.03em]">Morrow</span></div>
    <div className="hidden lg:block"><p className="font-mono text-[9px] uppercase tracking-[.2em] text-[hsl(var(--muted-foreground))]">Personal space</p><p className="mt-1 text-sm font-semibold">{title}</p></div>
    <div className="ml-auto flex items-center gap-3">
      <span className="hidden text-right sm:block"><span data-testid="text-user-identity" className="block max-w-[160px] truncate text-xs font-semibold">{displayName}</span><span className="block text-[10px] text-[hsl(var(--muted-foreground))]">Listening whenever you need</span></span>
      <span data-testid="avatar-user" className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--violet-deep))] text-xs font-bold text-[hsl(var(--primary))]">{initials}</span>
      <button type="button" data-testid="button-logout" onClick={onSignOut} disabled={signingOut} aria-label="Sign out" className="inline-flex h-9 items-center gap-2 rounded-lg px-2 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))] disabled:opacity-50"><LogOut size={15} strokeWidth={1.7} /><span className="hidden text-[11px] font-semibold sm:inline">{signingOut ? 'Leaving…' : 'Sign out'}</span></button>
    </div>
  </header>;
}

export function SectionHeading({ eyebrow, title, detail, action }: { eyebrow?: string; title: string; detail?: string; action?: ReactNode }) {
  return <div className="flex items-end justify-between gap-4"><div>{eyebrow && <p className="mb-3 font-mono text-[9px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">{eyebrow}</p>}<h1 className="font-serif text-[clamp(2.4rem,5vw,4.35rem)] leading-[.92] tracking-[-.045em]">{title}</h1>{detail && <p className="mt-4 max-w-xl text-sm leading-6 text-[hsl(var(--muted-foreground))]">{detail}</p>}</div>{action}</div>;
}