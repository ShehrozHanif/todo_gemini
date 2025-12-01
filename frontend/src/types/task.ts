// frontend/src/types/task.ts

/**
 * Enum for Task Priority levels.
 */
export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

/**
 * Interface for a Task entity.
 * Aligns with the data model defined in data-model.md.
 */
export interface Task {
  id: string; // UUIDv4
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
