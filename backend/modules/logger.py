import logging
import sys
import os

def setup_logger(name="BioGraph"):
    """
    Configures a professional logger with console and file output.
    """
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    # Avoid duplicate handlers
    if logger.handlers:
        return logger

    # Formatting
    formatter = logging.Formatter(
        '%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    # Console Handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # File Handler (Optional: Save logs to file)
    log_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "logs")
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    
    file_handler = logging.FileHandler(os.path.join(log_dir, "app.log"))
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    return logger

# Global instance
logger = setup_logger()
