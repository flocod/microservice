/**
 * 
 * 
 * 

Le code fourni est un exemple simplifié d'un microservice en Node.js utilisant Apache Kafka pour la gestion de comptes bancaires.
Le microservice dispose de quatre routes :

GET /accounts : récupère la liste de tous les comptes bancaires
GET /accounts/:id : récupère le compte bancaire correspondant à l'identifiant id
POST /accounts : crée un nouveau compte bancaire
DELETE /accounts/:id : supprime le compte bancaire correspondant à l'identifiant id
Voici une explication détaillée du code :
 */

// Chargement des dépendances
const express = require("express");
const bodyParser = require("body-parser");
const { Kafka } = require("kafkajs");

// Configuration d'Express
const app = express();
app.use(bodyParser.json());

// Configuration de Kafka
const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});
const producer = kafka.producer();

// Connexion à Kafka
producer.connect();

// Route GET /accounts
app.get("/accounts", async (req, res) => {
  try {
    // Envoi de la requête à Kafka
    await producer.send({
      topic: "accounts",
      messages: [{ value: "list" }],
    });

    // En attente de la réponse de Kafka
    const consumer = kafka.consumer({ groupId: "accounts" });
    await consumer.connect();
    await consumer.subscribe({ topic: "accounts", fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ message }) => {
        res.json(JSON.parse(message.value.toString()));
      },
    });
  } catch (err) {
    console.error("Error getting accounts:", err);
    res.status(500).send({ message: "Error getting accounts" });
  }
});

// Route GET /accounts/:id
app.get("/accounts/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Envoi de la requête à Kafka
    await producer.send({
      topic: "accounts",
      messages: [{ value: `get ${id}` }],
    });

    // En attente de la réponse de Kafka
    const consumer = kafka.consumer({ groupId: "accounts" });
    await consumer.connect();
    await consumer.subscribe({ topic: "accounts", fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ message }) => {
        const account = JSON.parse(message.value.toString());
        if (account.id === id) {
          res.json(account);
        }
      },
    });
  } catch (err) {
    console.error(`Error getting account with id ${id}:`, err);
    res.status(500).send({ message: `Error getting account with id ${id}` });
  }
});

// Route POST /accounts
app.post("/accounts", async (req, res) => {
  const account = req.body;
  try {
    // Envoi de la requête à Kafka
    await producer.send({
      topic: "accounts",
      messages: [{ value: JSON.stringify(account) }],
    });

    res.status(201).send({ message: "Account created" });
  } catch (err) {
    console.error("Error creating account:", err);
    res.status(500).send({ message: "Error creating account" });
  }
});

// Route DELETE /accounts/:id
app.delete("/accounts/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Envoi de la requête à Kafka
    await producer.send({
      topic: "accounts",
      messages: [{ value: `delete ${id}` }],
    });

    res.status(200).send({ message: `Account with id ${id} deleted` });
  } catch (err) {
    console.error("Error deleting account with id ${id}:", err);
    res.status(500).send({ message: "Error deleting account with id ${id} " });
  }
});

/*

Dans la section "Configuration d'Express", 
on importe les dépendances nécessaires, notamment express et body-parser. 
Nous configurons ensuite notre application Express en appelant la méthode use pour utiliser 
le middleware body-parser, qui nous permet de lire les données POST dans le corps de la requête.

Dans la section "Configuration de Kafka", nous créons un client Kafka en utilisant la bibliothèque kafkajs. 
Nous configurons le client avec un ID de client arbitraire my-app et un seul broker Kafka fonctionnant sur localhost sur le port 9092. 
Nous créons également un producteur Kafka à partir du client.

Nous établissons ensuite une connexion à Kafka en appelant la méthode connect sur notre producteur. 
Dans chaque route, nous envoyons une requête à Kafka en utilisant le producteur. Pour la route GET /accounts, 
nous envoyons simplement une demande de liste de tous les comptes. Pour les autres routes 
(GET /accounts/:id, POST /accounts et DELETE /accounts/:id), 
nous incluons l'identifiant du compte dans le corps de la demande.

Nous établissons ensuite une connexion de consommateur à Kafka en utilisant la méthode consumer et nous souscrivons à notre sujet Kafka
pour écouter les messages entrants. Nous exécutons ensuite notre consommateur Kafka en utilisant la méthode run. 
Dans la méthode run, nous utilisons la fonction eachMessage pour définir une fonction de rappel qui sera exécutée pour chaque message reçu. 
Dans cette fonction de rappel, nous convertissons le message JSON en un objet JavaScript et l'envoyons à notre réponse HTTP.

Pour la gestion des erreurs, nous utilisons des blocs try/catch pour capturer les exceptions pouvant survenir dans notre code. 
Si une erreur se produit, nous utilisons la méthode console.error pour enregistrer l'erreur dans la console, 
puis nous renvoyons une réponse HTTP avec un code d'erreur approprié et un message d'erreur.

Enfin, pour des raisons de sécurité, nous pourrions envisager d'utiliser des certificats SSL pour chiffrer 
les communications entre notre microservice et Kafka. 
Pour des raisons de performance, nous pourrions envisager d'utiliser des connexions persistantes à Kafka au 
lieu de créer une nouvelle connexion pour chaque requête.

*/
