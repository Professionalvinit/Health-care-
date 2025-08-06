#!/bin/bash

# Health Platform Deployment Script
echo "🚀 Starting deployment process..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Vercel
    echo "🌐 Deploying to Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo "🎉 Deployment successful!"
        echo "Your health platform is now live!"
    else
        echo "❌ Deployment failed. Please check the logs above."
    fi
else
    echo "❌ Build failed. Please fix the errors and try again."
fi
