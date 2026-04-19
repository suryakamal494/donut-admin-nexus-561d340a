export interface Batch {
  id: string;
  name: string;
  subject: string;
  grade: string;
  section: string | null;
}

export interface Routine {
  id: string;
  key: string;
  label: string;
  icon: string;
  description: string | null;
  default_system_prompt: string | null;
  quick_start_chips: string[];
  is_active: boolean;
  sort_order: number;
}

export interface Thread {
  id: string;
  batch_id: string;
  routine_id: string;
  title: string;
  last_message_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  thread_id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  created_at: string;
}

export interface Artifact {
  id: string;
  batch_id: string;
  thread_id: string | null;
  type: "lesson_plan" | "test" | "homework" | "banded_homework" | "ppt" | "report" | "schedule";
  title: string;
  content: any;
  created_at: string;
}
