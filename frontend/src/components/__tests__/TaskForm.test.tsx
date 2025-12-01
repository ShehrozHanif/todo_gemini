// frontend/src/components/__tests__/TaskForm.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from '../TaskForm';
import { generateUUID } from '../../utils/uuid'; // Mock this
import { Priority } from '../../types/task';

// Mock the uuid generation to ensure consistent test results
jest.mock('../../utils/uuid', () => ({
  generateUUID: jest.fn(() => 'mock-uuid-123'),
}));

describe('TaskForm', () => {
  const onAddTaskMock = jest.fn();

  beforeEach(() => {
    onAddTaskMock.mockClear();
    (generateUUID as jest.Mock).mockClear();
    (generateUUID as jest.Mock).mockReturnValue('mock-uuid-123'); // Reset mock
  });

  test('renders correctly with input field and button', () => {
    render(<TaskForm onAddTask={onAddTaskMock} />);

    expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/priority:/i)).toBeInTheDocument();
  });

  test('updates input field value on change', () => {
    render(<TaskForm onAddTask={onAddTaskMock} />);
    const inputElement = screen.getByPlaceholderText('Add a new task...');
    fireEvent.change(inputElement, { target: { value: 'New Test Task' } });
    expect(inputElement).toHaveValue('New Test Task');
  });

  test('updates priority select value on change', () => {
    render(<TaskForm onAddTask={onAddTaskMock} />);
    const selectElement = screen.getByLabelText(/priority:/i);
    fireEvent.change(selectElement, { target: { value: Priority.High } });
    expect(selectElement).toHaveValue(Priority.High);
  });

  test('calls onAddTask with new task data and clears form on valid submission', () => {
    render(<TaskForm onAddTask={onAddTaskMock} />);
    const inputElement = screen.getByPlaceholderText('Add a new task...');
    const selectElement = screen.getByLabelText(/priority:/i);
    const addButton = screen.getByRole('button', { name: /add task/i });

    fireEvent.change(inputElement, { target: { value: 'Walk the dog' } });
    fireEvent.change(selectElement, { target: { value: Priority.High } });
    fireEvent.click(addButton);

    expect(onAddTaskMock).toHaveBeenCalledTimes(1);
    expect(onAddTaskMock).toHaveBeenCalledWith({
      id: 'mock-uuid-123',
      title: 'Walk the dog',
      completed: false,
      priority: Priority.High,
      createdAt: expect.any(String), // Date.toISOString() will be a string
      updatedAt: expect.any(String),
    });
    expect(inputElement).toHaveValue(''); // Form should clear
    expect(selectElement).toHaveValue(Priority.Medium); // Priority should reset to default
  });

  test('does not call onAddTask if title is empty or just whitespace', () => {
    render(<TaskForm onAddTask={onAddTaskMock} />);
    const inputElement = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByRole('button', { name: /add task/i });

    fireEvent.change(inputElement, { target: { value: '   ' } });
    fireEvent.click(addButton);

    expect(onAddTaskMock).not.toHaveBeenCalled();
    expect(inputElement).toHaveValue('   '); // Form input should not clear if not added
  });

  test('input field has a max length of 100 characters', () => {
    render(<TaskForm onAddTask={onAddTaskMock} />);
    const inputElement = screen.getByPlaceholderText('Add a new task...');
    expect(inputElement).toHaveAttribute('maxlength', '100');
  });
});
