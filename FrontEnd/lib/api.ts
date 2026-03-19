const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side requests ALWAYS go to the public URL
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  }
  // Server-side (React Server Components, SSR)
  // Use INTERNAL_API_URL if needed for docker, fallback to public
  return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

interface RequestOptions extends RequestInit {
  body?: any;
  timeout?: number;
  retries?: number;
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('petcare_token') : null;
  const timeoutMs = options.timeout || 8000;
  const maxRetries = options.retries || 0;
  let attempt = 0;
  
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

  const fullUrl = `${API_BASE_URL}${endpoint}`;
  
  while (attempt <= maxRetries) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    config.signal = controller.signal;

    console.log(`[API] ${config.method || 'GET'} ${fullUrl} (Attempt ${attempt + 1})`);

    try {
      const response = await fetch(fullUrl, config);
      clearTimeout(id);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        
        console.error(`[API Error] ${response.status} ${config.method} ${endpoint}:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          message: errorMessage
        });
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`[API Success] ${config.method || 'GET'} ${endpoint}`);
      return data;
    } catch (error: any) {
      clearTimeout(id);
      const isLastAttempt = attempt === maxRetries;
      
      if (error.name === 'AbortError') {
        if (isLastAttempt) throw new Error(`Request timed out after ${timeoutMs}ms.`);
      } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error(`[API Connection Error] Cannot reach backend at ${API_BASE_URL}`);
        
        if (isLastAttempt) {
            // Specific backend down identifier for boundary catching
            throw new Error(`BACKEND_DOWN: Connection failed to ${API_BASE_URL}`);
        }
      } else {
        if (isLastAttempt) throw error;
      }
      
      attempt++;
      // Exponential backoff
      if (!isLastAttempt) {
          await new Promise(res => setTimeout(res, 1000 * attempt));
      }
    }
  }
  throw new Error("Unexpected error after retries");
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
  status: "pending" | "active" | "suspended" | "rejected";
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
  description?: string;
  imageUrl?: string;
  photo?: string;
  status: "pending" | "approved" | "rejected";
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

export interface TrainerService {
  _id?: string;
  serviceName: string;
  price?: number | null;
  priceType?: 'fixed' | 'hourly' | 'custom';
  isActive?: boolean;
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
  services: (string | TrainerService)[];
  pricing?: number;
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
  status: string;
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
  
  adminLogin: (credentials: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/admin-login', credentials),
  
  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, newPassword: string) =>
    api.post<{ message: string }>('/auth/reset-password', { token, newPassword }),
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
    
  updateUserStatus: (id: string, status: string) =>
    api.put<User>(`/admin/users/${id}/status`, { status }),
    
  approvePet: (id: string) =>
    api.patch<Pet>(`/admin/pets/${id}/approve`, {}),
    
  rejectPet: (id: string) =>
    api.patch<Pet>(`/admin/pets/${id}/reject`, {}),
  
  acceptTrainerRequest: (id: string) =>
    api.put<{ message: string; request: TrainerRequest }>(`/admin/trainer-requests/${id}/accept`, {}),
  
  rejectTrainerRequest: (id: string) =>
    api.put<{ message: string; request: TrainerRequest }>(`/admin/trainer-requests/${id}/reject`, {}),
  
  deleteUser: (id: string) =>
    api.delete<{ message: string }>(`/admin/users/${id}`),
};

// Trainer API
export const trainerApi = {
  getTrainers: () => api.get<Trainer[]>('/trainers'),
  getTrainerById: (id: string) => api.get<Trainer>(`/trainers/${id}`),
  updateTrainer: (id: string, trainerData: Partial<Trainer>) => api.put<Trainer>(`/trainers/${id}`, trainerData),
  getTrainerServices: (id: string) => api.get<TrainerService[]>(`/trainers/${id}/services`),
  addTrainerService: (id: string, serviceData: TrainerService) => api.post<TrainerService>(`/trainers/${id}/services`, serviceData),
  updateTrainerService: (id: string, serviceId: string, serviceData: Partial<TrainerService>) => api.put<TrainerService>(`/trainers/${id}/services/${serviceId}`, serviceData),
  deleteTrainerService: (id: string, serviceId: string) => api.delete<{ message: string }>(`/trainers/${id}/services/${serviceId}`),
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
