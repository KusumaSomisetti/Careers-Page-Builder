# HirePoint (Careers Page Builder)

## Overview

HirePoint is a careers page builder designed to help companies create branded, customizable careers pages without more effort. The system supports two primary user flows:

* **Candidates** browsing companies and job listings through a public interface
* **Recruiters** editing and managing their company’s careers page through a dashboard

The goal of this project is to build a clean, mobile-first, production-like experience that balances flexibility (for recruiters) and simplicity (for candidates).

## Assumptions

A few assumptions were made while designing the system:

* The platform serves two user groups: recruiters and candidates
* Recruiters only manage a single company
* Each company has exactly one careers page
* Careers pages exist in two states: **draft** and **published**
* Public users should land directly on a company’s careers page through a shareable link
* Editing is done in draft mode, and publishing updates the public view
* File uploads are simplified as URL inputs for now
* Authentication is not fully implemented 

## Architecture

The application is structured as a **single codebase with separated frontend and backend layers**:

client/   → React (Vite)
server/   → Node.js + Express
Supabase  → PostgreSQL database

### Frontend

* Built with React (Vite)
* Tailwind CSS for styling
* Component-driven architecture
* Mobile-first design approach

### Backend

* Express-based REST API
* Supabase used as the database
* Clean separation of routes, controllers, and services

* Frontend communicates with backend using a centralized `api.js` service layer
* Backend interacts with Supabase

## Frontend Architecture

The frontend is a single-page React application with multiple top-level views:

* Landing Page
* Recruiter Login Page
* Recruiter Dashboard (Editor)
* Recruiter Company View
* Public Careers Page (`/careers/:slug`)

## Recruiter Dashboard Design

The dashboard is split into two main areas:

### 1. Editing Controls

* Brand settings (colors, logo, banner)
* Section management (add/remove/reorder/toggle)
* Job management

### 2. Live Preview

* On mobile: preview shown as a separate tab
* On desktop: side-by-side preview

This allows recruiters to see changes in real time.

## Backend Design

The backend exposes REST APIs under `/api`.

### Core API Responsibilities

* Fetch company data
* Save draft careers page
* Publish careers page
* Fetch public careers page
* Manage jobs

## Data Models

The system is built around three main entities:

### 1. Companies

Stores basic company identity and branding.
Fields:

* id
* slug
* name
* logo
* banner
* about

### 2. Career Pages

Handles both draft and published states.
Fields:

* company_id
* draft_theme_settings
* draft_sections
* published_theme_settings
* published_sections
* is_published
* published_at

### 3. Jobs

Stores open roles for a company.
Fields:

* id
* company_id
* title
* location
* type
* summary

## Key Features Implemented

### Recruiter Features

* Edit branding (logo, colors, banner)
* Manage sections (add/remove/reorder/toggle)
* Add and edit jobs
* Live preview while editing
* Save draft changes
* Generate shareable careers page link

### Candidate Features

* Browse companies from landing page
* Search across companies and jobs
* View company-specific careers pages
* Filter jobs by location and type

## UX Considerations

* Mobile-first layout
* Clean, minimal design
* Consistent spacing and typography
* Smooth navigation and transitions

## Testing Approach

Testing was primarily manual and scenario-based.

### Areas Covered

* Landing page search and navigation
* Recruiter dashboard flows
* Section management (add/reorder/remove)
* Job creation and updates
* Careers page rendering
* Public share link behavior

## Present Gaps 

* No real authentication or authorization layer
* File uploads are URL-based only
* Drag-and-drop reordering not implemented yet
* Limited validation for inputs (colors, URLs, etc.)
* Accessibility not fully audited

## Scalability Considerations

If extended further, the following would need attention:

* Proper auth system (multi-tenant support)
* Media storage (Supabase Storage or S3)
* Pagination for jobs and companies
* Caching public careers pages
* Role-based permissions

## Final Notes

The focus of this implementation was to build a **clean, usable, and extensible prototype** rather than a fully production-ready system.

The system is structured in a way that can be iterated on easily and extended into a full ATS product.
