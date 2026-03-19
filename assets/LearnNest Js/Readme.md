# Begin learn NestJS

⚡ D’abord : c’est quoi NestJS ?
👉 NestJS est un framework backend basé sur :
Node.js
TypeScript
👉 Il est inspiré de frameworks comme :
Laravel (structure propre)
Angular (architecture modulaire)
c'est tres bien pour les micro service

# installation 
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
npm install prisma --save-dev  ORM prisme mieux que TypeORM
npm install @prisma/client
npx prisma init pour initialiser

# Thunder Client 
extension pour les API 

# les ORM a utilisé
Prisma ou TypeORM (pour le projet Prédicam utilisé TypeORM pour  Intégration native avec NestJS via @nestjs/typeorm communauté mature et etendu gain en productivité, sécurité et maintenabilité perte en performances et en flexibilité) 