import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DomainErrorFilter } from './presentation/http/filters/domain-error.filter.js';
import { crearValidationPipe } from './presentation/http/validation.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:5173' });
  app.useGlobalPipes(crearValidationPipe());
  app.useGlobalFilters(new DomainErrorFilter());
  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
