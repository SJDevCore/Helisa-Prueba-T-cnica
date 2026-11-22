import { Cuenta } from '../../domain/entities/cuenta.entity.js';
import {
  CodigoDuplicadoError,
  PadreNoExisteError,
} from '../../domain/errors/domain.errors.js';
import { CuentaRepository } from '../../domain/repositories/cuenta.repository.interface.js';
import { CodigoCuenta } from '../../domain/value-objects/codigo-cuenta.vo.js';
import { CrearCuentaInput } from '../dtos/crear-cuenta.input.interface.js';
import { CuentaOutput } from '../dtos/nodo-cuenta.output.interface.js';
import { ArbolMapper } from '../mappers/arbol.mapper.js';

export class CrearCuentaUseCase {
  private readonly repo: CuentaRepository;

  constructor(repo: CuentaRepository) {
    this.repo = repo;
  }

  async ejecutar(input: CrearCuentaInput): Promise<CuentaOutput> {
    // Reglas 1 y 2: numérico y longitud válida (las valida el value object)
    const codigo = CodigoCuenta.crear(input.codigo);

    // Regla 7: código único
    if (await this.repo.buscarPorCodigo(codigo.valor)) {
      throw new CodigoDuplicadoError(codigo.valor);
    }

    const codigoPadre = codigo.codigoPadre();
    let cuenta: Cuenta;

    if (codigoPadre === null) {
      cuenta = Cuenta.crearClase(codigo, input.nombre, input.naturaleza);
    } else {
      // Regla 4: el padre debe existir
      const padre = await this.repo.buscarPorCodigo(codigoPadre);
      if (!padre) throw new PadreNoExisteError(codigoPadre);
      // Regla 8: hereda la naturaleza (la aplica la entidad)
      cuenta = Cuenta.crearHija(codigo, input.nombre, padre);
    }

    await this.repo.guardar(cuenta);
    return ArbolMapper.aOutput(cuenta); // recién creada: sin hijas
  }
}
