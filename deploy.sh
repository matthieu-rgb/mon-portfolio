#!/usr/bin/env bash
# deploy.sh - commit + push GitHub + sync RPi
set -e

RPI="matthieu@192.168.18.10"
REMOTE_PATH="/var/www/portfolio"
PORTFOLIO_DIR="$(cd "$(dirname "$0")" && pwd)"

# --- Git commit + push ---
cd "$PORTFOLIO_DIR"
git add -A
if git diff --cached --quiet; then
    echo "Rien a committer."
else
    git commit -m "${1:-deploy $(date +%Y-%m-%d)}"
    git push
    echo "GitHub : OK"
fi

# --- Rsync vers RPi ---
rsync -av --delete \
    --exclude='.git' \
    --exclude='.DS_Store' \
    --exclude='mocks/' \
    --exclude='deploy.sh' \
    "$PORTFOLIO_DIR/" "$RPI:$REMOTE_PATH/"

echo "RPi : OK"
echo "Deploiement termine."
