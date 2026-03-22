#!/bin/bash

TARGET_NAME="rachid aourik"
TARGET_EMAIL="rachidaourik18@gmail.com"

echo "Fixing last 30 commits..."
echo "✔ Keeping commits by $TARGET_NAME"
echo "✔ Rewriting others"

git filter-branch -f --env-filter '
if [ "$GIT_AUTHOR_NAME" != "'"$TARGET_NAME"'" ]; then
    GIT_AUTHOR_NAME="'"$TARGET_NAME"'"
    GIT_AUTHOR_EMAIL="'"$TARGET_EMAIL"'"
    GIT_COMMITTER_NAME="'"$TARGET_NAME"'"
    GIT_COMMITTER_EMAIL="'"$TARGET_EMAIL"'"
fi

export GIT_AUTHOR_NAME
export GIT_AUTHOR_EMAIL
export GIT_COMMITTER_NAME
export GIT_COMMITTER_EMAIL
' HEAD~30..HEAD

echo "✔ Done."

echo "⚠ If already pushed:"
echo "git push --force"
