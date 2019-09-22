import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import 'reflect-metadata';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(8000);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.use(
    cors({
      credentials: true,
    }),
  );
}
bootstrap();
