# Authentication System Guide

## Overview
Your pet care application now has a complete authentication system with:
- User registration with input validation
- Secure password hashing (bcryptjs)
- JWT token-based authentication
- Role-based access control (user, trainer, worker, caregiver, admin)
- Admin login with separate endpoint
- Rate limiting to prevent brute force attacks
- HTTP security headers with Helmet

## Installation

Make sure all dependencies are installed:
```bash
npm install
```

If you're adding this for the first time, also install:
```bash
npm install helmet express-rate-limit
```

## Environment Variables

Ensure your `.env` file includes:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/petcare
JWT_SECRET=supersecretjwtkeyforpetcare123
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=password123
ADMIN_EMAIL=admin@petcare.com
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### 1. User Registration (Sign Up)
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (@, $, !, %, *, ?, &)

**Example Valid Passwords:**
- `MyPassword123!`
- `SecurePass@456`
- `TestPass#999`

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Missing fields, invalid email, weak password, or user already exists
- `500`: Server error

---

### 2. User Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "status": "active",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Checks:**
- `pending`: User account is awaiting admin approval
- `active`: User can log in
- `suspended`: User account is suspended
- `rejected`: User application was rejected

**Error Responses:**
- `401`: Invalid email or password
- `403`: Account not active, suspended, or rejected
- `500`: Server error

---

### 3. Admin Login
**Endpoint:** `POST /api/auth/admin-login`

**Request Body:**
```json
{
  "email": "admin@petcare.com",
  "password": "AdminPass123!"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "id": "507f1f77bcf86cd799439012",
  "name": "Admin User",
  "email": "admin@petcare.com",
  "role": "admin",
  "status": "active",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "redirect": "/admin-dashboard"
}
```

**Error Responses:**
- `400`: Missing email or password
- `401`: Invalid admin credentials
- `403`: Admin account is suspended
- `500`: Server error

---

### 4. Forgot Password
**Endpoint:** `POST /api/auth/forgot-password`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset link sent to email"
}
```

---

### 5. Reset Password
**Endpoint:** `POST /api/auth/reset-password`

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewPassword456@"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successful"
}
```

---

## Frontend Integration Examples

### React/Next.js Sign Up Example
```javascript
const handleSignUp = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    // Store token
    localStorage.setItem('token', data.token);
    
    // Redirect based on role
    if (data.role === 'admin') {
      window.location.href = '/admin-dashboard';
    } else {
      window.location.href = '/user-dashboard';
    }
  } catch (error) {
    console.error('Sign up error:', error);
    alert('An error occurred during sign up');
  }
};
```

### React/Next.js Login Example
```javascript
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    // Store token
    localStorage.setItem('token', data.token);
    localStorage.setItem('userRole', data.role);

    // Redirect based on role
    if (data.role === 'admin') {
      window.location.href = '/admin-dashboard';
    } else {
      window.location.href = '/user-dashboard';
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login');
  }
};
```

### React/Next.js Admin Login Example
```javascript
const handleAdminLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    // Store token
    localStorage.setItem('token', data.token);
    localStorage.setItem('userRole', 'admin');

    // Redirect to admin dashboard
    window.location.href = data.redirect; // /admin-dashboard
  } catch (error) {
    console.error('Admin login error:', error);
    alert('An error occurred during admin login');
  }
};
```

### Using Protected Routes with Token
```javascript
// Custom fetch with Authorization header
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  });
};

// Example: Get user dashboard data
const response = await fetchWithAuth('/api/users/dashboard');
const userData = await response.json();
```

---

## Protected Routes Example

In your frontend, protect routes based on user role:

```javascript
// Example: Admin Route Guard
const AdminRoute = ({ children }) => {
  const userRole = localStorage.getItem('userRole');
  
  if (userRole !== 'admin') {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Usage
<Routes>
  <Route 
    path="/admin-dashboard" 
    element={<AdminRoute><AdminDashboard /></AdminRoute>} 
  />
  <Route path="/user-dashboard" element={<UserDashboard />} />
  <Route path="/login" element={<LoginPage />} />
</Routes>
```

---

## Security Features Implemented

1. **Password Hashing**: All passwords are hashed with bcryptjs (salt rounds: 10)
2. **JWT Tokens**: Secure token-based authentication with 30-day expiration
3. **Input Validation**: 
   - Email format validation
   - Password strength requirements
   - Required field validation
4. **Rate Limiting**:
   - General: 100 requests per 15 minutes per IP
   - Auth endpoints: 5 attempts per 15 minutes per IP
5. **HTTP Security Headers**: Helmet middleware for security headers
6. **User Status Management**: Multi-state user status (pending, active, suspended, rejected)
7. **Role-Based Access Control**: Different roles with different permissions
8. **Token Expiration**: JWT tokens expire after 30 days
9. **Password Reset**: Secure password reset with token expiration (10 minutes)

---

## Creating Admin Accounts

To create an admin account, use MongoDB or Mongoose to insert a new user:

```javascript
const User = require('./models/User');

// Create admin user
const createAdmin = async () => {
  try {
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@petcare.com',
      password: 'AdminPass123!', // Will be hashed by pre-save hook
      fullName: 'System Administrator',
      role: 'admin',
      status: 'active'
    });
    console.log('Admin created:', admin);
  } catch (error) {
    console.error('Error creating admin:', error);
  }
};

createAdmin();
```

Or run directly via MongoDB Shell:
```javascript
db.users.insertOne({
  name: 'Admin',
  email: 'admin@petcare.com',
  fullName: 'System Administrator',
  password: '$2a$10$...', // Pre-hashed password with bcrypt
  role: 'admin',
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date()
});
```

---

## Testing with Postman

### Test Sign Up
1. Set Method: `POST`
2. URL: `http://localhost:5000/api/auth/register`
3. Headers: `Content-Type: application/json`
4. Body:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "TestPass123!"
}
```

### Test Login
1. Set Method: `POST`
2. URL: `http://localhost:5000/api/auth/login`
3. Headers: `Content-Type: application/json`
4. Body:
```json
{
  "email": "test@example.com",
  "password": "TestPass123!"
}
```

### Test Admin Login
1. Set Method: `POST`
2. URL: `http://localhost:5000/api/auth/admin-login`
3. Headers: `Content-Type: application/json`
4. Body:
```json
{
  "email": "admin@petcare.com",
  "password": "AdminPass123!"
}
```

### Test Protected Route
1. Get token from login response
2. Set Method: `GET`
3. URL: `http://localhost:5000/api/admin/dashboard`
4. Headers:
   - `Content-Type: application/json`
   - `Authorization: Bearer <your_token_here>`

---

## Troubleshooting

### "User already exists"
- The email is already registered. Use a different email or reset the database.

### "Too many login attempts"
- Rate limiting has blocked your IP. Wait 15 minutes before trying again.

### "Token invalid" or "Not authorized"
- Token may have expired (30 days). Log in again to get a new token.
- Token may be malformed. Ensure the format is: `Bearer <token>`

### "Account is pending admin approval"
- Admin must change user status from "pending" to "active" in admin dashboard.

### "Invalid email or password"
- Double-check credentials. Passwords are case-sensitive.

---

## Next Steps

1. **Set up email service** for password reset emails (using nodemailer)
2. **Add phone verification** for two-factor authentication
3. **Implement OAuth** (Google, Facebook) for social login
4. **Add audit logging** to track login attempts and admin actions
5. **Set up refresh tokens** for better token management
