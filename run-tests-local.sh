#!/bin/bash

# Fast Local Test Runner Script
# Bypasses Docker for rapid development testing

echo "🚀 Running fast local Playwright tests..."

# Set local environment
export PLAYWRIGHT_BASE_URL=http://localhost:3000
export CI=false

# Color output for better visibility
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Installing/updating dependencies if needed...${NC}"
npm ci --silent

echo -e "${YELLOW}🏗️  Building application...${NC}"
npm run build

echo -e "${YELLOW}🎭 Installing Playwright browsers if needed...${NC}"
npx playwright install --with-deps chromium

echo -e "${GREEN}🧪 Starting fast smoke tests (Chrome only, no videos/screenshots)...${NC}"

# Run the optimized smoke tests
npm run test:e2e:smoke:local

# Check exit code
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed! 🎉${NC}"
else
    echo -e "${RED}❌ Some tests failed. Check the output above.${NC}"
    exit 1
fi

echo -e "${GREEN}⚡ Fast testing complete! Total time: much faster than Docker 😎${NC}"