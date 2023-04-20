const express = require("express");
const bodyParser = require("body-parser");
const { Kafka } = require("kafkajs");

const app = express();
app.use(bodyParser.json());

// Configuration Kafka
const kafka = new Kafka({
  clientId: "account-service",
  brokers: ["kafka1:9092", "kafka2:9092", "kafka3:9092"],
  requestTimeout: 10000,
  retry: {
    initialRetryTime: 1000,
    retries: 10,
  },
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "account-group" });

// Connexion à Kafka
async function connectKafka() {
  try {
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({ topic: "account-topic" });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`Received message: ${message.value}`);
      },
    });
    console.log("Connected to Kafka");
  } catch (err) {
    console.error("Error connecting to Kafka:", err);
    process.exit(1);
  }
}

connectKafka();

// Routes CRUD pour les comptes bancaires
app.post("/accounts", async (req, res) => {
  try {
    const account = req.body;
    const result = await producer.send({
      topic: "account-topic",
      messages: [
        {
          value: JSON.stringify({ type: "account-created", payload: account }),
        },
      ],
    });
    console.log(`Created account: ${JSON.stringify(account)}`);
    res.send({ message: `Account ${account.id} created` });
  } catch (err) {
    console.error("Error creating account:", err);
    res.status(500).send({ message: "Error creating account" });
  }
});

app.get("/accounts/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await producer.send({
      topic: "account-topic",
      messages: [
        { value: JSON.stringify({ type: "account-read", payload: { id } }) },
      ],
    });
    console.log(`Read account with id: ${id}`);
    res.send({ message: `Account with id ${id} read` });
  } catch (err) {
    console.error("Error reading account:", err);
    res.status(500).send({ message: "Error reading account" });
  }
});

app.put("/accounts/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const account = req.body;
    const result = await producer.send({
      topic: "account-topic",
      messages: [
        {
          value: JSON.stringify({
            type: "account-updated",
            payload: { id, ...account },
          }),
        },
      ],
    });
    console.log(`Updated account with id: ${id}`);
    res.send({ message: `Account with id ${id} updated` });
  } catch (err) {
    console.error("Error updating account:", err);
    res.status(500).send({ message: "Error updating account" });
  }
});

app.delete("/accounts/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await producer.send({
      topic: "account-topic",
      messages: [
        { value: JSON.stringify({ type: "account-deleted", payload: { id } }) },
      ],
    });
    console.log(`Deleted account with id: ${id}`);
    res.send({ message: `Account with id ${id} deleted` });
  } catch (err) {
    console.error("Error deleting account:", err);
    res.status(500).send({ message: "Error deleting account" });
  }
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).send({ message: "Internal server error" });
});

// Sécurité : utiliser Helmet pour améliorer la sécurité de l'application Express
const helmet = require("helmet");
app.use(helmet());

// Performance : compression de la réponse HTTP
const compression = require("compression");
app.use(compression());

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
