require("dotenv").config();
const redis = require("redis");
const bluebird = require("bluebird");
const config = require("better-config");

// Add extra definitions for RedisTimeSeries commands.
redis.addCommand("ts.add"); // redis.ts_addAsync
redis.addCommand("ts.range"); // redis.ts_rangeAsync

// Promisify all the functions exported by node_redis.
bluebird.promisifyAll(redis);

// Create a client and connect to Redis using configuration
// from config.json.
const clientConfig = {
  host: process.env.REDIS_HOST || config.get("dataStores.redis.host"),
  port: process.env.REDIS_PORT || config.get("dataStores.redis.port"),
};

if (process.env.REDIS_PASSWORD || config.get("dataStores.redis.password")) {
  clientConfig.password =
    process.env.REDIS_PASSWORD || config.get("dataStores.redis.password");
}

const client = redis.createClient(clientConfig);

// This is a catch all basic error handler.
client.on("error", (error) => console.log(error));

module.exports = {
  /**
   * Get the application's connected Redis client instance.
   *
   * @returns {Object} - a connected node_redis client instance.
   */
  getClient: () => client,
};
