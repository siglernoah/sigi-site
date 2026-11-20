#!/usr/bin/env bash
# MCP stdio entry point used by .mcp.json: makes sure Blender is running, then starts the MCP server.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$HERE/start-blender.sh" >&2
export DISABLE_TELEMETRY=true BLENDER_MCP_DISABLE_TELEMETRY=true
exec "$HERE/.venv/bin/mcp-for-blender"
