require("dotenv").config();
const redis = require("redis");
const { promisify } = require("util");

// Create a client and connect to Redis.
const client = redis.createClient({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || "password",
});

// Use Node's built in promisify to wrap the Redis
// command functions we are going to use in promises.
const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);

// Chain promises together to call Redis commands and process the results.
setAsync("hello_promises", "world_promises")
  .then((res) => console.log(res)) // OK
  .then(() => getAsync("hello_promises"))
  .then((res) => console.log(res)) // world_promises
  .then(() => client.quit());
