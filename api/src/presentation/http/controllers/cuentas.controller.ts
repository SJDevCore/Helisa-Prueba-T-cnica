import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CrearCuentaUseCase } from '../../../application/use-cases/crear-cuenta.use-case.js';
import { EliminarCuentaUseCase } from '../../../application/use-cases/eliminar-cuenta.use-case.js';
import { ObtenerArbolUseCase } from '../../../application/use-cases/obtener-arbol.use-case.js';
import {
  CuentaOutput,
  NodoCuentaOutput,
} from '../../../application/dtos/nodo-cuenta.output.interface.js';
import { CrearCuentaSchema } from '../schemas/crear-cuenta.schema.js';

/** Controller delgado: recibe HTTP, delega al caso de uso, devuelve el resultado. */
@Controller('cuentas')
export class CuentasController {
  constructor(
    private readonly crearCuenta: CrearCuentaUseCase,
    private readonly obtenerArbol: ObtenerArbolUseCase,
    private readonly eliminarCuenta: EliminarCuentaUseCase,
  ) {}

  @Get('arbol')
  arbol(): Promise<NodoCuentaOutput[]> {
    return this.obtenerArbol.ejecutar();
  }

  @Post()
  crear(@Body() body: CrearCuentaSchema): Promise<CuentaOutput> {
    return this.crearCuenta.ejecutar(body);
  }

  @Delete(':codigo')
  @HttpCode(HttpStatus.NO_CONTENT)
  eliminar(@Param('codigo') codigo: string): Promise<void> {
    return this.eliminarCuenta.ejecutar(codigo);
  }
}
