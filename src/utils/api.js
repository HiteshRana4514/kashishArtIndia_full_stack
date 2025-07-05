// Centralized API utility for backend requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
