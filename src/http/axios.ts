import axios from 'axios';
import { TokenHelper } from '../helpers/token.helper';
import { API } from '../constants/back-end';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const defaultOptions = {
  baseURL,
  paramsSerializer: {
    serialize: (params: Record<string, unknown>) => {
      const searchParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;

        if (Array.isArray(value)) {
          // Para arrays, adiciona múltiplos parâmetros com o mesmo nome
          value.forEach((item) => {
            if (item !== undefined && item !== null && item !== '') {
              searchParams.append(key, String(item));
            }
          });
        } else {
          searchParams.append(key, String(value));
        }
      });

      return searchParams.toString();
    },
  },
};

const axiosIns = axios.create(defaultOptions);

axiosIns.interceptors.request.use(
  (config) => {
    const { accessToken } = TokenHelper.get();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Mutex para evitar múltiplos refreshes simultâneos (race condition)
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error || !token) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosIns.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Se já está refreshing, enfileira este request para retry após o refresh
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosIns(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { refreshToken } = TokenHelper.get();

        if (!refreshToken) throw new Error('Refresh token not found');

        const response = await axios.post(`${baseURL}${API.AUTH.REFRESH}`, {
          refreshToken,
        });

        const newAccessToken = response.data.accessToken;
        TokenHelper.set({
          accessToken: newAccessToken,
          refreshToken: response.data.refreshToken,
        });

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Resolve todos os requests enfileirados com o novo token
        processQueue(null, newAccessToken);

        return axiosIns(originalRequest); // Refaz a requisição original
      } catch (refreshError) {
        // Rejeita todos os requests enfileirados
        processQueue(refreshError, null);

        TokenHelper.delete();

        if (typeof window !== 'undefined' && window.location.pathname !== '/' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosIns;
