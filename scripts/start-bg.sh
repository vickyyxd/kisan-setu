#!/usr/bin/env bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR" || exit 1

echo "🚀 Starting Kisan Setu in background via PM2..."
npx pm2 start ecosystem.config.js

LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1")

echo ""
echo "======================================================"
echo "🌾 KISAN SETU IS RUNNING IN BACKGROUND!"
echo "======================================================"
echo "   Local URL:   http://localhost:5001"
echo "   Network URL: http://$LOCAL_IP:5001  (Open on Phone/WiFi)"
echo "   Process:     PM2 Daemon"
echo "======================================================"
echo "💡 Commands:"
echo "   npm run bg:status  -> Check status"
echo "   npm run bg:logs    -> View live logs"
echo "   npm run bg:stop    -> Stop background server"
echo "   npm run tunnel     -> Get public internet link"
echo "======================================================"
