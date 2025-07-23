#!/bin/bash

# E2E Test Setup Verification Script
# This script helps verify that the e2e setup is working correctly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [[ ! -d "e2e/cms-web-e2e" ]]; then
    log_error "Please run this script from the project root directory"
    exit 1
fi

log_info "Verifying E2E test setup..."

# Check if e2e directory exists and has correct structure
log_info "Checking directory structure..."
if [[ -f "e2e/cms-web-e2e/package.json" ]]; then
    log_success "package.json found"
else
    log_error "package.json not found"
    exit 1
fi

if [[ -f "e2e/cms-web-e2e/playwright.config.ts" ]]; then
    log_success "playwright.config.ts found"
else
    log_error "playwright.config.ts not found"
    exit 1
fi

if [[ -f "e2e/cms-web-e2e/src/login.spec.ts" ]]; then
    log_success "login test file found"
else
    log_error "login test file not found"
    exit 1
fi

if [[ -f "e2e/cms-web-e2e/src/pages/LoginPage.ts" ]]; then
    log_success "LoginPage page object found"
else
    log_error "LoginPage page object not found"
    exit 1
fi

# Check if dependencies are installed
log_info "Checking dependencies..."
cd e2e/cms-web-e2e
if [[ -d "node_modules" ]]; then
    log_success "Dependencies installed"
else
    log_warning "Dependencies not installed, installing now..."
    npm install
fi

# Check if Playwright can list tests
log_info "Validating test configuration..."
if npx playwright test --list > /dev/null 2>&1; then
    log_success "Test configuration is valid"
    
    # Show available tests
    echo
    log_info "Available tests:"
    npx playwright test --list | grep -E "›.*›" | head -10
    echo "... and more (total of 60 tests across 3 browsers)"
else
    log_error "Test configuration has issues"
    exit 1
fi

# Check if login page is accessible (test static serving)
log_info "Testing login page accessibility..."
cd ../../
if python3 -m http.server 8080 > /dev/null 2>&1 &
then
    SERVER_PID=$!
    sleep 2
    
    if curl -s -I http://localhost:8080/client/pages/login.html | grep -q "200 OK"; then
        log_success "Login page is accessible at http://localhost:8080/client/pages/login.html"
    else
        log_warning "Could not access login page via static server"
    fi
    
    # Cleanup
    kill $SERVER_PID 2>/dev/null || true
    wait $SERVER_PID 2>/dev/null || true
fi

echo
log_success "E2E test setup verification complete!"
echo
log_info "To run tests manually:"
echo "1. Start the test database: ./scripts/start-test-db.sh"
echo "2. Navigate to e2e directory: cd e2e/cms-web-e2e"
echo "3. Install browsers: npm run install-browsers"
echo "4. Run tests: npm run e2e"
echo
log_info "Note: Browser installation may require manual intervention due to download issues."
echo "Alternative: Use npm run e2e:headed to see tests run in a visible browser"