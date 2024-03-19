import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { existsSync, mkdirSync, writeFile } from 'fs';

async function bootstrap() {
  const env = process.env
  if (env.NODE_ENV === 'production') {
    const dir = 'logs';
    if (!existsSync(dir)) {
      mkdirSync(dir, {
        recursive: true
      });
      writeFile('logs/logs.out', '', (err: any) => {
        if (err) console.log(err);
      });
    }
  }
  const app = await NestFactory.create(AppModule,{
    cors: false
  });
  const port = process.env.PORT || 3000
  await app.listen(port);
}
bootstrap();
