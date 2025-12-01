// backend/src/api/tasks/route.ts
import { NextResponse } from 'next/server';
import { Task, Priority } from '../../types/task'; // Assuming types are shared or re-defined for backend
import { generateUUID } from '../../../frontend/src/utils/uuid'; // Re-using frontend UUID generator for now
import { validateTaskCreation } from '../../utils/validation';

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

export async function GET() {
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const { title, priority }: { title: string; priority: Priority } = await request.json();

  const validation = validateTaskCreation(title, priority);
  if (!validation.isValid) {
    return NextResponse.json({ message: validation.message }, { status: 400 });
  }

  const now = new Date().toISOString();
  const newTask: Task = {
    id: generateUUID(), // Re-using frontend UUID generator for now
    title: title.trim(),
    completed: false,
    priority,
    createdAt: now,
    updatedAt: now,
  };

  tasks.push(newTask);
  return NextResponse.json(newTask, { status: 201 });
}