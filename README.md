# 🐾 Pet Care Platform

![Pet Care Banner](https://via.placeholder.com/1200x400?text=Pet+Care+Platform+Banner)

A comprehensive, full-stack pet care management platform designed to connect **Pet Owners**, **Caregivers**, and **Trainers**. It features multiple robust dashboards tailored by role, real-time messaging, AI-powered pet health scanning, automated daily activity tracking, and a comprehensive administrative portal.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?style=for-the-badge&logo=socketdotio)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## ✨ Key Features

* **Multi-Role Dashboards:** Distinct and secure dashboards crafted specifically for Pet Owners (`/dashboard`), Trainers (`/trainer-dashboard`), and Platform Admins (`/admin-dashboard`).
* **Pet Profiles & Timelines:** Manage extensive pet health records, daily routines, care plans, and monitor activity timelines.
* **AI Pet Assistant:** Features a built-in AI interface (`/ai-pet-assistant`) offering conversational assistance and behavior analysis tools.
* **Real-Time Messaging:** Integrated chat using Socket.io to allow pet owners to instantly converse with caregivers and trainers.
* **Booking & Scheduling:** Seamlessly schedule tasks, care packages, meet-and-greets, and routine schedules with certified trainers and caregivers.
* **Onboarding Portals:** Unique application flows for users looking to become caregivers (`/caregiver-apply`) or trainers (`/become-trainer`), feeding directly into an Admin approval queue.
* **Notifications Center:** Built-in push and contextual notifications to keep users alert on tasks, messages, and application statuses.
* **Beautiful, Modern UI:** Fully accessible styling built with Tailwind CSS v4 and Radix UI components, enriched with fluid animations using Framer Motion and Anime.js.
* **Secure Authentication:** JWT-based secure login algorithms supporting standard authentication and distinct Admin flows.

---

## 🛠 Tech Stack

### Frontend (Client)
- **Framework**: Next.js 15 (App Router)
- **UI & Libraries**: React 19, Radix UI Primitives, Lucide Icons
- **Styling**: Tailwind CSS v4
- **Animations**: GSAP, Framer Motion, Anime.js
- **Forms & Validation**: React Hook Form + Zod
- **Networking & Real-Time**: Socket.io-client, custom `apiFetch` interceptor logic
- **Package Manager**: npm

### Backend (API)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Real-Time Layer**: Socket.io + Redis Adapter
- **Jobs & Queues**: BullMQ
- **Security & Validation**: Helmet, bcryptjs, express-rate-limit, Zod validators
- **Uploads Configuration**: Multer + Cloudinary (remote) or local mapping

---

## 📂 Project Architecture

```text
pet-care-platform/
├── BackEnd/                 # Node.js + Express API
│   ├── config/              # Environment & service configurations
│   ├── controllers/         # Business logic mapping to API routes
│   ├── middleware/          # Security, auth gating, & API middlewares
│   ├── models/              # Mongoose DB schemas (Pets, Users, Bookings, etc.)
│   ├── routes/              # Express endpoint groupings (auth, pets, trainers, etc.)
│   ├── services/            # Extracted single-responsibility logic (emails, AI processing)
│   ├── workers/             # Background BullMQ job workers
│   └── server.js            # Main backend entry point
│
└── FrontEnd/                # Next.js Application
    ├── app/                 # Next.js App Router (pages/layouts per route)
    ├── components/          # Reusable UI parts & complex features (dashboards, modals)
    ├── hooks/               # Custom React hooks abstraction
    ├── lib/                 # Core API integrations (`api.ts`), TS Definitions (`types.ts`)
    ├── tailwind.config.ts   # Advanced Tailwind theming config
    └── package.json         # Project dependency map
```

---

## 🚀 Installation & Local Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or a remote Atlas connection)
- Redis (*Optional*, used for BullMQ and distributed websockets)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/pet-care-platform.git
cd pet-care-platform
```

### 2. Backend Setup
Navigate to the API folder and install dependencies:
```bash
cd BackEnd
npm install
```
Prepare the environment:
```bash
cp .env.example .env
```
*(Open `.env` and fill in necessary elements like `MONGO_URI`, `JWT_SECRET`, and `CLOUDINARY` credentials)*.

Start the backend:
```bash
npm run dev
```
*(The backend typically listens on `http://localhost:5000`)*

### 3. Frontend Setup
In a new terminal window, initialize the Next.js client:
```bash
cd FrontEnd
npm install
```
Link up your frontend configuration:
```bash
cp .env.example .env.local
```
*(Ensure `NEXT_PUBLIC_API_URL` aligns with your backend's URL)*.

Start the frontend development server:
```bash
npm run dev
```
*(Access the app at `http://localhost:3000`)*

---

## ⚙️ Environment Variables Example

**Frontend (`FrontEnd/.env.local`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_DEV_MODE=true
```

**Backend (`BackEnd/.env`)**
```env
MONGO_URI=mongodb://localhost:27017/petcare
REDIS_ENABLED=false
JWT_SECRET=super_secret_jwt_signature
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password
```

---

## 🛡️ Best Practices & Quality Control

We strive for enterprise-grade standardization inside this monorepo approach:

*   **Resiliency Design:** The Backend gracefully scales backward—disabling Realtime sockets or AI queues if Redis isn't configured, thus keeping core functions alive locally without heavy ops prerequisites.
*   **Strong Typing Data Integrity:** From Mongoose models dynamically aligned with frontend TypeScript interfaces (`lib/types.ts`) guaranteeing 1:1 parity between Backend and UI states.
*   **Linting & Style Checks:** Protected by robust ESLint Flat Configuration on both sides, ensuring conventions (such as standardizing module imports and using TS best practices) remain consistent on commit.
*   **Production Handshaking:** Intelligent API request utilities that actively suppress React strict mode duplication loops and properly bubble network disconnect errors up to global boundary handlers to render fallbacks.

## 📄 License

This repository is licensed under the [MIT License](LICENSE).
