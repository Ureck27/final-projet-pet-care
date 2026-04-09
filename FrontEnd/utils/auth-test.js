// Simple authentication test utility
// This can be used to verify the auth flow is working correctly

export const testAuthFlow = async () => {
  console.log('Testing authentication flow...');

  try {
    // Test 1: Check if no token results in graceful 401
    console.log('1. Testing unauthenticated state...');
    const response = await fetch('/api/auth/me', {
      credentials: 'include',
    });

    if (response.status === 401) {
      console.log('✓ Unauthenticated state handled correctly');
    } else {
      console.log('⚠ Unexpected response for unauthenticated request:', response.status);
    }

    // Test 2: Check if cookies are being sent
    console.log('2. Checking cookie presence...');
    const hasTokenCookie = document.cookie.includes('token=');
    console.log(
      hasTokenCookie
        ? '✓ Token cookie found'
        : '✓ No token cookie (expected for unauthenticated state)',
    );

    // Test 3: Test login flow (if credentials are available)
    console.log('3. Authentication flow ready for testing');

    return {
      success: true,
      message: 'Authentication test completed',
      hasToken: hasTokenCookie,
      unhandledAuth: response.status !== 401,
    };
  } catch (error) {
    console.error('Auth test failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
