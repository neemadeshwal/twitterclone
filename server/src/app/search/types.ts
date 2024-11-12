export const types = `#graphql

input searchQueryInput{
    query:String
}

type SearchQueryType{
    post:[Tweet]
    hashtag:[HashTag]
    people:[User]
}
`;
