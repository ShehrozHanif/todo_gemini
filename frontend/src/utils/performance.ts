export function logPerformance(operationName: string, callback: () => void) {
  const start = performance.now();
  callback();
  const end = performance.now();
  console.log(`${operationName} took ${end - start}ms`);
}

export async function logPerformanceAsync<T>(operationName: string, callback: () => Promise<T>): Promise<T> {
  const start = performance.now();
  const result = await callback();
  const end = performance.now();
  console.log(`${operationName} took ${end - start}ms`);
  return result;
}
