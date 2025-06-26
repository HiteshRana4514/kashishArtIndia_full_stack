import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

// Test health endpoint
const testHealth = async () => {
  try {
    console.log('🏥 Testing health endpoint...');
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health check:', data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
};

// Test admin setup
const testAdminSetup = async () => {
  try {
    console.log('\n👤 Testing admin setup...');
    const response = await fetch(`${BASE_URL}/auth/setup-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log('✅ Admin setup:', data);
  } catch (error) {
    console.error('❌ Admin setup failed:', error.message);
  }
};

// Test admin login
const testAdminLogin = async () => {
  try {
    console.log('\n🔐 Testing admin login...');
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'password'
      })
    });
    const data = await response.json();
    console.log('✅ Admin login:', data);
    return data.token;
  } catch (error) {
    console.error('❌ Admin login failed:', error.message);
    return null;
  }
};

// Test protected endpoint
const testProtectedEndpoint = async (token) => {
  if (!token) {
    console.log('❌ No token available for protected endpoint test');
    return;
  }

  try {
    console.log('\n🔒 Testing protected endpoint...');
    const response = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log('✅ Protected endpoint:', data);
  } catch (error) {
    console.error('❌ Protected endpoint failed:', error.message);
  }
};

// Test paintings endpoint
const testPaintingsEndpoint = async () => {
  try {
    console.log('\n🎨 Testing paintings endpoint...');
    const response = await fetch(`${BASE_URL}/paintings`);
    const data = await response.json();
    console.log('✅ Paintings endpoint:', data);
  } catch (error) {
    console.error('❌ Paintings endpoint failed:', error.message);
  }
};

// Test blog endpoint
const testBlogEndpoint = async () => {
  try {
    console.log('\n📝 Testing blog endpoint...');
    const response = await fetch(`${BASE_URL}/blog`);
    const data = await response.json();
    console.log('✅ Blog endpoint:', data);
  } catch (error) {
    console.error('❌ Blog endpoint failed:', error.message);
  }
};

// Main test function
const runTests = async () => {
  console.log('🧪 Starting API tests...\n');
  
  await testHealth();
  await testAdminSetup();
  const token = await testAdminLogin();
  await testProtectedEndpoint(token);
  await testPaintingsEndpoint();
  await testBlogEndpoint();
  
  console.log('\n✅ All tests completed!');
};

// Run tests
runTests().catch(console.error); 