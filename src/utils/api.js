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
  const options = {
    method,
    headers: {},
    body: formData,
  };
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'API Error');
  }
  return json;
}
