#!/bin/bash

# Smart Travel Companion Startup Script

echo "🚀 Starting Smart Travel Companion Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running (optional check)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found. Make sure MongoDB is installed and running."
    echo "   You can install MongoDB from: https://www.mongodb.com/try/download/community"
fi

# Install backend dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Install frontend dependencies if client/node_modules doesn't exist
if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd client
    npm install
    cd ..
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating environment configuration..."
    cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/smart-travel-companion
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
PORT=5000
WEATHER_API_KEY=your-weather-api-key
MAPS_API_KEY=your-maps-api-key
EOF
    echo "✅ Created .env file. Please update the configuration as needed."
fi

# Create client .env file if it doesn't exist
if [ ! -f "client/.env" ]; then
    echo "⚙️  Creating client environment configuration..."
    cat > client/.env << EOF
REACT_APP_API_URL=http://localhost:5000
EOF
    echo "✅ Created client/.env file."
fi

echo ""
echo "🎯 Starting the application..."
echo "   Backend will run on: http://localhost:5000"
echo "   Frontend will run on: http://localhost:3000"
echo ""
echo "📝 Make sure MongoDB is running before starting the application!"
echo ""

# Start the application
npm run dev
