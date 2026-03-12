#!/bin/bash

TARGET="newmaintest1"
SOURCE="frontend-features"

echo "Switching to $TARGET branch..."
git checkout $TARGET || git switch $TARGET

echo "Pulling latest changes..."
git pull origin $TARGET

echo "Merging $SOURCE into $TARGET..."
git merge $SOURCE

echo "Pushing merged branch..."
git push origin $TARGET

echo "✔ Merge completed: $SOURCE → $TARGET"
