const ioredis = require("ioredis");
const express = require("express");
const { emailQueue } = require("./queue");

const app = express();

app.use(express.json());

app.post("/welcome-email", async (req, res) => {
  const { to, name } = req.body;

  const job = await emailQueue.add(
    "Welcome Email",
    { to, name },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    },
  );

  res
    .status(200)
    .json({ message: "Welcome email queued successfully!", jobId: job.id });
});

app.listen(8090, () => {
  console.log("Server is running on port 8090");
});
