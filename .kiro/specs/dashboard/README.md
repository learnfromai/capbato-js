# Dashboard Requirements

This directory contains the EARS (Event-Action-Response-State) requirements for the M.G. Amores Medical Clinic dashboard page.

## Files

- `requirements.txt` - Main EARS requirements document for the dashboard functionality

## Dashboard Overview

The dashboard (`legacy/client/pages/index.html`) serves as the main landing page after user authentication and provides:

### Core Functionality
- **Authentication Validation**: Validates user session and redirects unauthorized users
- **User Profile Management**: Displays user role, username, avatar, and logout functionality  
- **Navigation**: Sidebar navigation with role-based menu items
- **Data Summary**: Summary cards showing assigned doctor, current patient, and appointment counts
- **Real-time Updates**: Auto-refresh of appointment and lab data

### Key Features
- **Today's Appointments**: Table view of current day's appointments with patient links
- **Lab Results** (Doctor role): View of completed lab tests with modal viewing capability
- **Responsive Design**: Mobile-friendly layout with proper spacing and interactions
- **Error Handling**: Graceful handling of API failures with fallback displays

### Role-based Access
- **All Roles**: Dashboard, appointments, patients, laboratory, prescriptions, doctors navigation
- **Admin Only**: Additional "Accounts" navigation item
- **Doctor Only**: Lab results section with viewing capabilities

### Technical Implementation
- **Frontend**: HTML, CSS, JavaScript with Bootstrap styling
- **Backend Integration**: REST API calls to Node.js/Express server
- **Database**: MySQL with appointments, patients, lab_request_entries, users tables
- **Real-time Features**: Auto-refresh intervals for live data updates

## Related Files

### Frontend
- `legacy/client/pages/index.html` - Main dashboard HTML structure
- `legacy/client/js/index.js` - Dashboard JavaScript functionality  
- `legacy/client/assets/styles/index.css` - Dashboard-specific styling
- `legacy/client/js/sidebar.js` - Sidebar navigation handling

### Backend
- `legacy/server/src/controllers/appointments.controller.js` - Appointments API logic
- `legacy/server/src/controllers/laboratory.controller.js` - Lab results API logic
- `legacy/server/src/routes/appointments.routes.js` - Appointments routing
- `legacy/server/src/routes/laboratory.routes.js` - Lab results routing

### Database Tables
- `appointments` - Patient appointment data
- `patients` - Patient demographic information
- `lab_request_entries` - Laboratory test requests and results
- `users` - System user accounts and roles
- `doctors` - Doctor information and specializations