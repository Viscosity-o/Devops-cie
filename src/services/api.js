const API_BASE_URL = 'http://localhost:8081/api';

// Helper to retrieve auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem('taskcraft_jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const apiService = {
  // Auth API
  async login(username, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || data.error || 'Login failed. Please check credentials.');
    }
    return data;
  },

  async signup(username, email, password, fullName) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, fullName }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || data.error || 'Signup failed. Please try again.');
    }
    return data;
  },

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) return null;
    return await response.json();
  },

  // Task API
  async getTasks() {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks from server');
    }
    return await response.json();
  },

  async createTask(taskData) {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error('Failed to create task on server');
    }
    return await response.json();
  },

  async updateTask(id, taskData) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error('Failed to update task on server');
    }
    return await response.json();
  },

  async deleteTask(id) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete task from server');
    }
    return await response.json();
  }
};
