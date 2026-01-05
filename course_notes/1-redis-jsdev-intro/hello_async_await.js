require("dotenv").config();
const redis = require("redis");
const bluebird = require("bluebird");

// Make all functions in 'redis' available as promisified
// versions whose names end in 'Async'.
bluebird.promisifyAll(redis);

// When using 'await', code needs to be in a function that
// is declared 'async', so our code is wrapped in here and
// called at the bottom of the script.
const runApplication = async () => {
  // Connect to Redis.
  const client = redis.createClient({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || "password",
  });

  // Run a Redis command.
  const reply = await client.setAsync("hello_async_await", "world_async_await");
  console.log(reply); // OK

  const keyValue = await client.getAsync("hello_async_await");
  console.log(keyValue); // world_async_await
  // ? Clean up and allow the script to exit.
  client.quit();
};

try {
  runApplication();
} catch (e) {
  console.log(e);
}
