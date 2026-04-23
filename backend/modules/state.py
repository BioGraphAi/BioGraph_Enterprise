import time
from modules.logger import logger

# Dictionary to hold task progress
# { task_id: { "current": 0, "total": 0, "status": "Idle", "result": None, "error": None, "last_updated": <timestamp> } }
SCAN_PROGRESS = {}

def init_task(task_id: str):
    # Auto-cleanup on new task creation to prevent memory leaks
    cleanup_sessions()
    
    SCAN_PROGRESS[task_id] = {
        "current": 0,
        "total": 0,
        "status": "Initializing...",
        "result": None,
        "error": None,
        "last_updated": time.time()
    }
    logger.info(f"Task Initialized: {task_id}")

def update_progress(task_id: str, current: int = None, total: int = None, status: str = None, result: dict = None, error: str = None):
    if task_id not in SCAN_PROGRESS:
        init_task(task_id)
    
    task = SCAN_PROGRESS[task_id]
    if current is not None: task["current"] = current
    if total is not None: task["total"] = total
    if status is not None: task["status"] = status
    if result is not None: task["result"] = result
    if error is not None: task["error"] = error
    
    task["last_updated"] = time.time()
    
    if error:
        logger.error(f"Task {task_id} FAILED: {error}")
    elif status == "Done":
        logger.info(f"Task {task_id} COMPLETED successfully.")

def get_progress(task_id: str):
    return SCAN_PROGRESS.get(task_id, {"current": 0, "total": 0, "status": "Idle", "result": None, "error": None})

def cleanup_sessions():
    """
    Remove tasks older than 30 minutes to manage memory.
    """
    current_time = time.time()
    # 1800 seconds = 30 minutes
    stale_keys = [k for k, v in SCAN_PROGRESS.items() if current_time - v.get("last_updated", 0) > 1800]
    for k in stale_keys:
        logger.info(f"Cleaning up stale task: {k}")
        del SCAN_PROGRESS[k]