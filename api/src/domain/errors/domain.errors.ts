export type CampoCuenta = 'codigo' | 'nombre' | 'naturaleza';

export type TipoErrorDominio = 'VALIDACION' | 'NO_ENCONTRADO' | 'CONFLICTO';

export abstract class DomainError extends Error {
  abstract readonly tipo: TipoErrorDominio;
  readonly campo?: CampoCuenta;

  constructor(mensaje: string, campo?: CampoCuenta) {
    super(mensaje);
    this.name = new.target.name;
    this.campo = campo;
  }
}

export class CodigoInvalidoError extends DomainError {
  readonly tipo = 'VALIDACION';
  constructor(mensaje: string) {
    super(mensaje, 'codigo');
  }
}

export class NombreInvalidoError extends DomainError {
  readonly tipo = 'VALIDACION';
  constructor(mensaje: string) {
    super(mensaje, 'nombre');
  }
}

export class NaturalezaRequeridaError extends DomainError {
  readonly tipo = 'VALIDACION';
  constructor() {
    super('Una clase debe tener naturaleza (DEBITO o CREDITO)', 'naturaleza');
  }
}

export class PadreNoExisteError extends DomainError {
  readonly tipo = 'VALIDACION';
  constructor(codigoPadre: string) {
    super(`La cuenta padre ${codigoPadre} no existe`, 'codigo');
  }
}

export class CodigoDuplicadoError extends DomainError {
  readonly tipo = 'CONFLICTO';
  constructor(codigo: string) {
    super(`Ya existe una cuenta con el código ${codigo}`, 'codigo');
  }
}

export class CuentaConHijasError extends DomainError {
  readonly tipo = 'CONFLICTO';
  constructor(codigo: string) {
    super(`La cuenta ${codigo} tiene cuentas hijas y no se puede eliminar`);
  }
}

export class CuentaNoEncontradaError extends DomainError {
  readonly tipo = 'NO_ENCONTRADO';
  constructor(codigo: string) {
    super(`La cuenta ${codigo} no existe`);
  }
}
