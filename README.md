# Faculty Appraisal System — JIIT

A full-stack faculty appraisal management system for JIIT (Jaypee Institute of Information Technology). Faculty members fill out multi-section appraisal forms, and HODs can review all faculty data from a dashboard.

---

## 📐 Architecture Overview

The system consists of **4 services** that all need to be running:

| Service | Tech Stack | Default Port | Purpose |
|---|---|---|---|
| **MongoDB** | MongoDB (via Docker) | `27017` | Shared database for all services |
| **Django Backend** | Django 5 + DRF + PyMongo | `8001` | REST API — appraisal form ingestion & retrieval (legacy) |
| **FastAPI Backend** | FastAPI + Motor (async) | `8000` | REST API — appraisal form ingestion & retrieval (current) |
| **Next.js Frontend** | Next.js **15.5.9** + NextAuth v5 + Tailwind + shadcn/ui | `3000` | Web portal — login, appraisal forms, HOD dashboard |

> **Note:** The frontend's API calls point to `http://localhost:8000` by default (the FastAPI backend). The Django backend is an older/alternate implementation on port `8001`. You need **at least** MongoDB + FastAPI + Next.js running.

```
┌──────────────┐      ┌─────────────────┐      ┌──────────────┐
│   Next.js    │─────▶│  FastAPI / Django│─────▶│   MongoDB    │
│  (Port 3000) │      │  (Port 8000/8001)│      │  (Port 27017)│
│              │─────▶│                  │      │  (Docker)    │
│  NextAuth +  │      │  PyMongo / Motor │      └──────────────┘
│  Mongoose    │──────┘                  │              ▲
│  (direct DB) │────────────────────────────────────────┘
└──────────────┘   (Auth uses Mongoose directly)
```

---

## 🔧 Prerequisites

Make sure you have these installed on your machine:

