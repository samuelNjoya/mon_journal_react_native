# Begin learn NestJS

⚡ D’abord : c’est quoi NestJS ?
👉 NestJS est un framework backend basé sur :
Node.js
TypeScript
👉 Il est inspiré de frameworks comme :
Laravel (structure propre)
Angular (architecture modulaire)
c'est tres bien pour les micro service

# installation    npm run start:dev
$ npm i -g @nestjs/cli / npm uninstall -g @nestjs/cli
$ nest new project-name
npx @nestjs/cli new mon-projet
un peu plus lent a chaque utilisation car retelecharge le package
lancé le serveur de dev
npm run start:dev (http://localhost:3000/) recharge automatiquement le serveur
npm run start -- -b swc.(pour accelerer le processus de developpement)
deux plateforme http: espress et fastify


Pour créer un nouveau projet TypeScript avec un ensemble de fonctionnalités plus strict, passez le --strict drapeau à la nest new commandement 
# nest new --strict project1

nest g module users
nest g controller users
nest g service users

## controller
pour creer un controlleur il faut ajouter le decorateur controller on peux decorer les classes et decorer aussi les methodes on peut aussi decorer les paramètres de la méthode
@Get()
findAll() {
  return "Liste des utilisateurs";
}

## service ou provider
on utilise le decoratuer injectable pour les definir
getUsers() {
  return ["user1", "user2"];
}

## module
👉 regroupe tout

## connexion a postgressql
npm install prisma --save-dev  ORM prisme mieux que TypeORM dans la facilité et la migration
npm install @prisma/client
npx prisma init pour initialiser

pour installer TypeORM pour postgresSQL
npm install @nestjs/typeorm typeorm pg
npm install -g typeorm


# Thunder Client 
extension pour les API 

# les ORM a utilisé
Prisma ou TypeORM (pour le projet Prédicam utilisé TypeORM pour  Intégration native avec NestJS via @nestjs/typeorm communauté mature et etendu gain en productivité, sécurité et maintenabilité perte en performances et en flexibilité) 


# extention vs code nest js
1- NestJS Snippets  : auto completion Fournit des raccourcis pour générer rapidement du code NestJS (modules, contrôleurs, services, décorateurs, etc.). nest-module génère automatiquement la structure d’un module NestJS.
2- ESLint
Intègre ESLint (linter pour JavaScript/TypeScript) directement dans VS Code.
Détecte les erreurs de syntaxe, les mauvaises pratiques et applique les règles de style de ton projet (ex : règles NestJS ou Airbnb).
3- Prettier pour l'indentation
4- Bracket Pair Colorizer: pour colorier les accolade evitant leur oublie

### ce que je comprends
Entity = table

# outils de validation 
npm install class-validator class-transformer
# ajout du hash du mot de passe 
npm install bcrypt
npm install -D @types/bcrypt

# Migration plus tart 
npx typeorm migration:generate -n InitUser
npx typeorm migration:run

# a éviter
❌ oublier ValidationPipe
❌ stocker password en clair
❌ ne pas utiliser DTO
❌ ne pas gérer les erreurs

# les dto sont pour les api et les entity pour la bd

### les dependances pour JWT
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install -D @types/passport-jwt
# les Alias
nest g mo auth && nest g s auth && nest g co auth

ce token contient 
{
  "sub": 1,
  "email": "test@gmail.com",
  "role": "user"
}

 "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjExLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NzQwMDk0MTksImV4cCI6MTc3NDA5NTgxOX0.F4m2r_05illvcL12E8IHeJVMP14l3qDovOeT6b8QWjk"