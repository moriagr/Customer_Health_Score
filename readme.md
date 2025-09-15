# 🧑‍💻 Customer Health Dashboard

A full-stack application for monitoring **customer health scores** based on invoices, tickets, and product usage events.  
The system provides insights into customer segments, health score trends, and potential risks.  

---

## 🚀 Features
- Customer list with health scores
- Detailed customer view (events, invoices, tickets)
- Real-time health score calculation
- Error & loading handling with reusable UI components
- Designed UI components (CustomButton, ErrorBox, ProgressBar, Loading)
- Automated testing with **80%+ coverage** for critical operations

---

## 🛠️ Tech Stack
### Frontend
- React + TypeScript
- CSS Modules for styling
- fetch for API calls

### Backend
- Node.js + Express
- PostgreSQL (with init.sql for schema)
- Health score calculation logic

### Infrastructure
- Docker & Docker Compose
- ESLint + Prettier for code quality
- Jest + React Testing Library for tests

---

## ⚙️ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/moriagr/customer-health-dashboard.git
cd customer-health-dashboard
```

### 2. Environment Variables

Create `.env` files for backend and frontend. Example for backend:

```ini
DB_USER=postgres
DB_PASS=postgres
DB_HOST=db
DB_PORT=5432
DB_NAME=customer_health
PORT=8000

```
---
## Run with Docker (Recommended)

Make sure you have Docker & Docker Compose installed.

```bash
docker-copmose up --build
```

This will start:

- Backend at http://localhost:8000/api
- Frontend at http://localhost:3000
- Postgres DB at localhost:5432
---
## 2. Run without Docker (Recommended)

### Backend
```bash
cd backend
npm install
npm run dev
```

Backend will run on: http://localhost:8000/api

### Frontend
```bash
cd frontend
npm install
npm start
```

Frontend will run on: http://localhost:3000

### Database

Make sure PostgreSQL is running locally and matches your `.env` credentials. Run `db/init.sql` to set up schema.

---
## Running Tests

### Frontend
```bash
cd frontend
npm test
```

### Backend
```bash
cd backend
npm test
```

**Tests include:**

* **Unit tests:** Health score calculation logic

* **Integration tests:** API endpoints

* **Coverage requirement:** 80%+ on critical operations

---
## AI Collaboration Evidence

This project was developed with the support of AI tools, which assisted in:

Designing reusable UI components (Loading, ErrorBox, ProgressBar, CustomButton)

Refactoring inline styles into CSS Modules

Researching best practices for Express routing and CORS handling

Refining health score calculation functions and backend structure

See [AI Documentation](./documentation/AI_README.md) for more details.

---
## API Documentation

The backend provides a RESTful API for managing customers, events, support tickets, and invoices, as well as fetching summarized health data for dashboards. It includes endpoints to list customers, get detailed customer health scores, add events or tickets, and retrieve dashboard statistics. Each endpoint provides clear success, error, and validation responses. 

See [API Documentation](./documentation/API_README.md) for more details.

---
## Research Documentation

The research documents the methodology behind the customer health score calculation, including metric definitions, weighting, and scoring rationale.  
See [Research Documentation](./documentation/Research_README.md.md) for more details.