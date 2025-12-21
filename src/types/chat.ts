import { TripStage } from "./trip";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: {
    stage?: TripStage;
    action?: "select_destination" | "select_plan" | "modify_timeline";
    data?: unknown;
  };
}
