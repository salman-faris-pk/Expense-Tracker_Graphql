import { ApolloServer } from "@apollo/server";
import { expressMiddleware }from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from "express";
import path from "path";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { buildContext } from "graphql-passport";
import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import prisma from "./lib/prisma.js"
import passport from "passport"
import session from "express-session";
import ConnectMongoDBSession from "connect-mongodb-session";
import { configurePassport } from "./passport/passport.config.js"


const __dirname=path.resolve();
const app = express();
dotenv.config();

configurePassport();

const httpServer=http.createServer(app)


const mongoDBstore= ConnectMongoDBSession(session)
const store = new mongoDBstore({
  uri: process.env.DATABASE_URL,
  collection: 'sessions'
});

store.on("error", (err)=> console.log(err));

app.use(session({
     secret: process.env.SESSION_SECRET,
     resave: false, // this option specifies whether to save the session to the store on every request
     saveUninitialized:false, // // option specifies whether to save uninitialized sessions( Didn't save a new session if it hasn't been used yet)
      name:"token",
     cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
			httpOnly: true, 
     },
     store: store,
}));

app.use(passport.initialize());
app.use(passport.session());  //For every subsequent request, passport.session() middleware runs and checks the session


const server= new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers:mergedResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

await server.start()

app.use("/graphql",cors({
    origin:"http://localhost:3004",
    credentials: true,
}),
  express.json(),
  expressMiddleware(server,{
     context: async({req,res})=> buildContext({req,res})  // or add user: req.user and Access the user ,in the resolver like this "const { user } = context;""
  })
);



//npm run build will build your frontend app
app.use(express.static(path.join(__dirname, "frontend/dist")));

app.get("*",(req,res)=>{
   res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});



   await new Promise((resolve) =>
    httpServer.listen({ port: 4000 }, resolve),
  );

  await prisma.$connect();
  console.log("✅ Prisma connected successfully");

  console.log(`🚀 Server ready at http://localhost:4000/graphql`);


