import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

export const getProducts = () => api.get('/products');
export const placeOrder = (orderData: any) => api.post('/orders', orderData);
export const getOrders = () => api.get('/orders');
export const getOrderById = (id: string) => api.get(`/orders/${id}`);

export default api;
