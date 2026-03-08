# API Integration Guide

This document explains how the FrontEnd should communicate with the Node.js + Express BackEnd. The backend is configured to accept cross-origin requests (CORS) and parses responses as JSON.

## Base URL
Ensure your backend is running. By default, it runs on port 5000.
**Base API URL:** `http://localhost:5000/api`

## Endpoints

### 1. Create a User (POST)
**Endpoint:** `/users`
**Payload:** `{ name: string, email: string, age: number }`

```javascript
// Example using fetch
async function createUser(userData) {
  try {
    const response = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) throw new Error('Failed to create user');
    const data = await response.json();
    console.log('User created:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage:
// createUser({ name: "John Doe", email: "john@example.com", age: 30 });
```

### 2. Get All Users (GET)
**Endpoint:** `/users`

```javascript
async function fetchUsers() {
  try {
    const response = await fetch('http://localhost:5000/api/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    
    const data = await response.json();
    console.log('Users:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### 3. Update a User (PUT)
**Endpoint:** `/users/:id`
**Payload:** `{ name?: string, email?: string, age?: number }`

```javascript
async function updateUser(userId, updateData) {
  try {
    const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) throw new Error('Failed to update user');
    const data = await response.json();
    console.log('User updated:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### 4. Delete a User (DELETE)
**Endpoint:** `/users/:id`

```javascript
async function deleteUser(userId) {
  try {
    const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Failed to delete user');
    const data = await response.json();
    console.log('User deleted:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Running the Server
1. Navigate to the `BackEnd` directory: `cd BackEnd`
2. Install dependencies (if you haven't already): `npm install`
3. Run the development server: `npm run dev` (starts on port 5000 with nodemon)

## Required Dependencies in `package.json`
- `express`: Core web framework
- `mongoose`: MongoDB object modeling tool
- `cors`: Middleware to enable CORS
- `dotenv`: Module to load environment variables from `.env` files

Make sure you have MongoDB running locally (`mongodb://localhost:27017/petcare`) or update the `MONGO_URI` in `.env` to point to your cloud instance.
