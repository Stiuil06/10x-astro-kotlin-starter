// Shared types for backend and frontend (Entities, DTOs)

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserData {
  email: string;
  name: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

// Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Add more shared types as needed for your specific backend

