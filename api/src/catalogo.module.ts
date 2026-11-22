import { Module } from '@nestjs/common';
import { CrearCuentaUseCase } from './application/use-cases/crear-cuenta.use-case.js';
import { EliminarCuentaUseCase } from './application/use-cases/eliminar-cuenta.use-case.js';
import { ObtenerArbolUseCase } from './application/use-cases/obtener-arbol.use-case.js';
import {
  CUENTA_REPOSITORY,
  CuentaRepository,
} from './domain/repositories/cuenta.repository.interface.js';
import { InMemoryCuentaRepository } from './infrastructure/persistence/in-memory/in-memory-cuenta.repository.js';
import { crearSeed } from './infrastructure/persistence/in-memory/seed.js';
import { CuentasController } from './presentation/http/controllers/cuentas.controller.js';

/**
 * Composition root: el ÚNICO lugar que sabe qué implementación del repositorio se usa.
 * Cambiar a Postgres = cambiar este useFactory. Dominio y casos de uso no se tocan.
 */
@Module({
  controllers: [CuentasController],
  providers: [
    {
      provide: CUENTA_REPOSITORY,
      useFactory: (): CuentaRepository =>
        new InMemoryCuentaRepository(crearSeed()),
    },
    {
      provide: CrearCuentaUseCase,
      useFactory: (repo: CuentaRepository) => new CrearCuentaUseCase(repo),
      inject: [CUENTA_REPOSITORY],
    },
    {
      provide: ObtenerArbolUseCase,
      useFactory: (repo: CuentaRepository) => new ObtenerArbolUseCase(repo),
      inject: [CUENTA_REPOSITORY],
    },
    {
      provide: EliminarCuentaUseCase,
      useFactory: (repo: CuentaRepository) => new EliminarCuentaUseCase(repo),
      inject: [CUENTA_REPOSITORY],
    },
  ],
})
export class CatalogoModule {}
