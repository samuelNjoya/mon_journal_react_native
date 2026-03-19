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