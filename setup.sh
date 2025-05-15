#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "🔧 Updating package list..."
sudo apt update

echo "📦 Installing Node.js and npm..."
sudo apt install -y nodejs npm git

echo "📁 Cloning the parking lot app repository..."
git clone https://github.com/itaiwolf/parking-lot-app.git

cd parking-lot-app

echo "📦 Installing dependencies..."
npm install

echo "🚀 Starting the server on port 3000..."
node index.js
