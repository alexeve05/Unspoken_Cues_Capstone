# Sprint 1 Technical Plan

## Sprint Goal

Create the first functional staff-facing workflow for the Unspoken Cues Resort/Event Management Platform.

Sprint 1 will focus on:

- Staff dashboard
- Participating guest records
- Guest ID lookup
- Individual guest profiles
- Initial data model and ERD
- Role and permission definitions
- Core frontend/backend architecture
- API documentation
- Testing and documentation

---

## Sprint 1 User Stories

### US-1 — Staff Dashboard

**As a staff member, I want to view a dashboard so that I can quickly see important information about the current resort or event.**

Primary functionality:

- Display dashboard
- Display resort/property information
- Display registration/check-in counts
- Display active/upcoming events and deployments
- Display recent operational information


---

### US-2 — Participating Guests

**As a staff member, I want to view participating guests so that I can locate guests associated with the current resort or event.**

Primary functionality:

- Display participating guests
- Display operational guest information
- Allow selection of a guest
- Handle empty/error states


---

### US-4 — Guest ID Lookup

**As a staff member, I want to locate a guest using their Guest ID so that I can quickly access their operational record.**

Primary functionality:

- Guest ID search
- Valid guest lookup
- Invalid guest handling
- Link lookup result to guest profile

---

### US-6 — Guest Profile

**As a staff member, I want to view an individual guest profile so that I can see the operational information associated with that guest.**

Primary functionality:

- Display guest name and identity reference
- Display deployment/event participation
- Display operational status
- Display QR identity association
- Display allowed staff-facing information only

---

# Technical Tasks

## 1. Initial ERD and Data Model

Create an initial ERD based on client requirements.

Initial entities should consider:

- Property
- Event
- Deployment
- Guest
- Deployment Participation
- Staff User
- Role
- Staff Assignment
- Check-In Record
- Wristband
- Wristband Assignment
- Activity Log

Important client requirements:

- Each guest has one persistent Unspoken Cues identity.
- Participation is recorded separately for each deployment.
- Properties may have multiple simultaneous events and deployments.
- Wristband assignment history must be retained.
- Activity history must record relevant actors and timestamps.

**Definition of Done**

- Initial ERD completed.
- Entity relationships documented.
- Required/important fields identified.
- Diagram included in Sprint 1 presentation.
- ERD prepared for client review.

---

## 2. Role and Permission Definitions

Define initial permissions for:

### Administrator

Expected responsibilities:

- Property configuration
- Event/deployment management
- Staff management
- Role/permission management
- Administrative history

### Manager

Expected responsibilities:

- Assigned event/deployment management
- Guest participation
- Wristband operations
- Reporting
- Operational exceptions

### Check-In Staff

Expected responsibilities:

- Authorized guest lookup
- Check-in/check-out
- Wristband assignment
- Limited operational guest information

**Definition of Done**

- Permissions documented for all three roles.
- Private/user-controlled information identified as inaccessible to venue staff.
- Role matrix included in project documentation.

---

## 3. Core Architecture

Current architecture:

Frontend:
- React
- Vite
- JavaScript

Backend:
- Node.js
- Express

Database:
- PostgreSQL planned

Communication:
- REST API using JSON

**Definition of Done**

- React frontend runs locally.
- Express backend runs locally.
- Frontend can communicate with backend.
- Architecture diagram created.
- Major project folders documented.

---

## 4. Mock Data

Create synthetic data for Sprint 1 development.

Mock data should include examples of:

- Properties
- Events
- Deployments
- Guests
- Participation
- Check-ins
- Wristband assignments
- Recent activity

No real participant information should be used.

**Definition of Done**

- Mock data supports all implemented Sprint 1 screens.
- Data structure is consistent across frontend components.
- Demo data can later be replaced by API/database responses.

---

## 5. API Design and Documentation

Initial API endpoints may include:

- `GET /api/health`
- `GET /api/guests`
- `GET /api/guests/:id`

Additional endpoints should only be added when required by implemented Sprint 1 functionality.

All implemented APIs must be documented in the root `README.md`.

Documentation should include:

- HTTP method
- Endpoint
- Purpose
- Parameters
- Example request where appropriate
- Example response
- Expected status codes

**Definition of Done**

- Every implemented endpoint documented.
- API documentation uses Markdown.
- Documentation matches actual behavior.

---

## 6. Testing Setup

Sprint 1 testing should include both unit and functional testing.

Frontend testing:

- Vitest
- React Testing Library

Backend/API testing:

- Vitest
- Supertest

Tests should cover:

- Normal behavior
- Empty states
- Invalid input
- API failures
- Navigation/actions where applicable

**Definition of Done**

- Tests implemented for completed Sprint 1 user stories.
- All test results recorded.
- Number passed/failed documented.
- Coverage generated where possible.
- No known critical failures remain at Sprint completion.

---

## 7. Dashboard Implementation

Initial dashboard should prioritize:

- Active/upcoming events and deployments
- Registration counts
- Check-in counts
- Wristband information
- Operational exceptions
- Recent activity
- Quick guest lookup/check-in access

The initial implementation may use mock data.

**Definition of Done**

- Dashboard renders correctly.
- Required information is visible.
- Layout works with mock data.
- Loading/error states are considered.
- Relevant tests pass.
- Screenshot included in presentation.

---

## 8. Sprint Documentation and Presentation Evidence

Collect evidence as Sprint 1 progresses.

Required presentation materials include:

- Planned versus completed features
- User stories
- Scenarios
- Test cases
- Definitions of done
- Architecture diagrams
- ERD
- Test results
- Coverage information
- API documentation screenshot
- Screenshots of implemented user stories
- Sprint demo

**Definition of Done**

- Required screenshots captured.
- Diagrams stored in project documentation.
- Test results recorded.
- Presentation materials reflect the actual implemented system.