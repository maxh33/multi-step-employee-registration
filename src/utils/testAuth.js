// Test Firebase Authentication Setup
// Run this in the browser console on http://localhost:3000

const testFirebaseAuth = async () => {
  try {
    // Test with the credentials you created in Firebase Console
    const email = 'YOUR_TEST_EMAIL@example.com'; // Replace with your test email
    const password = 'YOUR_TEST_PASSWORD'; // Replace with your test password
    
    console.log('Testing Firebase Auth...');
    console.log('Environment variables loaded:', {
      hasApiKey: !!process.env.REACT_APP_FIREBASE_API_KEY,
      hasAuthDomain: !!process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      hasProjectId: !!process.env.REACT_APP_FIREBASE_PROJECT_ID,
    });
    
    // Direct API call to identify the exact error
    const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Auth Error Details:');
      console.error('Status:', response.status);
      console.error('Response:', data);
      console.error('Error Message:', data.error?.message);
      console.error('Error Details:', data.error?.errors);
      
      // Common error codes and their meanings
      const errorMeanings = {
        'EMAIL_NOT_FOUND': 'User does not exist. Create user in Firebase Console first.',
        'INVALID_PASSWORD': 'Wrong password for this email.',
        'USER_DISABLED': 'User account has been disabled.',
        'INVALID_EMAIL': 'Email format is invalid.',
        'MISSING_PASSWORD': 'Password is required.',
        'WEAK_PASSWORD': 'Password should be at least 6 characters.',
        'API_KEY_INVALID': 'API key is invalid. Check Firebase configuration.',
        'INVALID_API_KEY': 'API key is invalid or restricted.',
      };
      
      if (data.error?.message && errorMeanings[data.error.message]) {
        console.log('🔴 Solution:', errorMeanings[data.error.message]);
      }
    } else {
      console.log('✅ Auth Success!', data);
      console.log('User ID:', data.localId);
      console.log('Email:', data.email);
    }
  } catch (error) {
    console.error('Network Error:', error);
  }
};

// Export for use in console
window.testFirebaseAuth = testFirebaseAuth;

console.log('Test function loaded! Run window.testFirebaseAuth() after updating email/password in the code.');

export default testFirebaseAuth;