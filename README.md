# Agricultural Land Lease Management System (AgriLease)

A modern full-stack web application connecting agricultural landowners who want to lease their farmland with cultivating farmers looking for land, complete with digital tenancy agreements, community reporting, and administrative governance.

---

## Architecture & Technology Stack

| Layer | Technology | Version / Spec |
| :--- | :--- | :--- |
| **Frontend** | React.js via Vite, React Router DOM, Axios | React 18, Vite 5, JavaScript |
| **Backend** | Java Spring Boot, Spring Data JPA, Spring Security, Validation | Java 17, Spring Boot 3.2.5 |
| **Security** | Stateless JWT (HMAC-SHA256) & BCrypt Password Hashing | JJWT 0.11.5 |
| **Database** | H2 In-Memory (Dev) & H2 File-Persistent Mode | H2 2.x |
| **IDEs** | VS Code (Frontend) & Spring Tool Suite / STS (Backend) | Standard Maven & npm |

---

## System Requirements & Prerequisites

- **Java Development Kit (JDK):** Version 17 or higher
- **Node.js & npm:** Node.js v18+ and npm v9+
- **Maven:** Version 3.8+ (or use STS embedded Maven)
- **IDEs:** 
  - Spring Tool Suite 4 (STS) or Eclipse for Backend
  - Visual Studio Code for Frontend

---

## Quick Start & Running Locally

### 1. Backend Setup (Spring Tool Suite / STS)

1. Open **Spring Tool Suite (STS)**.
2. Select **File $\rightarrow$ Import... $\rightarrow$ Maven $\rightarrow$ Existing Maven Projects**.
3. Choose the root folder: `c:\Users\rithv\Downloads\agricultural-land-portal` and click **Finish**.
4. Right-click the project folder $\rightarrow$ **Maven $\rightarrow$ Update Project** (<kbd>Alt</kbd> + <kbd>F5</kbd>).
5. Right-click the project $\rightarrow$ **Run As $\rightarrow$ Spring Boot App**.
6. The backend will start on **`http://localhost:8080`**.

> **Database Initialization:** On first launch, `DataInitializer` automatically creates demo accounts and initial farmland listings in the H2 database.

#### H2 Web Console Inspection:
- URL: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- JDBC URL: `jdbc:h2:mem:agridb`
- User: `sa`
- Password: *(leave blank)*

---

### 2. Frontend Setup (Visual Studio Code)

1. Open **Visual Studio Code**.
2. Open the frontend folder: `c:\Users\rithv\Downloads\agricultural-land-portal\frontend`
3. Open a terminal in VS Code (<kbd>Ctrl</kbd> + <kbd>`</kbd>) and run:
   ```bash
   npm install
   npm run dev
   ```
4. Access the frontend application at: **`http://localhost:5173`**

---

## Pre-seeded Demo Credentials

For immediate evaluation, the database includes pre-configured accounts:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@agrilease.com` | `Admin@123` | Platform-wide moderation, account suspension, review reports |
| **LANDOWNER** | `ramesh.patel@gmail.com` | `Ramesh@123` | Owns 15-Acre Anand and 12-Acre Nashik listings |
| **LANDOWNER** | `suresh.reddy@gmail.com` | `Suresh@123` | Owns 25-Acre Guntur riverbank listing |
| **FARMER** | `kavitha.farmer@gmail.com` | `Farmer@123` | Active applicant for Guntur farmland |
| **FARMER** | `vikram.singh@gmail.com` | `Farmer@123` | Holds active lease contract `LEA-2026-0001` |

*(You can also register new accounts anytime using the registration page with instant role selection).*

---

## REST API Specification

### 1. Authentication (`/api/auth`)
- `POST /api/auth/register` - Create account (`ROLE_LANDOWNER` or `ROLE_FARMER`).
- `POST /api/auth/login` - Authenticate and obtain JWT token.
- `POST /api/auth/logout` - Clear session.
- `GET /api/auth/me` - Retrieve current user profile.
- `PUT /api/auth/profile` - Update profile contact and location information.

### 2. Farmland Listings (`/api/lands`)
- `GET /api/lands` - Filter and search available lands (state, district, soil, water, budget, acreage, pagination).
- `GET /api/lands/{id}` - View complete property details.
- `POST /api/lands` - Landowner: Publish a new farmland listing.
- `PUT /api/lands/{id}` - Landowner/Admin: Update farmland listing.
- `DELETE /api/lands/{id}` - Landowner/Admin: Set listing status to `INACTIVE`.
- `GET /api/lands/my-listings` - Landowner: Retrieve properties owned by logged-in user.
- `POST /api/lands/{id}/report` - Report inaccurate or fraudulent listing.

### 3. Lease Applications (`/api/applications`)
- `POST /api/applications` - Farmer: Submit proposed acreage, duration, intended crop, and rent offer.
- `GET /api/applications/my-applications` - Farmer: View submitted proposals and status updates.
- `GET /api/applications/received` - Landowner: Review incoming farmer proposals.
- `PATCH /api/applications/{id}/approve` - Landowner: Approve application; deducts available acreage and creates `LeaseAgreement`.
- `PATCH /api/applications/{id}/reject` - Landowner: Reject application with optional reason.
- `PATCH /api/applications/{id}/cancel` - Farmer: Cancel pending application.

### 4. Lease Agreements (`/api/leases`)
- `GET /api/leases/my-leases` - View active, completed, or expired lease agreements.
- `GET /api/leases/{id}` - View complete digital agreement terms.

### 5. Admin Governance (`/api/admin`)
- `GET /api/admin/dashboard` - Platform metrics and counters.
- `GET /api/admin/users` - Inspect all registered users.
- `PATCH /api/admin/users/{id}/status` - Suspend or reactivate user account.
- `GET /api/admin/listings` - Moderate all land listings.
- `PATCH /api/admin/listings/{id}/status` - Deactivate or reactivate listing.
- `GET /api/admin/reports` - Review community flagged listings.
- `PATCH /api/admin/reports/{id}/status` - Mark report as `ACTIONED` or `DISMISSED`.

---

## Database Modes (H2)

Edit [`src/main/resources/application.properties`](file:///c:/Users/rithv/Downloads/agricultural-land-portal/src/main/resources/application.properties):

- **In-Memory Mode (Default):**
  ```properties
  spring.datasource.url=jdbc:h2:mem:agridb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
  ```
- **Persistent File-Based Mode:**
  Uncomment the line:
  ```properties
  spring.datasource.url=jdbc:h2:file:./data/agridb;DB_CLOSE_ON_EXIT=FALSE;AUTO_SERVER=TRUE
  ```

---

## Troubleshooting Guide

1. **`No goals have been specified for this build` in STS:**
   - In STS **Run As $\rightarrow$ Maven build...**, type `clean compile` into the **Goals** field before clicking Run.
2. **`npm error enoent Could not read package.json`:**
   - Ensure your terminal is in the `frontend` directory: `cd frontend && npm install`.
3. **CORS Errors:**
   - Verify frontend is running on `http://localhost:5173` and backend on `http://localhost:8080`.
   - Cross-Origin policies are configured in `SecurityConfig.java`.
4. **Port 8080 already in use:**
   - Change `server.port=8081` in `application.properties` and update `baseURL` in `frontend/src/api/client.js`.

---

## Statutory Tenancy Notice
AgriLease records agreed parameters between private parties. Official registration must follow local state agricultural tenancy and revenue regulations.

