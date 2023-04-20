const express = require("express");
const bodyParser = require("body-parser");
const kafka = require("kafka-node");

let kafkaHost = { kafkaHost: "localhost:9092" };

// Création d'un client Kafka
const kafkaClient = new kafka.KafkaClient(kafkaHost);

// Création d'un producteur Kafka pour envoyer des événements
const kafkaProducer = new kafka.Producer(kafkaClient);

// Création d'un consommateur Kafka pour écouter des événements
const kafkaConsumer = new kafka.ConsumerGroup(
  {
    ...kafkaHost,
    groupId: "account-service-consumer-group",
  },
  ["account-created", "account-updated", "account-deleted"]
);

// Création d'un serveur Express
const app = express();
app.use(bodyParser.json());

// Handler pour la création d'un compte bancaire
app.post("/accounts", (req, res) => {
  const account = req.body;
  // Envoi d'un événement "account-created" à Kafka
  kafkaProducer.send(
    [
      {
        topic: "account-created",
        messages: JSON.stringify(account),
      },
    ],
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        console.log(data);
        res.send(account);
      }
    }
  );
});

// Handler pour la lecture d'un compte bancaire
app.get("/accounts/:id", (req, res) => {
  const accountId = req.params.id;
  // Envoi d'un événement "account-read" à Kafka
  kafkaProducer.send(
    [
      {
        topic: "account-read",
        messages: accountId,
      },
    ],
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        console.log(data);
        res.send(data);
      }
    }
  );
});

// Handler pour la mise à jour d'un compte bancaire
app.put("/accounts/:id", (req, res) => {
  const accountId = req.params.id;
  const account = req.body;
  // Envoi d'un événement "account-updated" à Kafka
  kafkaProducer.send(
    [
      {
        topic: "account-updated",
        messages: JSON.stringify({ id: accountId, ...account }),
      },
    ],
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        console.log(data);
        res.send(account);
      }
    }
  );
});

// Handler pour la suppression d'un compte bancaire
app.delete("/accounts/:id", (req, res) => {
  const accountId = req.params.id;
  // Envoi d'un événement "account-deleted" à Kafka
  kafkaProducer.send(
    [
      {
        topic: "account-deleted",
        messages: accountId,
      },
    ],
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        console.log(data);
        res.send({ message: `Account ${accountId} has been deleted` });
      }
    }
  );
});

// Écoute des événements Kafka
kafkaConsumer.on("message", (message) => {
  const topic = message.topic;
  const payload = message.value;
  switch (topic) {
    case "account-created":
      // Traitement de l'événement "account-created"
      console.log("Account created: ${payload}");
      break;
    case "account-updated":
      // Traitement de l'événement "account-updated"
      console.log("Account updated: ${payload}");
      break;
    case "account-deleted":
      // Traitement de l'événement "account-deleted"
      console.log("Account deleted: ${payload}");
      break;
    case "account-read":
      // Récupération d'un compte bancaire à partir de son identifiant
      console.log("Account read: ${payload}");
      break;
    default:
      console.warn("Unknown topic: ${topic}");
  }
});

// Démarrage du serveur Express
app.listen(3000, () => {
  console.log("Account service listening on port 3000");
});

/* Dans ce code, nous avons utilisé la librairie "kafka-node" pour créer un client Kafka,
un producteur Kafka pour envoyer des événements, et un consommateur Kafka pour écouter des événements.

Nous avons ensuite créé un serveur Express avec quatre handlers pour les opérations CRUD sur un compte bancaire
(POST pour la création, GET pour la lecture, PUT pour la mise à jour, et DELETE pour la suppression).

Chaque handler envoie un événement à Kafka avec un topic correspondant à l'opération
(account-created, account-read, account-updated, account-deleted) et le payload correspondant à l'objet compte bancaire ou à son identifiant.

Enfin, nous avons ajouté un handler pour écouter les événements Kafka et les traiter en fonction de leur topic.
Dans cet exemple, nous avons simplement affiché le payload de l'événement à la console, mais vous pouvez ajouter d'autres traitements en fonction de vos besoins.

Notez que ce code est un exemple très simplifié et qu'il est important de prendre en compte les problématiques de gestion d'erreurs, de sécurité, de performance, etc. lors du développement d'un microservice de ce type en production.*/
