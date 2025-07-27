#!/bin/bash

echo "=== Travel App Status Check ==="
echo

echo "1. Checking MongoDB..."
if pgrep -f mongod > /dev/null; then
    echo "✓ MongoDB is running"
else
    echo "✗ MongoDB is not running"
fi

echo

echo "2. Checking Backend Server..."
if pgrep -f "node.*server.js" > /dev/null; then
    echo "✓ Backend server process is running"
    # Test the actual endpoint
    if curl -s -f http://localhost:5000/api/health > /dev/null 2>&1; then
        echo "✓ Backend API is responding"
    else
        echo "✗ Backend API is not responding on localhost:5000"
    fi
else
    echo "✗ Backend server is not running"
fi

echo

echo "3. Checking Frontend Server..."
if pgrep -f "react-scripts.*start" > /dev/null; then
    echo "✓ Frontend server process is running"
    # Check if port 3000 is in use
    if curl -s -f http://localhost:3000 > /dev/null 2>&1; then
        echo "✓ Frontend is responding"
    else
        echo "✗ Frontend is not responding on localhost:3000"
    fi
else
    echo "✗ Frontend server is not running"
fi

echo

echo "4. Testing API endpoints..."
echo "Testing destinations endpoint:"
curl -s http://localhost:5000/api/destinations | head -c 200
echo "..."

echo
echo "=== End Status Check ==="