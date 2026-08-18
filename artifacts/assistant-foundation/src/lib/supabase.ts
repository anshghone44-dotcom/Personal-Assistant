import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const rawSupabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

function isValidSupabaseUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

const supabaseUrl = isValidSupabaseUrl(rawSupabaseUrl) ? rawSupabaseUrl.trim() : undefined;
const supabaseAnonKey = rawSupabaseAnonKey?.trim() || undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);