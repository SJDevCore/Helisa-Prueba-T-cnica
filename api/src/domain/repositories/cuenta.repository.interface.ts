import { Cuenta } from '../entities/cuenta.entity.js';

/**
 * Puerto definido por el dominio. La infraestructura lo implementa
 * (en memoria hoy, una BD mañana) sin que dominio ni casos de uso cambien.
 * Es async para que cambiar a una BD real no rompa la firma.
 */
export interface CuentaRepository {
  buscarPorCodigo(codigo: string): Promise<Cuenta | null>;
  listar(): Promise<Cuenta[]>;
  tieneHijas(codigo: string): Promise<boolean>;
  guardar(cuenta: Cuenta): Promise<void>;
  eliminar(codigo: string): Promise<void>;
}

/** Token de inyección. Es un Symbol de JS puro, no depende de NestJS. */
export const CUENTA_REPOSITORY = Symbol('CuentaRepository');
