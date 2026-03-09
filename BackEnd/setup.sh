#!/bin/bash

# Pet Care Platform - Environment Setup Script
echo "🐾 Setting up Pet Care Platform Environment..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database Configuration
MONGO_URI=mongodb://localhost:27017/petcare

# JWT Configuration
JWT_SECRET=petcare-dev-secret-key-2024-super-secure

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Email Configuration (for notifications)
EMAIL_USER=dev@petcare.com
EMAIL_PASS=dev-password-123
EMAIL_SERVICE=gmail

# Admin Dashboard URL
ADMIN_DASHBOARD_URL=http://localhost:3000/admin-dashboard
EOF
    echo "✅ .env file created successfully!"
else
    echo "✅ .env file already exists"
fi

# Create uploads directory if it doesn't exist
if [ ! -d uploads ]; then
    echo "📁 Creating uploads directory..."
    mkdir -p uploads
    echo "✅ Uploads directory created!"
else
    echo "✅ Uploads directory already exists"
fi

# Install dependencies if not already installed
echo "📦 Checking dependencies..."
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed!"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Make sure MongoDB is running on localhost:27017"
echo "2. Run 'npm run dev' to start the backend server"
echo "3. Run 'npm run dev' in the FrontEnd directory to start the frontend"
echo ""
echo "🔗 Default URLs:"
echo "- Backend API: http://localhost:5000"
echo "- Frontend: http://localhost:3000"
echo "- Admin Dashboard: http://localhost:3000/admin-dashboard"
echo ""
echo "📝 Note: Update the .env file with your actual email credentials for notifications"
