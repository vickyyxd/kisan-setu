#!/usr/bin/env bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR" || exit 1

echo "🛑 Stopping Kisan Setu background process..."
npx pm2 stop ecosystem.config.js 2>/dev/null || npx pm2 stop kisan-setu 2>/dev/null
echo "✅ Kisan Setu stopped."
