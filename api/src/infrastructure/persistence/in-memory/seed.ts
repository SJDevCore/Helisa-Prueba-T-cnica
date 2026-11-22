import { Cuenta } from '../../../domain/entities/cuenta.entity.js';
import { Naturaleza } from '../../../domain/value-objects/naturaleza.vo.js';

// Catálogo de ejemplo del enunciado. Ordenado de padre a hija.
const CATALOGO_INICIAL: Array<
  [codigo: string, nombre: string, naturaleza: Naturaleza]
> = [
  ['1', 'Activo', 'DEBITO'],
  ['11', 'Disponible', 'DEBITO'],
  ['1105', 'Caja', 'DEBITO'],
  ['110505', 'Caja general', 'DEBITO'],
  ['110510', 'Caja menor', 'DEBITO'],
  ['2', 'Pasivo', 'CREDITO'],
  ['21', 'Obligaciones financieras', 'CREDITO'],
  ['2105', 'Bancos nacionales', 'CREDITO'],
];

export function crearSeed(): Cuenta[] {
  return CATALOGO_INICIAL.map(([codigo, nombre, naturaleza]) =>
    Cuenta.reconstruir(codigo, nombre, naturaleza),
  );
}
