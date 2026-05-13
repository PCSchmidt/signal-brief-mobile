import os
import sys
from pathlib import Path


os.environ.setdefault("SIGNAL_BRIEF_APP_ENV", "test")
os.environ.setdefault("SIGNAL_BRIEF_WARM_DIGEST_ON_STARTUP", "false")


BACKEND_ROOT = Path(__file__).resolve().parents[1]

if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))