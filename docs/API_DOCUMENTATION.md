# AgriLease REST API Documentation

Base URL: `http://localhost:8080/api`

All responses follow the standard `ApiResponse<T>` envelope:
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... },
  "timestamp": "2026-10-11T19:00:00"
}
```

---

## 1. Authentication Endpoints

### Register User
- **POST** `/auth/register`
- **Body:**
```json
{
  "fullName": "Ramesh Patel",
  "email": "ramesh.patel@gmail.com",
  "password": "Password@123",
  "phone": "+91 9825123456",
  "role": "ROLE_LANDOWNER",
  "address": "Mogar Road",
  "state": "Gujarat",
  "district": "Anand"
}
```

### Login
- **POST** `/auth/login`
- **Body:**
```json
{
  "email": "ramesh.patel@gmail.com",
  "password": "Password@123"
}
```

### Current User Profile
- **GET** `/auth/me`
- **Headers:** `Authorization: Bearer <token>`

---

## 2. Land Listings Endpoints

### Search Lands
- **GET** `/lands?state=Gujarat&soilType=Black&page=0&size=10&sortBy=rentPerAcrePerYear&sortDir=asc`
- **Public access**

### Land Details
- **GET** `/lands/{id}`
- **Public access**

### Create Farmland Listing
- **POST** `/lands`
- **Role:** `ROLE_LANDOWNER`
- **Body:**
```json
{
  "title": "15-Acre Fertile Black Soil Farmland",
  "description": "High yield land with borewells...",
  "state": "Gujarat",
  "district": "Anand",
  "village": "Mogar",
  "address": "Survey No. 142/A",
  "totalAcreage": 15.0,
  "soilType": "Black Cotton Soil",
  "waterAvailability": "Borewell",
  "electricityAvailability": true,
  "availableFacilities": "Drip irrigation, tractor road",
  "rentPerAcrePerYear": 28000,
  "minLeaseDurationMonths": 12,
  "maxLeaseDurationMonths": 36,
  "imageUrl": "https://images.unsplash.com/...",
  "contactPhone": "+91 9825123456",
  "contactEmail": "owner@gmail.com"
}
```

---

## 3. Lease Applications Endpoints

### Apply for Farmland
- **POST** `/applications`
- **Role:** `ROLE_FARMER`
- **Body:**
```json
{
  "landListingId": 1,
  "requestedAcreage": 5.0,
  "proposedDurationMonths": 12,
  "intendedCrop": "Groundnut & Wheat",
  "proposedStartDate": "2026-11-01",
  "offeredRentPerAcre": 28000,
  "message": "Experience in organic cultivation..."
}
```

### Approve Application
- **PATCH** `/applications/{id}/approve`
- **Role:** `ROLE_LANDOWNER` (Owner of the land)
- **Effect:** Commits acreage, updates land status, creates `LeaseAgreement`.

### Reject Application
- **PATCH** `/applications/{id}/reject`
- **Role:** `ROLE_LANDOWNER`

### Cancel Application
- **PATCH** `/applications/{id}/cancel`
- **Role:** `ROLE_FARMER` (Applicant)

---

## 4. Lease Agreements

### My Leases
- **GET** `/leases/my-leases`
- **Authenticated:** Retrieves leases where caller is owner or farmer.

---

## 5. Administrative Endpoints

- **GET** `/admin/dashboard` - Platform statistics
- **GET** `/admin/users` - All users list
- **PATCH** `/admin/users/{id}/status` - Account suspension toggle
- **GET** `/admin/listings` - Moderation list
- **PATCH** `/admin/listings/{id}/status` - Listing status toggle
- **GET** `/admin/reports` - Unresolved community reports
- **PATCH** `/admin/reports/{id}/status` - Action or dismiss reports

