import { GetServerSideProps } from "next";
import { graphqlClient } from "@/clients/api";
import { getCurrentUser, getCurrentUserQueryProps } from "@/graphql/types";
import { getCurrentUserQuery } from "@/graphql/query/user";
import { cookies } from "next/headers";
import { GraphQLClient } from "graphql-request";
import { SERVER_URL } from "../constants";

export const getGraphQLClient = async() => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
  
    if (!token) {
      throw new Error('No authentication token found');
    }
  
    return new GraphQLClient(SERVER_URL!, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };
export const getCurrentUserData=async():Promise<getCurrentUser|null>=>{
  
try{

    const client = await getGraphQLClient();

    const data=await client.request<getCurrentUserQueryProps>(getCurrentUserQuery)
    return data.getCurrentUser;
}
catch(error){
    console.error("Error fetching current user data:", error);
    return null

}
}