# HirePoint – Careers Page Builder
Companies using this ATS want their Careers page to match their brand, tell their story, and make it effortless for candidates to discover and apply to open roles. 

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

### Recruiter Side

* Recruiter access flow:

  * Select existing company
  * Create a new company
  * Careers page editor:
  * Brand theme editing (colors, logo, banner)
  * Section management (add, remove, reorder, toggle visibility)
  * Job management (add/edit roles)
  * Live preview while editing
  * Save and share workflow:
  * Save draft changes
  * Share/publish careers page via link

## Tech Stack

**Frontend**

* React (Vite)
* Tailwind CSS

**Backend**

* Node.js
* Express

**Database**

* Supabase (PostgreSQL)

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
3. Select an existing company or create a new one
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

## Improvement Plan

### Product Improvements

* Add proper authentication and recruiter authorization
* Enforce recruiter-to-company ownership on backend
* Support real file uploads (logo, banner, gallery)
* Add job application links
* Expand job fields (department, salary, experience level, etc.)
* Improve section system with more content types
* Add drag-and-drop section reordering
* Improve publish/version control

### UX Improvements

* Better loading states and transitions
* Improved empty states
* Clear success/error feedback
* Accessibility improvements
* Better navigation on public pages
* Stronger desktop UI hierarchy

### Engineering Improvements

* Introduce proper routing (React Router)
* Improve shared state and data fetching patterns
* Add validation for API payloads
* Add unit and end-to-end tests
* Improve logging and observability
* Optimize API calls on landing page
* Add caching for public careers pages

## Known Limitations

* Authentication is flow-based (not production-grade)
* File uploads are URL-based only
* Some public pages rely on fallback if not published
* No full routing system implemented yet
* Testing coverage is limited

