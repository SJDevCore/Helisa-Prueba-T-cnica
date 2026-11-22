export const Naturaleza = {
  DEBITO: 'DEBITO',
  CREDITO: 'CREDITO',
} as const;

export type Naturaleza = (typeof Naturaleza)[keyof typeof Naturaleza];

export function esNaturaleza(valor: unknown): valor is Naturaleza {
  return valor === Naturaleza.DEBITO || valor === Naturaleza.CREDITO;
}
