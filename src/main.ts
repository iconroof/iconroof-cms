import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { json, urlencoded, Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Redirect /api/uploads/* to /uploads/* (fix for old incorrect URLs)
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/uploads/')) {
      const newPath = req.path.replace('/api/uploads/', '/uploads/');
      return res.redirect(301, newPath);
    }
    next();
  });

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Increase body parser limits for large content (HTML with base64 images)
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
