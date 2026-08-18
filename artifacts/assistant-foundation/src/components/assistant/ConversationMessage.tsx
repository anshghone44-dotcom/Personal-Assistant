import { MessageCircle } from 'lucide-react';
import type { ConversationItem } from '@/data/demo';

export function ConversationMessage({ item }: { item: ConversationItem }) {
  return <div data-testid={`message-conversation-${item.id}`} className="relative border border-[hsl(var(--primary)/.18)] bg-[hsl(var(--primary)/.06)] p-4 pl-5 shadow-[0_14px_40px_hsl(var(--background)/.16)] sm:p-5"><span className="absolute -left-[34px] top-5 flex h-[23px] w-[23px] items-center justify-center rounded-full border border-[hsl(var(--primary)/.28)] bg-[hsl(var(--background))] text-[hsl(var(--primary))]"><MessageCircle size={11} /></span><div className="flex items-start justify-between gap-3"><p className="text-[13px] font-semibold">{item.title}</p><span className="font-mono text-[9px] text-[hsl(var(--muted-foreground))]">{item.time}</span></div><p className="mt-2 max-w-md text-xs leading-5 text-[hsl(var(--muted-foreground))]">{item.detail}</p></div>;
}