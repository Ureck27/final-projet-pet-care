#!/bin/bash

# ---------------------------
# CONFIGURE THESE
# ---------------------------
REPO_URL="https://github.com/Ureck27/final-projet-pet-care.git"
NEW_BRANCH="my-feature-branch"  # change this to whatever branch name you want

# ---------------------------
# GO TO PROJECT FOLDER
# ---------------------------
echo "Step 1: Ensure you are in your project folder"
cd "$(pwd)"  # assumes you run this from project root

# ---------------------------
# INITIALIZE GIT IF NEEDED
# ---------------------------
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
else
    echo "Git already initialized."
fi

# ---------------------------
# ADD REMOTE IF NOT EXISTS
# ---------------------------
if git remote | grep -q origin; then
    echo "Remote 'origin' already exists."
else
    echo "Adding remote origin..."
    git remote add origin $REPO_URL
fi

# ---------------------------
# ADD FILES AND COMMIT
# ---------------------------
echo "Adding files and committing..."
git add .
git commit -m "Add local project files"

# ---------------------------
# CREATE AND PUSH NEW BRANCH
# ---------------------------
echo "Creating new branch: $NEW_BRANCH"
git checkout -b $NEW_BRANCH

echo "Pulling remote main to merge any changes (allowing unrelated histories)..."
git pull origin main --allow-unrelated-histories --no-rebase || echo "No conflicts yet."

echo "Pushing new branch to GitHub..."
git push -u origin $NEW_BRANCH

echo "Done! Your local project is now on branch '$NEW_BRANCH'."
echo "Next: you can create a Pull Request on GitHub to merge '$NEW_BRANCH' into 'main'."
