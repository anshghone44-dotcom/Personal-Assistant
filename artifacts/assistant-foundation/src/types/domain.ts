export type MessageRole = "user" | "assistant" | "system";
export type EventStatus = "scheduled" | "cancelled" | "completed";
export type EventSource = "manual" | "ai" | "calendar_sync";
export type ReminderStatus = "pending" | "completed" | "cancelled";

export interface Profile {
  id: string;
  user_id: string;
  name: string | null;
  timezone: string;
  preferred_language: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  role: MessageRole;
  content: string;
  language: string | null;
  created_at: string;
}

export interface Person {
  id: string;
  user_id: string;
  name: string;
  relationship: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  person_id: string | null;
  start_time: string;
  end_time: string | null;
  timezone: string;
  location: string | null;
  status: EventStatus;
  source: EventSource;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  trigger_time: string;
  timezone: string;
  related_event_id: string | null;
  status: ReminderStatus;
  created_at: string;
  updated_at: string;
}

export interface Memory {
  id: string;
  user_id: string;
  memory_type: string;
  content: string;
  importance: number;
  confidence: number;
  source_message_id: string | null;
  created_at: string;
  expires_at: string | null;
  updated_at: string;
}

export interface Preference {
  id: string;
  user_id: string;
  preference_key: string;
  preference_value: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}