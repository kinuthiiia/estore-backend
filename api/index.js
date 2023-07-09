import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import http from "http";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import resolvers from "../resolvers.js";
import typeDefs from "../typeDefs.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const httpServer = http.createServer(app);

const startApolloServer = async (app, httpServer) => {
  // DB set-up
  mongoose.Promise = global.Promise;

  const connection = mongoose.connect(process.env.DB_LOCAL, {
    useNewUrlParser: true,
  });

  connection
    .then((db) => console.log("DB connected"))
    .catch((err) => {
      console.log(err);
    });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({ app });
};

startApolloServer(app, httpServer);

export default httpServer;
