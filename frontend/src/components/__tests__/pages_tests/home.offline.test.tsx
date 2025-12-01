// frontend/src/pages/__tests__/home.offline.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../../app/page'; // Adjust path if necessary
import { Task, Priority } from '../../types/task';
import { generateUUID } from '../../utils/uuid';
import * as localStorage from '../../utils/localStorage';
import * as apiClient from '../../services/api-client';

// Mock the uuid generation for consistent testing
jest.mock('../../utils/uuid', () => ({
  generateUUID: jest.fn(() => 'mock-uuid-offline-123'),
}));

// Mock localStorage utility functions
jest.mock('../../utils/localStorage', () => ({
  loadTasksFromLocalStorage: jest.fn(),
  saveTasksToLocalStorage: jest.fn(),
}));

// Mock API client functions
jest.mock('../../services/api-client', () => ({
  taskApiClient: {
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
}));

describe('Home Page - LocalStorage & Offline Handling Integration', () => {
  const mockTask: Task = {
    id: 'mock-uuid-offline-123',
    title: 'Offline Task',
    completed: false,
    priority: Priority.Medium,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (localStorage.loadTasksFromLocalStorage as jest.Mock).mockReturnValue([]);
    (apiClient.taskApiClient.createTask as jest.Mock).mockResolvedValue(mockTask);
    (apiClient.taskApiClient.updateTask as jest.Mock).mockResolvedValue({ ...mockTask, completed: true });
    (apiClient.taskApiClient.deleteTask as jest.Mock).mockResolvedValue({});

    // Simulate online by default
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: true });
  });

  test('loads tasks from localStorage on initial render', () => {
    (localStorage.loadTasksFromLocalStorage as jest.Mock).mockReturnValue([mockTask]);
    render(<Home />);
    expect(localStorage.loadTasksFromLocalStorage).toHaveBeenCalledTimes(1);
    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
  });

  test('saves tasks to localStorage when tasks state changes', async () => {
    render(<Home />);

    const inputElement = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByRole('button', { name: /add task/i });

    fireEvent.change(inputElement, { target: { value: 'New Local Task' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(localStorage.saveTasksToLocalStorage).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ title: 'New Local Task' })])
      );
    });
  });

  test('displays offline banner when offline', async () => {
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: false });
    render(<Home />);
    expect(screen.getByText('You are currently offline. Some features may not be available.')).toBeInTheDocument();
  });

  test('does not display offline banner when online', () => {
    render(<Home />);
    expect(screen.queryByText('You are currently offline. Some features may not be available.')).not.toBeInTheDocument();
  });

  test('queues create task request when offline and processes when online', async () => {
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: false });
    render(<Home />);

    const inputElement = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByRole('button', { name: /add task/i });

    fireEvent.change(inputElement, { target: { value: 'Queued Task' } });
    fireEvent.click(addButton);

    // Expect taskApiClient.createTask not to be called immediately
    expect(apiClient.taskApiClient.createTask).not.toHaveBeenCalled();
    expect(screen.getByText('Queued Task')).toBeInTheDocument(); // Task should appear locally

    // Simulate going online
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: true });
    fireEvent(window, new Event('online'));

    await waitFor(() => {
      expect(apiClient.taskApiClient.createTask).toHaveBeenCalledTimes(1);
      expect(apiClient.taskApiClient.createTask).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Queued Task' })
      );
    });
  });

  test('queues update task request when offline and processes when online', async () => {
    // Start with a task in localStorage
    const initialTasks = [{ ...mockTask, id: 'update-1', title: 'Task to Update' }];
    (localStorage.loadTasksFromLocalStorage as jest.Mock).mockReturnValue(initialTasks);
    render(<Home />);

    // Simulate offline
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: false });

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    const titleInput = screen.getByDisplayValue('Task to Update');
    fireEvent.change(titleInput, { target: { value: 'Updated Offline' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(apiClient.taskApiClient.updateTask).not.toHaveBeenCalled();
    expect(screen.getByText('Updated Offline')).toBeInTheDocument(); // Local change reflects

    // Simulate going online
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: true });
    fireEvent(window, new Event('online'));

    await waitFor(() => {
      expect(apiClient.taskApiClient.updateTask).toHaveBeenCalledTimes(1);
      expect(apiClient.taskApiClient.updateTask).toHaveBeenCalledWith(
        'update-1',
        expect.objectContaining({ title: 'Updated Offline' })
      );
    });
  });

  test('queues delete task request when offline and processes when online', async () => {
    // Start with a task in localStorage
    const initialTasks = [{ ...mockTask, id: 'delete-1', title: 'Task to Delete' }];
    (localStorage.loadTasksFromLocalStorage as jest.Mock).mockReturnValue(initialTasks);
    render(<Home />);

    // Simulate offline
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: false });

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(apiClient.taskApiClient.deleteTask).not.toHaveBeenCalled();
    expect(screen.queryByText('Task to Delete')).not.toBeInTheDocument(); // Task removed locally

    // Simulate going online
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: true });
    fireEvent(window, new Event('online'));

    await waitFor(() => {
      expect(apiClient.taskApiClient.deleteTask).toHaveBeenCalledTimes(1);
      expect(apiClient.taskApiClient.deleteTask).toHaveBeenCalledWith('delete-1');
    });
  });
});
