export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export type PriorityLevel = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  timestamp: number;
  priority: PriorityLevel;
  category: string;
  dueDate: string; // Format YYYY-MM-DD
  subtasks?: Record<string, SubTask>;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastCompletedDate: string | null; // Format YYYY-MM-DD
}
