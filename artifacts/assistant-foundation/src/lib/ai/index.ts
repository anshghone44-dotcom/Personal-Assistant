import type { Message } from "@/types/domain";

export interface AIService {
  understandMessage(message: Message): Promise<unknown>;
  generateResponse(input: unknown): Promise<string>;
}