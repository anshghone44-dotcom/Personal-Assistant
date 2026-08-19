import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type Profile = {
  id: string;
  user_id: string;
  name: string | null;
  timezone: string | null;
  preferred_language: string | null;
  created_at: string;
  updated_at: string;
};

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('[Profile] getProfile database error:', error);
    throw error;
  }
  return data as Profile | null;
}

export async function createProfileForUser(user: User, name: string) {
  console.log('[Profile] Creating/updating profile for user:', user.id);
  const timezone = Intl?.DateTimeFormat?.()?.resolvedOptions?.()?.timeZone || 'UTC';
  const preferredLanguage = (typeof navigator !== 'undefined' && navigator.language ? navigator.language.split('-')[0] : 'en') || 'en';

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      user_id: user.id,
      name: name.trim() || null,
      timezone,
      preferred_language: preferredLanguage,
    }, { onConflict: 'user_id' })
    .select('*')
    .single();

  if (error) {
    console.error('[Profile] createProfileForUser database error:', error);
    throw error;
  }
  console.log('[Profile] Profile saved successfully:', data);
  return data as Profile;
}