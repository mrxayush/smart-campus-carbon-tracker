# Smart Campus Carbon Footprint & Energy Tracker 🌱⚡

A production-ready, full-stack sustainability platform engineered with **Spring Boot 3 (REST, JPA, Security with JWT)** and **React 18 (Tailwind CSS, Axios)**. 

The application enables academic campuses to track departmental electricity (kWh) and water consumption (Litres), converting these raw metrics into verifiable **Carbon Footprint ($\text{kg CO}_2\text{e}$)** via environmental emission factors.

---

## 🚀 Key Highlights & Architecture

- **Role-Based Access Control (RBAC):**
  - **Campus Admin (`ROLE_ADMIN`):** Full read & write permissions. Can log new departmental energy readings, update records, and delete outdated entries.
  - **Student / Standard User (`ROLE_STUDENT`):** Read-only dashboard view. Accesses real-time carbon statistics, rankings, and reports.
- **Automated Carbon Calculation Engine:** Automatically derives carbon emission metrics on write/update requests:
  $$\text{Carbon Footprint (kg CO}_2\text{e)} = (\text{Electricity}_{\text{kWh}} \times 0.82) + (\text{Water}_{\text{Litres}} \times 0.0003)$$
- **Security-First Backend:** Stateless JWT authentication (`OncePerRequestFilter`), `SecurityContextHolder`, `BCryptPasswordEncoder`, and method/endpoint security.
- **Modern Dashboard UI:** Built with Tailwind CSS, metric summary cards, departmental emission distribution ranking bars, client-side search, real-time formula preview, and responsive data tables.
- **Interactive API Documentation:** Embedded OpenAPI 3 / Swagger UI with Bearer Token integration.
- **Instant Out-of-the-Box Evaluation:** Pre-configured with H2 in-memory database and seed data (default admin, student, and 7 department energy records).

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Spring Boot 3.2.3, Spring Security 6, Spring Data JPA, JJWT (HMAC-SHA256), H2 Database, SpringDoc OpenAPI 3 |
| **Frontend** | React 18, Tailwind CSS 3, Axios, Plus Jakarta Sans |
| **Build Tools** | Maven (Java 17+), npm (Node.js 18+) |

---

## ⚙️ How to Run Locally

### 1. Start the Spring Boot Backend

```bash
cd backend
mvn clean spring-boot:run
```
- Server starts at: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:carbontrackerdb`, User: `sa`, Password: *blank*)

### 2. Start the React Frontend

```bash
cd frontend
npm install
npm start
```
- Frontend starts at: `http://localhost:3000`

---

## 🔑 Pre-Seeded Demo Credentials

| Role | Username | Password | Capabilities |
|---|---|---|---|
| **Campus Admin** | `admin` | `admin123` | View Dashboard + Log, Update, and Delete Records |
| **Student** | `student` | `student123` | View Dashboard, Stats & Ledger (Read-Only) |

*Quick login buttons are directly available on the login page for effortless switching!*

---

## 📡 REST API Summary

| Method | Endpoint | Access Level | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticates user; returns JWT Bearer token |
| `POST` | `/api/auth/register` | Public | Registers a new user account |
| `GET` | `/api/records` | `ROLE_ADMIN`, `ROLE_STUDENT` | Retrieves all records (supports `?department=...`) |
| `GET` | `/api/records/stats` | `ROLE_ADMIN`, `ROLE_STUDENT` | Aggregated sustainability metrics & breakdown |
| `GET` | `/api/records/{id}` | `ROLE_ADMIN`, `ROLE_STUDENT` | Retrieves specific energy record |
| `POST` | `/api/records` | `ROLE_ADMIN` Only | Logs new departmental consumption (computes $\text{CO}_2$) |
| `PUT` | `/api/records/{id}` | `ROLE_ADMIN` Only | Updates consumption and recalculates $\text{CO}_2$ |
| `DELETE` | `/api/records/{id}` | `ROLE_ADMIN` Only | Deletes energy record |
