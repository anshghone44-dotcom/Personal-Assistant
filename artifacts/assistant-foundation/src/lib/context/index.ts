export interface ContextService {
  getRelevantContext(input: unknown): Promise<unknown>;
}