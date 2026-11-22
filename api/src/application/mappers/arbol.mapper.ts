import { Cuenta } from '../../domain/entities/cuenta.entity.js';
import {
  CuentaOutput,
  NodoCuentaOutput,
} from '../dtos/nodo-cuenta.output.interface.js';

export class ArbolMapper {
  static aOutput(cuenta: Cuenta, admiteMovimientos = true): CuentaOutput {
    return {
      codigo: cuenta.codigo.valor,
      nombre: cuenta.nombre,
      nivel: cuenta.nivel,
      naturaleza: cuenta.naturaleza,
      admiteMovimientos,
    };
  }

  /**
   * Lista plana → árbol anidado en O(n log n).
   * Al ordenar los códigos como texto, todo padre queda antes que sus hijos
   * ('1' < '11' < '1105' < '110505' < '110510' < '12'), así que en una sola
   * pasada el padre ya está en el mapa cuando llega cada hija.
   */
  static aArbol(cuentas: Cuenta[]): NodoCuentaOutput[] {
    const ordenadas = [...cuentas].sort((a, b) =>
      a.codigo.valor.localeCompare(b.codigo.valor),
    );
    const nodos = new Map<string, NodoCuentaOutput>();
    const raices: NodoCuentaOutput[] = [];

    for (const cuenta of ordenadas) {
      const nodo: NodoCuentaOutput = {
        ...ArbolMapper.aOutput(cuenta),
        hijos: [],
      };
      nodos.set(nodo.codigo, nodo);

      const codigoPadre = cuenta.codigo.codigoPadre();
      const padre = codigoPadre ? nodos.get(codigoPadre) : undefined;

      if (padre) {
        padre.hijos.push(nodo);
        padre.admiteMovimientos = false;
      } else {
        raices.push(nodo);
      }
    }
    return raices;
  }
}
