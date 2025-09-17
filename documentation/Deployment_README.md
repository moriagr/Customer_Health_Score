# Deployment Documentation
## Live URL
## Deployment Steps
1. Clone repo and `cd` into project.
   
## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
- A Heroku account
- Project structure:
  ```bash
  project-root/
  |- backend/
  |- frontend/
  |- Dockerfile
  |- docker-compose.yml
  ```

---

## Heroku Setup

### Step 1: Prepare React Frontend
1. Go to the frontend folder:
```bash
cd frontend 
```
1. Build React for production:
```bash
npm install
npm run build
```
1. This creates a `build/` folder inside frontend/

### Step 2: Prepare PostgreSQL for Heroku

1. Add PostgreSQL add-on to Heroku:

```bash
heroku addons:create heroku-postgresql:hobby-dev
```
2. Heroku will create a `DATABASE_URL` environment variable automatically.
3. Update your backend to use it:

### Step 3: Create Procfile
In the root of your project, create a file named `Procfile` (no extension):
```bash
web: node backend/server.js
```

### Step 4: Set Environment Variables on Heroku
```bash
heroku login
heroku create your-app-name
heroku config:set NODE_ENV=production
# DATABASE_URL is automatically set if you added PostgreSQL add-on

```

### Step 5: Push to Heroku
1. Make sure your build folder is committed:
```bash
git add frontend/build
git commit -m "Add frontend build"
```

2. Push to Heroku:
```bash
git push heroku main
```

### Step 6: Run DB Migrations (if needed)

If you have SQL schema files:
```bash
heroku pg:psql < schema.sql
```

### Step 7: Open Your App

```bash
heroku open
```
Your live URL will look like:
React frontend loads.

API routes like `/api/customers` work on the same domain.