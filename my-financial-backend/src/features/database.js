const { Pool } = require("pg");

let dbHost =
  process.env.DB_HOST ??
  (() => {
    throw new Error("DB Host is not provided");
  })();

let dbUser =
  process.env.DB_USER ??
  (() => {
    throw new Error("DB User is not provided");
  })();

let dbPassword =
  process.env.DB_PASSWORD ??
  (() => {
    throw new Error("DB User is not provided");
  })();

let dbName =
  process.env.DB_NAME ??
  (() => {
    throw new Error("DB Name is not provided");
  })();

let poolConfig = {
  host: dbHost,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  max: 10,
};

const pool = new Pool(poolConfig);

module.exports = pool;
