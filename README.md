# HirePoint – Careers Page Builder
HirePoint is a careers page builder that allows companies to create branded, customizable careers pages and lets candidates explore roles through a clean, mobile-first experience.

## Features

### Candidate Side

* Public landing page with:

  * Live search across companies and jobs
  * Featured companies carousel
  * Job browsing experience
  * Company cards open careers pages in a new tab
  * Careers page includes:
  * About section
  * Life at Company section
  * Open roles with filtering (location, job type, title)
  * Only published careers pages are accessible publicly

### Recruiter Side

* Recruiter access flow:
  * Login using company name and password
  * Create a new company during login

* Careers page editor:
  * Brand theme editing (colors, logo, banner)
  * Media upload support (file upload + URL input)
  * Section management (add, remove, reorder with drag-and-drop, toggle visibility)
  * Job management (add/edit/delete roles)
  * Live preview while editing

* Save and publish workflow:
  * Save draft changes
  * Publish careers page
  * Share careers page via link

## Tech Stack

**Frontend**

* React (Vite)
* Tailwind CSS

**Backend**

* Node.js
* Express

**Database**

* Supabase (PostgreSQL)

## Step-by-Step User Guide

### Candidate Flow

1. Open the landing page
2. Browse featured companies
3. Use search to filter companies and jobs
4. Click **Browse All Jobs** to view roles
5. Click **Explore Companies** to view company cards
6. Click a company card → opens careers page in a new tab
7. Browse:

   * About
   * Life at Company
   * Open Roles
8. Filter jobs by:

   * Title
   * Location
   * Job type

### Recruiter Flow

1. Open landing page
2. Click **Recruiter Login**
3. Login using company credentials or create a new company
4. Continue to recruiter company view
5. Click **Edit** to open builder

### Recruiter Builder Flow

#### Brand Theme

* Edit:
  * Company name
  * Logo (text/image)
  * Colors
  * Banner content
  * Culture video URL

#### Sections

* Reorder sections
* Toggle visibility
* Edit:
  * About section
  * Life at Company (including gallery)
  * Open Roles headline
  * Custom sections

#### Jobs

* Add new job
* Edit existing job
* Update:
  * Title
  * Location
  * Type
  * Summary

#### Preview & Share

* Use live preview to check UI
* Save changes
* Share careers page:
  * Copy link
  * share 

## How To Run

### Prerequisites

* Node.js installed
* npm installed
* Supabase project set up
* Backend `.env` configured
* Frontend env configured 

### Install dependencies

Run from the root of the project:

```bash npm install```

Workspaces will install dependencies for both `client` and `server`.

### Run full app (frontend + backend)

```bash npm run dev```

This starts:

* Frontend (Vite)
* Backend (Node + Express)

### Run frontend only

```bash
npm run dev --workspace client
```
### Run backend only

```bash
npm run dev --workspace server
```

### Build frontend

```bash
npm run build --workspace client
```

### Preview production build

```bash npm run preview --workspace client```

### Import sample jobs

```bash npm run import:sample-jobs --workspace server```

## Environment Variables

### Backend

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
PORT=
PUBLIC_APP_URL=
ALLOWED_ORIGINS=
```

### Frontend

```bash
VITE_API_BASE_URL=
```

## Improvement Plan

### Product Improvements

* Add role-based authentication (multiple users per company)
* Add job application links
* Expand job fields (department, salary, experience level, etc.)
* Improve section system with more content types
* Improve publish/version control

### UX Improvements

* Better loading states and transitions
* Improved empty states
* Clear success/error feedback
* Accessibility improvements
* Better navigation on public pages
* Stronger desktop UI hierarchy

### Engineering Improvements

* Improve shared state and data fetching patterns
* Add validation for API payloads
* Add unit and end-to-end tests
* Improve logging and observability
* Add caching for public careers pages

## Known Limitations

* Authentication is basic and does not support multiple users per company
* Limited validation for inputs (colors, URLs, etc.)
* No automated test coverage yet
* Accessibility is not fully audited

