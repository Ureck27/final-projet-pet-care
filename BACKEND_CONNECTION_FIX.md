# Backend Connection Fix Guide

## Problem Summary
**Error:** `[API Connection Error] Cannot reach backend at http://localhost:5000/api`

**Root Cause:** 
- Orphaned Node.js processes were running but not listening on port 5000
- Backend server was not properly started
- All three services (MongoDB, Backend, Frontend) must run simultaneously

---

## ✅ Verification Checklist

### 1. Backend Configuration is Correct ✓
- `PORT=5000` ✓
- `MONGO_URI=mongodb://localhost:27017/petcare` ✓
- `FRONTEND_URL=http://localhost:3000` ✓
- CORS configured for localhost:3000 ✓
- Routes mounted at `/api/auth` ✓
- `/api/auth/register` endpoint exists ✓

### 2. Frontend Configuration is Correct ✓
- `NEXT_PUBLIC_API_URL=http://localhost:5000/api` ✓
- Token stored in localStorage ✓
- Error handling implemented ✓

---

## 🔧 Step-by-Step Fix

### Step 1: Clean Up Stray Processes
```powershell
# Already done! Run this if you need to restart:
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process mongod -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
```

### Step 2: Start MongoDB (Terminal 1)
```powershell
mongod
```
**Expected Output (in 3-5 seconds):**
```
[connection] Listening on 127.0.0.1:27017
```

### Step 3: Start Backend Server (Terminal 2)
```powershell
cd "c:\Users\Admin\Desktop\final-projet-pet-care\BackEnd"
npm run dev
```
**Expected Output (in 2-3 seconds):**
```
[nodemon] starting `node server.js`
MongoDB Connected: 127.0.0.1
Server running on port 5000
```

### Step 4: Start Frontend Server (Terminal 3)
```powershell
cd "c:\Users\Admin\Desktop\final-projet-pet-care\FrontEnd"
npm run dev
```
**Expected Output (in 10-15 seconds):**
```
Local:        http://localhost:3000
Ready in 12.3s
```

### Step 5: Test Registration
1. Open http://localhost:3000/register in your browser
2. Open **Developer Console** (F12 → Console tab)
3. Fill the form:
   - Full Name: `Test User`
   - Email: `test@unique.com` (must be unique)
   - Password: `Password123!`
   - Phone: `5551234567`
4. Click **Create Account**

### Step 6: Monitor Console Output
Watch for these messages:
```
✓ [API] POST /auth/register
✓ [Auth] Registering user: test@unique.com
✓ [Auth] Registration successful, storing user data
✓ [API Success] POST /auth/register
```

If successful → You'll be redirected to `/dashboard`

---

## 🚨 Troubleshooting

### Issue: "Failed to fetch" Error
**Symptoms:**
```
[API Connection Error] Cannot reach backend at http://localhost:5000/api
[API Help] Check if backend is running: http://localhost:5000
```

**Solutions:**
```powershell
# 1. Verify MongoDB is running
netstat -ano | findstr ":27017"
# Should show LISTENING. If not, restart MongoDB

# 2. Verify Backend is running
netstat -ano | findstr ":5000"
# Should show LISTENING. If not, check Terminal 2

# 3. Test backend directly
Invoke-WebRequest -Uri "http://localhost:5000" -Method GET
# Should return "API is running..."
```

### Issue: "MongoDB Connection Failed"
**Solution:**
```powershell
# 1. Make sure mongod is running
# 2. Check if port 27017 is free
netstat -ano | findstr ":27017"

# 3. If port is in use, kill the process
Get-Process mongod | Stop-Process -Force
Start-Sleep -Seconds 2
mongod
```

### Issue: "Port 5000 Already in Use"
```powershell
# Find what's using port 5000
$process = Get-NetTCPConnection -LocalPort 5000 | Select-Object -ExpandProperty OwningProcess
Stop-Process -Id $process -Force
```

### Issue: "Module not found" in Backend
```powershell
cd "c:\Users\Admin\Desktop\final-projet-pet-care\BackEnd"
npm install
npm run dev
```

---

## 📊 Port Status Command
Run this to see all critical services:

```powershell
Write-Host "Checking services...`n"
@(("MongoDB", 27017), ("Backend", 5000), ("Frontend", 3000)) | ForEach-Object {
    $name, $port = $_
    $result = netstat -ano | findstr ":$port" 
    if ($result) { Write-Host "✓ $name running on port $port" }
    else { Write-Host "✗ $name NOT running on port $port" }
}
```

---

## 🔍 API Endpoint Verification

### Test Backend Directly
```powershell
# Test 1: Verify API is responding
Invoke-WebRequest -Uri "http://localhost:5000" -Method GET
# Expected: 200 OK, body "API is running..."

# Test 2: Test registration endpoint
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "Password123!"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
# Expected: 201 Created with { token, _id, email, name, role, status }
```

---

## 📋 Architecture Diagram

```
Browser (localhost:3000)
    ↓
Frontend Next.js Server
    ↓ (fetch to http://localhost:5000/api)
Backend Express Server (port 5000)
    ↓ (connect)
MongoDB (localhost:27017)
```

All three must be running simultaneously!

---

## ✨ Success Indicators

- [ ] Backend terminal shows: `Server running on port 5000`
- [ ] Frontend terminal shows: `Local: http://localhost:3000`
- [ ] Browser console shows: `[API Success] POST /auth/register`
- [ ] User redirected to dashboard after registration
- [ ] MongoDB shows: `Listening on 127.0.0.1:27017`

---

## 🔐 Security Notes

Your setup has:
- ✓ CORS configured for localhost:3000
- ✓ Rate limiting: 100 req/15min general, 5 auth attempts/15min
- ✓ Helmet security headers
- ✓ bcryptjs password hashing (10 salt rounds)
- ✓ JWT token authentication
- ✓ Password strength validation (8+ chars, uppercase, lowercase, number, special char)

---

## 📞 Still Not Working?

Check these in order:
1. MongoDB running? `mongod` in Terminal 1
2. Backend running? `npm run dev` in `BackEnd` folder (Terminal 2)
3. Frontend running? `npm run dev` in `FrontEnd` folder (Terminal 3)
4. All showing "running" messages in their logs?
5. Browser DevTools Console showing `[API]` messages?

If step 3 fails, check backend server logs for connection errors.
