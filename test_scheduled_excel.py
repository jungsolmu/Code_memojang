import datetime
import tempfile
from pathlib import Path

from scheduled_excel import create_excel_file, seconds_until_target


# Functional smoke test for file creation.
with tempfile.TemporaryDirectory() as tmp:
    created = create_excel_file(base_dir=tmp)
    assert created.exists(), "Excel file was not created"
    assert created.parent == Path(tmp)

# Time calculation checks.
now = datetime.datetime(2026, 4, 1, 16, 0, 0)
assert seconds_until_target(now, 16, 30) == 1800

now_after = datetime.datetime(2026, 4, 1, 16, 31, 0)
assert seconds_until_target(now_after, 16, 30) == (23 * 3600 + 59 * 60)

print("All checks passed")
