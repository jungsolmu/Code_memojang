import datetime
import os
import time
from pathlib import Path

from openpyxl import Workbook


def create_excel_file(base_dir: str | None = None) -> Path:
    """Create an Excel file named hello_YYYY-MM-DD.xlsx with '안녕하세요' in A1.

    Args:
        base_dir: Directory where the file will be created.
                  Defaults to ~/Desktop.

    Returns:
        Path to the created file.
    """
    desktop_path = Path(base_dir) if base_dir else Path.home() / "Desktop"
    desktop_path.mkdir(parents=True, exist_ok=True)

    today = datetime.date.today().strftime("%Y-%m-%d")
    file_path = desktop_path / f"hello_{today}.xlsx"

    wb = Workbook()
    ws = wb.active
    ws["A1"] = "안녕하세요"
    wb.save(file_path)

    return file_path


def seconds_until_target(now: datetime.datetime, hour: int = 16, minute: int = 30) -> float:
    """Return seconds from `now` to the next target HH:MM."""
    target_time = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
    if now > target_time:
        target_time += datetime.timedelta(days=1)
    return (target_time - now).total_seconds()


def run_scheduler(hour: int = 16, minute: int = 30, base_dir: str | None = None) -> None:
    """Run forever and create one file daily at the target time."""
    while True:
        now = datetime.datetime.now()
        sleep_seconds = seconds_until_target(now, hour=hour, minute=minute)
        print(f"다음 실행까지 대기: {sleep_seconds / 3600:.2f} 시간")
        time.sleep(max(sleep_seconds, 0))

        try:
            path = create_excel_file(base_dir=base_dir)
            print(f"파일 생성 완료: {path}")
        except Exception as e:  # noqa: BLE001 - intentionally broad for scheduler resilience
            print(f"오류 발생: {e}")


if __name__ == "__main__":
    run_scheduler()
