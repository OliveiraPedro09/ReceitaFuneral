import axios from "axios";

// const API_URL = process.env.API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: 'http://10.0.2.2:3000/api',
});

export default api;