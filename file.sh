#!/bin/bash

echo "Fixing last 13 commits author..."

git filter-branch -f --env-filter '

export GIT_AUTHOR_NAME="rachid aourik"
export GIT_AUTHOR_EMAIL="rachidaourik18@gmail.com"
export GIT_COMMITTER_NAME="rachid aourik"
export GIT_COMMITTER_EMAIL="rachidaourik18@gmail.com"

' HEAD~13..HEAD

echo "✔ Commits updated."

echo "Now push with force:"
echo "git push --force"
