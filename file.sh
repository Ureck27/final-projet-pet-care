#!/bin/bash

NAME="rachid aourik"
EMAIL="rachidaourik18@gmail.com"

echo "Changing author of last 2 commits..."

git filter-branch -f --env-filter "

export GIT_AUTHOR_NAME='$NAME'
export GIT_AUTHOR_EMAIL='$EMAIL'
export GIT_COMMITTER_NAME='$NAME'
export GIT_COMMITTER_EMAIL='$EMAIL'

" HEAD~2..HEAD

echo "Done."
echo "If commits were pushed already run:"
echo "git push --force"
