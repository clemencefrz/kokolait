import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Filter the data we don't need
      transform: true,
    }),
  ); // Necessary for Validation feature, cf https://docs.nestjs.com/application/validation
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
