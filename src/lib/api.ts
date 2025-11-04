const API_BASE_URL = 'http://localhost:8090/api';

// API utility functions
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    return apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  register: async (userData: any) => {
    return apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  forgotPassword: async (email: string) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  getProfile: async () => {
    return apiRequest('/auth/profile');
  },
};

// Cars API
export const carsAPI = {
  getAll: async () => {
    return apiRequest('/cars');
  },

  getById: async (id: string) => {
    return apiRequest(`/cars/${id}`);
  },

  search: async (filters: any) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`/cars/search?${params}`);
  },
};

// Bookings API
export const bookingsAPI = {
  create: async (bookingData: any) => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  getByUser: async (userId: string) => {
    return apiRequest(`/bookings/user/${userId}`);
  },

  cancel: async (bookingId: string) => {
    return apiRequest(`/bookings/${bookingId}/cancel`, {
      method: 'PUT',
    });
  },

  getAll: async () => {
    return apiRequest('/bookings');
  },
};

// Admin API
export const adminAPI = {
  getAllBookings: async () => {
    return apiRequest('/admin/bookings');
  },

  updateCarStatus: async (carId: string, status: string) => {
    return apiRequest(`/admin/cars/${carId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  addCar: async (carData: any) => {
    return apiRequest('/admin/cars', {
      method: 'POST',
      body: JSON.stringify(carData),
    });
  },

  updateCar: async (carId: string, carData: any) => {
    return apiRequest(`/admin/cars/${carId}`, {
      method: 'PUT',
      body: JSON.stringify(carData),
    });
  },

  deleteCar: async (carId: string) => {
    return apiRequest(`/admin/cars/${carId}`, {
      method: 'DELETE',
    });
  },
};