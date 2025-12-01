// frontend/src/components/__tests__/FilterControls.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterControls from '../FilterControls';
import { Priority } from '../../types/task';

describe('FilterControls', () => {
  const mockOnStatusFilterChange = jest.fn();
  const mockOnPriorityFilterChange = jest.fn();

  beforeEach(() => {
    mockOnStatusFilterChange.mockClear();
    mockOnPriorityFilterChange.mockClear();
  });

  test('renders status and priority filter selects', () => {
    render(
      <FilterControls
        currentStatusFilter="All"
        currentPriorityFilter="All"
        onStatusFilterChange={mockOnStatusFilterChange}
        onPriorityFilterChange={mockOnPriorityFilterChange}
      />
    );

    expect(screen.getByLabelText('Filter by Status:')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by Priority:')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'All' })).toBeInTheDocument(); // For status
    expect(screen.getByRole('option', { name: 'Low' })).toBeInTheDocument(); // For priority
  });

  test('calls onStatusFilterChange when status filter is changed', () => {
    render(
      <FilterControls
        currentStatusFilter="All"
        currentPriorityFilter="All"
        onStatusFilterChange={mockOnStatusFilterChange}
        onPriorityFilterChange={mockOnPriorityFilterChange}
      />
    );

    const statusSelect = screen.getByLabelText('Filter by Status:');
    fireEvent.change(statusSelect, { target: { value: 'Completed' } });

    expect(mockOnStatusFilterChange).toHaveBeenCalledTimes(1);
    expect(mockOnStatusFilterChange).toHaveBeenCalledWith('Completed');
  });

  test('calls onPriorityFilterChange when priority filter is changed', () => {
    render(
      <FilterControls
        currentStatusFilter="All"
        currentPriorityFilter="All"
        onStatusFilterChange={mockOnStatusFilterChange}
        onPriorityFilterChange={mockOnPriorityFilterChange}
      />
    );

    const prioritySelect = screen.getByLabelText('Filter by Priority:');
    fireEvent.change(prioritySelect, { target: { value: Priority.High } });

    expect(mockOnPriorityFilterChange).toHaveBeenCalledTimes(1);
    expect(mockOnPriorityFilterChange).toHaveBeenCalledWith(Priority.High);
  });

  test('displays correct initial filter values', () => {
    render(
      <FilterControls
        currentStatusFilter="Pending"
        currentPriorityFilter={Priority.Low}
        onStatusFilterChange={mockOnStatusFilterChange}
        onPriorityFilterChange={mockOnPriorityFilterChange}
      />
    );

    expect(screen.getByLabelText('Filter by Status:')).toHaveValue('Pending');
    expect(screen.getByLabelText('Filter by Priority:')).toHaveValue(Priority.Low);
  });
});
