export const Nivel = {
  CLASE: 'CLASE',
  GRUPO: 'GRUPO',
  CUENTA: 'CUENTA',
  SUBCUENTA: 'SUBCUENTA',
} as const;

export type Nivel = (typeof Nivel)[keyof typeof Nivel];

// Regla 2: la longitud del código define el nivel. El orden importa: es la jerarquía.
export const LONGITUDES_VALIDAS = [1, 2, 4, 6] as const;

export const NIVEL_POR_LONGITUD: Record<number, Nivel> = {
  1: Nivel.CLASE,
  2: Nivel.GRUPO,
  4: Nivel.CUENTA,
  6: Nivel.SUBCUENTA,
};

export function esLongitudValida(longitud: number): boolean {
  return longitud in NIVEL_POR_LONGITUD;
}

export function nivelPorLongitud(longitud: number): Nivel {
  return NIVEL_POR_LONGITUD[longitud];
}

/** Longitud del nivel anterior, o null si es una clase. */
export function longitudPadre(longitud: number): number | null {
  const i = LONGITUDES_VALIDAS.indexOf(
    longitud as (typeof LONGITUDES_VALIDAS)[number],
  );
  return i > 0 ? LONGITUDES_VALIDAS[i - 1] : null;
}
