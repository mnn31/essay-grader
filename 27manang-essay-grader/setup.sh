#!/bin/bash

# Print each command before executing it
set -x

# Exit on any error
set -e

echo "Setting up Essay Grader Application..."

# Check if MongoDB is running
echo "Checking MongoDB status..."
if ! mongod --version > /dev/null 2>&1; then
    echo "MongoDB is not installed. Please install MongoDB first."
    exit 1
fi

# Install backend dependencies
echo "Setting up backend..."
cd backend
npm install

# Install frontend dependencies
echo "Setting up frontend..."
cd ../frontend
npm install

# Start MongoDB (if not already running)
echo "Starting MongoDB..."
mongod --fork --logpath /var/log/mongodb.log || true

# Start the backend server
echo "Starting backend server..."
cd ../backend
node server.js &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Start the frontend development server
echo "Starting frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "Setup complete!"
echo "Backend running on http://localhost:5001"
echo "Frontend running on http://localhost:5173"
echo ""
echo "To stop the servers, run:"
echo "kill $BACKEND_PID $FRONTEND_PID"

# Wait for user input
read -p "Press Enter to stop the servers..."
kill $BACKEND_PID $FRONTEND_PID 