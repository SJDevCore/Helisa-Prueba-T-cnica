import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "../infrastructure/http/api-error";

/**
 * Todos los errores que llegan a TanStack Query son ApiError (http-client.ts
 * los normaliza), así que se registra como tipo de error por defecto.
 */
declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError;
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // No reintentar errores del cliente (4xx): repetir no los arregla.
      retry: (intentos, error) =>
        error.status >= 400 && error.status < 500 ? false : intentos < 2,
    },
    mutations: {
      retry: false,
    },
  },
});
