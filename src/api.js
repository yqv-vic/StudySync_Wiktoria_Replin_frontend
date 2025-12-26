import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

// automatically attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// auth
export function login(data) {
  // { email; password }
  return api.post("/auth/login", data);
}

export function getMe() {
  return api.get("/me");
}

// tasks
export function getTasks() {
  return api.get("/tasks");
}

export function createTask(data) {
  return api.post("/tasks", data);
}

export function deleteTask(id) {
  return api.delete(`/tasks/${id}`);
}

export default api;

