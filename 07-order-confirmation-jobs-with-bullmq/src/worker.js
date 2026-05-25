const { Worker } = require("bullmq");
const { connection } = require("./queue");

const worker = new Worker(
  "emails",
  async (job) => {
    (console.log(`Processing job ${job.id} with data:`, job.data),
      await new Promise((resolve) => setTimeout(resolve, 1500)),
      console.log(`Finished processing job ${job.id} ${job.name},${job.data}`));
  },
  { connection },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} has failed with error:`, err);
});

console.log("Worker is running and waiting for jobs...");
