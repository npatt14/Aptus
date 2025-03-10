export interface Shift {
  id?: string;
  position: string;
  start_time: string; // ISO
  end_time: string; // ISO
  rate: string;
  raw_input: string;
  status: "success" | "error";
  created_at?: string;
  updated_at?: string;
}

export interface ShiftInput {
  text: string;
}

export interface OpenAIResponse {
  position: string;
  start_time: string;
  end_time: string;
  rate: string;
}

export interface BasicEvaluation {
  valid: boolean;
  results: {
    requiredFields: boolean;
    dateFormats: boolean;
    timeSequence: boolean;
    position: boolean;
  };
}

export interface AdvancedEvaluation {
  score: number;
  feedback: string;
  correct: boolean;
  metrics: {
    positionAccuracy: number;
    timeAccuracy: number;
    rateAccuracy: number;
    overallQuality: number;
  };
}

export interface ShiftEvaluation {
  basic: BasicEvaluation;
  advanced?: AdvancedEvaluation;
}

export interface ParsedShiftResponse {
  shiftData: OpenAIResponse;
  evaluation: ShiftEvaluation;
}
