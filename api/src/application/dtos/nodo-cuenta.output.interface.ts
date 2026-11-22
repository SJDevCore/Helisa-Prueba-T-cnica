import { Naturaleza } from '../../domain/value-objects/naturaleza.vo.js';
import { Nivel } from '../../domain/value-objects/nivel.vo.js';

/** Lo que sale de los casos de uso: datos planos, nunca la entidad. */
export interface CuentaOutput {
  codigo: string;
  nombre: string;
  nivel: Nivel;
  naturaleza: Naturaleza;
  /** Regla 6: solo las cuentas sin hijas admiten movimientos. */
  admiteMovimientos: boolean;
}

export interface NodoCuentaOutput extends CuentaOutput {
  hijos: NodoCuentaOutput[];
}
