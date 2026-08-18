import { useState } from 'react';
import { ArrowUpRight, Keyboard, Mic } from 'lucide-react';
import type { OrbState } from '@/data/demo';
import { VoiceOrb } from '@/components/assistant/VoiceOrb';

export function VoiceInteraction() {
  const [state, setState] = useState<OrbState>('idle');
  return <section className="relative flex flex-col items-center py-8 sm:py-12">
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--primary)/.035)] blur-3xl" />
    <VoiceOrb onStateChange={setState} />
    <div className="mt-10 text-center"><p className="font-serif text-3xl tracking-[-.03em] sm:text-4xl">{state === 'idle' ? 'Talk to me.' : state === 'listening' ? 'I’m here.' : state === 'thinking' ? 'Let me hold that.' : state === 'speaking' ? 'A thought for you.' : state === 'success' ? 'I’ll remember.' : 'Try again when you’re ready.'}</p><p className="mx-auto mt-3 max-w-[280px] text-xs leading-5 text-[hsl(var(--muted-foreground))]">{state === 'idle' ? 'Say what is on your mind. No prompt needed.' : 'This is a private, simulated conversation for now.'}</p></div>
    {state === 'idle' && <div className="mt-8 flex items-center gap-3"><button type="button" data-testid="button-type-message" className="inline-flex h-9 items-center gap-2 rounded-full border border-[hsl(var(--border))] px-3.5 text-[11px] font-semibold text-[hsl(var(--muted-foreground))] transition-colors hover:border-[hsl(var(--primary)/.45)] hover:text-[hsl(var(--foreground))]"><Keyboard size={14} /> Type instead</button><span className="text-[10px] text-[hsl(var(--muted-foreground)/.65)]">or press</span><kbd className="rounded-md border border-[hsl(var(--border))] px-2 py-1 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">space</kbd></div>}
    {state === 'success' && <button type="button" data-testid="button-view-conversation" className="mt-8 inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--primary))]">View conversation <ArrowUpRight size={14} /></button>}
    <div className="mt-10 flex items-center gap-2 text-[10px] text-[hsl(var(--muted-foreground)/.65)]"><Mic size={12} /> Voice is the shortest distance between you and your space.</div>
  </section>;
}