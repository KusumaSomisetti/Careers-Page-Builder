# Deployment

## Architecture
- Frontend: Vercel (`client`)
- Backend: Render (`server`)
- Database: Supabase

## 1. Deploy the backend to Render

### Render settings
- Service type: `Web Service`
- Root directory: `server`
- Runtime: `Node`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`

### Backend environment variables
Set these in Render:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=3000
PUBLIC_APP_URL=https://your-vercel-app.vercel.app
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

After deploy, note the Render URL, for example:

```text
https://hirepoint-api.onrender.com
```

## 2. Deploy the frontend to Vercel

### Vercel settings
- Framework preset: `Vite`
- Root directory: `client`

### Frontend environment variables
Set this in Vercel:

```env
VITE_API_BASE_URL=https://your-render-service.onrender.com/api
```

## 3. Update the backend public app URL

After Vercel gives you the final frontend URL, make sure Render has:

```env
PUBLIC_APP_URL=https://your-vercel-app.vercel.app
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

Redeploy Render if you changed those values.

## 4. Verify

Check these after deployment:
- Render health endpoint: `https://your-render-service.onrender.com/api/health`
- Frontend loads company data correctly
- Recruiter flow works
- Saving draft and fetching jobs work from Vercel
- Share link points to the deployed frontend URL

After every new commit in github the vercel and render will redeploy automatically.
