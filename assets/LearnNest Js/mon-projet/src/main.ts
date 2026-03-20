import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Appliquer le ValidationPipe globalement AVANT d'écouter le port
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // Supprime les champs non définis dans les DTO
      forbidNonWhitelisted: true, // Renvoie une erreur si des champs non autorisés sont envoyés
      transform: true,       // Transforme automatiquement les types (ex: string -> number)
      stopAtFirstError: true, // Arrête la validation après la première erreur rencontrée
    }),
  );

  // Démarrer l'application
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
