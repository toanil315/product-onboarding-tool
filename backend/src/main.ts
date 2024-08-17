import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { DATA_FOLDER_PATH } from './constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(5500);
}

bootstrap().then(() => {
  if (!fs.existsSync(DATA_FOLDER_PATH)) {
    fs.mkdirSync(DATA_FOLDER_PATH);
  }
});
