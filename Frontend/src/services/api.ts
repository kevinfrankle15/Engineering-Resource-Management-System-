import axios from 'axios';
const API = axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api' });
// Auth
export const login = (data: { email: string; password: string }) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');

// Engineers
export const fetchEngineers = (params?: {
  skill?: string;
  level?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}) => {
  const query = new URLSearchParams(params as any).toString();
  return API.get(`/engineers?${query}`);
};

export const getEngineerById = (id: string) => API.get(`/engineers/${id}`);

export const createEngineer = (data: {
  name: string;
  level: string;
  skills: string;
}) => API.post('/engineers', data);

export const updateEngineer = (
  id: string,
  data: { name: string; level: string; skills: string }
) => API.put(`/engineers/${id}`, data);

export const deleteEngineer = (id: string) => API.delete(`/engineers/${id}`);

export const getEngineerCapacity = (id: string) =>
  API.get(`/engineers/${id}/capacity`);

// Projects
export const fetchProjects = (token: string) =>
  API.get('/projects', {
    headers: { Authorization: `Bearer ${token}` },
  });
export const createProject = (data: any, token: string) =>
  API.post('/projects', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const getProject = (id: string) => API.get(`/projects/${id}`);

export const deleteProject = (id: number, token: string) =>
  API.delete(`/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateProject = (id: number, data: any, token: string) =>
  API.put(`/projects/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Assignments
export const fetchAssignments = (token: string) =>
  API.get('/assignments', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createAssignment = (data: any, token: string) =>
  
  API.post('/assignments', data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateAssignment = (id: string, data: any, token: string) =>
  API.put(`/assignments/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteAssignment = (id: number, token: string) =>
  API.delete(`/assignments/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
