#!/usr/bin/env bash
# Start Blender (with its UI) on a virtual display so the MCP add-on can listen on 127.0.0.1:9876.
# Safe to run repeatedly: does nothing if the socket is already up.
set -euo pipefail
PORT="${BLENDER_PORT:-9876}"
up() { (echo > "/dev/tcp/127.0.0.1/$PORT") 2>/dev/null; }
if up; then echo "Blender MCP socket already listening on $PORT"; exit 0; fi
command -v blender >/dev/null || { echo "blender not on PATH (see tools/3d/README.md)" >&2; exit 1; }
LOG="${TMPDIR:-/tmp}/blender-mcp-gui.log"
DISABLE_TELEMETRY=true BLENDER_MCP_DISABLE_TELEMETRY=true \
  setsid nohup xvfb-run -a -s "-screen 0 1600x1000x24" blender >"$LOG" 2>&1 < /dev/null &
for _ in $(seq 1 60); do up && { echo "Blender MCP socket up on $PORT (log: $LOG)"; exit 0; }; sleep 1; done
echo "Blender did not open port $PORT within 60s; see $LOG" >&2; exit 1
