import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CrearCuentaInput } from '../../../application/dtos/crear-cuenta.input.interface.js';

/**
 * Valida la FORMA del body (tipos y requeridos).
 * Las reglas de negocio (dígitos, longitud, padre, unicidad) viven en el dominio,
 * así se cumplen aunque el caso de uso se llame sin pasar por HTTP.
 */
export class CrearCuentaSchema implements CrearCuentaInput {
  @IsString({ message: 'El código debe ser texto' })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  codigo: string;

  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsOptional()
  @IsIn(['DEBITO', 'CREDITO'], {
    message: 'La naturaleza debe ser DEBITO o CREDITO',
  })
  naturaleza?: string;
}
