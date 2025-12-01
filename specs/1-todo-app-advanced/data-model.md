# Data Model: Advanced To-Do App

## Entity: Task

Represents a single To-Do item.

### Fields

| Field Name | Type               | Description                                   | Constraints                                     |
|------------|--------------------|-----------------------------------------------|-------------------------------------------------|
| `id`       | `string` (UUIDv4)  | Unique identifier for the task.               | Required, Unique                                |
| `title`    | `string`           | The description or name of the task.          | Required, 1-100 characters, Unique (optional warning) |
| `completed`| `boolean`          | Indicates if the task is completed.           | Required, Default: `false`                      |
| `priority` | `string`           | The urgency level of the task.                | Required, Enum: `Low`, `Medium`, `High`         |
| `createdAt`| `ISO timestamp`    | Timestamp when the task was created.          | Required, Auto-generated                        |
| `updatedAt`| `ISO timestamp`    | Timestamp when the task was last updated.     | Required, Auto-updated                          |

### Relationships

*   **None**: `Task` is a standalone entity in this initial data model.

### Validation Rules (Derived from Spec)

*   `id`: Must be a valid UUIDv4.
*   `title`:
    *   Cannot be empty.
    *   Maximum length: 100 characters.
    *   (Optional) Should be unique to prevent duplicate task titles, but a warning can be shown instead of strict prevention.
*   `completed`: Must be a boolean value.
*   `priority`: Must be one of "Low", "Medium", "High".
*   `createdAt`: Must be a valid ISO timestamp.
*   `updatedAt`: Must be a valid ISO timestamp.

### State Transitions (Implicit)

*   A task can transition from `completed: false` to `completed: true` and vice-versa.
*   The `priority` of a task can change at any time.
*   `updatedAt` timestamp is updated on any modification to the task.
