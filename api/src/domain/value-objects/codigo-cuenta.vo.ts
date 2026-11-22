import { CodigoInvalidoError } from '../errors/domain.errors.js';
import {
  LONGITUDES_VALIDAS,
  Nivel,
  esLongitudValida,
  longitudPadre,
  nivelPorLongitud,
} from './nivel.vo.js';

/**
 * Value object: si existe una instancia, el código ya es válido (reglas 1 y 2).
 * Solo se construye con CodigoCuenta.crear().
 */
export class CodigoCuenta {
  readonly valor: string;

  private constructor(valor: string) {
    this.valor = valor;
  }

  static crear(valor: string): CodigoCuenta {
    const limpio = (valor ?? '').trim();

    if (!/^\d+$/.test(limpio)) {
      throw new CodigoInvalidoError('El código debe contener solo dígitos');
    }
    if (!esLongitudValida(limpio.length)) {
      throw new CodigoInvalidoError(
        `El código debe tener ${LONGITUDES_VALIDAS.join(', ')} dígitos`,
      );
    }
    return new CodigoCuenta(limpio);
  }

  get nivel(): Nivel {
    return nivelPorLongitud(this.valor.length);
  }

  get esClase(): boolean {
    return this.nivel === Nivel.CLASE;
  }

  /** Regla 3: el padre es el prefijo del nivel anterior. Las clases no tienen padre. */
  codigoPadre(): string | null {
    const largo = longitudPadre(this.valor.length);
    return largo === null ? null : this.valor.slice(0, largo);
  }

  /** Regla 8: la clase raíz es el primer dígito. */
  codigoClase(): string {
    return this.valor[0];
  }

  equals(otro: CodigoCuenta): boolean {
    return this.valor === otro.valor;
  }

  toString(): string {
    return this.valor;
  }
}
