import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Accept',
      exposedHeaders: ['Authorization'],
    }),
  );

  await app.listen(process.env.PORT);
  console.log(`Server running on ${process.env.PORT}`);
}
bootstrap();
