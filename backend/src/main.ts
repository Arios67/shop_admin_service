import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // HttpException Filter
  // app.useGlobalFilters(new HttpExceptionFilter());

  // Response Interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // class-validation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Swagger
  SwaggerModule.setup(
    '/api-docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('shop_admin service')
        .setDescription('api-docs')
        .setVersion('1.0')
        .build(),
    ),
  );

  await app.listen(process.env.PORT);
}
bootstrap();
