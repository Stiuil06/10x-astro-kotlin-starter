import { apiClient, type ApiResponse } from '../api-client';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface CreateUserData {
  email: string;
  name: string;
}

export class ApiService {
  // User endpoints
  async getUsers(): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>('/users');
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`/users/${id}`);
  }

  async createUser(userData: CreateUserData): Promise<ApiResponse<User>> {
    return apiClient.post<User>('/users', userData);
  }

  async updateUser(id: string, userData: Partial<CreateUserData>): Promise<ApiResponse<User>> {
    return apiClient.put<User>(`/users/${id}`, userData);
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/users/${id}`);
  }

  // Add more service methods as needed for your specific backend
}

export const apiService = new ApiService();

