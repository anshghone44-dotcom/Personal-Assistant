import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Plus } from 'lucide-react';
import { AppShell } from '@/components/assistant/AppShell';
import { PageTransition } from '@/components/assistant/PageTransition';
import { ReminderCard } from '@/components/assistant/ReminderCard';
import { SectionHeading } from '@/components/assistant/Navigation';
import { reminders as initialReminders, type Reminder } from '@/data/demo';

export function RemindersPage() {
  const [items, setItems] = useState<Reminder[]>(initialReminders);
  function done(id: string) { setItems((current) => current.map((item) => item.id === id ? { ...item, state: item.state === 'completed' ? 'today' : 'completed', when: item.state === 'completed' ? 'Today' : 'Done just now' } : item)); }
  function later(id: string) { setItems((current) => current.map((item) => item.id === id ? { ...item, state: 'upcoming', when: 'Tomorrow' } : item)); }
  const groups: { key: Reminder['state']; label: string; note: string }[] = [{ key: 'today', label: 'Today', note: 'The near things.' }, { key: 'upcoming', label: 'Upcoming', note: 'Not yet, but not forgotten.' }, { key: 'completed', label: 'Completed', note: 'A little evidence of movement.' }];
  return <AppShell title="Reminders"><PageTransition className="mx-auto max-w-[880px] px-5 py-10 sm:px-8 lg:px-10 lg:py-14"><SectionHeading eyebrow="Held lightly" title="Reminders" detail="Things you asked me not to let slip. Nothing here is louder than it needs to be." action={<button type="button" data-testid="button-add-reminder" className="inline-flex h-10 items-center gap-2 border border-[hsl(var(--border))] px-3 text-[11px] font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))]"><Plus size={14} /> Add</button>} /><div className="mt-14 space-y-12">{groups.map((group) => { const groupItems = items.filter((item) => item.state === group.key); return <section key={group.key}><div className="mb-2 flex items-end justify-between"><div><h2 className="font-serif text-3xl tracking-[-.03em]">{group.label}</h2><p className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))]">{group.note}</p></div><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--secondary))] font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{groupItems.length}</span></div><AnimatePresence mode="popLayout">{groupItems.length ? groupItems.map((item) => <ReminderCard key={item.id} reminder={item} onDone={done} onLater={later} />) : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 border-b border-[hsl(var(--border)/.6)] py-5 text-xs text-[hsl(var(--muted-foreground))]"><Bell size={14} /> Nothing resting here.</motion.div>}</AnimatePresence></section>; })}</div></PageTransition></AppShell>;
}