import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { RefreshTokenResponse } from "./pages/api/refresh-token";

export interface User {
  email: string;
}

const client = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

class Api {
  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return await this.request<T>({ ...config, method: "GET", url });
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return await this.request<T>({ ...config, method: "POST", url, data });
  }

  private async request<T = any>(
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }

    try {
      return await client.request<T>(config);
    } catch (requestError) {
      if (
        axios.isAxiosError(requestError) &&
        requestError.response?.status === 401
      ) {
        try {
          const refreshResponse = await client.post<RefreshTokenResponse>(
            "/refresh-token"
          );

          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${refreshResponse.data.accessToken}`,
          };

          localStorage.setItem("accessToken", refreshResponse.data.accessToken);
        } catch (refreshError) {
          throw requestError;
        }
      }

      return await client.request<T>(config);
    }
  }
}

export default new Api();
