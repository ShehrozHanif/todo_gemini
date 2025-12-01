// frontend/src/components/TaskItem.tsx
import React, { useState } from 'react';
import { Task, Priority } from '../types/task';

interface TaskItemProps {
  task: Task;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdateTask, onDeleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedPriority, setEditedPriority] = useState(task.priority);

  const handleToggleCompleted = () => {
    onUpdateTask({ ...task, completed: !task.completed, updatedAt: new Date().toISOString() });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedTitle.trim() && editedTitle !== task.title || editedPriority !== task.priority) {
      onUpdateTask({
        ...task,
        title: editedTitle.trim(),
        priority: editedPriority,
        updatedAt: new Date().toISOString(),
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setEditedPriority(task.priority);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDeleteTask(task.id);
  };

  const getPriorityColorClass = (priority: Priority) => {
    switch (priority) {
      case Priority.Low:
        return 'bg-green-200 text-green-800';
      case Priority.Medium:
        return 'bg-yellow-200 text-yellow-800';
      case Priority.High:
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className={`flex items-center justify-between p-4 border-b border-gray-200 flex-wrap md:flex-nowrap ${task.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-center flex-grow">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleCompleted}
          className="form-checkbox h-5 w-5 text-blue-600 rounded"
        />
        {isEditing ? (
          <>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="ml-4 p-2 border border-gray-300 rounded-md flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={100}
            />
            <select
              value={editedPriority}
              onChange={(e) => setEditedPriority(e.target.value as Priority)}
              className="ml-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(Priority).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </>
        ) : (
          <span className={`ml-4 text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.title}
          </span>
        )}
        {!isEditing && (
          <span
            className={`ml-4 px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColorClass(task.priority)}`}
          >
            {task.priority}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEdit}
              className="p-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
