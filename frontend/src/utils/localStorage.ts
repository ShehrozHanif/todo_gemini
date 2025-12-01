// frontend/src/utils/localStorage.ts
import { Task } from '../types/task';

const LOCAL_STORAGE_KEY = 'advanced-todo-tasks';

/**
 * Loads tasks from local storage.
 * @returns {Task[]} An array of tasks or an empty array if none found.
 */
export function loadTasksFromLocalStorage(): Task[] {
  try {
    const serializedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serializedTasks === null) {
      return [];
    }
    // Parse the JSON and ensure dates are correctly transformed if needed
    const tasks: Task[] = JSON.parse(serializedTasks);
    // Optional: Re-hydrate Date objects if stored as strings
    return tasks.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt).toISOString(),
      updatedAt: new Date(task.updatedAt).toISOString(),
    }));
  } catch (error) {
    console.error("Error loading tasks from local storage:", error);
    return [];
  }
}

/**
 * Saves tasks to local storage.
 * @param {Task[]} tasks The array of tasks to save.
 */
export function saveTasksToLocalStorage(tasks: Task[]): void {
  try {
    const serializedTasks = JSON.stringify(tasks);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedTasks);
  } catch (error) {
    console.error("Error saving tasks to local storage:", error);
  }
}
