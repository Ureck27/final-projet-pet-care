# 🐾 Pet Care Platform

![Pet Care Banner](https://via.placeholder.com/1200x400?text=Pet+Care+Platform+Banner)

A comprehensive, full-stack pet care management platform designed to connect pet owners with caregivers and trainers. Featuring real-time chat, AI-powered pet health scanning, automated routines, and a full administrative dashboard.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?style=for-the-badge&logo=socketdotio)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## ✨ Features

* **Pet Profiles & Dashboard:** Manage health records, routines, and daily activities for multiple pets.
* **Real-Time Messaging:** Built-in chat using Socket.io to connect pet owners with caregivers and trainers instantly.
* **AI Pet Scanner:** Identify pet conditions or get recommendations through integrated AI vision services.
* **Booking System:** Seamlessly schedule tasks and appointments with certified caregivers.
* **Admin Dashboard:** A centralized port for platform owners to manage users, approve trainers, and oversee system metrics.
* **Beautiful, Modern UI:** Fully responsive design built with Tailwind CSS, featuring subtle animations via GSAP and Framer Motion.
* **Secure Authentication:** JWT-based secure login and registration with distinct User and Admin flows.

---

## 🛠 Tech Stack

### Frontend (Client)
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4, Radix UI components
- **Animations**: GSAP, Framer Motion, Anime.js
- **Form Handling**: React Hook Form + Zod
- **Networking**: Socket.io-client

### Backend (API)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Real-Time**: Socket.io
- **Security**: Helmet, bcryptjs, express-rate-limit
- **File Uploads**: Multer (Local storage)

---

## 📸 Screenshots

| Pet Dashboard | Real-Time Chat |
|:---:|:---:|
| ![Dashboard Placeholder](https://via.placeholder.com/400x250?text=Dashboard+UI) | ![Chat Placeholder](https://via.placeholder.com/400x250?text=Chat+Interface) |

| AI Scanner | Mobile Responsive |
|:---:|:---:|
| ![Scanner Placeholder](https://via.placeholder.com/400x250?text=AI+Scanner) | ![Mobile Placeholder](https://via.placeholder.com/400x250?text=Mobile+View) |

---

## 🚀 Installation & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas cluster)
- [Redis](https://redis.io/) (**Optional** for local development; enables Chat and AI features)
- [Git](https://git-scm.com/)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/pet-care-platform.git
cd pet-care-platform
```

### 2. Backend Setup
```bash
cd BackEnd
npm install
```
Copy the `.env.example` file to create your local `.env`:
```bash
cp .env.example .env
```
*Edit the `.env` file to match your local MongoDB URI and desired port.*

Start the backend development server:
```bash
npm run dev
```
*(The backend runs on `http://localhost:5000` by default).*

### 3. Frontend Setup
Open a new terminal window and navigate to the frontend directory:
```bash
cd FrontEnd
npm install
```
Copy the `.env.example` file to create your local environment:
```bash
cp .env.example .env.local
```
Start the frontend development server:
```bash
npm run dev
```
*(The frontend runs on `http://localhost:3000` by default).*

---

## ⚙️ Environment Variables Setup

### Frontend (`FrontEnd/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_DEV_MODE=true
NEXT_PUBLIC_AI_API_URL=https://api.petcare-ai.com/v1
NEXT_PUBLIC_AI_API_KEY=your-dev-key
```

### Backend (`BackEnd/.env`)
```env
MONGO_URI=mongodb://localhost:27017/petcare
REDIS_ENABLED=false
JWT_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_SERVICE=gmail
ADMIN_EMAIL=admin@petcare.com
ADMIN_DASHBOARD_URL=http://localhost:3000/admin-dashboard
```

---

## 🏗 How to Build for Production

To build the Next.js application for production manually:

```bash
cd FrontEnd
npm run build
npm start
```

For the backend, running `npm start` executes `node server.js` which is the production process.

---



---

## 🛡️ Development Resilience

The platform is built with a "Resilient-First" approach to ensure a smooth developer experience even with missing local infrastructure:

*   **Redis-Optional Mode**: The backend automatically detects if Redis is unavailable or disabled via `REDIS_ENABLED=false`. It gracefully falls back to memory-based adapters for Socket.io and mocks BullMQ queues to prevent startup crashes.
*   **Robust MongoDB Connectivity**: Featuring advanced retry logic and forced IPv4 resolution to handle local network jitters and service lag.
*   **Graceful Degeneracy**: Core platform features remain operational even if secondary services (like Chat or AI scanning) are temporarily disconnected.

---

## 📏 Code Standards & Quality

We maintain high code quality through automated linting and strict conventions:

*   **Linter**: Fully migrated to **ESLint Flat Config** for both FrontEnd and BackEnd.
*   **Formatting**: Automated Prettier integration ensuring consistent code style across the monorepo.
*   **Conventions**: 
    *   Unused variables/parameters MUST be prefixed with an underscore (e.g., `_next`, `_res`) to pass linting.
    *   Modular logic architecture in the BackEnd for better testability and scalability.

---

## 📂 Folder Structure

```text
pet-care-platform/
├── BackEnd/                 # Node.js + Express API
│   ├── config/              # Database & service configurations
│   ├── controllers/         # Business logic & request handling
│   ├── middleware/          # Security, auth, & file upload middleware
│   ├── models/              # Mongoose DB schemas
│   ├── routes/              # Express API endpoints mapping
│   ├── services/            # Reusable services (Email, AI, Notifications)
│   ├── uploads/             # Temporary/Local storage for image uploads
│   └── server.js            # Main backend entry point
│
└── FrontEnd/                # Next.js Application
    ├── app/                 # Next.js App Router pages & layouts
    ├── components/          # Reusable UI components (Features & UI)
    ├── hooks/               # Custom React hooks
    ├── lib/                 # Utility functions & API clients
    ├── public/              # Static frontend assets
    └── tailwind.config.ts   # Tailwind CSS configuration
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
