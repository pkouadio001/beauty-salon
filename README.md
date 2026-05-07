# Beauty Salon — Appointment Booking System

A full-stack web application that allows clients to book hair salon appointments online. The platform supports three roles: **customers**, **employees**, and **admins**, each with their own dashboard and capabilities.

---

## Tech Stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, DaisyUI |
| Backend  | Spring Boot 4, Java 26, Spring Security, Spring Data JPA |
| Database | PostgreSQL                                      |

---

## Project Structure

```
hairstyle/
├── backend/    # Spring Boot REST API
└── frontend/   # React + TypeScript SPA
```

---

## Features

- **Customer**: Register, log in, browse available care services, book appointments, and view appointment history.
- **Employee**: View assigned appointments and update appointment statuses.
- **Admin**: Full visibility of all appointments, ability to reassign providers and manage the salon.

---

## Prerequisites

- Java 26+
- Maven (or use the included `mvnw` wrapper)
- Node.js 18+ and npm
- PostgreSQL running on port `5433`

---

## Running the Project

### 1. Database Setup

Create a PostgreSQL database and schema:

```sql
CREATE SCHEMA hairstyle;
```

The default connection details (configurable in `backend/src/main/resources/application.properties`):

| Property | Default value                                              |
|----------|------------------------------------------------------------|
| URL      | `jdbc:postgresql://localhost:5433/postgres?currentSchema=hairstyle,public` |
| Username | `postgres`                                                 |
| Password | `password123`                                              |

> The schema and seed data are automatically applied on startup via `schema.sql` and `data.sql`.

---

### 2. Backend

```bash
cd backend
./mvnw spring-boot:run
```

On Windows:

```bash
cd backend
mvnw.cmd spring-boot:run
```

The API will be available at `http://localhost:8080`.

---

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Overview

| Method | Endpoint                                    | Description                        |
|--------|---------------------------------------------|------------------------------------|
| POST   | `/api/auth/register`                        | Register a new customer            |
| POST   | `/api/auth/login`                           | Log in and receive a session       |
| GET    | `/api/v1/appointments/all`                  | Get all appointments (admin)       |
| GET    | `/api/v1/appointments/{customerId}/customer`| Get appointments for a customer    |
| GET    | `/api/v1/appointments/{employeeId}/employee`| Get appointments for an employee   |
| POST   | `/api/v1/appointment/book`                  | Book a new appointment             |
| PATCH  | `/api/v1/appointments/{id}/status`          | Update appointment status          |
| PATCH  | `/api/v1/appointments/{id}/provider`        | Reassign appointment to employee   |

---

## Security

Routes are protected by role:

- `/api/auth/**` — Public (login/register)
- `/api/customer/**` — Requires `CUSTOMER` role
- `/api/employee/**` — Requires `EMPLOYEE` role
- `/api/admin/**` — Requires `ADMIN` role

