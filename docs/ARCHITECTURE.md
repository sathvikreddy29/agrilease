# Agricultural Land Lease Management System - Architecture & Design

## 1. System Overview

The **Agricultural Land Lease Management System (AgriLease)** is a full-stack platform engineered to bridge agricultural landowners and cultivating farmers. It enables verified listing of farmlands, multi-criteria filtering, customized lease proposal submission, transactional agreement creation, and administrative oversight.

---

## 2. Technical Stack

- **Frontend:** React 18, Vite, React Router DOM 6, Axios, Custom Agricultural CSS Theme
- **Backend:** Java 17, Spring Boot 3.2.5, Spring Security 6, Spring Data JPA, Jakarta Validation
- **Authentication:** Stateless JWT (HMAC-SHA256) & BCrypt Password Encryption
- **Database:** H2 Database (In-Memory for development & File-based for persistence)
- **API Protocol:** RESTful JSON APIs with standardized `ApiResponse<T>` envelopes

---

## 3. High-Level Architecture Diagram

```
+-------------------------------------------------------+
|            Client: Web Browser (Port 5173)            |
|       React 18 + Vite SPA (Components, Context)       |
+---------------------------+---------------------------+
                            |
                   HTTP / REST (JSON)
           Authorization: Bearer <JWT Token>
                            |
                            v
+-------------------------------------------------------+
|         Backend Server: Spring Boot (Port 8080)       |
|                                                       |
|  [CORS Configuration: http://localhost:5173]         |
|                           |                           |
|  [JwtAuthenticationFilter: Intercepts & Verifies]     |
|                           |                           |
|  [Spring Security 6: Role-Based Authorization]        |
|   - ROLE_LANDOWNER                                    |
|   - ROLE_FARMER                                       |
|   - ROLE_ADMIN                                        |
|                           |                           |
|  [REST Controllers]                                   |
|   - AuthController                                    |
|   - LandListingController                             |
|   - LeaseApplicationController                        |
|   - LeaseAgreementController                          |
|   - AdminController                                   |
|                           |                           |
|  [Service Layer: Business Logic & Transactions]       |
|                           |                           |
|  [Spring Data JPA Repositories]                       |
+---------------------------+---------------------------+
                            |
                            v
+-------------------------------------------------------+
|                    H2 Database                        |
|  Tables: users, land_listings, lease_applications,    |
|          lease_agreements, reported_listings          |
|  Modes: In-Memory (mem:agridb) or Persistent (file)  |
|  Console: http://localhost:8080/h2-console           |
+-------------------------------------------------------+
```

---

## 4. Entity Relationship Model

```
       +------------------+
       |       USER       |
       +--------+---------+
                |
       +--------+--------+------------------+
       |                 |                  |
       v                 v                  v
+--------------+ +----------------+ +---------------+
| LAND_LISTING | |LEASE_APPLICAT'N| | LEASE_AGREEM'T|
+------+-------+ +-------+--------+ +---------------+
       |                 |                  ^
       |                 +------------------+
       +------------------------------------+
```

---

## 5. Security Principles

1. **Stateless JWT Sessions:** Tokens expire after 24 hours. No session state is held in the server memory.
2. **Password Protection:** Stored using salted BCrypt hashing.
3. **Authorization Enforcement:** Enforced at both filter and controller method levels (`@PreAuthorize`).
4. **Ownership Verification:** Services verify that users can only modify properties and applications that belong to them.

