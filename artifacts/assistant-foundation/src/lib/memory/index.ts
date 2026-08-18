import type { Memory } from "@/types/domain";

export interface MemoryService {
  createMemory(input: Partial<Memory>): Promise<Memory>;
  updateMemory(id: string, input: Partial<Memory>): Promise<Memory>;
  deleteMemory(id: string): Promise<void>;
  listMemories(): Promise<Memory[]>;
}