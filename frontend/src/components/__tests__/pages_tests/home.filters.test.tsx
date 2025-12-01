// frontend/src/pages/__tests__/home.filters.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../../app/page'; // Adjust path if necessary
import { Task, Priority } from '../../types/task';
import { generateUUID } from '../../utils/uuid';

// Mock the uuid generation for consistent testing
jest.mock('../../utils/uuid', () => ({
  generateUUID: jest.fn(() => 'mock-uuid-filter-123'),
}));

describe('Home Page - Filtering Logic Integration', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task Low Pending',
      completed: false,
      priority: Priority.Low,
      createdAt: new Date('2025-01-01T10:00:00Z').toISOString(),
      updatedAt: new Date('2025-01-01T10:00:00Z').toISOString(),
    },
    {
      id: '2',
      title: 'Task Medium Completed',
      completed: true,
      priority: Priority.Medium,
      createdAt: new Date('2025-01-02T10:00:00Z').toISOString(),
      updatedAt: new Date('2025-01-02T10:00:00Z').toISOString(),
    },
    {
      id: '3',
      title: 'Task High Pending',
      completed: false,
      priority: Priority.High,
      createdAt: new Date('2025-01-03T10:00:00Z').toISOString(),
      updatedAt: new Date('2025-01-03T10:00:00Z').toISOString(),
    },
    {
      id: '4',
      title: 'Task Low Completed',
      completed: true,
      priority: Priority.Low,
      createdAt: new Date('2025-01-04T10:00:00Z').toISOString(),
      updatedAt: new Date('2025-01-04T10:00:00Z').toISOString(),
    },
  ];

  beforeEach(() => {
    localStorage.clear();
    // Pre-populate tasks in localStorage for filtering tests
    localStorage.setItem('tasks', JSON.stringify(mockTasks));
    (generateUUID as jest.Mock).mockClear();
    (generateUUID as jest.Mock).mockReturnValue('mock-uuid-filter-123');
  });

  // Re-mock TaskList to simplify assertions for filtered content
  jest.mock('../../components/TaskList', () => {
    return jest.fn(({ tasks, onUpdateTask, onDeleteTask }) => (
      <div data-testid="mock-task-list">
        {tasks.map((task) => (
          <div key={task.id} data-testid={`task-item-${task.id}`}>
            {task.title} {task.completed ? '[C]' : '[P]'} [{task.priority}]
          </div>
        ))}
      </div>
    ));
  });


  test('displays all tasks by default (All status, All priority)', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText('Task Low Pending [P] [Low]')).toBeInTheDocument();
      expect(screen.getByText('Task Medium Completed [C] [Medium]')).toBeInTheDocument();
      expect(screen.getByText('Task High Pending [P] [High]')).toBeInTheDocument();
      expect(screen.getByText('Task Low Completed [C] [Low]')).toBeInTheDocument();
    });
  });

  test('filters tasks by status "Completed"', async () => {
    render(<Home />);
    const statusFilter = screen.getByLabelText('Filter by Status:');
    fireEvent.change(statusFilter, { target: { value: 'Completed' } });

    await waitFor(() => {
      expect(screen.queryByText('Task Low Pending [P] [Low]')).not.toBeInTheDocument();
      expect(screen.getByText('Task Medium Completed [C] [Medium]')).toBeInTheDocument();
      expect(screen.queryByText('Task High Pending [P] [High]')).not.toBeInTheDocument();
      expect(screen.getByText('Task Low Completed [C] [Low]')).toBeInTheDocument();
    });
  });

  test('filters tasks by status "Pending"', async () => {
    render(<Home />);
    const statusFilter = screen.getByLabelText('Filter by Status:');
    fireEvent.change(statusFilter, { target: { value: 'Pending' } });

    await waitFor(() => {
      expect(screen.getByText('Task Low Pending [P] [Low]')).toBeInTheDocument();
      expect(screen.queryByText('Task Medium Completed [C] [Medium]')).not.toBeInTheDocument();
      expect(screen.getByText('Task High Pending [P] [High]')).toBeInTheDocument();
      expect(screen.queryByText('Task Low Completed [C] [Low]')).not.toBeInTheDocument();
    });
  });

  test('filters tasks by priority "High"', async () => {
    render(<Home />);
    const priorityFilter = screen.getByLabelText('Filter by Priority:');
    fireEvent.change(priorityFilter, { target: { value: Priority.High } });

    await waitFor(() => {
      expect(screen.queryByText('Task Low Pending [P] [Low]')).not.toBeInTheDocument();
      expect(screen.queryByText('Task Medium Completed [C] [Medium]')).not.toBeInTheDocument();
      expect(screen.getByText('Task High Pending [P] [High]')).toBeInTheDocument();
      expect(screen.queryByText('Task Low Completed [C] [Low]')).not.toBeInTheDocument();
    });
  });

  test('filters tasks by combined status "Completed" and priority "Low"', async () => {
    render(<Home />);
    const statusFilter = screen.getByLabelText('Filter by Status:');
    const priorityFilter = screen.getByLabelText('Filter by Priority:');

    fireEvent.change(statusFilter, { target: { value: 'Completed' } });
    fireEvent.change(priorityFilter, { target: { value: Priority.Low } });

    await waitFor(() => {
      expect(screen.queryByText('Task Low Pending [P] [Low]')).not.toBeInTheDocument();
      expect(screen.queryByText('Task Medium Completed [C] [Medium]')).not.toBeInTheDocument();
      expect(screen.queryByText('Task High Pending [P] [High]')).not.toBeInTheDocument();
      expect(screen.getByText('Task Low Completed [C] [Low]')).toBeInTheDocument();
    });
  });

  test('displays tasks sorted by creation date newest first', async () => {
    render(<Home />);
    // Initial render should show tasks sorted by createdAt DESC
    const taskList = screen.getByTestId('mock-task-list');
    const taskItems = await waitFor(() => screen.getAllByTestId(/task-item-/i));

    // Assert the order based on createdAt (mockTasks are already sorted by createdAt asc in the definition)
    // The filter and sort logic in page.tsx should reverse this for newest first.
    expect(taskItems[0]).toHaveTextContent('Task Low Completed [C] [Low]');
    expect(taskItems[1]).toHaveTextContent('Task High Pending [P] [High]');
    expect(taskItems[2]).toHaveTextContent('Task Medium Completed [C] [Medium]');
    expect(taskItems[3]).toHaveTextContent('Task Low Pending [P] [Low]');
  });
});
