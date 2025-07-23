# CMS Web E2E Tests

This directory contains end-to-end tests for the Clinic Management System web application using Playwright.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npm run install-browsers
   ```

## Running Tests

### Prerequisites

Before running e2e tests, make sure:

1. The test database is running:
   ```bash
   # From the root directory
   ./scripts/start-test-db.sh
   ```

2. The server environment is configured with test database settings (the webServer config will start the server automatically)

### Run Tests

- **Run all tests**: `npm run e2e`
- **Run tests with UI mode**: `npm run e2e:ui`
- **Run tests in headed mode** (see browser): `npm run e2e:headed`
- **Debug tests**: `npm run e2e:debug`

### Test Configuration

The tests are configured to:
- Automatically start the development server before running tests
- Run against `http://localhost:3001`
- Test the login page functionality
- Use Chromium, Firefox, and WebKit browsers

## Test Structure

- `src/pages/` - Page Object Models
- `src/*.spec.ts` - Test files
- `playwright.config.ts` - Playwright configuration

## Current Tests

### Login Page Tests (`src/login.spec.ts`)

Tests cover:
- Page structure and branding
- Form element visibility and attributes
- Form interaction (typing, tabbing, clearing)
- Form submission behavior
- Navigation elements
- Error handling capabilities
- Responsive design on different viewport sizes

## Notes

- Tests focus on the login page UI and functionality
- Database connectivity and actual authentication logic are tested separately
- The webServer configuration automatically starts the backend server before tests run
- Tests are designed to be independent and can run in parallel