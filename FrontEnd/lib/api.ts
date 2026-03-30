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
  retryDelay?: number;
  enableRetry?: boolean;
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('petcare_token') : null;
  const timeoutMs = options.timeout || 15000; // Increased default timeout to 15s
  const maxRetries = options.retries !== undefined ? options.retries : 2; // Default 2 retries
  const retryDelay = options.retryDelay || 1000; // Default 1s delay
  const enableRetry = options.enableRetry !== false; // Enable retry by default
  let attempt = 0;
  
  // Debug logging
  if (typeof window !== 'undefined') {
    console.log(`[API] ${options.method || 'GET'} ${endpoint}`, {
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
      isClientSide: true
    });
  }
  
  const headers = new Headers(options.headers || {});
  const isFormData = options.body instanceof FormData;
  if (!isFormData) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  } else {
    console.warn('[API] No token found - request may fail authentication');
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
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
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);
    
    config.signal = controller.signal;

    if (config.body) {
    }

    try {
      const response = await fetch(fullUrl, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData: any = {};
        let text = '';
        try {
          text = await response.text();
          errorData = text ? JSON.parse(text) : {};
        } catch (e) {
          errorData = { message: text || `HTTP Error ${response.status}`, raw: text };
        }
        
        // Enhanced logging for 403 errors
        if (response.status === 403) {
          console.error(`[API] 403 Forbidden - Permission denied for ${endpoint}`, {
            endpoint,
            method: options.method || 'GET',
            hasToken: !!token,
            error: errorData,
            headers: Object.fromEntries(headers.entries())
          });
        }
        
        // Automatic token purge on 401 Unauthorized
        if (response.status === 401 && typeof window !== 'undefined') {
          console.warn('[API Auth] 401 Unauthorized - Purging credentials');
          localStorage.removeItem('petcare_token');
          localStorage.removeItem('petcare_user');
          // Optional: redirect to login if we have window.location
          if (endpoint !== '/auth/login' && endpoint !== '/auth/admin-login') {
            window.location.href = '/login';
          }
        }
        
        const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        
        console.error(`[API Error] ${response.status} ${config.method} ${endpoint}:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          message: errorMessage,
          attempt: attempt + 1
        });
        
        // Don't retry on client errors (4xx) except for 408 (timeout)
        // Specifically don't retry 429 (rate limit) to avoid making it worse
        const shouldRetry = enableRetry && 
          (response.status >= 500 || response.status === 408) && 
          attempt < maxRetries;
        
        if (!shouldRetry) {
          // For rate limit errors, include retry information
          if (response.status === 429) {
            const enhancedError = new Error(errorMessage);
            (enhancedError as any).isRateLimit = true;
            (enhancedError as any).retryAfter = errorData.retryAfter || '15 minutes';
            (enhancedError as any).type = errorData.type || 'rate_limit';
            throw enhancedError;
          }
          const noRetryError = new Error(errorMessage);
          (noRetryError as any).isNoRetry = true;
          throw noRetryError;
        } else {
          // This allows the catch block to retry normal server errors
          throw new Error(errorMessage);
        }
      } else {
        const data = await response.json();
        return data;
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      const isLastAttempt = attempt === maxRetries;
      
      // Don't retry specific errors (like 4xx client errors)
      if (error.isRateLimit || error.isNoRetry) {
        throw error;
      }
      
      if (error.name === 'AbortError') {
        console.error(`[API Timeout] Request aborted after ${timeoutMs}ms (Attempt ${attempt + 1})`);
        if (isLastAttempt) {
          throw new Error(`Request timed out after ${timeoutMs}ms. Please check your connection and try again.`);
        }
      } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error(`[API Connection Error] Cannot reach backend at ${API_BASE_URL} (Attempt ${attempt + 1})`);
        
        if (isLastAttempt) {
          // Specific backend down identifier for boundary catching
          throw new Error(`BACKEND_DOWN: Unable to connect to the server. Please check if the backend is running at ${API_BASE_URL}`);
        }
      } else if (error.message && error.message.startsWith('BACKEND_DOWN')) {
        // Re-throw backend down errors immediately
        throw error;
      } else {
        console.error(`[API Error] Unexpected error (Attempt ${attempt + 1}):`, error);
        if (isLastAttempt) {
          throw error;
        }
      }
    }
    
    // Retry logic with exponential backoff
    if (attempt < maxRetries) {
      attempt++;
      const delay = retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error("Request failed after all retry attempts. Please try again later.");
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) => 
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, body: any, options?: RequestOptions) => 
    apiFetch<T>(endpoint, { ...options, method: 'POST', body }),
  
  put: <T>(endpoint: string, body: any, options?: RequestOptions) => 
    apiFetch<T>(endpoint, { ...options, method: 'PUT', body }),
  
  patch: <T>(endpoint: string, body: any, options?: RequestOptions) => 
    apiFetch<T>(endpoint, { ...options, method: 'PATCH', body }),
  
  delete: <T>(endpoint: string, options?: RequestOptions) => 
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};

// Types
export interface User {
  _id: string;
  id: string;
  email: string;
  name: string;
  role: "user" | "admin" | "trainer";
  status?: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: string;
}

export interface Pet {
  _id: string;
  id: string;
  userId: string;
  ownerId?: string; // Consistent with lib/types.ts
  name: string;
  type: string;
  breed?: string; // Consistent with lib/types.ts
  age: number;
  description?: string;
  image: string;
  status: "pending" | "accepted" | "rejected" | "approved";
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
  
export interface Notification {
  _id?: string;
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  read: boolean;
  actionUrl?: string;
  sentAt: string;
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
    api.post<AuthResponse>('/auth/admin-login', credentials, { 
      retries: 1, // Reduce retries for admin login
      enableRetry: false // Disable retries for admin login to avoid rate limit issues
    }),
  
  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, newPassword: string) =>
    api.post<{ message: string }>('/auth/reset-password', { token, newPassword }),
};

// Pet API
export const petApi = {
  getPets: async (userId?: string) => {
    if (userId) {
      return api.get<Pet[]>(`/pets?userId=${userId}`);
    }
    return api.get<Pet[]>('/pets');
  },
  
  createPet: (petData: FormData | { name: string; type: string; age: number; description?: string; image: string }) =>
    api.post<Pet>('/pets', petData),
  
  getAllPets: () =>
    api.get<Pet[]>('/pets'),
  
  getUserPets: () =>
    api.get<Pet[]>('/pets/user'),
  
  updatePet: (id: string, petData: FormData | Partial<Pet>) =>
    api.put<Pet>(`/pets/${id}`, petData),
  
  deletePet: (id: string) =>
    api.delete<{ message: string }>(`/pets/${id}`),
  
  updatePetStatus: (id: string, status: 'accepted' | 'rejected') =>
    api.patch<Pet>(`/pets/${id}`, { status }),
  
  getPetById: (id: string) =>
    api.get<Pet>(`/pets/${id}`),
    
  getPetStatusUpdates: (petId: string) =>
    api.get<any>(`/pet-updates/${petId}`),
    
  createPetUpdate: (formData: FormData) =>
    petUpdateApi.createUpdate(formData),
};

// Trainer Request API
export const trainerRequestApi = {
  createRequest: (requestData: FormData | { experience: string; message: string }) =>
    api.post<TrainerRequest>('/trainer-requests', requestData),
  
  getRequests: () =>
    api.get<TrainerRequest[]>('/trainer-requests'),
  
  getRequestById: (id: string) =>
    api.get<TrainerRequest>(`/trainer-requests/${id}`),
  
  getUserRequest: () =>
    api.get<TrainerRequest>('/trainer-requests/my-request'),
  
  approveRequest: (id: string) =>
    api.put<{ message: string; request: TrainerRequest }>(`/trainer-requests/${id}/approve`, {}),
  
  rejectRequest: (id: string, rejectionReason?: string) =>
    api.put<{ message: string; request: TrainerRequest }>(`/trainer-requests/${id}/reject`, { rejectionReason }),
  
  deleteRequest: (id: string) =>
    api.delete<{ message: string }>(`/trainer-requests/${id}`),
};

// Pet Update API
export const petUpdateApi = {
  createUpdate: (formData: FormData) =>
    api.post<any>('/pet-updates', formData),
  
  getPetUpdates: (petId: string) =>
    api.get<any[]>(`/pet-updates/${petId}`),
  
  getTrainerUpdates: (trainerId: string) =>
    api.get<any[]>(`/pet-updates/trainer/${trainerId}`),
  
  deleteUpdate: (id: string) =>
    api.delete<{ message: string }>(`/pet-updates/${id}`),
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
    
  getPendingRequests: () =>
    api.get<any[]>('/admin/requests'),
    
  acceptRequest: (type: string, id: string) =>
    api.patch<any>(`/admin/accept/${type}/${id}`, {}),
    
  rejectRequest: (type: string, id: string) =>
    api.patch<any>(`/admin/reject/${type}/${id}`, {}),
};

// Trainer API
export const trainerApi = {
  getTrainers: () => api.get<Trainer[]>('/trainers'),
  getTrainerProfile: () => api.get<Trainer>('/trainers/profile'),
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

// Chat API
export const chatApi = {
  getConversations: () => api.get<any[]>('/chat/conversations'),
  getMessages: (conversationId: string) => api.get<any[]>(`/chat/${conversationId}`),
  initiateConversation: (userId: string, trainerId: string) => api.post<any>('/chat/conversation', { userId, trainerId }),
};

// Notification API
export const notificationApi = {
  getNotifications: () => api.get<Notification[]>('/notifications'),
  markAsRead: (id: string) => api.patch<Notification>(`/notifications/${id}/read`, {}),
};
