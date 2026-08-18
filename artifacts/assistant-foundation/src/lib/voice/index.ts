export interface VoiceService {
  startRecording(): Promise<void>;
  stopRecording(): Promise<Blob>;
}