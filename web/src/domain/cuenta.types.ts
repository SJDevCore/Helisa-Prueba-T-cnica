export const Nivel = {
  CLASE: "CLASE",
  GRUPO: "GRUPO",
  CUENTA: "CUENTA",
  SUBCUENTA: "SUBCUENTA",
} as const;

export type Nivel = (typeof Nivel)[keyof typeof Nivel];

export const Naturaleza = {
  DEBITO: "DEBITO",
  CREDITO: "CREDITO",
} as const;

export type Naturaleza = (typeof Naturaleza)[keyof typeof Naturaleza];

/** Lo que devuelve la API por cada cuenta (POST /cuentas). */
export interface Cuenta {
  codigo: string;
  nombre: string;
  nivel: Nivel;
  naturaleza: Naturaleza;
  admiteMovimientos: boolean;
}

/** Nodo del árbol (GET /cuentas/arbol). */
export interface NodoCuenta extends Cuenta {
  hijos: NodoCuenta[];
}

/** Body de POST /cuentas. La naturaleza solo aplica a clases. */
export interface CrearCuentaDto {
  codigo: string;
  nombre: string;
  naturaleza?: Naturaleza;
}

export type CampoCuenta = keyof CrearCuentaDto;
