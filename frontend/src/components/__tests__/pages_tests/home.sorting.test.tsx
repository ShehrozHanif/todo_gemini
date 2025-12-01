// frontend/src/pages/__tests__/home.sorting.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../../app/page'; // Adjust path if necessary
import { Task, Priority } from '../../types/task';
import { generateUUID } from '../../utils/uuid';

// Mock the uuid generation for consistent testing
jest.mock('../../utils/uuid', () => ({
  generateUUID: jest.fn(() => 'mock-uuid-sort-123'),
}));

describe('Home Page - Sorting Logic Integration', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task Low',
      completed: false,
      priority: Priority.Low,
      createdAt: new Date('2025-01-01T10:00:00Z').toISOString(),
      updatedAt: new Date('2025-01-01T10:00:00Z').toISOString(),
    },
    {
      id: '2',
      title: 'Task Medium',
      completed: false,
      priority: Priority.Medium,
      createdAt: new Date('2025-01-02T10:00:00Z').toISOString(),
      updatedAt: new Date('2025-01-02T10:00:00Z').toISOString(),
    },
    {
      id: '3',
      title: 'Task High',
      completed: false,
      priority: Priority.High,
      createdAt: new Date('2025-01-03T10:00:00Z').toISOString(),
      updatedAt: new Date('2025-01-03T10:00:00Z').toISOString(),
    },
  ];

  beforeEach(() => {
    localStorage.clear();
    // Pre-populate tasks in localStorage for sorting tests
    localStorage.setItem('tasks', JSON.stringify(mockTasks));
    (generateUUID as jest.Mock).mockClear();
    (generateUUID as jest.Mock).mockReturnValue('mock-uuid-sort-123');
  });

  // Re-mock TaskList to simplify assertions for sorted content
  jest.mock('../../components/TaskList', () => {
    return jest.fn(({ tasks, onUpdateTask, onDeleteTask }) => (
      <div data-testid="mock-task-list">
        {tasks.map((task) => (
          <div key={task.id} data-testid={`task-item-${task.id}`}>
            {task.title} [{task.priority}]
          </div>
        ))}
      </div>
    ));
  });

  test('sorts tasks by creation date by default (newest first)', async () => {
    render(<Home />);
    const taskItems = await waitFor(() => screen.getAllByTestId(/task-item-/i));

    // Tasks are mockTasks[0] oldest, mockTasks[2] newest based on createdAt
    // Default sort should display newest first
    expect(taskItems[0]).toHaveTextContent('Task High [High]');
    expect(taskItems[1]).toHaveTextContent('Task Medium [Medium]');
    expect(taskItems[2]).toHaveTextContent('Task Low [Low]');
  });

  test('sorts tasks by priority (High to Low)', async () => {
    render(<Home />);
    const sortSelect = screen.getByLabelText('Sort by:');
    fireEvent.change(sortSelect, { target: { value: 'priority' } });

    const taskItems = await waitFor(() => screen.getAllByTestId(/task-item-/i));

    // Priority order: High, Medium, Low
    expect(taskItems[0]).toHaveTextContent('Task High [High]');
    expect(taskItems[1]).toHaveTextContent('Task Medium [Medium]');
    expect(taskItems[2]).toHaveTextContent('Task Low [Low]');
  });

  test('maintains filter and then sorts correctly', async () => {
    // Add a completed high priority task and a pending low priority task
    const complexMockTasks: Task[] = [
      {
        id: '1', title: 'Task Low Pending', completed: false, priority: Priority.Low,
        createdAt: new Date('2025-01-01T10:00:00Z').toISOString(), updatedAt: new Date('2025-01-01T10:00:00Z').toISOString(),
      },
      {
        id: '2', title: 'Task Medium Completed', completed: true, priority: Priority.Medium,
        createdAt: new Date('2025-01-02T10:00:00Z').toISOString(), updatedAt: new Date('2025-01-02T10:00:00Z').toISOString(),
      },
      {
        id: '3', title: 'Task High Pending', completed: false, priority: Priority.High,
        createdAt: new Date('2025-01-03T10:00:00Z').toISOString(), updatedAt: new Date('2025-01-03T10:00:00Z').toISOString(),
      },
      {
        id: '4', title: 'Task High Completed', completed: true, priority: Priority.High,
        createdAt: new Date('2025-01-04T10:00:00Z').toISOString(), updatedAt: new Date('2025-01-04T10:00:00Z').toISOString(),
      },
    ];
    localStorage.setItem('tasks', JSON.stringify(complexMockTasks)); // Overwrite initial mockTasks

    render(<Home />);

    const statusFilter = screen.getByLabelText('Filter by Status:');
    const sortSelect = screen.getByLabelText('Sort by:');

    // Filter by Pending, then sort by Priority
    fireEvent.change(statusFilter, { target: { value: 'Pending' } });
    fireEvent.change(sortSelect, { target: { value: 'priority' } });

    const taskItems = await waitFor(() => screen.getAllByTestId(/task-item-/i));

    // Expected: High Pending, then Low Pending (sorted by priority)
    expect(taskItems).toHaveLength(2);
    expect(taskItems[0]).toHaveTextContent('Task High Pending [High]');
    expect(taskItems[1]).toHaveTextContent('Task Low Pending [Low]');
  });
});
