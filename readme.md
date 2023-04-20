npm install kafka-node express body-parser

<div align="center">
  <br>
  <h1>Node.js Kafka comptes bancaires</h1>
  <p>Microservice en Node.js utilisant Apache Kafka pour la gestion de comptes bancaires.</p>

</div>

# Features
 -Interagir avec Kafka via Node.js
 -Produire/consommer des événements vers/depuis des sujets
 -Utiliser Kafka comme file d'attente et comme système de publication/abonnement
- GET /accounts : récupère la liste de tous les comptes bancaires
- GET /accounts/:id : récupère le compte bancaire correspondant à l'identifiant id
- POST /accounts : crée un nouveau compte bancaire
- DELETE /accounts/:id : supprime le compte bancaire correspondant à l'identifiant id


# Tech Stack

- [Node.js](https://nodejs.org)
- [Kafka](https://kafka.apache.org)

# Usage

**Requirements**: Node.js

**Setup**

- `npm install` (Install NPM dependencies)

**Run**

- `npm start`

**Monitoring**

- http://localhost:8080 (Console)

**Notes**

# Codebase

- [`example.ts`](example.ts) (Minimal example of using Kafka with Node.js)
- [`cli.ts`](cli.ts) (CLI application to read wallet data in realtime)
- [`server.ts`](server.ts) (WebSocket server that communicates with CLI and with Kafka)
- [`balance.ts`](balance.ts) (Service, that crawls wallet balance on demand)
- [`price.ts`](price.ts) (Service, that writes realtime price events to Kafka)
