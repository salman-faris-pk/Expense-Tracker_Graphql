import { ApolloServer } from "@apollo/server";
import { expressMiddleware }from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { buildContext } from "graphql-passport";
import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import prisma from "./lib/prisma.js"
const app = express();
dotenv.config();



const httpServer=http.createServer(app)

const server= new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers:mergedResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

await server.start()

app.use("/graphql",cors({
    origin:"*",
    credentials: true,
}),
  express.json(),
  expressMiddleware(server,{
    context: async({req,res})=> buildContext({req,res})
  })
);

   await new Promise((resolve) =>
    httpServer.listen({ port: 4000 }, resolve),
  );

  await prisma.$connect();
  console.log("✅ Prisma connected successfully");

  console.log(`🚀 Server ready at http://localhost:4000/graphql`);


