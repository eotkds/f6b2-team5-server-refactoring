import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import 'dotenv/config';
import { graphqlUploadExpress } from 'graphql-upload';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(graphqlUploadExpress());
  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.enableCors({
    origin: [
      'http://smaf.site',
      'https://smaf.site',
      'http://localhost:3000',
      'https://backend.smaf.shop',
      'http://localhost:5500',
      'https://storage.googleapis.com/teamproject_storage/projectImage/',
    ],
    allowedHeaders: [
      'Access-Control-Allow-Headers',
      'Authorization',
      'X-Requested-With',
      'Content-Type',
      'Accept',
    ],
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
