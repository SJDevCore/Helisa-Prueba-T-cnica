import { Nivel } from "./cuenta.types";

/**
 * Mismas reglas que el dominio del backend (reglas 1, 2 y 3).
 * Se duplican a propósito: el front valida antes de enviar para dar feedback
 * inmediato, pero la API sigue siendo la fuente de verdad.
 */
export const LONGITUDES_VALIDAS = [1, 2, 4, 6] as const;

const NIVEL_POR_LONGITUD: Record<number, Nivel> = {
  1: Nivel.CLASE,
  2: Nivel.GRUPO,
  4: Nivel.CUENTA,
  6: Nivel.SUBCUENTA,
};

export const ETIQUETA_NIVEL: Record<Nivel, string> = {
  CLASE: "Clase",
  GRUPO: "Grupo",
  CUENTA: "Cuenta",
  SUBCUENTA: "Subcuenta",
};

export function esNumerico(codigo: string): boolean {
  return /^\d+$/.test(codigo);
}

export function esLongitudValida(codigo: string): boolean {
  return codigo.length in NIVEL_POR_LONGITUD;
}

export function nivelDe(codigo: string): Nivel | null {
  return NIVEL_POR_LONGITUD[codigo.length] ?? null;
}

export function esClase(codigo: string): boolean {
  return nivelDe(codigo) === Nivel.CLASE;
}

/** Código del padre, o null si es clase o la longitud no es válida. */
export function codigoPadre(codigo: string): string | null {
  const i = LONGITUDES_VALIDAS.indexOf(
    codigo.length as (typeof LONGITUDES_VALIDAS)[number],
  );
  return i > 0 ? codigo.slice(0, LONGITUDES_VALIDAS[i - 1]) : null;
}

/** Longitud que debe tener una hija de este código, o null si es subcuenta. */
export function longitudHija(codigo: string): number | null {
  const i = LONGITUDES_VALIDAS.indexOf(
    codigo.length as (typeof LONGITUDES_VALIDAS)[number],
  );
  return i >= 0 && i < LONGITUDES_VALIDAS.length - 1
    ? LONGITUDES_VALIDAS[i + 1]
    : null;
}

export function textoLongitudes(): string {
  return `${LONGITUDES_VALIDAS.slice(0, -1).join(", ")} o ${LONGITUDES_VALIDAS.at(-1)}`;
}
