const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side requests ALWAYS go to the public URL
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  }
  // Server-side (React Server Components, SSR)
  // Use INTERNAL_API_URL if needed for docker, fallback to public
  return (
    process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  );
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Gets the full URL for media assets (images, videos)
 */
export function getMediaUrl(path: string | null | undefined): string {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http')) return path;

  // Use the API URL but strip the /api suffix to get the backend origin
  const origin = API_BASE_URL.replace(/\/api$/, '');
  return `${origin}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * Decodes a JWT token without validation
 * Note: Since tokens are now HttpOnly cookies, this is rarely used directly by clients unless explicitly passed.
 */
export function decodeToken(token: string | null): any {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('[API] Failed to decode token:', error);
    return null;
  }
}

interface RequestOptions extends RequestInit {
  body?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  enableRetry?: boolean;
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const isDev = process.env.NODE_ENV === 'development';
  const timeoutMs = options.timeout || (isDev ? 30000 : 15000); // 30s in dev, 15s in prod
  const maxRetries = options.retries !== undefined ? options.retries : isDev ? 3 : 2; // 3 retries in dev
  const retryDelay = options.retryDelay || 1000;
  const enableRetry = options.enableRetry !== false;
  let attempt = 0;

  if (isDev) {
    console.log(`[API Request] ${options.method || 'GET'} ${endpoint} (Timeout: ${timeoutMs}ms)`);
  }

  const headers = new Headers(options.headers || {});
  const isFormData = options.body instanceof FormData;
  if (!isFormData) {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Important: This ensures HttpOnly cookies are sent
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

  const fullUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

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
            error: errorData,
          });

          // Throw a more descriptive error for 403
          const forbiddenError = new Error(
            errorData.message ||
              'Access Forbidden: You do not have permission to access this resource.',
          );
          (forbiddenError as any).status = 403;
          (forbiddenError as any).isNoRetry = true;
          throw forbiddenError;
        }

        // Automatic token purge on 401 Unauthorized
        if (response.status === 401 && typeof window !== 'undefined') {
          // Check if this is an auth check - don't log as warning for expected failures
          const isAuthCheck = endpoint === '/auth/me' || endpoint.includes('/auth/me');

          if (!isAuthCheck) {
            console.warn('[API Auth] 401 Unauthorized - Purging credentials');
          }

          // Check if we're already on an auth page to avoid infinite reload loops
          const pathname = window.location.pathname;
          const isAuthPage =
            pathname === '/login' || pathname === '/admin-login' || pathname === '/register';

          if (
            !isAuthPage &&
            !isAuthCheck &&
            endpoint !== '/auth/login' &&
            endpoint !== '/auth/admin-login'
          ) {
            window.location.href = '/login';
          }
        }

        const errorMessage =
          errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;

        // Reduce noise for auth check failures - only log real errors
        const isAuthCheck = endpoint === '/auth/me' || endpoint.includes('/auth/me');
        const shouldLogError = response.status !== 401 || !isAuthCheck;

        if (shouldLogError) {
          console.error(`[API Error] ${response.status} ${config.method} ${endpoint}:`, {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
            message: errorMessage,
            attempt: attempt + 1,
          });
        }

        // Don't retry on client errors (4xx) except for 408 (timeout)
        // Specifically don't retry 429 (rate limit) to avoid making it worse
        const shouldRetry =
          enableRetry &&
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
        const retryText = maxRetries > 0 ? ` [Retrying ${attempt + 1}/${maxRetries}]` : '';
        console.error(`[API Timeout] Request timed out after ${timeoutMs}ms${retryText}`);
        if (isLastAttempt) {
          throw new Error(
            `Request timed out after ${timeoutMs}ms. Please check your connection and try again.`,
          );
        }
      } else if (
        error instanceof TypeError &&
        (error.message === 'Failed to fetch' || error.message.includes('NetworkError'))
      ) {
        const retryText = maxRetries > 0 ? ` [Retrying ${attempt + 1}/${maxRetries}]` : '';
        console.error(`[API Connection Error] Cannot reach backend at ${API_BASE_URL}${retryText}`);

        if (isLastAttempt) {
          // Specific backend down identifier for UI context boundary catching
          const connectionError = new Error(
            `BACKEND_OFFLINE: Connection refused. Please ensure the backend is running at ${API_BASE_URL}`,
          );
          (connectionError as any).isBackendDown = true;
          (connectionError as any).url = fullUrl;
          throw connectionError;
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
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error('Request failed after all retry attempts. Please try again later.');
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
  role: 'owner' | 'caregiver' | 'trainer' | 'admin';
  status?: 'pending' | 'accepted' | 'rejected' | 'suspended';
  createdAt: Date;
  updatedAt: string;
}

export interface Pet {
  _id: string;
  id: string;
  userId: string;
  ownerId?: string;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed: string;
  age: number;
  description?: string;
  image: string;
  weight?: number;
  status: 'pending' | 'accepted' | 'rejected';
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
  getMe: () => api.get<User>('/auth/me'),

  register: (userData: { name: string; email: string; password: string; role?: string }) =>
    api.post<AuthResponse>('/auth/register', userData),

  login: (credentials: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', credentials),

  adminLogin: (credentials: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/admin-login', credentials, {
      retries: 1, // Reduce retries for admin login
      enableRetry: false, // Disable retries for admin login to avoid rate limit issues
    }),

  logout: () => api.post<{ success: boolean; message: string }>('/auth/logout', {}),

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

  createPet: (
    petData:
      | FormData
      | { name: string; type: string; age: number; description?: string; image: string },
  ) => api.post<Pet>('/pets', petData),

  getAllPets: () => api.get<Pet[]>('/pets'),

  getUserPets: () => api.get<Pet[]>('/pets/user'),

  getTrainerAssignedPets: () => api.get<Pet[]>('/pets/trainer/assigned'),

  updatePet: (id: string, petData: FormData | Partial<Pet>) => api.put<Pet>(`/pets/${id}`, petData),

  deletePet: (id: string) => api.delete<{ message: string }>(`/pets/${id}`),

  updatePetStatus: (id: string, status: 'accepted' | 'rejected') =>
    api.patch<Pet>(`/pets/${id}`, { status }),

  getPetById: (id: string) => api.get<Pet>(`/pets/${id}`),

  getPetStatusUpdates: (petId: string) => api.get<any>(`/pet-updates/${petId}`),

  getPetOwner: async (petId: string) => {
    const pet = await api.get<Pet>(`/pets/${petId}`);
    return (pet as any).userId as unknown as User;
  },

  createPetUpdate: (formData: FormData) => petUpdateApi.createUpdate(formData),
};

// Trainer Request API
export const trainerRequestApi = {
  createRequest: (requestData: FormData | { experience: string; message: string }) =>
    api.post<TrainerRequest>('/trainer-requests', requestData),

  getRequests: () => api.get<TrainerRequest[]>('/trainer-requests'),

  getRequestById: (id: string) => api.get<TrainerRequest>(`/trainer-requests/${id}`),

  getUserRequest: () => api.get<TrainerRequest>('/trainer-requests/my-request'),

  approveRequest: (id: string) =>
    api.put<{ message: string; request: TrainerRequest }>(`/trainer-requests/${id}/approve`, {}),

  rejectRequest: (id: string, rejectionReason?: string) =>
    api.put<{ message: string; request: TrainerRequest }>(`/trainer-requests/${id}/reject`, {
      rejectionReason,
    }),

  deleteRequest: (id: string) => api.delete<{ message: string }>(`/trainer-requests/${id}`),
};

// Pet Update API
export const petUpdateApi = {
  createUpdate: (formData: FormData) => api.post<any>('/pet-updates', formData),

  getPetUpdates: (petId: string) => api.get<any[]>(`/pet-updates/${petId}`),

  getTrainerUpdates: (trainerId: string) => api.get<any[]>(`/pet-updates/trainer/${trainerId}`),

  deleteUpdate: (id: string) => api.delete<{ message: string }>(`/pet-updates/${id}`),
};

// Admin API
export const adminApi = {
  getUsers: () => api.get<User[]>('/admin/users'),

  getPets: () => api.get<Pet[]>('/admin/pets'),

  getTrainers: () => api.get<Trainer[]>('/admin/trainers'),

  getTrainerRequests: () => api.get<TrainerRequest[]>('/admin/trainer-requests'),

  getDashboardStats: () => api.get<DashboardStats>('/admin/dashboard'),

  updateUserRole: (id: string, role: string) => api.put<User>(`/admin/users/${id}/role`, { role }),

  updateUserStatus: (id: string, status: string) =>
    api.put<User>(`/admin/users/${id}/status`, { status }),

  approvePet: (id: string) => api.patch<Pet>(`/admin/pets/${id}/approve`, {}),

  rejectPet: (id: string) => api.patch<Pet>(`/admin/pets/${id}/reject`, {}),

  acceptTrainerRequest: (id: string) =>
    api.put<{ message: string; request: TrainerRequest }>(
      `/admin/trainer-requests/${id}/accept`,
      {},
    ),

  rejectTrainerRequest: (id: string) =>
    api.put<{ message: string; request: TrainerRequest }>(
      `/admin/trainer-requests/${id}/reject`,
      {},
    ),

  deleteUser: (id: string) => api.delete<{ message: string }>(`/admin/users/${id}`),

  getPendingRequests: () => api.get<any[]>('/admin/requests'),

  acceptRequest: (type: string, id: string) => api.patch<any>(`/admin/accept/${type}/${id}`, {}),

  rejectRequest: (type: string, id: string) => api.patch<any>(`/admin/reject/${type}/${id}`, {}),
};

// Trainer API
export const trainerApi = {
  getTrainers: () => api.get<Trainer[]>('/trainers'),
  getTrainerProfile: () => api.get<Trainer>('/trainers/profile'),
  getTrainerById: (id: string) => api.get<Trainer>(`/trainers/${id}`),
  updateTrainer: (id: string, trainerData: Partial<Trainer>) =>
    api.put<Trainer>(`/trainers/${id}`, trainerData),
  getTrainerServices: (id: string) => api.get<TrainerService[]>(`/trainers/${id}/services`),
  addTrainerService: (id: string, serviceData: TrainerService) =>
    api.post<TrainerService>(`/trainers/${id}/services`, serviceData),
  updateTrainerService: (id: string, serviceId: string, serviceData: Partial<TrainerService>) =>
    api.put<TrainerService>(`/trainers/${id}/services/${serviceId}`, serviceData),
  deleteTrainerService: (id: string, serviceId: string) =>
    api.delete<{ message: string }>(`/trainers/${id}/services/${serviceId}`),
};

// Task API
export const taskApi = {
  getTasks: () => api.get<any[]>('/tasks'),

  getTaskById: (id: string) => api.get<any>(`/tasks/${id}`),

  createTask: (taskData: any) => api.post<any>('/tasks', taskData),

  updateTask: (id: string, taskData: any) => api.put<any>(`/tasks/${id}`, taskData),

  deleteTask: (id: string) => api.delete<{ message: string }>(`/tasks/${id}`),
};

// Booking API
export const bookingApi = {
  getBookings: (ownerId?: string) => {
    const query = ownerId ? `?ownerId=${ownerId}` : '';
    return api.get<any[]>(`/bookings${query}`);
  },

  getBookingById: (id: string) => api.get<any>(`/bookings/${id}`),

  createBooking: (bookingData: any) => api.post<any>('/bookings', bookingData),

  updateBooking: (id: string, bookingData: any) => api.put<any>(`/bookings/${id}`, bookingData),

  deleteBooking: (id: string) => api.delete<{ message: string }>(`/bookings/${id}`),
};

// Routine API
export const routineApi = {
  getRoutines: () => api.get<any[]>('/routine/my-routines'),

  getRoutineLogs: (petId: string) => api.get<any[]>(`/routine/pet/${petId}/logs`),

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
  submitApplication: (applicationData: FormData | Partial<CaregiverApplication>) =>
    api.post<CaregiverApplication>('/caregiver/apply', applicationData),

  getApplications: (status?: string) =>
    api.get<CaregiverApplication[]>(`/caregiver/pending${status ? `?status=${status}` : ''}`),

  approveApplication: (id: string) =>
    api.put<{ message: string; application: CaregiverApplication }>(`/caregiver/approve/${id}`, {}),

  rejectApplication: (id: string, rejectionReason?: string) =>
    api.put<{ message: string; application: CaregiverApplication }>(`/caregiver/reject/${id}`, {
      rejectionReason,
    }),

  deleteApplication: (id: string) => api.delete<{ message: string }>(`/caregiver/delete/${id}`),

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
  initiateConversation: (userId: string, trainerId: string) =>
    api.post<any>('/chat/conversation', { userId, trainerId }),
};

// Notification API
export const notificationApi = {
  getNotifications: () => api.get<Notification[]>('/notifications'),
  markAsRead: (id: string) => api.patch<Notification>(`/notifications/${id}/read`, {}),
};
