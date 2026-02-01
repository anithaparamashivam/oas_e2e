//import axios from 'axios';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

export type { AxiosRequestConfig }; // <-- Export AxiosRequestConfig

export interface ApiResponse<T> {
  status: number;
  data: T;
  headers: Record<string, string>;
}

export class ApiClient {
  private client: ReturnType<typeof axios.create>;

  constructor(baseURL: string = process.env.API_BASE_URL || 'http://localhost:3000') {
    this.client = axios.create({
      baseURL,
      timeout: parseInt(process.env.API_TIMEOUT || '10000'),
      validateStatus: () => true,
    });
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<T>(url, config);
    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>,
    };
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<T>(url, data, config);
    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>,
    };
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<T>(url, data, config);
    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>,
    };
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<T>(url, data, config);
    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>,
    };
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<T>(url, config);
    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>,
    };
  }
}

export default new ApiClient();
