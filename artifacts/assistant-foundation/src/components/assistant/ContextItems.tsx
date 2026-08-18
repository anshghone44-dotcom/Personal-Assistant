import { CalendarDays, Clock3, Lightbulb, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import type { ConversationItem } from '@/data/demo';

function Dot({ tone = 'muted' }: { tone?: ConversationItem['tone'] }) {
  const color = tone === 'warm' ? 'bg-[hsl(var(--accent))]' : tone === 'violet' ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted-foreground))]';
  return <span className={`absolute -left-[31px] top-5 h-[9px] w-[9px] rounded-full border-2 border-[hsl(var(--background))] ${color}`} />;
}
function ContextFrame({ item, children }: { item: ConversationItem; children: ReactNode }) {
  return <div data-testid={`context-${item.type}-${item.id}`} className="border-b border-[hsl(var(--border)/.55)] py-3.5"><Dot tone={item.tone} /><div className="flex items-start justify-between gap-3">{children}<span className="shrink-0 font-mono text-[9px] text-[hsl(var(--muted-foreground))]">{item.time}</span></div></div>;
}
export function ContextEvent({ item }: { item: ConversationItem }) {
  return <ContextFrame item={item}><div className="flex min-w-0 items-start gap-3"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--accent)/.11)] text-[hsl(var(--accent))]"><CalendarDays size={13} /></span><div><p className="text-xs font-semibold">{item.title}</p><p className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))]">{item.detail}</p></div></div></ContextFrame>;
}
export function ContextReminder({ item }: { item: ConversationItem }) {
  return <ContextFrame item={item}><div className="flex min-w-0 items-start gap-3"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--primary)/.10)] text-[hsl(var(--primary))]"><Clock3 size={13} /></span><div><p className="text-xs font-semibold">{item.title}</p><p className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))]">{item.detail}</p></div></div></ContextFrame>;
}
export function ContextMemory({ item }: { item: ConversationItem }) {
  return <ContextFrame item={item}><div className="flex min-w-0 items-start gap-3"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><Lightbulb size={13} /></span><div><p className="text-xs font-semibold">{item.title}</p><p className="mt-1 max-w-[270px] text-[11px] leading-5 text-[hsl(var(--muted-foreground))]">{item.detail}</p></div></div></ContextFrame>;
}
export function ContextPerson({ item }: { item: ConversationItem }) {
  return <ContextFrame item={item}><div className="flex items-center gap-3"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><UserRound size={13} /></span><p className="text-xs font-semibold">{item.title}</p></div></ContextFrame>;
}
export function ContextDate({ item }: { item: ConversationItem }) {
  return <div className="relative flex items-center gap-3 py-2"><span className="absolute -left-[35px] h-4 w-4 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--background))]" /><span className="font-mono text-[9px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">{item.title}</span><span className="h-px flex-1 bg-[hsl(var(--border)/.55)]" /></div>;
}