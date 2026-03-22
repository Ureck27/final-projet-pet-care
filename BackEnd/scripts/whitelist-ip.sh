#!/bin/bash

# MongoDB Atlas IP Whitelisting Script
# Run this to automatically whitelist your current IP

echo "🔧 MongoDB Atlas IP Whitelisting Helper"
echo "======================================="

# Get current public IP
echo "1. Getting your current public IP..."
CURRENT_IP=$(curl -s https://api.ipify.org)
echo "   Your IP: $CURRENT_IP"

# Check if mongocli is installed
echo "2. Checking MongoDB Atlas CLI..."
if ! command -v mongocli &> /dev/null; then
    echo "   ❌ MongoDB Atlas CLI not found"
    echo "   💡 Install with: npm install -g @mongocli/mongocli"
    echo "   📖 Or manually whitelist at: https://cloud.mongodb.com/network-access"
    exit 1
fi

# Check if logged in
echo "3. Checking Atlas authentication..."
if ! mongocli iam whoami &> /dev/null; then
    echo "   ❌ Not authenticated with MongoDB Atlas"
    echo "   💡 Login with: mongocli auth login"
    echo "   📖 Or manually whitelist at: https://cloud.mongodb.com/network-access"
    exit 1
fi

# Get project ID (assuming first project)
echo "4. Getting project information..."
PROJECT_ID=$(mongocli project list --output json | jq -r '.[0].id' 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "   ❌ Could not get project ID"
    echo "   💡 Make sure you have projects in your Atlas account"
    exit 1
fi

echo "   Project ID: $PROJECT_ID"

# Add IP to whitelist
echo "5. Adding IP to whitelist..."
if mongocli accesslist create --project $PROJECT_ID --ipAddress $CURRENT_IP --comment "Auto-whitelisted by diagnostic script" 2>/dev/null; then
    echo "   ✅ Successfully whitelisted IP: $CURRENT_IP"
    echo "   ⏳ Wait 2-3 minutes for changes to take effect"
else
    echo "   ❌ Failed to whitelist IP"
    echo "   💡 Try manually at: https://cloud.mongodb.com/network-access"
fi

echo ""
echo "🚀 Next steps:"
echo "   1. Wait 2-3 minutes for whitelist to update"
echo "   2. Run: npm run dev"
echo "   3. If still failing, try: node scripts/diagnose-mongo.js"
