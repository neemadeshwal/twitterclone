import express from "express"
import {expressMiddleware} from "@apollo/server/express4"
import bodyParser from "body-parser"
import AuthRoute from "./user/auth"
import cors from "cors"
import { ApolloServer } from "@apollo/server"

import { User } from "./user"
import { GraphqlContext } from "../interfaces"

export async function initServer() {
    const app=express()

    app.use(bodyParser.json())
    app.use(cors())

    
    

const graphqlServer=new ApolloServer<GraphqlContext>({
    typeDefs:`
    ${User.types}
  
    type Query {
      _empty: String
    }
    type Mutation{
    ${User.mutations}
    }
    `,
    resolvers:{
     
       Mutation:{...User.resolvers.mutations}
       
    }
})

await graphqlServer.start()

app.use("/graphql",expressMiddleware(graphqlServer))

app.use("/api/auth",AuthRoute)



return app


}