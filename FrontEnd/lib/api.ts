const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
  body?: any;
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('petcare_token') : null;
  
  const headers = new Headers(options.headers || {});
  const isFormData = options.body instanceof FormData;
  if (!isFormData) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.body !== undefined) {
    if (isFormData) {
      config.body = options.body;
    } else if (typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    } else {
      config.body = options.body;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
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
  _id: string;
  id: string;
  email: string;
  name: string;
  fullName: string;
  phone: string;
  role: "user" | "trainer" | "worker" | "admin";
  avatar?: string;
  createdAt: Date;
  updatedAt: string;
}

export interface Pet {
  _id: string;
  id: string;
  ownerId: string;
  name: string;
  fullName?: string;
  type: "dog" | "cat" | "bird" | "rabbit" | "other";
  breed: string;
  age: number;
  weight?: number;
  color?: string;
  medicalNotes?: string;
  photo?: string;
  createdAt: Date;
  updatedAt: string;
}

export interface TrainerRequest {
  _id: string;
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

export interface CaregiverApplication {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  petTypes: string[];
  certifications?: string;
  bio: string;
  profileImage?: string;
  idDocument?: string;
  status: 'pending' | 'approved' | 'rejected';
  userId?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Trainer {
  _id: string;
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
  _id: string;
  id: string;
  name: string;
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
  getPets: (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return api.get<Pet[]>(`/pets${query}`);
  },
  
  getPetById: (id: string) =>
    api.get<{ pet: Pet; profile: any }>(`/pets/${id}`),
  
  createPet: (petData: FormData | Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Pet>('/pets', petData),
  
  updatePet: (id: string, petData: FormData | Partial<Pet>) =>
    api.put<Pet>(`/pets/${id}`, petData),
  
  deletePet: (id: string) =>
    api.delete<{ message: string }>(`/pets/${id}`),
  
  getPetsByUserId: (userId: string) =>
    api.get<Pet[]>(`/pets/user/${userId}`),
};

// Trainer Request API
export const trainerRequestApi = {
  createRequest: (requestData: FormData | { experience: string; message: string }) =>
    api.post<TrainerRequest>('/trainer-requests', requestData),
  
  getRequests: () =>
    api.get<TrainerRequest[]>('/trainer-requests'),
  
  getRequestById: (id: string) =>
    api.get<TrainerRequest>(`/trainer-requests/${id}`),
  
  approveRequest: (id: string) =>
    api.put<{ message: string; request: TrainerRequest }>(`/trainer-requests/${id}/approve`, {}),
  
  rejectRequest: (id: string, rejectionReason?: string) =>
    api.put<{ message: string; request: TrainerRequest }>(`/trainer-requests/${id}/reject`, { rejectionReason }),
  
  deleteRequest: (id: string) =>
    api.delete<{ message: string }>(`/trainer-requests/${id}`),
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

// Task API
export const taskApi = {
  getTasks: () =>
    api.get<any[]>('/tasks'),
  
  getTaskById: (id: string) =>
    api.get<any>(`/tasks/${id}`),
  
  createTask: (taskData: any) =>
    api.post<any>('/tasks', taskData),
  
  updateTask: (id: string, taskData: any) =>
    api.put<any>(`/tasks/${id}`, taskData),
  
  deleteTask: (id: string) =>
    api.delete<{ message: string }>(`/tasks/${id}`),
};

// Booking API
export const bookingApi = {
  getBookings: (ownerId?: string) => {
    const query = ownerId ? `?ownerId=${ownerId}` : '';
    return api.get<any[]>(`/bookings${query}`);
  },
  
  getBookingById: (id: string) =>
    api.get<any>(`/bookings/${id}`),
  
  createBooking: (bookingData: any) =>
    api.post<any>('/bookings', bookingData),
  
  updateBooking: (id: string, bookingData: any) =>
    api.put<any>(`/bookings/${id}`, bookingData),
  
  deleteBooking: (id: string) =>
    api.delete<{ message: string }>(`/bookings/${id}`),
};

// Routine API
export const routineApi = {
  getRoutines: () =>
    api.get<any[]>('/routine/my-routines'),
  
  getRoutineLogs: (petId: string) =>
    api.get<any[]>(`/routine/pet/${petId}/logs`),
  
  completeRoutine: (routineId: string, photo: File) => {
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('routineId', routineId);
    return api.post<any>('/routine/complete', formData);
  },
  
  uploadPhoto: (photo: File) => {
    const formData = new FormData();
    formData.append('photo', photo);
    return api.post<{ photoUrl: string }>('/routine/upload', formData);
  },
};

// Project API
export interface Project {
  _id: string;
  id: string;
  name: string;
  subtitle?: string;
  date: string;
  progress: number;
  status: "inProgress" | "upcoming" | "completed" | "paused";
  accentColor: string;
  bgColorClass?: string;
  participants: string[];
  daysLeft?: number | string;
  ownerId: string;
  petId?: string;
  trainerId?: string;
  tags?: string[];
  description?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  completedAt?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  pet?: {
    _id: string;
    name: string;
    type: string;
    photo?: string;
  };
  trainer?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface ProjectMessage {
  _id: string;
  id: string;
  projectId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  starred: boolean;
  read: boolean;
  messageType: "update" | "reminder" | "info" | "alert";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  sender?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface ProjectStats {
  total: number;
  inProgress: number;
  upcoming: number;
  completed: number;
  paused: number;
}

export const projectApi = {
  getProjects: (params?: {
    status?: string;
    petId?: string;
    trainerId?: string;
    search?: string;
    sortBy?: string;
    sortDir?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.append(key, value.toString());
        }
      });
    }
    const queryString = query.toString();
    return api.get<{
      projects: Project[];
      stats: ProjectStats;
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/projects${queryString ? `?${queryString}` : ''}`);
  },
  
  getProject: (id: string) =>
    api.get<Project>(`/projects/${id}`),
  
  createProject: (projectData: Partial<Project>) =>
    api.post<Project>('/projects', projectData),
  
  updateProject: (id: string, projectData: Partial<Project>) =>
    api.put<Project>(`/projects/${id}`, projectData),
  
  deleteProject: (id: string) =>
    api.delete<{ message: string }>(`/projects/${id}`),
  
  reorderProjects: (projectIds: string[]) =>
    api.put<Project[]>('/projects/reorder', { projectIds }),
  
  getProjectMessages: (projectId: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.append(key, value.toString());
        }
      });
    }
    const queryString = query.toString();
    return api.get<{
      messages: ProjectMessage[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/projects/${projectId}/messages${queryString ? `?${queryString}` : ''}`);
  },
  
  addProjectMessage: (projectId: string, messageData: {
    text: string;
    messageType?: "update" | "reminder" | "info" | "alert";
    priority?: "low" | "medium" | "high";
  }) =>
    api.post<ProjectMessage>(`/projects/${projectId}/messages`, messageData),
  
  toggleMessageStar: (projectId: string, messageId: string) =>
    api.put<{ starred: boolean }>(`/projects/${projectId}/messages/${messageId}/star`, {}),
}

export const caregiverApi = {
  submitApplication: (applicationData: Partial<CaregiverApplication>) =>
    api.post<CaregiverApplication>('/caregiver/apply', applicationData),
  
  getApplications: (status?: string) =>
    api.get<CaregiverApplication[]>(`/caregiver/pending${status ? `?status=${status}` : ''}`),
  
  approveApplication: (id: string) =>
    api.put<{ message: string; application: CaregiverApplication }>(`/caregiver/approve/${id}`, {}),
  
  rejectApplication: (id: string, rejectionReason?: string) =>
    api.put<{ message: string; application: CaregiverApplication }>(`/caregiver/reject/${id}`, { rejectionReason }),
  
  deleteApplication: (id: string) =>
    api.delete<{ message: string }>(`/caregiver/delete/${id}`),
  
  getStats: () =>
    api.get<{
      totalApplications: number;
      pendingApplications: number;
      approvedCaregivers: number;
      rejectedApplications: number;
    }>('/caregiver/stats'),
};
