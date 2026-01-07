import axios from "axios";
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api/auth`;

export const registerUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/register`, data);
    return response;
  } catch (error) {
    throw error.response || { data: { error: "Server error" }, status: 500 };
  }
};

export const loginUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email: data.email,
      password: data.password
    });
    return response;
  } catch (error) {
    throw error.response || { data: { error: "Server error" }, status: 500 };
  }
};
