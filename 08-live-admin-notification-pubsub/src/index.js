const express = require("express");
const Redis = require("ioredis");

const subscriber = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

subscriber.subscribe("notifications", (err) => {
  if (err) {
    console.error("Failed to subscribe: %s", err.message);
    return;
  } else {
    console.log(`Subscribed successfully!.`);
  }
});

subscriber.on("message", (channel, message) => {
  console.log(`Received message from ${channel}: ${JSON.parse(message)}`);
});

const app = express();
app.use(express.json());

app.listen(8529, () => {
  console.log("Server is successfully running on port 8529");
});
