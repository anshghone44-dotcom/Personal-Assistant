import { CalendarDays } from 'lucide-react';
import { AppShell } from '@/components/assistant/AppShell';
import { CalendarView } from '@/components/assistant/CalendarView';
import { PageTransition } from '@/components/assistant/PageTransition';
import { SectionHeading } from '@/components/assistant/Navigation';

export function CalendarPage() {
  return <AppShell title="Calendar"><PageTransition className="mx-auto max-w-[1120px] px-5 py-10 sm:px-8 lg:px-10 lg:py-14"><SectionHeading eyebrow="A shape for the week" title="Calendar" detail="A view of what has a place in your day. Select anything to keep the context close." action={<span className="hidden h-10 w-10 items-center justify-center border border-[hsl(var(--border))] text-[hsl(var(--primary))] sm:flex"><CalendarDays size={17} /></span>} /><CalendarView /></PageTransition></AppShell>;
}