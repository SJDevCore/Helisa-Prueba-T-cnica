import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

/**
 * Contrato único de error para el front, venga del ValidationPipe o del dominio:
 * { statusCode, mensaje, errores: [{ campo?, mensaje }] }
 */
export interface ErrorRespuesta {
  statusCode: number;
  mensaje: string;
  errores: Array<{ campo?: string; mensaje: string }>;
}

export function crearValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true, // quita propiedades no declaradas en el schema
    forbidNonWhitelisted: true, // ...y si llegan, es error
    transform: true,
    exceptionFactory: (errors: ValidationError[]) => {
      const errores = errors.flatMap((e) =>
        Object.values(e.constraints ?? {}).map((mensaje) => ({
          campo: e.property,
          mensaje,
        })),
      );
      const body: ErrorRespuesta = {
        statusCode: 400,
        mensaje: 'Datos inválidos',
        errores,
      };
      return new BadRequestException(body);
    },
  });
}
