# Faculty Appraisal System: Architecture & Workflow Guide

This document explains the end-to-end data flow of the Faculty Appraisal System. It is designed to help new developers understand how the frontend Next.js application, the FastAPI backend, and MongoDB interact to provide a seamless, persistent user experience.

---

## 🏗️ High-Level Architecture
The system uses an **Optimistic Local Cache with Background Server Sync** pattern. 
- The frontend feels instantly responsive because it reads/writes directly to the browser's `localStorage`.
- The backend serves as the permanent source of truth, ensuring progress is never lost across devices, incognito windows, or browser clears.

---

## 🔄 The Step-by-Step Workflow

### Step 1: Authentication & Identity Establishment
1. A faculty member logs in via the Next.js `/login` page.
2. **NextAuth** queries the MongoDB `users` collection to verify credentials.
3. Upon success, NextAuth creates a JWT session. Crucially, it attaches the user's `employeeCode` (e.g., `"JIIT1068"`) to the session object. 
4. *Why this matters:* The `employeeCode` acts as the universal `user_id` across the entire stack, linking the Auth database with the Form Data database.

### Step 2: Initialization & Hydration (Loading Saved Data)
1. Once logged in, the `SessionSync` component extracts the `employeeCode` from the session and saves it to `localStorage` as `user_id`.
2. Immediately, the `useServerSync` custom hook fires. It makes a request to the FastAPI endpoint `GET /api/get-appraisal-progress/`.
3. **Hydration:** If the server has saved form data for this `employeeCode` (and the local browser is empty), the server data is injected into `localStorage`. 
4. The React UI re-renders, and the user instantly sees all their previously filled checkboxes, text fields, and completed sections.

### Step 3: Drafting & Form Interaction
1. The user navigates to a section (e.g., *Section 14: Research Papers*) and starts filling out the form.
2. The form relies on `react-hook-form`. As the user types, the state is managed entirely in the client's memory. No network requests are made while typing, ensuring zero lag.

### Step 4: Submission & Dual-Save Mechanism
When the user finishes a section and clicks **"Submit"**, two parallel processes occur:

**A. API Score Calculation (Business Logic)**
- The frontend calls a specific FastAPI endpoint for that section (e.g., `POST /api/injest-item-14/`).
- FastAPI receives the data, calculates the "API Score" based on institutional rules, and saves the data + score to the MongoDB `form_data_collection`.

**B. Background State Sync (Draft Persistence)**
- The frontend updates its `localStorage` with the newly submitted section data.
- This update triggers our **Auto-Sync mechanism** in `lib/localStorage.ts`.
- After a 1.5-second debounce (to prevent spamming the server), the frontend silently sends the *entire* `localStorage` state to `POST /api/sync-appraisal-progress/`.
- FastAPI saves this raw blob into the `frontend_progress` field in MongoDB. 

### Step 5: HOD / Admin Dashboard
1. When an HOD logs in and views the administrative dashboard, the frontend calls `GET /api/get-all-faculty-data/`.
2. FastAPI queries the `form_data_collection` in MongoDB and returns the calculated scores and completed sections for all faculty members.
3. Because the API scores were pre-calculated during Step 4A, the dashboard loads incredibly fast without needing to compute scores on the fly.

---

## 🔑 Key Changes

- **Source of Truth:** For the *UI state* (what the user sees in the text boxes), `localStorage` is the immediate source of truth, backed up by `frontend_progress` in MongoDB. For the *Official Appraisal Scores*, the individual section keys (e.g., `"14"`, `"11"`) in MongoDB are the source of truth.
- **Debouncing:** Never remove the debounce timer in `_debouncedSyncToServer()`. It prevents race conditions and server overload if a user rapidly clicks between sections.
- **Stateless Form Pages:** Notice how the 12 individual form pages in `app/appraisal/` do not contain complex API syncing logic. They just read/write from local storage functions. Keep them dumb; let the sync layer handle the network.
