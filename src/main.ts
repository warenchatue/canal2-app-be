import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { version } from 'package.json';
import { AppModule } from './app.module';
import { API_PORT, NODE_ENV } from './common/vars';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation
  // app.useGlobalPipes(new ValidationPipe());

  // Enable Cors
  app.enableCors();

  // Api versioning
  app.enableVersioning();

  // OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('DinoES API')
    .setVersion(version)
    .addBearerAuth()
    .setDescription('The Canal2 Spot System API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Helmet for security
  if (NODE_ENV == 'production') {
    app.use(helmet());
  }

  await app.listen(API_PORT);
}
bootstrap();
