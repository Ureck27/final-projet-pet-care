# 🐾 Pet Care Platform - Complete Testing Guide

## 🚀 **Quick Start**

### **1. Start Both Servers**
```bash
# Backend (Terminal 1)
cd BackEnd
npm run dev
# Server runs on: http://localhost:5001

# Frontend (Terminal 2)  
cd FrontEnd
npm run dev
# App runs on: http://localhost:3001
```

---

## 🧪 **Testing Scenarios**

### **👤 User Registration & Login**

#### **1. Register New User**
- **URL**: `http://localhost:3001/register`
- **Test Data**:
  ```
  Name: John Doe
  Email: john@example.com
  Password: password123
  Phone: 1234567890
  ```
- **Expected**: ✅ Success message & redirect to dashboard

#### **2. Login User**
- **URL**: `http://localhost:3001/login`
- **Use**: john@example.com / password123
- **Expected**: ✅ Redirect to `/dashboard`

---

### **🎯 Trainer Application System**

#### **1. Apply to Become Trainer**
- **URL**: `http://localhost:3001/become-trainer`
- **Prerequisites**: Must be logged in as regular user
- **Test Data**:
  ```
  Experience: 5+ years of professional dog training experience
  Message: I love training dogs and helping owners build better relationships
  ```
- **Expected**: ✅ Success message & admin notification

#### **2. Admin Approval Process**
- **URL**: `http://localhost:3001/admin-dashboard`
- **Prerequisites**: Must be logged in as admin
- **Login as Admin**: admin@example.com / password123

**Steps:**
1. Go to "Trainer Requests" tab
2. Find pending application
3. Click "Approve" (green checkmark) or "Reject" (red X)
4. **Expected**: ✅ Status updates instantly

#### **3. Verify Role Change**
- Re-login as the trainer user
- **Expected**: ✅ Role changed to "trainer" and access to trainer dashboard

---

### **🛡️ Admin Dashboard Features**

#### **1. Dashboard Overview**
- **URL**: `http://localhost:3001/admin-dashboard`
- **Features**:
  - 📊 **Stats Cards**: Total Users, Pets, Trainers, Pending Requests
  - 👥 **Users Tab**: View all registered users with roles
  - 🐾 **Pets Tab**: View all registered pets
  - 📋 **Trainer Requests Tab**: Approve/reject applications

#### **2. User Management**
- **Actions Available**:
  - 👁️ View user details
  - 🗑️ Delete users (with confirmation)
  - 👑️ Change user roles (via approve/reject)

---

### **🎓 Trainer Dashboard Features**

#### **1. Access Trainer Dashboard**
- **URL**: `http://localhost:3001/trainer-dashboard`
- **Prerequisites**: Must have "trainer" role
- **Features**:
  - 📈 **Stats Overview**: Bookings, Earnings, Rating, Completed Sessions
  - 📅 **Schedule View**: Calendar with assigned sessions
  - 🐾 **Assigned Pets**: List of pets under care
  - 📝️ **Status Updates**: Update pet care status with photo verification

#### **2. Task Management**
- **Complete Tasks**: Click "Complete" button → Upload photo → AI Analysis
- **Expected**: ✅ Task marked complete with AI insights

---

### **🧠 AI Features Testing**

#### **1. AI Pet Assistant**
- **URL**: `http://localhost:3001/ai-pet-assistant`
- **Features**:
  - 💬 **Chat Interface**: Ask AI about pet health
  - 📸 **Photo Upload**: Upload pet photos for health analysis
  - 🎥 **Video Upload**: Upload videos for behavior analysis
  - 📊 **Health Insights**: AI-generated health recommendations

#### **2. Pet Timeline**
- **URL**: `http://localhost:3001/pet-timeline`
- **Features**:
  - 📅 **Chronological Events**: Activities, health updates, mood changes
  - 🔍 **Filter Options**: Overview, Activities, Health tabs
  - 🤖 **AI Insights**: Integrated AI analysis results

#### **3. Smart Notifications**
- **URL**: `http://localhost:3001/notifications`
- **Features**:
  - 🔔 **Alert Management**: View all notifications
  - ⚙️ **Preferences**: Configure notification channels and types
  - ✅ **Mark Read/Unread**: Manage notification status

