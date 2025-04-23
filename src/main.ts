import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ThrottleMiddleware } from './throttle.middleware';

async function bootstrap() {
  // Use the Express-specific application type
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use('/auth/login', new ThrottleMiddleware().use);

  // Enable CORS so your React app can call the API
  app.enableCors({
    origin: 'https://bibleec.vercel.app',  // Replace with your frontend URL
    methods: 'GET,POST,DELETE',      // Allow appropriate methods
    allowedHeaders: 'Content-Type, Authorization',  // Allow the Authorization header
    credentials: true,
  });

  // Serve the uploads folder under the /uploads route
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Listen on the port from env or 3000
  await app.listen(3000); // Your NestJS port  
}
bootstrap();