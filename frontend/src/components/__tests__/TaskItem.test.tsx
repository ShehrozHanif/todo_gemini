// frontend/src/components/__tests__/TaskItem.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskItem from '../TaskItem';
import { Task, Priority } from '../../types/task';

describe('TaskItem', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    completed: false,
    priority: Priority.Medium,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const onUpdateTaskMock = jest.fn();
  const onDeleteTaskMock = jest.fn();

  beforeEach(() => {
    onUpdateTaskMock.mockClear();
    onDeleteTaskMock.mockClear();
  });

  test('renders task title, completion status, and priority badge', () => {
    render(
      <TaskItem
        task={mockTask}
        onUpdateTask={onUpdateTaskMock}
        onDeleteTask={onDeleteTaskMock}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: '' })).not.toBeChecked();
    expect(screen.getByText(Priority.Medium)).toBeInTheDocument();
  });

  test('calls onUpdateTask when checkbox is toggled', () => {
    render(
      <TaskItem
        task={mockTask}
        onUpdateTask={onUpdateTaskMock}
        onDeleteTask={onDeleteTaskMock}
      />
    );
    const checkbox = screen.getByRole('checkbox', { name: '' });
    fireEvent.click(checkbox);

    expect(onUpdateTaskMock).toHaveBeenCalledTimes(1);
    expect(onUpdateTaskMock).toHaveBeenCalledWith(
      expect.objectContaining({ ...mockTask, completed: true })
    );
  });

  test('enters edit mode when Edit button is clicked', () => {
    render(
      <TaskItem
        task={mockTask}
        onUpdateTask={onUpdateTaskMock}
        onDeleteTask={onDeleteTaskMock}
      />
    );
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue(Priority.Medium)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });

  test('calls onUpdateTask and exits edit mode on Save with changes', () => {
    render(
      <TaskItem
        task={mockTask}
        onUpdateTask={onUpdateTaskMock}
        onDeleteTask={onDeleteTaskMock}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    const titleInput = screen.getByDisplayValue('Test Task');
    fireEvent.change(titleInput, { target: { value: 'Updated Task Title' } });

    const prioritySelect = screen.getByDisplayValue(Priority.Medium);
    fireEvent.change(prioritySelect, { target: { value: Priority.High } });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(onUpdateTaskMock).toHaveBeenCalledTimes(1);
    expect(onUpdateTaskMock).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockTask,
        title: 'Updated Task Title',
        priority: Priority.High,
      })
    );
    expect(screen.queryByDisplayValue('Updated Task Title')).not.toBeInTheDocument(); // Exited edit mode
    expect(screen.getByText('Updated Task Title')).toBeInTheDocument(); // Displaying updated title
  });

  test('does not call onUpdateTask on Save if no changes were made', () => {
    render(
      <TaskItem
        task={mockTask}
        onUpdateTask={onUpdateTaskMock}
        onDeleteTask={onDeleteTaskMock}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(onUpdateTaskMock).not.toHaveBeenCalled();
    expect(screen.getByText('Test Task')).toBeInTheDocument(); // Exited edit mode
  });

  test('exits edit mode and reverts changes on Cancel', () => {
    render(
      <TaskItem
        task={mockTask}
        onUpdateTask={onUpdateTaskMock}
        onDeleteTask={onDeleteTaskMock}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    const titleInput = screen.getByDisplayValue('Test Task');
    fireEvent.change(titleInput, { target: { value: 'Changed Title' } });
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onUpdateTaskMock).not.toHaveBeenCalled();
    expect(screen.queryByDisplayValue('Changed Title')).not.toBeInTheDocument(); // Exited edit mode
    expect(screen.getByText('Test Task')).toBeInTheDocument(); // Reverted to original title
  });

  test('calls onDeleteTask when Delete button is clicked', () => {
    render(
      <TaskItem
        task={mockTask}
        onUpdateTask={onUpdateTaskMock}
        onDeleteTask={onDeleteTaskMock}
      />
    );
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(onDeleteTaskMock).toHaveBeenCalledTimes(1);
    expect(onDeleteTaskMock).toHaveBeenCalledWith(mockTask.id);
  });

  test('applies line-through style when task is completed', () => {
    const completedTask = { ...mockTask, completed: true };
    render(
      <TaskItem
        task={completedTask}
        onUpdateTask={onUpdateTaskMock}
        onDeleteTask={onDeleteTaskMock}
      />
    );
    const titleSpan = screen.getByText(completedTask.title);
    expect(titleSpan).toHaveClass('line-through');
  });

  test('priority badge shows correct color class', () => {
    const lowPriorityTask = { ...mockTask, priority: Priority.Low };
    const mediumPriorityTask = { ...mockTask, priority: Priority.Medium };
    const highPriorityTask = { ...mockTask, priority: Priority.High };

    const { rerender } = render(<TaskItem task={lowPriorityTask} onUpdateTask={onUpdateTaskMock} onDeleteTask={onDeleteTaskMock} />);
    expect(screen.getByText(Priority.Low)).toHaveClass('bg-green-200');

    rerender(<TaskItem task={mediumPriorityTask} onUpdateTask={onUpdateTaskMock} onDeleteTask={onDeleteTaskMock} />);
    expect(screen.getByText(Priority.Medium)).toHaveClass('bg-yellow-200');

    rerender(<TaskItem task={highPriorityTask} onUpdateTask={onUpdateTaskMock} onDeleteTask={onDeleteTaskMock} />);
    expect(screen.getByText(Priority.High)).toHaveClass('bg-red-200');
  });
});
