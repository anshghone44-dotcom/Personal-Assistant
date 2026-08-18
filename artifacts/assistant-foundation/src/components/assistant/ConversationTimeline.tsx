import { motion } from 'framer-motion';
import type { ConversationItem } from '@/data/demo';
import { fadeUp, stagger } from '@/design/motion';
import { ConversationMessage } from '@/components/assistant/ConversationMessage';
import { ContextDate, ContextEvent, ContextMemory, ContextPerson, ContextReminder } from '@/components/assistant/ContextItems';

export function ConversationTimeline({ items }: { items: ConversationItem[] }) {
  return <motion.div variants={stagger} initial="hidden" animate="visible" className="relative space-y-3">
    <div className="absolute bottom-4 left-[11px] top-4 w-px bg-[hsl(var(--border)/.7)]" />
    {items.map((item) => <motion.div key={item.id} variants={fadeUp} className="relative pl-9">{item.type === 'message' && <ConversationMessage item={item} />}{item.type === 'event' && <ContextEvent item={item} />}{item.type === 'reminder' && <ContextReminder item={item} />}{item.type === 'memory' && <ContextMemory item={item} />}{item.type === 'person' && <ContextPerson item={item} />}{item.type === 'date' && <ContextDate item={item} />}</motion.div>)}
  </motion.div>;
}