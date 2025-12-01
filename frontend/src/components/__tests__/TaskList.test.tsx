// frontend/src/components/__tests__/TaskList.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from '../TaskList';
import { Task, Priority } from '../../types/task';
import TaskItem from '../TaskItem'; // Assuming TaskItem is properly mocked if needed

// Mock TaskItem to simplify TaskList tests, focusing only on rendering logic
jest.mock('../TaskItem', () => {
  return jest.fn(({ task, onUpdateTask, onDeleteTask }) => (
    <div data-testid={`task-item-${task.id}`}>
      <span>{task.title}</span>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onUpdateTask({ ...task, completed: !task.completed })}
      />
      <button onClick={() => onDeleteTask(task.id)}>Delete</button>
    </div>
  ));
});

describe('TaskList', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      completed: false,
      priority: Priority.Medium,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Task 2',
      completed: true,
      priority: Priority.High,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const onUpdateTaskMock = jest.fn();
  const onDeleteTaskMock = jest.fn();

  beforeEach(() => {
    onUpdateTaskMock.mockClear();
    onDeleteTaskMock.mockClear();
    (TaskItem as jest.Mock).mockClear();
  });

  test('renders a message when there are no tasks', () => {
    render(
      <TaskList tasks={[]} onUpdateTask={onUpdateTaskMock} onDeleteTask={onDeleteTaskMock} />
    );
    expect(screen.getByText('No tasks yet. Add one above!')).toBeInTheDocument();
  });

  test('renders all provided tasks using TaskItem component', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onUpdateTask={onUpdateTaskMock}
        onDeleteTask={onDeleteTaskMock}
      />
    );

    expect(TaskItem).toHaveBeenCalledTimes(mockTasks.length);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByTestId('task-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('task-item-2')).toBeInTheDocument();
  });

  test('passes correct props to TaskItem components', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onUpdateTask={onUpdateTaskMock}
        onDeleteTask={onDeleteTaskMock}
      />
    );

    expect(TaskItem).toHaveBeenCalledWith(
      expect.objectContaining({ task: mockTasks[0], onUpdateTask: onUpdateTaskMock, onDeleteTask: onDeleteTaskMock }),
      {}
    );
    expect(TaskItem).toHaveBeenCalledWith(
      expect.objectContaining({ task: mockTasks[1], onUpdateTask: onUpdateTaskMock, onDeleteTask: onDeleteTaskMock }),
      {}
    );
  });

  test('TaskItem checkbox toggle triggers onUpdateTask', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onUpdateTask={onUpdateTaskMock}
        onDeleteTask={onDeleteTaskMock}
      />
    );
    const checkbox = screen.getAllByRole('checkbox')[0]; // First task's checkbox
    fireEvent.click(checkbox);
    expect(onUpdateTaskMock).toHaveBeenCalledWith(
      expect.objectContaining({ ...mockTasks[0], completed: true })
    );
  });

  test('TaskItem delete button triggers onDeleteTask', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onUpdateTask={onUpdateTaskMock}
        onDeleteTask={onDeleteTaskMock}
      />
    );
    const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0]; // First task's delete button
    fireEvent.click(deleteButton);
    expect(onDeleteTaskMock).toHaveBeenCalledWith(mockTasks[0].id);
  });
});
