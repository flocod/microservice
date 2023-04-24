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
- GET /accounts/: récupère le compte bancaire correspondant à l'identifiant id
- GET /filter-account/: Filtrer les comptes
- GET /update-account/: Mettre à jour un compte bancaire
- POST /account/ : crée un nouveau compte bancaire
- DELETE /delete-account/ : supprime le compte bancaire correspondant à l'identifiant id


# Tech Stack

- [Node.js](https://nodejs.org)
- [Kafka](https://kafka.apache.org)

# Usage

**Requirements**: Node.js

**Setup**

- `npm install` (Install NPM dependencies)

**Run**

- `npm  run  dev`
- `npm  test`

**Monitoring**

- http://localhost:3007 (Console)
