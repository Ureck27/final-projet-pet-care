#!/bin/bash

echo "🚀 Connecting your unzipped project to GitHub (HTTPS)..."

# ========================

# CONFIG

# ========================

REPO_URL="https://github.com/Ureck27/final-projet-pet-care.git"

# ========================

# STEP 1: CHECK / INIT GIT

# ========================

if [ ! -d ".git" ]; then
echo "📁 No .git found → initializing..."
git init
else
echo "✅ .git already exists"
fi

# ========================

# STEP 2: ADD & COMMIT

# ========================

echo "📦 Adding files..."
git add .

echo "📝 Committing..."
git commit -m "Upload project after unzip" || echo "⚠️ Nothing to commit"

# ========================

# STEP 3: CONNECT REMOTE

# ========================

echo "🔗 Setting remote origin..."
git remote remove origin 2>/dev/null
git remote add origin $REPO_URL

# ========================

# STEP 4: PUSH

# ========================

echo "🚀 Pushing to GitHub..."
git branch -M main
git push -u origin main || {
echo "⚠️ Conflict detected → fixing..."
git pull origin main --allow-unrelated-histories
git push -u origin main
}

echo "🎉 DONE! Your project is now on GitHub (HTTPS)."

