import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { AllExceptionsFilter } from './exceptions/all-exceptions.filter';
import { PrismaClientExceptionFilter } from './exceptions/prisma-exception.filter';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';

import * as session from 'express-session';
import * as passport from 'passport';

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: 60000 },
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activate validations pipes globally on system
  app.useGlobalPipes(new ValidationPipe());

  // set api as a global prefix
  app.setGlobalPrefix('api');

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(session(sessionOptions));
  app.use(passport.initialize());
  app.use(passport.session());

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Universe API Backend')
    .setDescription('ULAR Universe API')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/swagger', app, document);

  await app.listen(3333);
}
bootstrap();