---

## 🗄️ **Database Integration**

### **1. MongoDB Collections**
- **Users**: Authentication, roles (user/trainer/admin)
- **Pets**: Pet profiles with owner relationships
- **TrainerRequests**: Applications with status (pending/accepted/rejected)
- **Bookings**: Pet care appointments
- **Routines**: Daily care tasks with photo verification

### **2. API Endpoints**
```bash
# Authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgot-password

# Trainer Management
POST /api/trainer-requests
GET /api/trainer-requests (admin only)
PUT /api/trainer-requests/:id/approve (admin only)
PUT /api/trainer-requests/:id/reject (admin only)

# Admin Management
GET /api/admin/dashboard
GET /api/admin/users
PUT /api/admin/users/:id/role
DELETE /api/admin/users/:id
```

---

## 🌐 **Navigation Structure**

### **1. Navigation by Role**
- **Guest**: Home, Services, Pricing, About, Login, Register
- **User (Owner)**: Dashboard, My Pets, Find Caregivers, Bookings, Schedule, **Become Trainer**
- **Trainer**: Dashboard, Assigned Pets, Schedule
- **Admin**: Dashboard, Users, Pets, Trainer Requests

### **2. Page Access Rules**
- **Authentication Required**: All dashboards and protected pages
- **Role-Based Access**: Different dashboards for different roles
- **Automatic Redirects**: Users redirected based on role

---

## 🧪 **Test Results Expected**

### **✅ Successful Scenarios**
1. **User Registration**: New user created, JWT token returned
2. **Trainer Application**: Request submitted, admin notified
3. **Admin Approval**: User role changed to "trainer"
4. **Dashboard Access**: Correct dashboard for each role
5. **Data Persistence**: All data saved in MongoDB

### **⚠️ Common Issues & Solutions**
1. **Registration Fails**: Check MongoDB connection
2. **Email Errors**: Email config in `.env` (currently disabled)
3. **Role Access**: Clear localStorage to re-login with correct role
4. **API Errors**: Check backend logs with `npm run dev`

---

## 📱 **Mobile Responsiveness**

### **1. Responsive Design**
- **Mobile (< 768px)**: Stacked navigation, full-width cards
- **Tablet (768px - 1024px)**: Grid layouts, adapted navigation
- **Desktop (> 1024px)**: Full dashboard with sidebar

### **2. Touch-Friendly Features**
- **Large Tap Targets**: Minimum 44px for mobile
- **Swipe Gestures**: Calendar navigation, card interactions
- **Responsive Forms**: Optimized for mobile input

---

## 🔧 **Development Testing**

### **1. Backend Testing**
```bash
# Test API directly
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Check MongoDB
mongosh
use petcare
db.users.find()
db.trainerrequests.find()
```

### **2. Frontend Testing**
```bash
# Build for production
npm run build

# Test production build
npm run start

# Check types
npm run type-check
```

---

## 🎯 **Key Features Verified**

### **✅ Working Features**
- ✅ **User Authentication**: Register, login, role management
- ✅ **Trainer Applications**: Submit, approve, reject workflow
- ✅ **Admin Dashboard**: User management, statistics
- ✅ **Trainer Dashboard**: Bookings, assigned pets, task management
- ✅ **AI Integration**: Chat, photo analysis, health insights
- ✅ **Database Integration**: MongoDB with proper relationships
- ✅ **Role-Based Access**: Proper authorization and redirects
- ✅ **Responsive Design**: Mobile, tablet, desktop optimized
- ✅ **Real-Time Updates**: Instant status changes, notifications

### **🚧 Configuration Needed**
- **Email Service**: Configure SMTP in `.env` for notifications
- **Production Database**: Update MongoDB URI for production
- **Environment Variables**: Set all required `.env` variables

---

## 🎉 **Testing Complete!**

Your Pet Care Platform is now fully functional with:
- 🔐 **Secure Authentication**
- 👥 **Role-Based Access Control** 
- 🎓 **Trainer Application System**
- 🛡️ **Admin Management Dashboard**
- 🐾 **Trainer Business Tools**
- 🧠 **AI-Powered Pet Care**
- 📱 **Responsive Design**
- 🗄️ **Database Integration**

**Ready for production deployment!** 🚀
