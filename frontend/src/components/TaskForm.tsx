// frontend/src/components/TaskForm.tsx
import React, { useState } from 'react';
import { Task, Priority } from '../types/task';
import { generateUUID } from '../utils/uuid'; // Assuming uuid utility is in frontend/src/utils

interface TaskFormProps {
  onAddTask: (task: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.Medium);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const newTask: Task = {
        id: generateUUID(),
        title: title.trim(),
        completed: false,
        priority,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onAddTask(newTask);
      setTitle('');
      setPriority(Priority.Medium);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        maxLength={100}
      />
      <div className="flex items-center space-x-2">
        <label htmlFor="priority-select" className="text-gray-700">Priority:</label>
        <select
          id="priority-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.values(Priority).map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