- **Node.js** ≥ 18 (for the Next.js frontend) — [Install](https://nodejs.org/)
- **npm** (comes with Node.js) or **bun**
- **Python** ≥ 3.11 (for the backends) — [Install](https://www.python.org/downloads/)
- **pip** (comes with Python)
- **Docker** + **Docker Compose** (for MongoDB) — [Install](https://docs.docker.com/get-docker/)
- **uv** (recommended for FastAPI backend) — `pip install uv` or [Install](https://docs.astral.sh/uv/getting-started/installation/)

---

## 🚀 Step-by-Step Setup

### Step 1 — Clone the Repository

```bash
git clone https://github.com/ShauryaRahlon/faculty-appraisal-system.git
cd faculty-appraisal-system
```

---

### Step 2 — Start MongoDB (Docker)

```bash
docker compose up -d
```

This starts a MongoDB instance on `localhost:27017`. Data is persisted in `./data/db`.

> **Without Docker?** You can install MongoDB locally and ensure it's running on port 27017. Or use a cloud MongoDB URI (MongoDB Atlas) and update the env files accordingly.

---

### Step 3 — Set Up Environment Files

You need to create **2 env files**: one for the Django/FastAPI backends and one for the Next.js frontend.

#### 3a. Backend `.env` (for both Django & FastAPI)

Create the file at: **`django-backend/.env`**

```env
MONGO_URI=mongodb://localhost:27017/
APPRAISAL_SYSTEM_MONGO_DB_NAME=faculty_appraisal_db
DATA_INJECTION_COLLECTION_NAME=form_data_collection
FACULTY_DATA_COLLECTION_NAME=faculty_data_collection
```

> The FastAPI backend has its own `.env` file at `fastapi-backend/.env`. It uses `pydantic-settings` to load these values and falls back to defaults if the file is missing. Both backends share the same env file.

| Variable | Description | Default |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/` |
| `APPRAISAL_SYSTEM_MONGO_DB_NAME` | Database name in MongoDB | `faculty_appraisal_db` |
| `DATA_INJECTION_COLLECTION_NAME` | Collection for appraisal form data | `form_data_collection` |
| `FACULTY_DATA_COLLECTION_NAME` | Collection for faculty metadata | `faculty_data_collection` |

#### 3b. Frontend `.env.local` (for Next.js)

Create the file at: **`jiit-portal/.env.local`**

```env
# MongoDB connection (used by NextAuth & Mongoose for user auth)
MONGODB_URI=mongodb://localhost:27017/faculty_appraisal_db

# NextAuth Configuration
AUTH_SECRET=your-random-secret-key-here-generate-one-below
AUTH_URL=http://localhost:3000

# Backend API URL (FastAPI)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# SMTP Configuration (for OTP emails on first login)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

| Variable | Description | How to Get It |
|---|---|---|
| `MONGODB_URI` | Full MongoDB URI **including the database name** | Use `mongodb://localhost:27017/faculty_appraisal_db` for local Docker |
| `AUTH_SECRET` | Random secret for NextAuth session encryption | Run: `openssl rand -base64 32` |
| `AUTH_URL` | Base URL of the Next.js app | `http://localhost:3000` for local dev |
| `NEXT_PUBLIC_API_BASE_URL` | URL of the FastAPI (or Django) backend | `http://localhost:8000` for FastAPI |
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` for Gmail |
| `SMTP_PORT` | SMTP server port | `587` for Gmail TLS |
| `SMTP_USER` | Email address for sending OTPs | Your Gmail address |
| `SMTP_PASS` | Email password / app-specific password | [Generate a Gmail App Password](https://myaccount.google.com/apppasswords) |
| `SMTP_FROM` | "From" address on OTP emails | Same as `SMTP_USER` |

> **💡 Generating `AUTH_SECRET`:**
> ```bash
> openssl rand -base64 32
> ```
> Copy the output and paste it as the value.

> **💡 Gmail App Password:** If using Gmail, you must enable 2FA on your Google account, then go to [App Passwords](https://myaccount.google.com/apppasswords) to generate a 16-character app password. Use that instead of your regular Gmail password.

---

### Step 4 — Set Up & Run the FastAPI Backend

```bash
cd fastapi-backend

# Create a virtual environment
python3 -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate

# Install dependencies (Option A: using pip)
pip install fastapi motor pydantic-settings pymongo python-dotenv uvicorn

# Install dependencies (Option B: using uv — recommended)
uv sync

# Run the server
python main.py
```

The FastAPI backend will start at **http://localhost:8000**.  
You should see: `{"message":"Faculty Appraisal System API is running"}` when you visit it.

---

### Step 5 — (Optional) Set Up & Run the Django Backend

> Only needed if you want to use the Django API instead of / alongside FastAPI.

```bash
cd django-backend

# Create a virtual environment
python3 -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python manage.py runserver 8001
```

The Django backend will start at **http://localhost:8001**.

> If you want the frontend to use Django instead of FastAPI, change `NEXT_PUBLIC_API_BASE_URL` in your `.env.local` to `http://localhost:8001`.

---

### Step 6 — Set Up & Run the Next.js Frontend

```bash
cd jiit-portal

# Install dependencies
npm install

# Run the dev server
npm run dev
```

The frontend will start at **http://localhost:3000**.

---

### Step 7 — Seed the Database with Faculty Users

Once all services are running, you need to populate the database with faculty user accounts.

Open your browser and visit:

```
http://localhost:3000/api/seed
```

This hits a built-in API route that creates **136 faculty users + 1 Admin user** from a hardcoded dataset. Each faculty user gets:
- **Employee Code** (e.g., `JIIT1068`)
- **Default password:** `jiit123` (bcrypt-hashed)
- **Default email:** `{lowercase_name}@jiit.ac.in`
- **Role:** `faculty`
- **isVerified:** `false` (requires OTP on first login)

The **Admin** user is also created automatically:
- **Employee Code:** `ADMIN`
- **Password:** `Admin128`
- **Role:** `admin`
- **isVerified:** `true` (no OTP needed)

> ⚠️ Only run this once. If you run it again, it will skip existing users (upsert behavior).  
> To force re-seed (delete all users and recreate): visit `http://localhost:3000/api/seed?force=true`

---

### Step 8 — Login & Use

**Faculty Login:**
1. Go to **http://localhost:3000** → redirects to `/login`
2. Enter an employee code (e.g., `JIIT1068`) and the password `jiit123`
3. Since it's a first login (`isVerified: false`), an OTP will be sent to the faculty's email
4. Enter the OTP on the verification page
5. Set a new password on the change-password page
6. Login again with your new password → redirected to the **faculty dashboard**

**Admin Login (HOD Dashboard):**
1. Go to **http://localhost:3000/login**
2. Enter `ADMIN` as Employee Code and `Admin128` as password
3. Redirected directly to the **HOD dashboard** (no OTP required)

> **🛑 If SMTP is not configured:** The OTP will be logged to the terminal running Next.js. Look for `Sending OTP 123456 to ...` in the console output. You can use that OTP manually.

---

## 📁 Project Structure

```
faculty-appraisal-system/
├── docker-compose.yml          # MongoDB container
├── CSEIT_faculty major project.csv  # Source faculty data
│
├── django-backend/             # Django REST API (port 8001)
│   ├── .env.example            # Environment template
│   ├── manage.py
│   ├── requirements.txt
│   ├── faculty_apprasial_system/  # Django project settings
│   │   ├── settings.py
│   │   └── urls.py
│   ├── appraisal_form_injestion/  # Form data CRUD app
│   │   ├── views.py            # API views (13 endpoints)
│   │   ├── urls.py
│   │   ├── services/           # Business logic
│   │   └── clients/            # MongoDB client
│   ├── faculty_admin/          # Faculty management app
│   └── common/                 # Shared MongoDB client
│
├── fastapi-backend/            # FastAPI async API (port 8000)
│   ├── main.py                 # Entry point
│   ├── app/
│   │   ├── main.py             # FastAPI app + CORS + routers
│   │   ├── core/config.py      # Pydantic Settings (env loading)
│   │   ├── db/mongo.py         # Async MongoDB client (Motor)
│   │   ├── api/endpoints/      # Route handlers
│   │   ├── services/           # Business logic
│   │   └── utils/              # Utilities
│
├── jiit-portal/                # Next.js 15.5.9 frontend (port 3000)
│   ├── package.json
│   ├── auth.ts                 # NextAuth v5 config (credentials provider)
│   ├── middleware.ts           # Route protection (auth + role-based access)
│   ├── app/
│   │   ├── page.tsx            # Root → redirects to /login
│   │   ├── login/              # Login page
│   │   ├── verify-otp/         # OTP verification page
│   │   ├── change-password/    # Password change page
│   │   ├── dashboard/          # Faculty dashboard
│   │   ├── appraisal/          # Multi-section appraisal forms
│   │   ├── hod/                # HOD review dashboard
│   │   └── api/                # Next.js API routes
│   │       ├── auth/           # NextAuth handlers
│   │       ├── login/route.ts  # Custom login + OTP flow
│   │       ├── verify-otp/     # OTP verification endpoint
│   │       ├── change-password/# Password change endpoint
│   │       └── seed/route.ts   # Database seeding endpoint
│   ├── lib/
│   │   ├── dbConnect.ts        # Mongoose connection
│   │   ├── api.ts              # Backend API client helpers
│   │   ├── constants.ts        # API endpoints + section config
│   │   ├── mail.ts             # Nodemailer OTP emails
│   │   └── types.ts            # TypeScript types
│   ├── models/
│   │   └── User.ts             # Mongoose User schema
│   └── components/             # UI components (shadcn/ui)
```

---

## 🔌 API Endpoints

### FastAPI / Django Backend (`/api/...`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/get-item-by-section/?user_id=...&section=...` | Get appraisal data for a user + section |
| `POST` | `/api/injest-item-1-to-10/` | Submit general details (sections 1-10) |
| `POST` | `/api/injest-item-11/` | Submit conference/events data |
| `POST` | `/api/injest-item-12-1/` | Submit lectures/tutorials data |
| `POST` | `/api/injest-item-12-2/` | Submit reading material data |
| `POST` | `/api/injest-item-12-3-to-12-4/` | Submit project guidance data |
| `POST` | `/api/injest-item-13/` | Submit student activities data |
| `POST` | `/api/injest-item-14/` | Submit research papers data |
| `POST` | `/api/injest-item-15/` | Submit books & chapters data |
| `POST` | `/api/injest-item-16/` | Submit research projects data |
| `POST` | `/api/injest-item-17/` | Submit research guidance data |
| `POST` | `/api/injest-item-18/` | Submit memberships data |
| `POST` | `/api/injest-item-19/` | Submit other information |
| `GET` | `/api/get-all-faculty-data/` | Get all faculty data (HOD dashboard) |

### Next.js API Routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/login` | Login + trigger OTP for unverified users |
| `POST` | `/api/verify-otp` | Verify OTP and mark user as verified |
| `POST` | `/api/change-password` | Change user password |
| `GET` | `/api/seed` | Seed database with faculty user accounts |
| `*` | `/api/auth/*` | NextAuth session handlers |

---

## 🧹 Quick Start (TL;DR)

```bash
# 1. Start MongoDB
docker compose up -d

# 2. Create backend env
cp django-backend/.env.example django-backend/.env

# 3. Create frontend env
cat > jiit-portal/.env.local << 'EOF'
MONGODB_URI=mongodb://localhost:27017/faculty_appraisal_db
AUTH_SECRET=CHANGE_ME_run_openssl_rand_base64_32
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
EOF

# 4. Start FastAPI backend (Terminal 1)
cd fastapi-backend && python3 -m venv .venv && source .venv/bin/activate
pip install fastapi motor pydantic-settings pymongo python-dotenv uvicorn
python main.py

# 5. Start Next.js frontend (Terminal 2)
cd jiit-portal && npm install && npm run dev

# 6. Seed the database
# Open browser → http://localhost:3000/api/seed

# 7. Login
# Open browser → http://localhost:3000
# Use employee code: JIIT1068, password: jiit123
```

---

## ⚠️ Next.js Version & Future Migration Notes

This project currently runs on **Next.js 15.5.9** with **NextAuth v5 (beta)**.

### Middleware (`middleware.ts`)

Route protection is implemented using `middleware.ts` with JWT-based token checks via `next-auth/jwt`. This is the **stable, recommended approach** for Next.js 15.x.

> **🔮 Next.js 16+ Migration:** If upgrading to **Next.js 16 or later**, `middleware.ts` may be deprecated in favor of the new **`proxy.ts`** API. When migrating:
> 1. Review the [Next.js 16 release notes](https://nextjs.org/blog/next-16) for breaking changes
> 2. Replace `middleware.ts` with the equivalent `proxy.ts` configuration
> 3. Update route matching patterns to the new proxy API syntax
> 4. Ensure `next-auth` is compatible with the target Next.js version
> 5. Test all protected routes (`/dashboard`, `/hod/*`, `/appraisal/*`) after migration

### Key Version Dependencies

| Package | Current Version | Notes |
|---|---|---|
| `next` | `^15.5.9` | Pinned to 15.x — do NOT upgrade to 16 without proxy migration |
| `next-auth` | `^5.0.0-beta.30` | Auth.js v5 beta — check for stable release before upgrading |
| `bcryptjs` | latest | Password hashing |
| `mongoose` | latest | MongoDB ODM for user auth |

---

## 🛠 Troubleshooting

| Issue | Solution |
|---|---|
| `MongoServerError: connect ECONNREFUSED` | Make sure MongoDB is running: `docker compose up -d` |
| `Error: Please define the MONGODB_URI environment variable` | Create `jiit-portal/.env.local` with the `MONGODB_URI` variable |
| `AUTH_SECRET` missing error | Add `AUTH_SECRET` to `jiit-portal/.env.local` |
| OTP email not sending | Check SMTP credentials. If not configured, look for OTP in the Next.js terminal console output |
| `ModuleNotFoundError: No module named 'fastapi'` | Activate your venv and install deps: `pip install fastapi uvicorn motor pydantic-settings pymongo python-dotenv` |
| Port 8000 already in use | Kill the existing process: `lsof -ti:8000 \| xargs kill` |
| Port 3000 already in use | Kill the existing process: `lsof -ti:3000 \| xargs kill` |
| Seed shows "0 users" | Users already exist. Use `?force=true` to re-seed: `/api/seed?force=true` |
| Admin redirected to wrong dashboard | Restart dev server and re-seed with `?force=true` to refresh the `role` field |

---

## 👥 Authors

- **Arsh Gupta** — [arshgupta2004@gmail.com](mailto:arshgupta2004@gmail.com)
