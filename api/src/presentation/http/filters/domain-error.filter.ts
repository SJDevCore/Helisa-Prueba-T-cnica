import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  DomainError,
  TipoErrorDominio,
} from '../../../domain/errors/domain.errors.js';
import { ErrorRespuesta } from '../validation.js';

const STATUS_POR_TIPO: Record<TipoErrorDominio, HttpStatus> = {
  VALIDACION: HttpStatus.BAD_REQUEST, // 400
  NO_ENCONTRADO: HttpStatus.NOT_FOUND, // 404
  CONFLICTO: HttpStatus.CONFLICT, // 409
};

/** Traduce errores de dominio a HTTP. El dominio nunca sabe de status codes. */
@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();
    const statusCode = STATUS_POR_TIPO[error.tipo];

    const body: ErrorRespuesta = {
      statusCode,
      mensaje: error.message,
      errores: [{ campo: error.campo, mensaje: error.message }],
    };
    res.status(statusCode).json(body);
  }
}
