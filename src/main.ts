import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'aws-sdk';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as envConfig from 'config';

async function bootstrap() {
  const serverConfig = envConfig.get('server');
  const awsConfig = envConfig.get('aws');

  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  config.update({
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
    region: awsConfig.region,
  });

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);

  logger.log(`Application listening on port: ${port}`);
}
bootstrap();
