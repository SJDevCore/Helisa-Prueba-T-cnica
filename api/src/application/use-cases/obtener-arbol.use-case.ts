import { CuentaRepository } from '../../domain/repositories/cuenta.repository.interface.js';
import { NodoCuentaOutput } from '../dtos/nodo-cuenta.output.interface.js';
import { ArbolMapper } from '../mappers/arbol.mapper.js';

export class ObtenerArbolUseCase {
  private readonly repo: CuentaRepository;

  constructor(repo: CuentaRepository) {
    this.repo = repo;
  }

  async ejecutar(): Promise<NodoCuentaOutput[]> {
    const cuentas = await this.repo.listar();
    return ArbolMapper.aArbol(cuentas);
  }
}
