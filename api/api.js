const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const helmet = require("helmet");
const mapRoutes = require("../api/util/mapRoutes");
const cors = require("cors");
const { Kafka } = require("kafkajs");

/**
 * Configuration de Kafka
 */

const kafka = new Kafka({
  clientId: "account-service",
  brokers: ["localhost:3000"],
  requestTimeout: 10000,
  retry: {
    initialRetryTime: 1000,
    retries: 10,
  },
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "account-group" });

//connexion à kafka

async function connectKafka() {
  try {
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({ topic: "account-topic" });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`\n\nReceived From Topic: ${topic}`);
        console.log(`partition: ${partition} `);
        console.log(`message: ${message.value}\n\n`);
      },
    });

    console.log(`Connected to kafka`);
  } catch (error) {
    console.error("Error connecting to Kafka producer:", error);
    process.exit(1);
  }
}

connectKafka();



/**
 * server configuration
 */
const config = require("../config/");
const auth = require("./policies/auth.policy");
const dbService = require("./services/db.service");

// environment: development, staging, test, production
const environment = process.env.NODE_ENV;
console.log("environment:", environment);

/**
 * express application
 */
const app = express();
const server = http.Server(app);
const mappedOpenRoutes = mapRoutes(config.publicRoutes, "api/controllers/");
const mappedAuthRoutes = mapRoutes(config.privateRoutes, "api/controllers/");

const DB = dbService(environment, config.migrate).start();

const allowedOrigins = [
  "http://localhost:3007",
  "http://localhost:3001",
  "http://127.0.0.1:3007",
];
// allow cross origin requests
// configure to only allow requests from certain origins

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        let msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

// secure express app
app.use(
  helmet({
    dnsPrefetchControl: false,
    frameguard: false,
    ieNoOpen: false,
  })
);

// parsing the request bodys
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// secure your private routes with jwt authentication middleware
app.all("/api/private/*", (req, res, next) => auth(req, res, next));

// fill routes for express application
app.use("/api/public", mappedOpenRoutes);
app.use("/api/private", mappedAuthRoutes);

app.use("/api/public/accounts", async (req, res, next) => {
  await producer.send({
    topic: "account-topic",
    messages: [
      { value: JSON.stringify({ type: "account-read-all", payload: {} }) },
    ],
  });
  next();
});

app.use("/api/public/filter-account", async (req, res, next) => {
  const filter = req.query;

  await producer.send({
    topic: "account-topic",
    messages: [
      {
        value: JSON.stringify({ type: "account-filter", payload: { filter } }),
      },
    ],
  });
  
  next();
});

app.use("/api/public/delete-account/", async (req, res, next) => {
  const filter = req.query;

  await producer.send({
    topic: "account-topic",
    messages: [
      {
        value: JSON.stringify({ type: "delete-account", payload: { filter } }),
      },
    ],
  });
  next();
});

app.use("/api/public/account/", async (req, res, next) => {
  const payload = req.body;

  await producer.send({
    topic: "account-topic",
    messages: [
      {
        value: JSON.stringify({ type: "create-account", payload: { payload } }),
      },
    ],
  });
  next();
});

server.listen(config.port, () => {
  if (
    environment !== "production" &&
    environment !== "development" &&
    environment !== "local" &&
    environment !== "test"
  ) {
    console.error(
      `NODE_ENV is set to ${environment}, but only production and development are valid.`
    );
    process.exit(1);
  }

  console.log("server running on: ", config.port);

  return DB;
});

module.exports = app;
