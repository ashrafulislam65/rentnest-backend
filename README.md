# RentNest 🏠 — Backend API

**"Find & List Rental Properties with Ease"**

A backend API for a rental property marketplace. Landlords list properties and manage rental requests; tenants browse listings, request rentals, pay, and leave reviews; admins oversee the platform.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (v24), TypeScript
- **Framework:** Express 5
- **Database:** PostgreSQL (hosted on Neon)
- **ORM:** Prisma 7 (with `@prisma/adapter-pg` driver adapter)
- **Auth:** JWT (jsonwebtoken) + bcrypt password hashing
- **Validation:** Zod
- **Payments:** Stripe
- **Dev tooling:** tsx (watch mode), dotenv

---

## 📁 Project Structure

```
rentnest-backend/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts              # seeds a default ADMIN account
│   └── migrations/
├── src/
│   ├── config/
│   │   └── prisma.ts        # shared PrismaClient (adapter-based)
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── property.controller.ts     # public property/category reads
│   │   ├── landlord.controller.ts     # landlord property CRUD + requests
│   │   ├── rental.controller.ts       # tenant rental requests
│   │   ├── payment.controller.ts      # Stripe payment flow
│   │   ├── review.controller.ts
│   │   └── admin.controller.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── property.routes.ts
│   │   ├── landlord.routes.ts
│   │   ├── rental.routes.ts
│   │   ├── payment.routes.ts
│   │   ├── review.routes.ts
│   │   └── admin.routes.ts
│   ├── middlewares/
│   │   ├── authGuard.ts     # authGuard + authorizeRoles
│   │   ├── validateRequest.ts
│   │   └── globalErrorHandler.ts
│   ├── validations/
│   │   ├── auth.validation.ts
│   │   └── property.validation.ts
│   ├── app.ts
│   └── server.ts
├── prisma.config.ts
├── .env.example
└── package.json
```

---

## 🚀 Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env` and fill in real values:
```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `PORT` | Port the server runs on (default `5000`) |
| `DATABASE_URL` | PostgreSQL connection string (Neon pooled URL) |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `STRIPE_SECRET_KEY` | Stripe **secret** key (`sk_test_...`) |

### 3. Run database migrations
```bash
npx prisma migrate dev
```

### 4. Seed the database
Creates a default admin account (`admin@rentnest.com` / `admin123`):
```bash
npm run prisma:seed
```

### 5. Start the dev server
```bash
npm run dev
```
Server runs at `http://localhost:5000`.

---

## 🔐 Roles & Permissions

| Role | Permissions |
|---|---|
| **Tenant** | Browse listings, submit rental requests, pay, view payment history, leave reviews |
| **Landlord** | Create/manage own listings, approve/reject rental requests on own properties |
| **Admin** | Manage users (view/ban), view all properties & rentals, manage categories |

Role is chosen at registration (`TENANT`, `LANDLORD`, or `ADMIN`). All protected routes require a `Bearer <token>` in the `Authorization` header (token obtained from `/api/auth/login`).

---

## 📡 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Access |
|---|---|---|
| POST | `/register` | Public |
| POST | `/login` | Public |
| GET | `/me` | Authenticated |

### Properties (public) — `/api`
| Method | Endpoint | Access |
|---|---|---|
| GET | `/properties` | Public — filters: `location`, `priceMin`, `priceMax`, `categoryId`, `amenities` |
| GET | `/properties/:id` | Public |
| GET | `/categories` | Public |

### Landlord — `/api/landlord`
| Method | Endpoint | Access |
|---|---|---|
| POST | `/properties` | Landlord |
| PUT | `/properties/:id` | Landlord |
| DELETE | `/properties/:id` | Landlord |
| GET | `/requests` | Landlord |
| PATCH | `/requests/:id` | Landlord — body: `{ "status": "APPROVED" \| "REJECTED" }` |

### Rentals — `/api/rentals`
| Method | Endpoint | Access |
|---|---|---|
| POST | `/` | Tenant |
| GET | `/` | Tenant |
| GET | `/:id` | Tenant (own requests only) |

### Payments — `/api/payments`
| Method | Endpoint | Access |
|---|---|---|
| POST | `/create` | Authenticated — creates Stripe payment intent for an approved rental |
| POST | `/confirm` | Authenticated — confirms payment, sets rental to `ACTIVE` |
| GET | `/` | Authenticated — own payment history |
| GET | `/:id` | Authenticated (own payments only) |

### Reviews — `/api/reviews`
| Method | Endpoint | Access |
|---|---|---|
| POST | `/` | Tenant |
| GET | `/:propertyId` | Public |

### Admin — `/api/admin`
| Method | Endpoint | Access |
|---|---|---|
| GET | `/users` | Admin |
| PATCH | `/users/:id/ban` | Admin — body: `{ "isBanned": true \| false }` |
| GET | `/properties` | Admin |
| GET | `/rentals` | Admin |
| POST | `/categories` | Admin |
| PUT | `/categories/:id` | Admin |
| DELETE | `/categories/:id` | Admin |

---

## 🔄 Rental Request Lifecycle

```
PENDING → (landlord approves) → APPROVED → (payment confirmed) → ACTIVE → COMPLETED
PENDING → (landlord rejects)  → REJECTED
```

---

## 🗄️ Database Models

- **User** — id, name, email, password (hashed), role (`TENANT` / `LANDLORD` / `ADMIN`), isBanned
- **Property** — id, title, description, location, price, categoryId, amenities[], isAvailable, landlordId
- **Category** — id, name
- **RentalRequest** — id, propertyId, tenantId, startDate, endDate, status
- **Payment** — id, rentalRequestId, amount, transactionId, method, status, paidAt
- **Review** — id, propertyId, tenantId, rating, comment

---

## ✅ Tested Flow

All endpoints above have been manually tested end-to-end via Postman, covering the full lifecycle:
register → login (all 3 roles) → create category → create property → filter/browse properties → submit rental request → approve request → create payment intent → confirm payment → view payment history → leave review → admin user/property/rental management → role-based access control (403 checks) → cleanup.

---

## ⚠️ Known Notes

- Stripe is integrated in **test mode** (`sk_test_...`); no real charges occur.
- Property deletion is blocked (`RESTRICT`) if the property has associated rental requests — this is intentional, to preserve rental/payment history integrity.
