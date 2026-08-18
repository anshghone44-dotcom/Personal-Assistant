export type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'success' | 'error';

export type ConversationItem = {
  id: string;
  type: 'message' | 'event' | 'reminder' | 'person' | 'memory' | 'date';
  time: string;
  title: string;
  detail?: string;
  tone?: 'violet' | 'warm' | 'muted';
};

export const conversation: ConversationItem[] = [
  { id: 'date-1', type: 'date', time: '08:42', title: 'Thursday, October 24', tone: 'muted' },
  { id: 'message-1', type: 'message', time: '08:43', title: 'Good morning, Amara.', detail: 'You have a clear morning. Want to talk through what is on your mind?', tone: 'violet' },
  { id: 'event-1', type: 'event', time: '10:00', title: 'Design review', detail: 'Studio 4 · 45 min', tone: 'warm' },
  { id: 'reminder-1', type: 'reminder', time: '12:30', title: 'Call Mum', detail: 'You asked me to keep this close today.', tone: 'violet' },
  { id: 'memory-1', type: 'memory', time: 'Yesterday', title: 'You are thinking about a slower November.', detail: 'A note from your conversation about making room for long walks.', tone: 'muted' },
];

export const events = [
  { id: 'event-1', title: 'Design review', time: '10:00', end: '10:45', location: 'Studio 4', color: 'violet' as const, description: 'A quiet review of the new voice interaction prototypes.' },
  { id: 'event-2', title: 'Lunch with Jo', time: '12:30', end: '13:30', location: 'Mallow & Finch', color: 'warm' as const, description: 'Catch up and talk through the November trip.' },
  { id: 'event-3', title: 'Walk by the water', time: '17:40', end: '18:25', location: 'Crissy Field', color: 'soft' as const, description: 'No agenda. Bring the navy jacket.' },
  { id: 'event-4', title: 'Read together', time: '20:30', end: '21:15', location: 'Home', color: 'violet' as const, description: 'The last two chapters of The Hearing Trumpet.' },
];

export type Reminder = { id: string; title: string; note: string; when: string; state: 'upcoming' | 'today' | 'completed'; };
export const reminders: Reminder[] = [
  { id: 'reminder-1', title: 'Call Mum', note: 'Ask about the garden.', when: 'Today · 12:30', state: 'today' },
  { id: 'reminder-2', title: 'Send the revised deck', note: 'Include the new opening sequence.', when: 'Today · 16:00', state: 'today' },
  { id: 'reminder-3', title: 'Book the train to Portland', note: 'Look at the early Friday departures.', when: 'Tomorrow', state: 'upcoming' },
  { id: 'reminder-4', title: 'Pick up film', note: 'The little camera shop on Valencia.', when: 'Saturday', state: 'upcoming' },
  { id: 'reminder-5', title: 'Water the rosemary', note: 'It prefers the morning.', when: 'Done yesterday', state: 'completed' },
];

export type Memory = { id: string; title: string; body: string; tag: string; updated: string; };
export const memories: Memory[] = [
  { id: 'memory-1', title: 'A slower November', body: 'You want the month to feel less scheduled. Long walks, fewer evening plans, and a weekend near the coast.', tag: 'A feeling', updated: 'Saved yesterday' },
  { id: 'memory-2', title: 'Mum’s garden', body: 'The tomatoes are late this year. Ask how the new greenhouse is holding up when you call.', tag: 'A person', updated: 'Saved Oct 18' },
  { id: 'memory-3', title: 'The good kind of work', body: 'You do your best thinking when the first hour of the day stays quiet and the work has a tangible edge.', tag: 'An insight', updated: 'Saved Oct 12' },
  { id: 'memory-4', title: 'Portland, early spring', body: 'A small trip is calling. You bookmarked a house near the river and liked the idea of going before the city wakes up.', tag: 'A place', updated: 'Saved Oct 03' },
];

export const calendarDays = ['Mon 21', 'Tue 22', 'Wed 23', 'Thu 24', 'Fri 25', 'Sat 26', 'Sun 27'];