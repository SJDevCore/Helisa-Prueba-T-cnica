/** Entrada del caso de uso. Tipos planos: no conoce HTTP ni class-validator. */
export interface CrearCuentaInput {
  codigo: string;
  nombre: string;
  /** Solo se usa para clases (1 dígito). Las demás la heredan. */
  naturaleza?: string;
}
