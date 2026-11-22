import { ApiError, type ErrorCampo } from "./api-error";

const BASE_URL: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000";

interface CuerpoError {
  mensaje?: string;
  message?: string | string[];
  errores?: ErrorCampo[];
}

/**
 * Único punto que usa fetch. Convierte cualquier fallo (red caída o status != 2xx)
 * en un ApiError, para que la UI nunca tenga que leer la consola.
 */
export async function http<T>(
  ruta: string,
  opciones: RequestInit = {},
): Promise<T> {
  let respuesta: Response;
  try {
    respuesta = await fetch(`${BASE_URL}${ruta}`, {
      ...opciones,
      headers: { "Content-Type": "application/json", ...opciones.headers },
    });
  } catch {
    throw new ApiError(
      0,
      `No se pudo conectar con la API (${BASE_URL}). ¿Está corriendo?`,
    );
  }

  if (respuesta.status === 204) return undefined as T;

  const cuerpo: unknown = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const c = (cuerpo ?? {}) as CuerpoError;
    const mensaje =
      c.mensaje ??
      (Array.isArray(c.message) ? c.message.join(", ") : c.message) ??
      `Error HTTP ${respuesta.status}`;
    throw new ApiError(
      respuesta.status,
      mensaje,
      Array.isArray(c.errores) ? c.errores : [],
    );
  }

  return cuerpo as T;
}
