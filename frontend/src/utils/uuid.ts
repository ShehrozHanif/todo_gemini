// frontend/src/utils/uuid.ts

/**
 * Generates a UUID (Universally Unique Identifier) version 4.
 * A UUID is a 128-bit number used to uniquely identify information in computer systems.
 * Version 4 UUIDs are generated using random numbers.
 *
 * This implementation is simplified for demonstration purposes and should be replaced
 * with a robust library like 'uuid' in a production environment for better randomness
 * and adherence to RFC 4122.
 *
 * @returns {string} A randomly generated UUID v4 string.
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
