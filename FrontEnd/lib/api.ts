const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
  body?: any;
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('petcare_token') : null;
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Something went wrong');
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) => 
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, body: any, options?: RequestOptions) => 
    apiFetch<T>(endpoint, { ...options, method: 'POST', body }),
  
  put: <T>(endpoint: string, body: any, options?: RequestOptions) => 
    apiFetch<T>(endpoint, { ...options, method: 'PUT', body }),
  
  delete: <T>(endpoint: string, options?: RequestOptions) => 
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};

// Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: "owner" | "trainer" | "admin";
  avatar?: string;
  createdAt: Date;
  updatedAt: string;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  fullName?: string;
  species: "dog" | "cat";
  breed: string;
  age: number;
  weight?: string;
  color?: string;
  medicalNotes?: string;
  photo?: string;
  createdAt: Date;
  updatedAt: string;
}

export interface TrainerRequest {
  id: string;
  userId: string;
  name: string;
  email: string;
  experience: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Trainer {
  id: string;
  userId: string;
  name: string;
  email: string;
  bio: string;
  experience: number;
  certifications: string[];
  services: string[];
  pricing: number;
  availability: string[];
  rating: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  id: string;
  fullName: string;
  email: string;
  role: string;
  token: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalPets: number;
  totalTrainers: number;
  pendingTrainerRequests: number;
}

// Auth API
export const authApi = {
  register: (userData: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', userData),
  
  login: (credentials: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', credentials),
  
  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }),
};

// Pet API
export const petApi = {
  getPets: (ownerId?: string) => {
    const query = ownerId ? `?ownerId=${ownerId}` : '';
    return api.get<Pet[]>(`/pets${query}`);
  },
  
  getPetById: (id: string) =>
    api.get<{ pet: Pet; profile: any }>(`/pets/${id}`),
  
  createPet: (petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Pet>('/pets', petData),
  
  updatePet: (id: string, petData: Partial<Pet>) =>
    api.put<Pet>(`/pets/${id}`, petData),
  
  deletePet: (id: string) =>
    api.delete<{ message: string }>(`/pets/${id}`),
};

// Trainer Request API
export const trainerRequestApi = {
  createRequest: (requestData: { experience: string; message: string }) =>
    api.post<TrainerRequest>('/trainer-requests', requestData),
  
  getRequests: () =>
    api.get<TrainerRequest[]>('/trainer-requests'),
  
  approveRequest: (id: string) =>
    api.put<{ message: string }>(`/trainer-requests/${id}/approve`, {}),
  
  rejectRequest: (id: string) =>
    api.put<{ message: string }>(`/trainer-requests/${id}/reject`, {}),
};

// Admin API
export const adminApi = {
  getUsers: () =>
    api.get<User[]>('/admin/users'),
  
  getPets: () =>
    api.get<Pet[]>('/admin/pets'),
  
  getTrainers: () =>
    api.get<Trainer[]>('/admin/trainers'),
  
  getTrainerRequests: () =>
    api.get<TrainerRequest[]>('/admin/trainer-requests'),
  
  getDashboardStats: () =>
    api.get<DashboardStats>('/admin/dashboard'),
  
  updateUserRole: (id: string, role: string) =>
    api.put<User>(`/admin/users/${id}/role`, { role }),
  
  acceptTrainerRequest: (id: string) =>
    api.put<{ message: string; request: TrainerRequest }>(`/admin/trainer-requests/${id}/accept`, {}),
  
  rejectTrainerRequest: (id: string) =>
    api.put<{ message: string; request: TrainerRequest }>(`/admin/trainer-requests/${id}/reject`, {}),
  
  deleteUser: (id: string) =>
    api.delete<{ message: string }>(`/admin/users/${id}`),
};
