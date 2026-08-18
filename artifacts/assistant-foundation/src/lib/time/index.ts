export interface TimeService {
  getUserTimezone(): string;
  formatDateTime(value: string, timezone?: string): string;
}