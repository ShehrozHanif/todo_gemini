// backend/src/utils/validation.ts
import { Priority, Task } from '../../frontend/src/types/task'; // Assuming shared types

export function validateTaskCreation(title: string, priority: Priority): { isValid: boolean; message?: string } {
  if (!title || title.trim().length === 0) {
    return { isValid: false, message: 'Title is required.' };
  }
  if (title.trim().length > 100) {
    return { isValid: false, message: 'Title must be 100 characters or less.' };
  }
  if (!Object.values(Priority).includes(priority)) {
    return { isValid: false, message: 'Invalid priority value.' };
  }
  return { isValid: true };
}

export function validateTaskUpdate(updateData: Partial<Task>): { isValid: boolean; message?: string } {
  if (updateData.title !== undefined) {
    if (!updateData.title || updateData.title.trim().length === 0) {
      return { isValid: false, message: 'Title is required.' };
    }
    if (updateData.title.trim().length > 100) {
      return { isValid: false, message: 'Title must be 100 characters or less.' };
    }
  }
  if (updateData.completed !== undefined && typeof updateData.completed !== 'boolean') {
    return { isValid: false, message: 'Completed status must be a boolean.' };
  }
  if (updateData.priority !== undefined && !Object.values(Priority).includes(updateData.priority)) {
    return { isValid: false, message: 'Invalid priority value.' };
  }
  return { isValid: true };
}
