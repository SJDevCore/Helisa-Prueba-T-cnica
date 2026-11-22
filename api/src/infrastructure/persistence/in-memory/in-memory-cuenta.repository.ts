import { Cuenta } from '../../../domain/entities/cuenta.entity.js';
import { CuentaRepository } from '../../../domain/repositories/cuenta.repository.interface.js';

/**
 * Adaptador en memoria del puerto CuentaRepository.
 * Map indexado por código: búsqueda O(1) y unicidad (regla 7) natural.
 * Los datos se pierden al reiniciar: decisión consciente para la prueba.
 */
export class InMemoryCuentaRepository implements CuentaRepository {
  private readonly cuentas = new Map<string, Cuenta>();

  constructor(iniciales: Cuenta[] = []) {
    for (const cuenta of iniciales)
      this.cuentas.set(cuenta.codigo.valor, cuenta);
  }

  async buscarPorCodigo(codigo: string): Promise<Cuenta | null> {
    return this.cuentas.get(codigo) ?? null;
  }

  async listar(): Promise<Cuenta[]> {
    return [...this.cuentas.values()];
  }

  async tieneHijas(codigo: string): Promise<boolean> {
    for (const cuenta of this.cuentas.values()) {
      if (cuenta.codigo.codigoPadre() === codigo) return true;
    }
    return false;
  }

  async guardar(cuenta: Cuenta): Promise<void> {
    this.cuentas.set(cuenta.codigo.valor, cuenta);
  }

  async eliminar(codigo: string): Promise<void> {
    this.cuentas.delete(codigo);
  }
}
