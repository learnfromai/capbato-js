# Laboratory Page Requirements

This directory contains the EARS (Event-driven Architecture Requirements Specification) requirements for the Laboratory page functionality in the clinic management system.

## File Structure

- `requirements.txt` - Complete EARS requirements for laboratory page functionality

## Laboratory Page Overview

The laboratory page provides comprehensive lab test management functionality including:

- **Laboratory Dashboard**: Main view showing all patients with lab requests
- **Lab Test Modal**: Detailed view of individual patient's lab tests
- **Lab Form Overlay**: Interface for adding/editing lab test results
- **Test Categories**: Support for multiple test types (Routine, Blood Chemistry, Serology, etc.)
- **Status Management**: Tracking of pending, complete, and canceled lab tests

## Key Features Covered

### Page Display and Navigation
- Laboratory page layout and header
- Sidebar navigation with active state
- Main content area with table display

### Data Management
- API integration for lab request data
- Test categorization and grouping
- Patient information formatting
- Status determination logic

### Modal and Overlay System
- Floating modal for detailed test view
- Iframe-based overlay for lab forms
- Dynamic form loading based on test type
- Cross-frame communication

### User Interactions
- Action buttons based on test status
- Confirmation dialogs for critical actions
- Real-time data refresh
- Toast notifications

### Authentication and Authorization
- Role-based access control
- User profile management
- Session handling

### Test Categories
- ROUTINE: CBC, Pregnancy Test, Urinalysis, Fecalysis, Occult Blood
- SEROLOGY & IMMUNOLOGY: Various screening tests
- BLOOD CHEMISTRY: Metabolic panel tests
- MISCELLANEOUS: ECG
- THYROID FUNCTION: Hormone tests

## Related Files

- `legacy/client/pages/laboratory.html` - Main laboratory page
- `legacy/client/js/laboratory.js` - Laboratory page functionality
- `legacy/client/assets/styles/laboratory.css` - Laboratory page styling
- `legacy/server/src/routes/laboratory.routes.js` - API routes
- `legacy/server/src/controllers/laboratory.controller.js` - Backend logic

## Database Schema

The requirements are based on the `lab_request_entries` table structure which includes:
- Patient identification and demographics
- Individual test field flags
- Request dates and status tracking
- Result storage capabilities