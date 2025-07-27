# Patients Module Requirements

This directory contains EARS (Easy Approach to Requirements Syntax) requirements for the patient management functionality of the M.G. Amores Medical Clinic system.

## Files

- `requirements.txt` - Frontend requirements for the patients page (patients.html)
- `api.requirements.txt` - Backend API requirements for patient data operations

## Scope

### Frontend Requirements (requirements.txt)
Covers the patients.html page functionality including:
- Page display and loading
- Patient list display and formatting
- Real-time search functionality
- Navigation and user interactions
- User profile and authentication
- Admin-specific features
- Error handling and UI responsiveness

### API Requirements (api.requirements.txt)
Covers backend patient management API endpoints including:
- Patient data retrieval (`GET /patients`, `GET /patients/{id}`)
- Patient search functionality (`GET /patients/search`)
- Patient statistics (`GET /patients/total`)
- Patient creation (`POST /patients/add-patient`)
- Data validation and error handling

## Related Files

- Frontend: `legacy/client/pages/patients.html`
- JavaScript: `legacy/client/js/patients.js`  
- Styles: `legacy/client/assets/styles/patients.css`
- Backend Routes: `legacy/server/src/routes/patients.routes.js`
- Backend Controllers: `legacy/server/src/controllers/patients.controllers.js`