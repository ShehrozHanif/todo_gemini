// "use client"; // This is a client component

// import { useState, useMemo, useEffect } from 'react';
// import { Task, Priority } from '../src/types/task';
// import TaskForm from '../src/components/TaskForm';
// import TaskList from '../src/components/TaskList';
// import FilterControls from '../src/components/FilterControls';
// import OfflineBanner from '../src/components/OfflineBanner'; // Import OfflineBanner
// import { loadTasksFromLocalStorage, saveTasksToLocalStorage } from '../src/utils/localStorage';
// import toast from 'react-hot-toast'; // Import toast

// export default function Home() {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Pending'>('All');
//   const [priorityFilter, setPriorityFilter] = useState<'All' | Priority>('All');
//   const [currentSort, setCurrentSort] = useState<'createdAt' | 'priority'>('createdAt');

//   // Load tasks from local storage on initial render
//   useEffect(() => {
//     setTasks(loadTasksFromLocalStorage());
//   }, []);

//   // Save tasks to local storage whenever tasks state changes
//   useEffect(() => {
//     saveTasksToLocalStorage(tasks);
//   }, [tasks]);

//   const addTask = (task: Task) => {
//     setTasks((prevTasks) => {
//       toast.success(`Task "${task.title}" added!`);
//       return [...prevTasks, task];
//     });
//   };

//   const updateTask = (updatedTask: Task) => {
//     setTasks((prevTasks) => {
//       toast.success(`Task "${updatedTask.title}" updated!`);
//       return prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
//     });
//   };

//   const deleteTask = (id: string) => {
//     setTasks((prevTasks) => {
//       const deletedTask = prevTasks.find(task => task.id === id);
//       if (deletedTask) {
//         toast.success(`Task "${deletedTask.title}" deleted!`);
//       }
//       return prevTasks.filter((task) => task.id !== id);
//     });
//   };

//   const onReorderTasks = (reorderedTasks: Task[]) => {
//     setTasks(reorderedTasks);
//     toast.success('Tasks reordered!');
//   };

//   const handleStatusFilterChange = (filter: 'All' | 'Completed' | 'Pending') => {
//     setStatusFilter(filter);
//   };

//   const handlePriorityFilterChange = (filter: 'All' | Priority) => {
//     setPriorityFilter(filter);
//   };

//   const handleSortChange = (sortOption: 'createdAt' | 'priority') => {
//     setCurrentSort(sortOption);
//   };

//   const filteredAndSortedTasks = useMemo(() => {
//     let filtered = tasks;

//     // Apply status filter
//     if (statusFilter === 'Completed') {
//       filtered = filtered.filter((task) => task.completed);
//     } else if (statusFilter === 'Pending') {
//       filtered = filtered.filter((task) => !task.completed);
//     }

//     // Apply priority filter
//     if (priorityFilter !== 'All') {
//       filtered = filtered.filter((task) => task.priority === priorityFilter);
//     }

//     // Apply sorting
//     if (currentSort === 'createdAt') {
//       // Create a shallow copy to avoid modifying the original filtered array passed to sort
//       filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
//     } else if (currentSort === 'priority') {
//       const priorityOrder = { [Priority.High]: 3, [Priority.Medium]: 2, [Priority.Low]: 1 };
//       // Create a shallow copy to avoid modifying the original filtered array passed to sort
//       filtered = [...filtered].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
//     }

//     return filtered;
//   }, [tasks, statusFilter, priorityFilter, currentSort]);

//   return (
//     <>
//       <OfflineBanner /> {/* Integrated OfflineBanner */}
//       <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
//         <h1 className="text-4xl font-bold text-gray-800 mb-8">Advanced To-Do App</h1>
//         <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
//           <TaskForm onAddTask={addTask} />
//           <FilterControls
//             currentStatusFilter={statusFilter}
//             currentPriorityFilter={priorityFilter}
//             currentSort={currentSort}
//             onStatusFilterChange={handleStatusFilterChange}
//             onPriorityFilterChange={handlePriorityFilterChange}
//             onSortChange={handleSortChange}
//           />
//           <TaskList
//             tasks={filteredAndSortedTasks}
//             onUpdateTask={updateTask}
//             onDeleteTask={deleteTask}
//             onReorderTasks={onReorderTasks} // Pass the new reorder handler
//           />
//         </div>
//       </div>
//     </>
//   );
// }





"use client";

import { useState, useMemo, useEffect } from 'react';
import { Task, Priority } from '../src/types/task';
import TaskForm from '../src/components/TaskForm';
import FilterControls from '../src/components/FilterControls';
import dynamic from 'next/dynamic';
import { loadTasksFromLocalStorage, saveTasksToLocalStorage } from '../src/utils/localStorage';
import toast from 'react-hot-toast';

const DynamicOfflineBanner = dynamic(() => import('../src/components/OfflineBanner'), { ssr: false });
const DynamicTaskList = dynamic(() => import('../src/components/TaskList'), { ssr: false });

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Pending'>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | Priority>('All');
  const [currentSort, setCurrentSort] = useState<'createdAt' | 'priority'>('createdAt');

  useEffect(() => {
    setTasks(loadTasksFromLocalStorage());
  }, []);

  useEffect(() => {
    saveTasksToLocalStorage(tasks);
  }, [tasks]);

  // FIX: no toast inside setState callback!
  const addTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
    toast.success(`Task "${task.title}" added!`);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    toast.success(`Task "${updatedTask.title}" updated!`);
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => {
      const deleted = prevTasks.find((t) => t.id === id);
      if (deleted) toast.success(`Task "${deleted.title}" deleted!`);
      return prevTasks.filter((task) => task.id !== id);
    });
  };

  const onReorderTasks = (reordered: Task[]) => {
    setTasks(reordered);
    toast.success('Tasks reordered!');
  };

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...tasks];

    if (statusFilter === 'Completed') filtered = filtered.filter((t) => t.completed);
    if (statusFilter === 'Pending') filtered = filtered.filter((t) => !t.completed);

    if (priorityFilter !== 'All')
      filtered = filtered.filter((t) => t.priority === priorityFilter);

    if (currentSort === 'createdAt') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      const order = { High: 3, Medium: 2, Low: 1 };
      filtered.sort((a, b) => order[b.priority] - order[a.priority]);
    }

    return filtered;
  }, [tasks, statusFilter, priorityFilter, currentSort]);

  return (
    <>
      <DynamicOfflineBanner />

      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Advanced To-Do App</h1>

        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
          <TaskForm onAddTask={addTask} />

          <FilterControls
            currentStatusFilter={statusFilter}
            currentPriorityFilter={priorityFilter}
            currentSort={currentSort}
            onStatusFilterChange={setStatusFilter}
            onPriorityFilterChange={setPriorityFilter}
            onSortChange={setCurrentSort}
          />

          <DynamicTaskList
            tasks={filteredAndSortedTasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onReorderTasks={onReorderTasks}
          />
        </div>
      </div>
    </>
  );
}
