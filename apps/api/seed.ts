import 'reflect-metadata'; 
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app/app.module';
import { SeederService } from './src/app/shared/seeder.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('SeederScript');
  
  // Create application context (no HTTP server listening, just DI container)
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const seederService = app.get(SeederService);
    await seederService.seed();
    logger.log('Seeding process completed!');
  } catch (error) {
    logger.error('Seeding failed!', error);
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap();