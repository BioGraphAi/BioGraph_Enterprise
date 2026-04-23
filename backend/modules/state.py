# Shared State for Progress Tracking (Task Based)
import time

# Dictionary to hold task progress: { task_id: { "current": 0, "total": 0, "status": "Idle", "result": None, "error": None, "last_updated": <timestamp> } }
SCAN_PROGRESS = {}

def init_task(task_id: str):
    SCAN_PROGRESS[task_id] = {
        "current": 0,
        "total": 0,
        "status": "Initializing...",
        "result": None,
        "error": None,
        "last_updated": time.time()
    }

def update_progress(task_id: str, current: int = None, total: int = None, status: str = None, result: dict = None, error: str = None):
    if task_id not in SCAN_PROGRESS:
        init_task(task_id)
    if current is not None:
        SCAN_PROGRESS[task_id]["current"] = current
    if total is not None:
        SCAN_PROGRESS[task_id]["total"] = total
    if status is not None:
        SCAN_PROGRESS[task_id]["status"] = status
    if result is not None:
        SCAN_PROGRESS[task_id]["result"] = result
    if error is not None:
        SCAN_PROGRESS[task_id]["error"] = error
    SCAN_PROGRESS[task_id]["last_updated"] = time.time()

def get_progress(task_id: str):
    return SCAN_PROGRESS.get(task_id, {"current": 0, "total": 0, "status": "Idle", "result": None, "error": None})

def cleanup_sessions():
    # Remove tasks older than 1 hour to prevent memory leaks
    current_time = time.time()
    stale_keys = [k for k, v in SCAN_PROGRESS.items() if current_time - v.get("last_updated", current_time) > 3600]
    for k in stale_keys:
        del SCAN_PROGRESS[k]