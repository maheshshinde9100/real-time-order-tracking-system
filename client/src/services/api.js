import axios from "axios";

const API_BASE_URL = "http://localhost:8080"; // Default Spring Boot port

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createOrder = async (productName, amount) => {
  const response = await api.post("/orders", {
    userId: 101, // Mock user ID
    productName,
    amount,
  });
  return response.data;
};

export const getAllOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

export const getOrderStatus = async (id) => {
  const response = await api.get(`/orders/${id}/status`);
  return response.data;
};

export const getNotifications = async (userId = 101) => {
  const response = await api.get(`/notifications/${userId}`);
  return response.data;
};

export const getOrderAnalytics = async () => {
  const response = await api.get("/analytics/count");
  return response.data;
};
