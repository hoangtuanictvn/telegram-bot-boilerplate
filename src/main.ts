import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
