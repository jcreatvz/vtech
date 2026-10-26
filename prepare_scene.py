#!/usr/bin/env python3
"""Restore the exact Spline export from the repository's transfer-safe parts."""
from pathlib import Path
import hashlib

ROOT = Path(__file__).resolve().parent
TARGET = ROOT / 'dist/assets/scene.splinecode'
EXPECTED = 'ed506348f4f774de66c6def0b8b79dcc5bc83b02eab6e61e3ffb2f4822cd5c53'

def restore():
    if TARGET.exists() and hashlib.sha256(TARGET.read_bytes()).hexdigest() == EXPECTED:
        print('Spline scene is ready.')
        return
    parts = [ROOT / 'source-assets/spline' / f'scene.part{i:02d}' for i in range(40)]
    missing = [str(p.relative_to(ROOT)) for p in parts if not p.is_file()]
    if missing:
        raise SystemExit('Missing scene parts. Download the complete repository ZIP.\n' + '\n'.join(missing))
    data = b''.join(p.read_bytes() for p in parts)
    if hashlib.sha256(data).hexdigest() != EXPECTED:
        raise SystemExit('Scene checksum failed; no output was written.')
    TARGET.parent.mkdir(parents=True, exist_ok=True)
    TARGET.write_bytes(data)
    print('Restored the complete, verified Spline scene.')

if __name__ == '__main__':
    restore()
