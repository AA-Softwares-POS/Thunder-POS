import axios from 'axios';
import axiosRetry from 'axios-retry';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const client = axios.create({
  baseURL: API_BASE_URL,
});

axiosRetry(client, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export const apiRequest = async (endpoint: string, options: any = {}) => {
  const token = localStorage.getItem('auth_token');
  
  try {
    const response = await client({
      url: endpoint,
      method: options.method || 'GET',
      data: options.body,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Network error');
  }
};
