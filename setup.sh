#!/bin/bash

echo "🏋️ FitFindr Setup Script"
echo "========================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Backend setup
echo -e "${BLUE}Setting up Backend...${NC}"
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created. Please add your Google Maps API key!${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

cd ..

# Frontend setup
echo ""
echo -e "${BLUE}Setting up Frontend...${NC}"
cd frontend

echo "Installing Node dependencies..."
npm install

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cp .env.local.example .env.local
    echo -e "${GREEN}✓ .env.local file created${NC}"
else
    echo -e "${GREEN}✓ .env.local file already exists${NC}"
fi

cd ..

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Add your Google Maps API key to backend/.env"
echo "2. Run the backend: cd backend && source venv/bin/activate && uvicorn main:app --reload"
echo "3. Run the frontend: cd frontend && npm run dev"
echo ""
echo "Visit http://localhost:3000 to use FitFindr!"
