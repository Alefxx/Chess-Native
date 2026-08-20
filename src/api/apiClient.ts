// src/api/apiClient.ts
import axios from 'axios';

// instância configurada do Axios
export const apiClient = axios.create({
  // No Expo/React Native, usamos process.env e o prefixo EXPO_PUBLIC_
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Aborta se o backend demorar mais de 10 segundos
});
