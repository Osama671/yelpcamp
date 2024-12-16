import { createClient } from "redis";

const dotenv = await import("dotenv");
dotenv.config();

const client = createClient ({
  url : process.env.REDIS_URL
});

client.on("error", function(err) {
  throw err;
});

await client.connect()

export default client;
