// frontend/src/components/FilterControls.tsx
import React from 'react';
import { Priority } from '../types/task';

interface FilterControlsProps {
  currentStatusFilter: 'All' | 'Completed' | 'Pending';
  currentPriorityFilter: 'All' | Priority;
  currentSort: 'createdAt' | 'priority'; // New prop for current sort selection
  onStatusFilterChange: (filter: 'All' | 'Completed' | 'Pending') => void;
  onPriorityFilterChange: (filter: 'All' | Priority) => void;
  onSortChange: (sortOption: 'createdAt' | 'priority') => void; // New prop for sort change handler
}

const FilterControls: React.FC<FilterControlsProps> = ({
  currentStatusFilter,
  currentPriorityFilter,
  currentSort,
  onStatusFilterChange,
  onPriorityFilterChange,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-gray-100 rounded-lg shadow-md mb-4">
      <div className="flex-1">
        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Status:</label>
        <select
          id="status-filter"
          value={currentStatusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as 'All' | 'Completed' | 'Pending')}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <div className="flex-1">
        <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Priority:</label>
        <select
          id="priority-filter"
          value={currentPriorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value as 'All' | Priority)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="All">All</option>
          {Object.values(Priority).map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 sm:w-auto">
        <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">Sort by:</label>
        <select
          id="sort-by"
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as 'createdAt' | 'priority')}
          className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md min-w-max flex-shrink-0"
        >
          <option value="createdAt">Creation Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
    </div>
  );
};

export default FilterControls;
