import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Mic, X } from 'lucide-react';
import type { OrbState } from '@/data/demo';
import { softSpring } from '@/design/motion';

const labels: Record<OrbState, string> = { idle: 'Tap to talk', listening: 'Listening...', thinking: 'Finding the thread', speaking: 'Morrow is speaking', success: 'Got it', error: 'Something went quiet' };

export function VoiceOrb({ onStateChange }: { onStateChange?: (state: OrbState) => void }) {
  const [state, setState] = useState<OrbState>('idle');
  const [amplitude, setAmplitude] = useState(.5);
  const timers = useRef<number[]>([]);
  const reducedMotion = useReducedMotion();
  const update = useCallback((next: OrbState) => { setState(next); onStateChange?.(next); }, [onStateChange]);
  const clear = useCallback(() => { timers.current.forEach(window.clearTimeout); timers.current = []; }, []);
  useEffect(() => () => clear(), [clear]);
  useEffect(() => {
    if (state !== 'speaking') return;
    const interval = window.setInterval(() => setAmplitude(.35 + Math.random() * .65), 150);
    return () => window.clearInterval(interval);
  }, [state]);
  function begin() {
    if (state !== 'idle' && state !== 'error') return;
    clear(); update('listening');
    timers.current.push(window.setTimeout(() => update('thinking'), 1500));
    timers.current.push(window.setTimeout(() => update('speaking'), 2850));
    timers.current.push(window.setTimeout(() => update('success'), 5200));
    timers.current.push(window.setTimeout(() => update('idle'), 6250));
  }
  function cancel() { clear(); update('idle'); }
  const scale = state === 'speaking' ? 1 + amplitude * .045 : state === 'listening' ? 1.045 : state === 'thinking' ? 1.015 : state === 'success' ? 1.07 : 1;
  return <div className="flex flex-col items-center">
    <motion.button type="button" data-testid="button-voice-orb" aria-label={state === 'listening' ? 'Cancel listening' : 'Talk to Morrow'} onClick={state === 'listening' ? cancel : begin} animate={{ scale }} transition={softSpring} className={`group relative flex h-[168px] w-[168px] items-center justify-center rounded-full outline-none transition-[box-shadow] focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] sm:h-[208px] sm:w-[208px] ${state === 'idle' ? 'orb-breathe' : ''}`}>
      <span className={`absolute inset-0 rounded-full border border-[hsl(var(--primary)/.22)] bg-[radial-gradient(circle_at_35%_28%,hsl(var(--foreground)/.27),transparent_24%),radial-gradient(circle_at_60%_70%,hsl(var(--primary)/.43),hsl(var(--violet-deep))_62%,hsl(var(--background))_100%)] shadow-[0_0_0_18px_hsl(var(--primary)/.025),0_25px_80px_hsl(var(--primary)/.18)] ${state === 'listening' ? 'border-[hsl(var(--primary)/.7)] shadow-[0_0_0_22px_hsl(var(--primary)/.06),0_25px_90px_hsl(var(--primary)/.28)]' : ''}`} />
      <span className="relative flex items-center justify-center">{state === 'listening' ? <Waveform /> : state === 'thinking' ? <ThinkingMark /> : state === 'speaking' ? <SpeakingMark amplitude={amplitude} /> : state === 'success' ? <span className="font-serif text-3xl">✓</span> : state === 'error' ? <X size={25} strokeWidth={1.4} /> : <Mic size={26} strokeWidth={1.45} />}</span>
      {!reducedMotion && state === 'listening' && <span className="absolute -inset-4 rounded-full border border-[hsl(var(--primary)/.16)]" />}
    </motion.button>
    <AnimatePresence mode="wait"><motion.p key={state} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: .2 }} data-testid="text-voice-state" className="mt-6 font-mono text-[10px] uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">{labels[state]}</motion.p></AnimatePresence>
    {state === 'listening' && <button type="button" data-testid="button-cancel-voice" onClick={cancel} className="mt-3 inline-flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"><X size={13} /> Cancel</button>}
  </div>;
}

function Waveform() {
  return <span className="flex h-8 items-center gap-1" aria-hidden="true">{[.5, .82, 1, .65, .9, .55, .75].map((height, index) => <span key={index} className="wave-bar w-1 rounded-full bg-[hsl(var(--foreground)/.8)]" style={{ height: `${height * 28}px`, animationDelay: `${index * 70}ms` }} />)}</span>;
}
function ThinkingMark() {
  return <span className="flex items-center gap-1.5">{[0, 1, 2].map((item) => <motion.span key={item} animate={{ y: [0, -5, 0], opacity: [.35, 1, .35] }} transition={{ repeat: Infinity, duration: 1.1, delay: item * .18 }} className="h-2 w-2 rounded-full bg-[hsl(var(--foreground)/.78)]" />)}</span>;
}
function SpeakingMark({ amplitude }: { amplitude: number }) {
  return <span className="flex items-center gap-1">{[.45, .75, 1, .68, .42].map((height, index) => <motion.span key={index} animate={{ scaleY: height * amplitude + .22 }} transition={{ duration: .14 }} className="h-8 w-1 rounded-full bg-[hsl(var(--foreground)/.78)]" />)}</span>;
}