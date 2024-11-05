import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import AuthRoute from "./user/auth";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import passport from "../services/passport";
import { User } from "./user";
import { GraphqlContext } from "../interfaces";
import JWTService from "../services/jwt";
import { Tweet } from "./tweet";
import { Like } from "./like";
import { Comment } from "./comment";
import { Follows } from "./follows";

export async function initServer() {
  const app = express();

  app.use(bodyParser.json());
  app.use(cors());

  const graphqlServer = new ApolloServer<GraphqlContext>({
    typeDefs: `
    ${User.types}
    ${Tweet.types}
    ${Like.types}
    ${Comment.types}
    ${Follows.types}
  
    type Query {
      ${User.queries}
      ${Tweet.queries}
    }
    type Mutation{
    ${User.mutations}
    ${Tweet.mutations}
    ${Like.mutations}
    ${Comment.mutations}
    ${Follows.mutations}
    }
    `,
    resolvers: {
      Mutation: {
        ...User.resolvers.mutations,
        ...Tweet.resolvers.mutations,
        ...Like.resolvers.mutations,
        ...Comment.resolvers.mutations,
        ...Follows.resolvers.mutations,
      },
      Query: { ...User.resolvers.queries, ...Tweet.resolvers.queries },
      ...User.resolvers.extraResolvers,
      ...Tweet.resolvers.extraResolvers,
    },
  });

  await graphqlServer.start();

  app.use(
    "/graphql",
    expressMiddleware(graphqlServer, {
      context: async ({ req, res }) => {
        return {
          user: req.headers.authorization
            ? JWTService.decodeToken(
                req.headers.authorization.split("Bearer ")[1]
              )
            : undefined,
        };
      },
    })
  );

  app.use(passport.initialize());
  app.use("/api/auth", AuthRoute);

  return app;
}
