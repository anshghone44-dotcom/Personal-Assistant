import type { Reminder } from "@/types/domain";

export interface ReminderService {
  createReminder(input: Partial<Reminder>): Promise<Reminder>;
  updateReminder(id: string, input: Partial<Reminder>): Promise<Reminder>;
  deleteReminder(id: string): Promise<void>;
  listReminders(): Promise<Reminder[]>;
}