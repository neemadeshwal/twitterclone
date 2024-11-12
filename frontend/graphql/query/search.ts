import { gql } from "@apollo/client";

export const getSearchByQuery = gql(`
    query getSearchByQuery($payload:searchQueryInput){
        searchQuery(payload:$payload){
            people{
                id
            }
        }
    }`);
