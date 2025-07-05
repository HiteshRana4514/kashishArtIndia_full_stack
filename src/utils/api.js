// Centralized API utility for backend requests
// Determine if we're in production based on hostname
const isProduction = window.location.hostname !== 'localhost' && 
                   window.location.hostname !== '127.0.0.1';

// Use the correct API URL based on environment
const API_BASE_URL = isProduction 
  ? 'https://kashishartindia-full-stack.onrender.com/api'
  : 'http://localhost:5000/api';
  
// Log which API URL we're using for debugging
console.log(`Using API URL: ${API_BASE_URL} (${isProduction ? 'Production' : 'Development'} environment)`);

export async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  if (data) {
    options.body = JSON.stringify(data);
  }
  const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'API Error');
  }
  return json;
}

// For multipart/form-data (file upload)
export async function apiRequestMultipart(endpoint, method = 'POST', formData, token = null) {
  // Use a simpler approach that's less likely to cause issues
  // Don't clone FormData as it can lead to problems with file references
  
  // Log for debugging
  console.log(`Uploading to ${endpoint} with method ${method}`);
  console.log(`FormData has ${[...formData.entries()].length} entries`);
  
  // Check if there are file entries and log their sizes
  for (let [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`File: ${key}, name: ${value.name}, size: ${value.size} bytes, type: ${value.type}`);
    }
  }

  const options = {
    method,
    headers: {},
    body: formData, // Use original formData to avoid reference issues
    // No timeout to avoid interrupting large uploads
  };
  
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    console.log('Sending request...');
    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
    console.log(`Response status: ${res.status}`);
    
    // Handle different response types
    const contentType = res.headers.get('content-type');
    let responseData;
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await res.json();
    } else {
      const text = await res.text();
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = { message: text };
      }
    }
    
    if (!res.ok) {
      console.error('API Error:', responseData);
      throw new Error(responseData.message || responseData.error || `API Error: ${res.status}`);
    }
    
    return responseData;
  } catch (error) {
    console.error('Upload error:', error);
    // Rethrow with more helpful message
    throw new Error(error.message || 'File upload failed. Please try again.');
  }
}
