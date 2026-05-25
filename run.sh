#!/bin/bash

# Start Development Server - Mac/Linux Shell Script

echo ""
echo "================================================"
echo "  AR Computers Dashboard - Development Server"
echo "================================================"
echo ""

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "ERROR: package.json not found!"
    echo "Make sure you are in the project root directory."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        exit 1
    fi
fi

echo ""
echo "Starting Vite Development Server..."
echo ""
echo "Server will be available at: http://localhost:5173/"
echo ""
echo "Press Ctrl+C to stop the server."
echo ""

# Start the dev server
pnpm dev
