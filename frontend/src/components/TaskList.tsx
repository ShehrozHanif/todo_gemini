// frontend/src/components/TaskList.tsx
import React from 'react';
import { Task } from '../types/task';
import TaskItem from './TaskItem';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (id: string) => void;
  onReorderTasks: (reorderedTasks: Task[]) => void; // New prop for reordering
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdateTask, onDeleteTask, onReorderTasks }) => {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);

    onReorderTasks(reorderedTasks);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="task-list">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-gray-500 text-center">No tasks yet. Add one above!</p>
            ) : (
              tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        // Add some basic styling for dragging feedback
                        backgroundColor: snapshot.isDragging ? 'lightgreen' : 'white',
                        borderRadius: '0.5rem',
                        boxShadow: snapshot.isDragging ? '0 4px 8px rgba(0,0,0,0.2)' : 'none',
                        transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                      }}
                    >
                      <TaskItem
                        task={task}
                        onUpdateTask={onUpdateTask}
                        onDeleteTask={onDeleteTask}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TaskList;
