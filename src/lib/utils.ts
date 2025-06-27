import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function authRequest<T = any>(
  config: AxiosRequestConfig,
  logoutCallback?: () => void
): Promise<AxiosResponse<T>> {
  let accessToken = localStorage.getItem("access_token");
  let refreshToken = localStorage.getItem("refresh_token");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Attach access token if available
  if (!config.headers) config.headers = {};
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  try {
    return await axios(config);
  } catch (error: any) {
    // If 401, try to refresh
    if (error.response && error.response.status === 401 && refreshToken) {
      try {
        const refreshRes = await axios.post(
          `${backendUrl}/api/auth/refresh_token/`,
          { refresh: refreshToken }
        );
        if (refreshRes.status === 200 && refreshRes.data.access) {
          // Save new access token
          localStorage.setItem("access_token", refreshRes.data.access);
          // Retry original request with new token
          config.headers["Authorization"] = `Bearer ${refreshRes.data.access}`;
          return await axios(config);
        }
      } catch (refreshError: any) {
        // If refresh also fails with 401, logout
        if (
          refreshError.response &&
          refreshError.response.status === 401 &&
          refreshError.response.data?.detail === "Token is invalid"
        ) {
          localStorage.clear();
          if (logoutCallback) {
            logoutCallback();
          } else {
            window.location.href = "/login";
          }
        }
        throw refreshError;
      }
    }
    throw error;
  }
}
