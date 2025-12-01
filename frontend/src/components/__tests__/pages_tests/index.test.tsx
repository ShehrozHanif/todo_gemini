// frontend/src/pages/__tests__/index.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../../app/page'; // Adjust path if necessary based on your folder structure
import { generateUUID } from '../../utils/uuid';
import { Priority } from '../../types/task';

// Mock the uuid generation to ensure consistent test results
jest.mock('../../utils/uuid', () => ({
  generateUUID: jest.fn(() => 'mock-uuid-123'),
}));

describe('Home Page - Task CRUD Integration', () => {
  beforeEach(() => {
    (generateUUID as jest.Mock).mockClear();
    (generateUUID as jest.Mock).mockReturnValue('mock-uuid-123'); // Reset mock for each test
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('should add a new task and display it in the list', async () => {
    render(<Home />);

    const inputElement = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByRole('button', { name: /add task/i });

    // Add first task
    fireEvent.change(inputElement, { target: { value: 'Buy groceries' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(screen.getByText(Priority.Medium)).toBeInTheDocument();
    });

    // Add second task
    fireEvent.change(inputElement, { target: { value: 'Clean the house' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Clean the house')).toBeInTheDocument();
    });
  });

  test('should mark a task as completed/incomplete', async () => {
    render(<Home />);

    const inputElement = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByRole('button', { name: /add task/i });

    fireEvent.change(inputElement, { target: { value: 'Finish project' } });
    fireEvent.click(addButton);

    const taskText = await screen.findByText('Finish project');
    const checkbox = taskText.previousSibling as HTMLInputElement; // Get the checkbox associated with the task

    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  test('should edit a task title and priority', async () => {
    render(<Home />);

    const inputElement = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByRole('button', { name: /add task/i });

    fireEvent.change(inputElement, { target: { value: 'Original Task' } });
    fireEvent.click(addButton);

    const originalTaskText = await screen.findByText('Original Task');
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    const editInput = screen.getByDisplayValue('Original Task');
    fireEvent.change(editInput, { target: { value: 'Edited Task' } });

    const prioritySelect = screen.getByDisplayValue(Priority.Medium);
    fireEvent.change(prioritySelect, { target: { value: Priority.High } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.queryByDisplayValue('Original Task')).not.toBeInTheDocument();
      expect(screen.getByText('Edited Task')).toBeInTheDocument();
      expect(screen.getByText(Priority.High)).toBeInTheDocument();
    });
  });

  test('should delete a task', async () => {
    render(<Home />);

    const inputElement = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByRole('button', { name: /add task/i });

    fireEvent.change(inputElement, { target: { value: 'Task to Delete' } });
    fireEvent.click(addButton);

    await screen.findByText('Task to Delete');
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText('Task to Delete')).not.toBeInTheDocument();
    });
  });
});
