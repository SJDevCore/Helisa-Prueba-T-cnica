import {
  CodigoInvalidoError,
  NaturalezaRequeridaError,
  NombreInvalidoError,
} from '../errors/domain.errors.js';
import { CodigoCuenta } from '../value-objects/codigo-cuenta.vo.js';
import { Naturaleza, esNaturaleza } from '../value-objects/naturaleza.vo.js';
import { Nivel } from '../value-objects/nivel.vo.js';

const NOMBRE_MAX = 100;

export class Cuenta {
  readonly codigo: CodigoCuenta;
  readonly naturaleza: Naturaleza;
  private _nombre: string;

  private constructor(
    codigo: CodigoCuenta,
    nombre: string,
    naturaleza: Naturaleza,
  ) {
    this.codigo = codigo;
    this._nombre = nombre;
    this.naturaleza = naturaleza;
  }

  /** Crea una clase (nivel 1). Es la única que recibe naturaleza. */
  static crearClase(
    codigo: CodigoCuenta,
    nombre: string,
    naturaleza: unknown,
  ): Cuenta {
    if (!codigo.esClase) {
      throw new CodigoInvalidoError(
        'Solo un código de 1 dígito puede ser una clase',
      );
    }
    if (!esNaturaleza(naturaleza)) {
      throw new NaturalezaRequeridaError();
    }
    return new Cuenta(codigo, Cuenta.validarNombre(nombre), naturaleza);
  }

  /**
   * Crea una cuenta bajo su padre directo.
   * Regla 3: el padre debe ser el prefijo del nivel anterior.
   * Regla 8: hereda la naturaleza del padre (y por transitividad, de la clase).
   */
  static crearHija(
    codigo: CodigoCuenta,
    nombre: string,
    padre: Cuenta,
  ): Cuenta {
    if (codigo.codigoPadre() !== padre.codigo.valor) {
      throw new CodigoInvalidoError(
        `${padre.codigo.valor} no es el padre directo de ${codigo.valor}`,
      );
    }
    return new Cuenta(codigo, Cuenta.validarNombre(nombre), padre.naturaleza);
  }

  /** Para reconstruir desde persistencia sin repetir reglas de creación. */
  static reconstruir(
    codigo: string,
    nombre: string,
    naturaleza: Naturaleza,
  ): Cuenta {
    return new Cuenta(CodigoCuenta.crear(codigo), nombre, naturaleza);
  }

  get nombre(): string {
    return this._nombre;
  }

  get nivel(): Nivel {
    return this.codigo.nivel;
  }

  renombrar(nombre: string): void {
    this._nombre = Cuenta.validarNombre(nombre);
  }

  private static validarNombre(nombre: string): string {
    const limpio = (nombre ?? '').trim();
    if (!limpio) throw new NombreInvalidoError('El nombre es obligatorio');
    if (limpio.length > NOMBRE_MAX) {
      throw new NombreInvalidoError(
        `El nombre no puede superar ${NOMBRE_MAX} caracteres`,
      );
    }
    return limpio;
  }
}
