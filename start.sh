#!/bin/bash

echo "========================================"
echo "  Gradex Writers - Starting Server"
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    echo ""
    npm install
    echo ""
fi

echo "Starting server..."
echo ""
echo "========================================"
echo "  Server will start on http://localhost:3000"
echo "  Admin dashboard: http://localhost:3000/admin"
echo "  Default login: admin / admin123"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start

