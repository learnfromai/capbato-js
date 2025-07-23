# E2E Testing Guide

This document provides instructions for setting up and running end-to-end tests for the Clinic Management System.

## Quick Start

1. **Verify the setup:**
   ```bash
   ./verify-e2e-setup.sh
   ```

2. **Navigate to the e2e directory:**
   ```bash
   cd e2e/cms-web-e2e
   ```

3. **Install Playwright browsers:**
   ```bash
   npm run install-browsers
   ```

4. **Run the tests:**
   ```bash
   npm run e2e
   ```

## Prerequisites

### Database Setup (Optional for basic UI tests)
```bash
# Start the test database
./scripts/start-test-db.sh
```

### Environment Variables
The server configuration is set up automatically by the Playwright webServer, but if running manually:

```bash
# In server directory, create .env file with:
CLINIC_DB_HOST=localhost
CLINIC_DB_PORT=3307
CLINIC_DB_USER=root
CLINIC_DB_PASSWORD=testpassword
CLINIC_DB_NAME=clinic_management_system
PORT=3001
```

## Running Tests

### Basic Commands
- `npm run e2e` - Run all tests headlessly
- `npm run e2e:headed` - Run tests with visible browser
- `npm run e2e:ui` - Run tests with Playwright UI
- `npm run e2e:debug` - Run tests in debug mode

### Specific Test Filters
```bash
# Run only login tests
npx playwright test login

# Run specific test by name
npx playwright test --grep "should display login page"

# Run tests on specific browser
npx playwright test --browser firefox
```

## Test Structure

### Current Tests: Login Page (`src/login.spec.ts`)

The login page tests are organized into the following categories:

1. **Page Structure** (6 tests)
   - Page title verification
   - Clinic branding display
   - Form elements visibility
   - Input field attributes and placeholders
   - Password field type validation
   - Required field attributes

2. **Form Interaction** (5 tests)
   - Username/password field input
   - Field clearing functionality
   - Focus management
   - Tab navigation between fields

3. **Form Submission** (3 tests)
   - Login button display and state
   - Form submission with valid input
   - Enter key submission handling

4. **Navigation** (2 tests)
   - Go back button visibility and functionality

5. **Error Handling** (2 tests)
   - Error message element presence
   - Empty form submission handling

6. **Responsive Design** (2 tests)
   - Mobile viewport compatibility
   - Tablet viewport compatibility

**Total: 20 test cases across 3 browsers (60 test executions)**

### Page Object Model

The tests use a page object model (`src/pages/LoginPage.ts`) that provides:
- Clean element selectors
- Reusable interaction methods
- Centralized element management

## Troubleshooting

### Browser Installation Issues
If Playwright browser download fails:
```bash
# Try installing specific browsers
npx playwright install chromium
npx playwright install firefox

# Or install system browsers (if available)
npm run e2e -- --use-system-browsers
```

### Server Connection Issues
- Ensure port 3001 is available
- Check that the webServer configuration in playwright.config.ts is correct
- Manually start the server if needed: `cd server && npm run dev`

### Test Database Issues
- Verify the test database is running: `./scripts/start-test-db.sh status`
- Check database connection in server logs
- Note: Basic UI tests don't require database connectivity

## Development

### Adding New Tests
1. Create test files in `src/` directory
2. Follow the existing pattern with page objects
3. Use descriptive test names and organize in describe blocks

### Extending Page Objects
1. Add new page objects in `src/pages/`
2. Follow the LoginPage.ts pattern
3. Export from appropriate files for reuse

### Configuration Updates
Update `playwright.config.ts` for:
- New test directories
- Different base URLs
- Additional browser configurations
- Custom reporting options