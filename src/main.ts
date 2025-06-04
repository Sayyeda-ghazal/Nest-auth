import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,               // strips unknown fields
      forbidNonWhitelisted: true,   // throws if unknown fields present
      transform: true,              // transforms payload into DTO instances
    }),
  );

  await app.listen(process.env.PORT ?? 3300);
}
bootstrap();
