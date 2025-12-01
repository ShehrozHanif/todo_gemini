// backend/src/api/tasks/[id]/route.ts
import { NextResponse } from 'next/server';
import { Task, Priority } from '../../../frontend/src/types/task'; // Assuming types are shared or re-defined for backend
import { generateUUID } from '../../../frontend/src/utils/uuid'; // Re-using frontend UUID generator for now
import { validateTaskUpdate } from '../../utils/validation';

// In-memory "database" for demonstration purposes
let tasks: Task[] = [
  {
    id: '1',
    title: 'Learn Next.js',
    completed: false,
    priority: Priority.High,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Build To-Do App',
    completed: false,
    priority: Priority.Medium,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Deploy to Vercel',
    completed: false,
    priority: Priority.Low,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const task = tasks.find((t) => t.id === id);

  if (task) {
    return NextResponse.json(task);
  } else {
    return NextResponse.json({ message: 'Task not found' }, { status: 404 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const updateData: Partial<Task> = await request.json();

  const validation = validateTaskUpdate(updateData);
  if (!validation.isValid) {
    return NextResponse.json({ message: validation.message }, { status: 400 });
  }

  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex !== -1) {
    const updatedTask = { ...tasks[taskIndex], ...updateData };
    updatedTask.updatedAt = new Date().toISOString();
    tasks[taskIndex] = updatedTask;
    return NextResponse.json(updatedTask);
  } else {
    return NextResponse.json({ message: 'Task not found' }, { status: 404 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const initialLength = tasks.length;
  tasks = tasks.filter((t) => t.id !== id);

  if (tasks.length < initialLength) {
    return new NextResponse(null, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Task not found' }, { status: 404 });
  }
}
