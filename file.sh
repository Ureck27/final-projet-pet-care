#!/bin/bash

MAIN_BRANCH="main"

echo "Switching to $MAIN_BRANCH..."
git checkout $MAIN_BRANCH || git switch $MAIN_BRANCH

echo "Pulling latest changes from origin..."
git pull origin $MAIN_BRANCH

# List all local branches except main
BRANCHES=$(git for-each-ref --format='%(refname:short)' refs/heads/ | grep -v "^$MAIN_BRANCH$")

echo "Found branches to merge: $BRANCHES"

for BRANCH in $BRANCHES; do
    echo "Merging $BRANCH into $MAIN_BRANCH..."
    git merge --no-ff $BRANCH -m "Merge branch '$BRANCH' into $MAIN_BRANCH"
    
    # If conflicts appear, stop the script
    if [ $? -ne 0 ]; then
        echo "⚠ Merge conflict detected in $BRANCH! Resolve manually and then continue."
        exit 1
    fi
done

echo "All branches merged into $MAIN_BRANCH."

echo "Pushing updated main to GitHub..."
git push origin $MAIN_BRANCH

echo "✔ All done!"
