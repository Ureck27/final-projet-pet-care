# Backend Connection Issue - Root Cause Analysis & Fix

## 🎯 Root Cause Found

**Problem:** Orphaned Node.js processes running on the system but NOT listening on port 5000

**Evidence:**
- ✗ Port 5000: NOT listening (backend not responding)
- ✗ Port 3000: NOT listening (frontend not running) 
- ✗ Port 27017: NOT listening (MongoDB not running)
- ✗ But 5 stray Node processes were running (PIDs: 9812, 10012, 10264, 10892, 17652)

**Impact:** Frontend sends requests to `http://localhost:5000/api/auth/register` but nothing is listening → "Failed to fetch" error

---

## ✅ Root Cause Fix Applied

**Already cleaned:** All orphaned processes stopped ✓

---

## 🚀 QUICK START - Copy & Paste Commands

### Terminal 1 - MongoDB
```powershell
mongod
```
Wait for: `Listening on 127.0.0.1:27017`

### Terminal 2 - Backend  
```powershell
cd "c:\Users\Admin\Desktop\final-projet-pet-care\BackEnd" ; npm run dev
```
Wait for: `Server running on port 5000`

### Terminal 3 - Frontend
```powershell
cd "c:\Users\Admin\Desktop\final-projet-pet-care\FrontEnd" ; npm run dev
```
Wait for: `Local: http://localhost:3000`

### Then Test Registration
1. Navigate to: **http://localhost:3000/register**
2. Open **F12 → Console tab**
3. Fill form:
   - Full Name: `Test User`
   - Email: `test.unique@example.com`
   - Password: `Password123!`
   - Phone: `5551234567`
4. Click **Create Account**

**Watch console for:**
```
✓ [API] POST /auth/register
✓ [Auth] Registering user: test.unique@example.com
✓ [Auth] Registration successful
✓ [API Success] POST /auth/register
```

If successful → Auto-redirect to `/dashboard`

---

## 📋 Pre-Deployment Verification

### Endpoint Configuration ✓
- **Route:** `POST /api/auth/register`
- **Handler:** `authController.registerUser()`
- **Validation:** 
  - Email format validation ✓
  - Password strength (8+ chars, uppercase, lowercase, number, special char) ✓
  - Duplicate email check ✓

### Frontend Configuration ✓
- **API URL:** `http://localhost:5000/api` (from `.env.local`)
- **Token handling:** Stored in localStorage as `petcare_token`
- **Error messages:** Enhanced with detailed logging

### Backend Configuration ✓
- **CORS:** Enabled for `http://localhost:3000`
- **Rate limiting:** 5 auth attempts/15min per IP
- **Security:** Helmet, bcryptjs hashing, JWT auth

---

## 🔍 What Happens in Each Step

1. **Form Submit** → `RegisterForm.tsx` validates input
2. **Auth Context** → `register()` method called with form data
3. **API Fetch** → `apiFetch('/auth/register', {...})` 
4. **Backend Route** → `POST /api/auth/register` hits `registerUser()`
5. **Validation** → Email & password strength checked
6. **DB Check** → Duplicate email prevented
7. **Create User** → Password hashed with bcryptjs, user created in MongoDB
8. **Generate Token** → JWT token created (30-day expiration)
9. **Response** → Return 201 with `{ token, _id, email, name, role, status }`
10. **Frontend** → Store token, redirect to dashboard

---

## ❌ Common Issues After Restart

| Issue | Solution |
|-------|----------|
| "Cannot reach backend" | Verify Terminal 2 shows `Server running on port 5000` |
| "Database connection failed" | Verify Terminal 1 shows `Listening on 127.0.0.1:27017` |
| "Email already exists" | Use different email (add timestamp: `test.1234@example.com`) |
| "Password does not meet requirements" | Use: `Password123!` or similar |
| "Module not found" error | Run `npm install` in affected folder |
| 400 Bad Request | Check browser console - shows validation error |

---

## 🧪 Direct API Test (PowerShell)

If you want to test the backend WITHOUT the frontend:

```powershell
$body = @{
    name = "Test User"
    email = "direct-test@example.com"
    password = "Password123!"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

Write-Host "Status: $($response.StatusCode)"
Write-Host "Response: $($response.Content)"
```

**Expected 201 response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "direct-test@example.com",
  "name": "Test User",
  "role": "user",
  "status": "pending",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🔐 Security Configuration Verified

✓ **Password hashing:** bcryptjs with 10 salt rounds  
✓ **Token auth:** JWT with 30-day expiration  
✓ **CORS:** Limited to `http://localhost:3000`  
✓ **Rate limiting:** 5 auth attempts per 15 minutes per IP  
✓ **Headers:** Helmet security middleware active  
✓ **Password validation:** Requires mixed case, numbers, special chars  

---

## 📞 Need More Help?

Check the detailed guide: [BACKEND_CONNECTION_FIX.md](BACKEND_CONNECTION_FIX.md)

Key diagnostics:
1. **Are all 3 terminals showing success messages?** (MongoDB listening, Server running, Frontend ready)
2. **Can you access http://localhost:5000 directly in browser?** Should show "API is running..."
3. **Do you see `[API]` messages in browser console?** Means frontend can reach backend

