import { type ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

export function SettingsSection({ title, detail, children }: { title: string; detail: string; children: ReactNode }) {
  return <section className="border-t border-[hsl(var(--border)/.75)] py-7"><div className="grid gap-5 sm:grid-cols-[190px_1fr] sm:gap-10"><div><h2 className="text-sm font-semibold">{title}</h2><p className="mt-2 text-[11px] leading-5 text-[hsl(var(--muted-foreground))]">{detail}</p></div><div className="space-y-1">{children}</div></div></section>;
}
export function SettingRow({ label, detail, children, onClick }: { label: string; detail?: string; children?: ReactNode; onClick?: () => void }) {
  return <div className="flex min-h-[52px] items-center justify-between gap-5 border-b border-[hsl(var(--border)/.45)] py-3 last:border-0"><div className="min-w-0"><p className="text-xs font-semibold">{label}</p>{detail && <p className="mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">{detail}</p>}</div>{onClick ? <button type="button" data-testid={`button-setting-${label.toLowerCase().replaceAll(' ', '-')}`} onClick={onClick} className="inline-flex items-center gap-2 text-[11px] font-semibold text-[hsl(var(--primary))]">{children}<ChevronRight size={13} /></button> : children}</div>;
}