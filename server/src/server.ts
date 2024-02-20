import express from "express";
import { client, createTables } from "./db";

const app = express();
app.use(express.json());

const init = async () => {
  console.log("Connecting to database...");
  await client.connect();
  console.log("Connected successfully");

  await createTables();
  console.log("Created tables");
};

init();
