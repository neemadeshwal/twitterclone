"use client";
import { SERVER_URL } from "@/lib/constants";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";

const client = new ApolloClient({
  uri: SERVER_URL!,
  cache: new InMemoryCache(),
  credentials: "include",
  headers: {
    "Access-Control-Allow-Credentials": "true"
  }
});

export const ApolloProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
