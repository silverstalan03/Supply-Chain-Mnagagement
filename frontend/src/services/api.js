import axios from 'axios';

const API_URL = 'https://5813vss1o9.execute-api.us-east-1.amazonaws.com/Prod';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000
});

// Request interceptor with enhanced logging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      url: config.url,
      method: config.method?.toUpperCase(),
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
);

// Core services
const orderService = {
  async getOrders() {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      console.error('Get orders error:', error);
      throw error;
    }
  },

  async createOrder(orderData) {
    try {
      console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
      const response = await api.post('/orders', orderData);
      console.log('Order creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create order error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update status error:', error);
      throw error;
    }
  },

  async deleteOrder(orderId) {
    try {
      const response = await api.delete(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Delete order error:', error);
      throw error;
    }
  }
};

const healthService = {
  async check() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
};

export {
  orderService,
  healthService
};