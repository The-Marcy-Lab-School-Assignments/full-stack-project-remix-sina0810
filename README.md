# Job Application Tracker App — Full-Stack 


A full-stack Job Application Tracker built with React, Express, and Postgres. This is for someone who is applying for multiple jobs. It helps users track where and when they applied, by allowing them to register and log in to their account. A user logs in, sees all their applications, and can see or update the status of each one as things progress.

## User Stories

**Auth**
- A user can register for an account with a username and password
- A user can log in to an existing account
- A user can log out
- A returning user who has an active session is automatically logged in when they revisit the app

**Job Application**
- A logged-in user can view all of their job applications
- A logged-in user can view the details of a single application
- A logged-in user can create a new job application
- A logged-in user can update the status of an application
- A logged-in user can delete a job application

## Schema

```
users
─────────────────────────────
user_id       SERIAL PRIMARY KEY
username      TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL

applications
─────────────────────────────
application_id     SERIAL PRIMARY KEY
company_name 	TEXT NOT NULL
job_title		TEXT NOT NULL
description		TEXT NOT NULL
work_type		TEXT NOT NULL
salary			INTEGER 
status			TEXT NOT NULL
date_applied	DATE
user_id 		INTEGER REFERENCES users(user_id) ON DELETE CASCADE
	
```

A user has many applications. Deleting a user cascades to delete all of their applications.

## API Contract

### Auth endpoints

| Method | Endpoint             | Request Body             | Response                          |
| ------ | -------------------- | ------------------------ | --------------------------------- |
| POST   | `/api/auth/register` | `{ username, password }` | `{ user_id, username }`           |
| POST   | `/api/auth/login`    | `{ username, password }` | `{ user_id, username }`           |
| DELETE | `/api/auth/logout`   | —                        | `{ message }`                     |
| GET    | `/api/auth/me`       | —                        | `{ user_id, username }` or `null` |

### Application endpoints (all require authentication)

| Method | Endpoint              | Request Body      | Response                                     |
| ------ | --------------------- | ----------------- | -------------------------------------------- |
| GET    | `/api/applications`     | —                 | `[{ application _id, company_name, job_title, description, work_type, salary, status, date_applied, user_id }]` |
| POST   | `/api/applications`    | `{ company_name, job_title, description, work_type, salary, status, date_applied, user_id }`       | `{ application_id, company_name, job_title, description, work_type, salary, status, date_applied, user_id}`   |
| PATCH  | `/api/applications/:application_id`|`{ status }`|`{ application_id, company_name, job_title, description, work_type, salary, status, date_applied, user_id }`   |
| DELETE | `/api/applications/:application_id` | — | `{ application_id, company_name, job_title, description, work_type, salary, status, date_applied, user_id }`   |

## Setup

### 1. Database

Create a local Postgres database:

```sh
createdb job_application_tracker
```

### 2. Server

```sh
cd server
npm install
cp .env.template .env
```

Open `.env` and fill in your Postgres credentials and a session secret. Then seed the database:

```sh
npm run db:seed
```

Start the server:

```sh
npm run dev
```

The server runs on `http://localhost:3000`.

### 3. Frontend

In a second terminal:

```sh
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`. The Vite dev proxy forwards all `/api` requests to the Express server so session cookies work correctly.

## Seed Users

After running `npm run db:seed`, these accounts are available:

| Username | Password    |
| -------- | ----------- |
| alice    | password123 |
| bob      | password123 |


## Application Structure

```
├── frontend/               # React app (Vite)
│   ├── src/
│   │   ├── App.jsx         # Root component: currentUser state, session rehydration, auth handlers
│   │   ├── adapters/
│   │   │   ├── auth-adapters.js  # Fetch adapters for /api/auth/* endpoints
│   │   │   └── application-adapters.js  # Fetch adapters for /api/applications/* endpoints
│   │   └── components/
│   │       ├── AuthPage.jsx    # Login + Register forms (shown when logged out)
│   │       ├── ApplicationPage.jsx    # Main app container (shown when logged in)
│   │       ├── AddApplicationForm.jsx # Form to create a new application
│   │       ├── ApplicationList.jsx    # Renders a list of ApplicationItems
│   │       └── ApplicationItem.jsx    # Single application: checkbox, title, delete button
│   └── vite.config.js      # Proxies /api requests to Express in development
└── server/                 # Express + Postgres API
    ├── index.js            # App entry point, route definitions
    ├── controllers/
    │   ├── authControllers.js  # register, login, logout, getMe
    │   └── applicationControllers.js  # list, create, update, delete applications
    ├── models/
    │   ├── userModel.js    # SQL queries for the users table
    │   └── applicationModel.js    # SQL queries for the applications table
    ├── middleware/
    │   ├── checkAuthentication.js  # Blocks unauthenticated requests
    │   └── logRoutes.js            # Logs each incoming request
    └── db/
        ├── pool.js         # Postgres connection pool
        └── seed.js         # Creates tables and inserts sample data
```



## Screenshots
![App Screenshot](./screenshot1.png)
![App Screenshot 2](./screenshot2.png)