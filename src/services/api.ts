import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@AutoEscola:token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { detail?: string; title?: string; message?: string } | undefined;
    if (data?.detail) return data.detail;
    if (data?.message) return data.message;
    if (data?.title) return data.title;
    if (error.code === 'ERR_NETWORK') {
      return `Não foi possível conectar à API em ${API_BASE_URL}. Verifique se o Back-End (.NET) está rodando ou ative o Modo Simulação.`;
    }
  }
  return 'Ocorreu um erro inesperado. Tente novamente.';
}
