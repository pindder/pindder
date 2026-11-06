/**
 * This is pindder's production server!
 * This is a fully built backend to handle pindder's customers and admin responsibilities.
 */
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as fs from 'fs'; // 1. Import Node's fs module

// 2. Ensure the logs directory exists before initializing Winston
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { 
    rawBody: true,
    logger: WinstonModule.createLogger({
      transports: [
        // 1. Keep console logging active for local development
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.json(),
          ),
        }),
        // 2. Write all error logs to error.log
        new winston.transports.File({ 
          filename: 'logs/error.log', 
          level: 'error',
          format: winston.format.combine(winston.format.timestamp(), winston.format.json())
        }),
        // 3. Write all logs (info, warn, error) to combined.log
        new winston.transports.File({ 
          filename: 'logs/combined.log',
          format: winston.format.combine(winston.format.timestamp(), winston.format.json())
        }),
      ],
    }),
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin: [
      'https://pindder-buisness.onrender.com',
      'https://pindder-admin.onrender.com',
      'https://pindder.com',
      'https://app.pindder.com',
      'https://pindder-web.onrender.com',
      'http://localhost:4200',
      'http://localhost:4800',
      'http://localhost:4500',
      'http://localhost:8100',
      'http://localhost',       // Capacitor Android
      'http://10.0.2.2:4000',   // Android Emulator to host API
      'http://10.0.2.2',        // Android Emulator
      'capacitor://localhost',  // Capacitor iOS
      'ionic://localhost',      // Ionic iOS (legacy)
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });
  
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 4000;

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Pindder Api')
    .setDescription('Pindder API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port, '0.0.0.0');
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
