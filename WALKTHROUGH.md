# Enterprise Hospital Management System (HMS) — Comprehensive System Walkthrough

An enterprise-grade, full-stack Hospital Management System (MERN) designed for scalable clinical operations, real-time patient care, role-based security, and high-definition healthcare visualization.

---

## 👨‍💻 Developer Information

- **Lead Developer**: **M.jawad khan**
- **Phone / Contact**: `03044707155`
- **Email**: `jawad.khan4915@gmail.com`
- **Architecture**: MERN Stack (Node.js, Express 4, MongoDB/Mongoose 8, React 18, Vite 5, Tailwind CSS, Framer Motion)

---

## 🌟 Key System Features

1. **6 Role-Based Workspaces (RBAC)**:
   - **Admin Workspace**: System oversight, staff onboarding, global audit logging, security metrics.
   - **Doctor Workspace**: Patient consultation queue, Electronic Health Records (EHR), digital e-prescription slips.
   - **Receptionist Workspace**: Emergency check-in desk, appointment scheduling, doctor availability calendars.
   - **Patient Portal**: Online appointment booking, active QR prescription slip scanner, personal health timeline, billing statements.
   - **Nurse Workspace**: Ward & bed telemetry, patient vital signs logging, treatment execution logs.
   - **Pharmacist Workspace**: Medication stock inventory, QR code dispensary scanner, fulfillment logs.

2. **Classic Healthcare Aesthetic & Real Photography**:
   - Replaced 3D wireframes and neon artificial glows with a **classic, dignified clinical design system** (Deep Slate Navy `#0f172a`, Royal Blue `#0369a1`, Clinical Teal `#0284c7`, Emerald `#059669`).
   - Integrated high-resolution, curated hospital photography showcasing real surgical suites, doctor consultation rooms, diagnostic labs, and emergency desks.

3. **QR Digital Prescriptions & Slips**:
   - Instant QR code generation for digital prescriptions allowing pharmacists to verify medicine dosages and dispense status securely.

---

## 🛡️ Comprehensive Security Hardening

The system has been fortified with enterprise-grade threat defenses:

| Security Domain | Applied Security Mechanism |
|---|---|
| **HTTP Security Headers** | **Helmet**: Content-Security-Policy (CSP), HSTS (`maxAge: 31536000`), `X-Frame-Options: DENY` (anti-clickjacking), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`. |
| **NoSQL Query Injection** | Custom recursive sanitizer middleware stripping `$` and `.` MongoDB operators from `req.body`, `req.query`, and `req.params`. |
| **XSS Script Stripping** | Global input sanitizer cleaning dangerous `<script>`, `<iframe>`, and event handler injections from user strings. |
| **Brute-Force Auth Protection** | Strict rate limiter (`authRateLimiter`) capping login & MFA attempts to 5 requests per 15-minute window per IP. |
| **DoS & Payload Size Capping** | Capped Express payload body limit to `100kb` to defend against Buffer Exhaustion and ReDoS attacks. |
| **Database Projection Defense** | Set `select: false` on `password` and `mfaSecret` schema fields in `User.js` to eliminate accidental hash leaks in API returns. |
| **RBAC Route Auditing** | Explicit `authorizeRoles` enforcement across all API endpoints (appointments, billing, records, staff, patients). |
| **Log Data Masking** | Winston log sanitizer masking passwords, tokens, OTP codes, and credit card numbers from log files. |

---

## ⚙️ Environment Variables (Render & Vercel)

### 1. Render Environment Variables (Backend Web Service)

Set these variables in your **Render Web Service Dashboard** under **Environment**:

```env
# --- Server Environment ---
NODE_ENV=production
PORT=10000

# --- Database Connection (MongoDB Atlas) ---
# Replace <user>, <password>, and <cluster> with your Atlas credentials
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/hms?retryWrites=true&w=majority

# --- JWT Authentication Secret ---
# Use a strong 64-character random secret key for production token signing
JWT_SECRET=f8c9b3a1d4e2f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0

# --- CORS Allowed Origin (Vercel Frontend URL) ---
# Points to your deployed Vercel frontend URL (without trailing slash)
FRONTEND_URL=https://hospital-management-system.vercel.app
```

---

### 2. Vercel Environment Variables (Frontend Web App)

Set these variables in your **Vercel Project Settings** under **Environment Variables**:

```env
# --- Production Backend API URL ---
# Points to your deployed Render backend web service URL (without trailing slash)
VITE_API_URL=https://enterprise-hms-backend.onrender.com
```

---

## 🚀 Quick Local Setup Instructions

### Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017/hms` OR MongoDB Atlas URI.

### Step 1: Install Dependencies
```bash
# Install root and backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install
```

### Step 2: Seed Initial Data (Demo Accounts)
```bash
# Seed 6 role accounts & sample medical data
npm run seed
```

### Step 3: Run Development Server
```bash
# Start concurrently (Backend on port 5000, Frontend on port 5173/3000)
npm run dev
```

---

## 🌐 Production Deployment Steps

### Deploying Backend to Render
1. Push your repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) -> **New Web Service**.
3. Select your repository and set:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
4. Add the 4 environment variables listed above (`NODE_ENV`, `PORT`, `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`).

### Deploying Frontend to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/) -> **New Project**.
2. Select your repository and choose the `frontend` root directory.
3. Add the `VITE_API_URL` environment variable set to your Render backend URL.
4. Click **Deploy**.
