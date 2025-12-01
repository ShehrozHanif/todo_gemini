// frontend/src/services/api-client.ts
import { Task } from '../types/task';

// Placeholder for API endpoint - replace with actual backend API base URL
const API_BASE_URL = '/api/tasks';

// Type for queued requests
interface QueuedRequest {
  method: string;
  url: string;
  data?: any;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

// Queue for offline requests
let requestQueue: QueuedRequest[] = [];

// Define a type for the expected API error structure
interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  // Add other common error properties if known
}

// Helper function to safely parse error response
async function parseErrorResponse(response: Response): Promise<ApiErrorResponse | string> {
  try {
    const text = await response.text();
    if (!text) {
      return `API error: ${response.status} ${response.statusText}`;
    }
    const json = JSON.parse(text);
    return json; // Assuming the JSON contains a message property
  } catch (parseError) {
    // If text is not valid JSON, return the raw text or a generic message
    return text || `API error: ${response.status} ${response.statusText}`;
  }
}

/**
 * Sends a single request.
 * @param {string} method HTTP method (GET, POST, PUT, DELETE).
 * @param {string} url The URL to send the request to.
 * @param {any} data The request payload (for POST, PUT).
 * @returns {Promise<any>} The response data.
 */
async function sendRequest(method: string, url: string, data?: any): Promise<any> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorBody = await parseErrorResponse(response);
    const errorMessage = typeof errorBody === 'string'
      ? errorBody
      : errorBody.message || `API error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  // Handle cases where response might be 204 No Content
  if (response.status === 204) {
    return {};
  }

  try {
    return await response.json();
  } catch (error) {
    console.error("Error parsing successful response JSON:", error);
    throw new Error(`Failed to parse response from ${url}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Processes the queue of failed/offline requests.
 */
async function processQueue(): Promise<void> {
  if (typeof window !== 'undefined' && navigator.onLine && requestQueue.length > 0) {
    console.log(`Online again, processing ${requestQueue.length} queued requests.`);
    const failedRequests: QueuedRequest[] = [];

    for (const req of requestQueue) {
      try {
        const result = await sendRequest(req.method, req.url, req.data);
        req.resolve(result);
      } catch (error: unknown) { // Explicitly type error as unknown
        console.error('Failed to process queued request:', req, error);
        failedRequests.push(req); // Re-add to failed queue
      }
    }
    requestQueue = failedRequests; // Keep only requests that still failed
    if (requestQueue.length > 0) {
      console.warn(`${requestQueue.length} requests failed during queue processing.`);
    }
  }
}

// Listen for online/offline events to process the queue
if (typeof window !== 'undefined') {
  window.addEventListener('online', processQueue);
}

/**
 * Generic API client function that handles offline queueing.
 * @param {string} method HTTP method.
 * @param {string} endpoint API endpoint (e.g., '/tasks').
 * @param {any} data Request body.
 * @returns {Promise<any>} Response data.
 */
async function apiCall(method: string, endpoint: string, data?: any): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;

  if (typeof window !== 'undefined' && !navigator.onLine && method !== 'GET') { // Don't queue GETs as they might return stale data
    return new Promise<any>((resolve, reject) => {
      requestQueue.push({ method, url, data, resolve, reject });
      console.warn(`Offline: Request ${method} ${url} queued.`);
    });
  }

  return sendRequest(method, url, data);
}

// Task-specific API functions
export const taskApiClient = {
  getTasks: (): Promise<Task[]> => apiCall('GET', '/'),
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => apiCall('POST', '/', task),
  updateTask: (id: string, task: Partial<Task>): Promise<Task> => apiCall('PUT', `/${id}`, task),
  deleteTask: (id: string): Promise<void> => apiCall('DELETE', `/${id}`),
};

// Initial processing attempt in case we start offline and come online later
if (typeof window !== 'undefined') {
  processQueue();
}

