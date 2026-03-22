# HirePoint (Careers Page Builder)

## Overview

HirePoint is a careers page builder designed to help companies create branded, customizable careers pages with minimal effort. The system supports two primary user flows:

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
* Recruiters authenticate using company-based login (company name + password)
* Media uploads are supported via Supabase Storage (with URL fallback support)
* Editing is done in draft mode, and publishing updates the public view

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

### Storage

* Supabase Storage is used for handling media uploads (logos, banners, gallery images)
* Supports both direct file uploads and external URLs

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
* Section management (add/remove/reorder/toggle with drag-and-drop support)
* Job management

### 2. Live Preview

* On mobile: preview shown as a separate tab
* On desktop: side-by-side preview

This allows recruiters to see changes in real time.

## Backend Design

The backend exposes REST APIs under `/api`.

### Authentication Flow

* Recruiters can log in using company credentials
* New companies can be created during the login flow
* Each recruiter is scoped to their own company data

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
* password

### 2. Career Pages

Handles both draft and published states.
Fields:

* company_id
* draft_theme_settings
* draft_sections
* draft_banner
* published_theme_settings
* published_sections
* published_banner
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

* Secure recruiter login (company-based authentication)
* Company creation flow
* Edit branding (logo, colors, banner)
* Media upload support (file upload + URL input)
* Manage sections (add/remove/reorder/toggle with drag-and-drop)
* Add and edit jobs
* Live preview while editing
* Save draft changes
* Publish and share careers page via link

### Candidate Features

* Browse companies from landing page
* Search across companies and jobs
* View company-specific careers pages
* Filter jobs by location and type
* Access only published careers pages

## UX Considerations

* Mobile-first layout
* Clean, minimal design
* Consistent spacing and typography
* Smooth navigation and transitions
* Stable loading states (skeleton loaders)
* Responsive behavior across mobile and desktop

## Testing Approach

Testing was primarily manual and scenario-based.

### Areas Covered

* Landing page search and navigation
* Recruiter dashboard flows
* Section management (add/reorder/remove)
* Job creation and updates
* Careers page rendering
* Public share link behavior

## Known Limitations 

* Authentication is basic and not fully role-based (no multi-user support per company)
* Limited validation for inputs (colors, URLs, etc.)
* Accessibility not fully audited
* No automated test coverage yet

## Scalability Considerations

If extended further, the following would need attention:

* Proper auth system (multi-tenant support)
* Pagination for jobs and companies
* Improving auth system for multi-user/company roles
* Adding caching for public careers pages
* Enhancing API performance for large datasets

## Final Notes

The focus of this implementation was to build a clean, usable, and extensible system that closely resembles a real-world product.

The current version includes core product features such as authentication, media handling, and structured content management, and is designed to be extended into a full ATS platform.
