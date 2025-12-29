import uuid
import time
from typing import Dict, Any

# In-memory store for task progress
# Format: { "task_id": { "status": "Processing", "progress": 0, "result": None, "error": None, "timestamp": 12345 } }
TASKS: Dict[str, Any] = {}

def create_task() -> str:
    """Creates a new task and returns its ID. Also performs lazy cleanup of old tasks."""
    # Lazy cleanup: Check for old tasks every time a new one is created
    cleanup_old_tasks()

    task_id = str(uuid.uuid4())
    TASKS[task_id] = {
        "status": "Initializing",
        "progress": 0,
        "result": None,
        "error": None,
        "timestamp": time.time()
    }
    return task_id

def update_progress(task_id: str, progress: int, status: str):
    """Updates the progress of a specific task."""
    if task_id in TASKS:
        TASKS[task_id]["progress"] = progress
        TASKS[task_id]["status"] = status

def set_task_result(task_id: str, result: Any):
    """Sets the final result of the task."""
    if task_id in TASKS:
        TASKS[task_id]["result"] = result
        TASKS[task_id]["progress"] = 100
        TASKS[task_id]["status"] = "Completed"

def set_task_error(task_id: str, error: str):
    """Sets an error for the task."""
    if task_id in TASKS:
        TASKS[task_id]["error"] = error
        TASKS[task_id]["status"] = "Failed"

def get_task_status(task_id: str) -> Dict[str, Any]:
    """Retrieves the status of a task."""
    return TASKS.get(task_id, {"error": "Task not found"})

def cleanup_old_tasks(max_age_seconds: int = 3600):
    """Removes tasks older than max_age_seconds."""
    current_time = time.time()
    # Create list of keys to delete to avoid modifying dict while iterating
    to_delete = [
        tid for tid, task in TASKS.items()
        if current_time - task["timestamp"] > max_age_seconds
    ]
    for tid in to_delete:
        del TASKS[tid]
