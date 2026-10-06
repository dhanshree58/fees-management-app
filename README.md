# Fees Management System

A professional starter fee-management application built with **React + Vite**, **Node.js + Express**, and **PostgresSQL**.

## Features
- Admin and Staff login
- Admin can add, edit, view, and delete students
- Staff can add/edit students and record fee payments
- Total fee, paid fee, and remaining fee calculated automatically
- Payment history with date, mode, and note
- Dashboard statistics
- Student search
- Prevents payment above remaining fee
- Responsive UI


## Default accounts
- Admin: `admin` / `admin123`
- Staff: `staff` / `staff123`

Change these credentials and the JWT secret before production use.

## Run backend
```bash
cd backend
npm install
npm start
```
Backend runs on `http://localhost:5000`.

## Run frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Then open the URL shown by Vite, usually `http://localhost:5173`.

## Database
The backend creates `backend/fees.db` automatically on first run.

## Production notes
For a real school deployment, add password hashing (bcrypt/argon2), HTTPS, proper secret management, audit logs, database backups, and server-side validation. You can later add receipts, installments, academic years, classes, discounts, reports, and Excel/PDF export.
