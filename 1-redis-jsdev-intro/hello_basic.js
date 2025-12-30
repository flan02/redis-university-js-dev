require("dotenv").config();
const redis = require("redis");

// Create a client and connect to Redis.
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

// Run a Redis command, receive response in callback.
client.set("hello", "world", (err, reply) => {
  console.log(reply); // ? OK

  // Run a second Redis command now we know that the
  // first one completed.  Again, response in callback.
  client.get("hello", (getErr, getReply) => {
    console.log(getReply); // ? world

    // Quit client and free up resources.
    client.quit();
  });
});
