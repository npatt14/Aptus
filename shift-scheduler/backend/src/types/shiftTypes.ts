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
