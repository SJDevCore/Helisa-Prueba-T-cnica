import {
  CuentaConHijasError,
  CuentaNoEncontradaError,
} from '../../domain/errors/domain.errors.js';
import { CuentaRepository } from '../../domain/repositories/cuenta.repository.interface.js';
import { CodigoCuenta } from '../../domain/value-objects/codigo-cuenta.vo.js';

export class EliminarCuentaUseCase {
  private readonly repo: CuentaRepository;

  constructor(repo: CuentaRepository) {
    this.repo = repo;
  }

  async ejecutar(codigoRaw: string): Promise<void> {
    const codigo = CodigoCuenta.crear(codigoRaw);

    if (!(await this.repo.buscarPorCodigo(codigo.valor))) {
      throw new CuentaNoEncontradaError(codigo.valor);
    }
    // Regla 5: no se elimina una cuenta con hijas
    if (await this.repo.tieneHijas(codigo.valor)) {
      throw new CuentaConHijasError(codigo.valor);
    }
    await this.repo.eliminar(codigo.valor);
  }
}
