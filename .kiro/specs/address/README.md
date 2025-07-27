# Address API Specifications

This directory contains the specifications for the Philippine Address API endpoints.

## Overview

The Address API provides hierarchical access to Philippine geographical data including provinces, cities/municipalities, and barangays. The API is designed to support dropdown cascading functionality for address selection in forms.

## Endpoints

- `GET /address/provinces` - Retrieve all provinces
- `GET /address/cities/:provinceCode` - Retrieve cities for a province  
- `GET /address/barangays/:cityCode` - Retrieve barangays for a city

## Files

- `api.requirements-01.txt` - EARS format requirements specification for the address API

## Implementation

The API is implemented in:
- Routes: `legacy/server/src/routes/address.routes.js`
- Controller: `legacy/server/src/controllers/address.controller.js`
- Data Source: `legacy/server/src/data/philippines-complete.json`

## Testing

Comprehensive test scripts are available in:
- `legacy/postman-tests/address-endpoints-tests.js`
- `legacy/postman-tests/run-address-tests.sh`