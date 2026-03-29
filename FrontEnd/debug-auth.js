// Debug script to test authentication flow
// Run this in browser console to debug auth issues

// Test 1: Check if token exists
const token = localStorage.getItem('petcare_token');
const user = localStorage.getItem('petcare_user');

console.log('=== Authentication Debug ===');
console.log('Token exists:', !!token);
console.log('Token preview:', token ? `${token.substring(0, 20)}...` : 'none');
console.log('User exists:', !!user);
console.log('User data:', user ? JSON.parse(user) : null);

// Test 2: Manual API call to test authentication
async function testAuth() {
  try {
    const response = await fetch('http://localhost:5000/api/pets/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Pet data:', data);
    } else {
      const error = await response.text();
      console.error('Error response:', error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Test 3: Test the problematic admin endpoint
async function testAdminEndpoint() {
  try {
    const userData = JSON.parse(user);
    const response = await fetch(`http://localhost:5000/api/pets?userId=${userData.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    
    console.log('Admin endpoint status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Admin endpoint success:', data);
    } else {
      const error = await response.text();
      console.error('Admin endpoint error:', error);
    }
  } catch (error) {
    console.error('Admin endpoint network error:', error);
  }
}

// Export functions for manual testing
window.testAuth = testAuth;
window.testAdminEndpoint = testAdminEndpoint;

console.log('Test functions available: testAuth(), testAdminEndpoint()');
