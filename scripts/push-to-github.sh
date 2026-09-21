#!/usr/bin/env bash

# Kisan Setu - GitHub Push Automation Script
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR" || exit 1

echo "======================================================"
echo "🌾 KISAN SETU — PUSH TO GITHUB REPOSITORY"
echo "======================================================"
echo "Author: Vicky Kumar (Team White Raven, GBPIET)"
echo "PS Code: SIH26032"
echo "======================================================"
echo ""

# 1. Initialize git if not initialized
if [ ! -d ".git" ]; then
  echo "📦 Initializing local Git repository..."
  git init
  git branch -M main
fi

# 2. Stage all project files
echo "📝 Staging all codebase files..."
git add .

# 3. Commit
COMMIT_MSG="feat: complete Kisan Setu smart procurement platform (SIH26032)"
git commit -m "$COMMIT_MSG" 2>/dev/null || echo "ℹ️  No new changes to commit."

# 4. Check remote
REMOTE_URL=$(git remote get-url origin 2>/dev/null)

if [ -z "$REMOTE_URL" ]; then
  if [ -n "$1" ]; then
    REMOTE_URL="$1"
    git remote add origin "$REMOTE_URL"
    echo "🔗 Added remote origin: $REMOTE_URL"
  else
    echo "💡 Enter your GitHub Repository URL:"
    echo "   (Example: https://github.com/vickeykumar1205/kisan-setu.git)"
    echo "   (Or:      git@github.com:vickeykumar1205/kisan-setu.git)"
    read -r -p "Repository URL: " USER_REPO
    if [ -n "$USER_REPO" ]; then
      git remote add origin "$USER_REPO"
      REMOTE_URL="$USER_REPO"
      echo "🔗 Added remote origin: $REMOTE_URL"
    else
      echo "⚠️  No URL provided. You can run manually later:"
      echo "   git remote add origin <your-repo-url>"
      echo "   git push -u origin main"
      exit 0
    fi
  fi
fi

# 5. Push to main branch
echo ""
echo "🚀 Pushing codebase to $REMOTE_URL (branch: main)..."
git push -u origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "======================================================"
  echo "🎉 SUCCESS! Codebase successfully pushed to GitHub!"
  echo "======================================================"
else
  echo ""
  echo "⚠️  If push failed due to remote permissions or existing README, run:"
  echo "   git push -u origin main --force"
fi
