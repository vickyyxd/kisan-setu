#!/usr/bin/env bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR" || exit 1

LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1")

echo "======================================================"
echo "🌾 KISAN SETU — BACKGROUND STATUS"
echo "======================================================"
echo "   Local:   http://localhost:5001"
echo "   Network: http://$LOCAL_IP:5001"
echo "======================================================"
npx pm2 status kisan-setu
echo ""
echo "Recent Logs:"
echo "------------------------------------------------------"
tail -n 8 "$ROOT_DIR/server.log" 2>/dev/null || echo "No logs yet."
echo "------------------------------------------------------"
