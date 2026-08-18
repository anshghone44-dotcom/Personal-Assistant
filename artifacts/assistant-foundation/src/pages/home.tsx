import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, CalendarDays, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { AppShell } from '@/components/assistant/AppShell';
import { ConversationTimeline } from '@/components/assistant/ConversationTimeline';
import { TodayTimeline } from '@/components/assistant/TodayTimeline';
import { VoiceInteraction } from '@/components/assistant/VoiceInteraction';
import { PageTransition } from '@/components/assistant/PageTransition';
import { conversation, reminders as initialReminders } from '@/data/demo';

export function HomePage() {
  const [reminders, setReminders] = useState(initialReminders);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 30_000); return () => window.clearInterval(timer); }, []);
  const dateLabel = useMemo(() => new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(now), [now]);
  const timeLabel = useMemo(() => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(now), [now]);
  function completeReminder(id: string) { setReminders((items) => items.map((item) => item.id === id ? { ...item, state: 'completed' as const, when: 'Done just now' } : item)); }
  return <AppShell title="Talk"><PageTransition className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
    <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0"><div className="flex items-end justify-between gap-5"><div><p className="font-mono text-[9px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">Thursday · Your space</p><p data-testid="text-current-time" className="mt-4 font-serif text-5xl leading-none tracking-[-.05em] sm:text-7xl">{timeLabel}</p><p data-testid="text-current-date" className="mt-3 text-xs text-[hsl(var(--muted-foreground))]">{dateLabel}</p></div><Link href="/app/calendar" data-testid="link-open-calendar" className="hidden items-center gap-1.5 pb-1 text-[11px] font-semibold text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--primary))] sm:flex">Open calendar <ArrowUpRight size={14} /></Link></div>
        <VoiceInteraction />
        <div className="mt-4 border-t border-[hsl(var(--border)/.7)] pt-10"><ConversationTimeline items={conversation} /></div>
      </div>
      <aside className="space-y-10 border-t border-[hsl(var(--border)/.7)] pt-8 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-1"><TodayTimeline reminders={reminders} onReminder={completeReminder} /><div className="border-t border-[hsl(var(--border)/.7)] pt-8"><div className="flex items-center gap-2 text-[hsl(var(--primary))]"><Sparkles size={15} /><span className="font-mono text-[9px] uppercase tracking-[.18em]">Continuity</span></div><p className="mt-4 font-serif text-2xl leading-[1.02] tracking-[-.02em]">The things you tell me stay connected.</p><p className="mt-3 text-xs leading-5 text-[hsl(var(--muted-foreground))]">People, places, dates, and half-formed thoughts — held in one calm thread.</p><Link href="/app/memory" data-testid="link-open-memory" className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[hsl(var(--primary))]">See what I remember <ChevronRight size={14} /></Link></div><div className="hidden border-t border-[hsl(var(--border)/.7)] pt-8 sm:block"><div className="flex items-center gap-2 text-[hsl(var(--accent))]"><CalendarDays size={15} /><span className="font-mono text-[9px] uppercase tracking-[.18em]">Next up</span></div><p className="mt-3 text-xs font-semibold">Design review</p><p className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))]">10:00 · Studio 4</p></div></aside>
    </div>
  </PageTransition></AppShell>;
}