/** Contrato de error del backend: { statusCode, mensaje, errores: [{ campo?, mensaje }] } */
export interface ErrorCampo {
  campo?: string;
  mensaje: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly errores: ErrorCampo[];

  constructor(status: number, mensaje: string, errores: ErrorCampo[] = []) {
    super(mensaje);
    this.name = "ApiError";
    this.status = status;
    this.errores = errores;
  }

  /** Errores agrupados por campo (el primero de cada uno). */
  porCampo(): Record<string, string> {
    const mapa: Record<string, string> = {};
    for (const e of this.errores) {
      if (e.campo && !mapa[e.campo]) mapa[e.campo] = e.mensaje;
    }
    return mapa;
  }

  /** Errores que no pertenecen a ninguno de los campos indicados (se muestran arriba). */
  generales(camposDelFormulario: readonly string[]): string[] {
    const sinCampo = this.errores
      .filter((e) => !e.campo || !camposDelFormulario.includes(e.campo))
      .map((e) => e.mensaje);
    return sinCampo.length > 0
      ? sinCampo
      : this.errores.length === 0
        ? [this.message]
        : [];
  }
}

export function esApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/** Mensaje legible para cualquier error, sea de la API o inesperado. */
export function mensajeDeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Ocurrió un error inesperado";
}
