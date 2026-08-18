import type { Event } from "@/types/domain";

export interface CalendarService {
  createEvent(input: Partial<Event>): Promise<Event>;
  updateEvent(id: string, input: Partial<Event>): Promise<Event>;
  deleteEvent(id: string): Promise<void>;
  listEvents(): Promise<Event[]>;
}