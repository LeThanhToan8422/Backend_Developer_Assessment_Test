import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./secrets/cert.key'),
    cert: fs.readFileSync('./secrets/cert.crt'),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.enableCors();
  app.use(helmet());
  const config = new DocumentBuilder()
    .setTitle('TodoList example')
    .setDescription('The todolist API description')
    .setVersion('1.0')
    .addTag('Users')
    .addTag('Jobs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
