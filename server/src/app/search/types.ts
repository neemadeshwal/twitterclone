export const types = `#graphql

input searchQueryInput{
    query:String
}

type SearchQueryType{
    post:[Tweet]
    people:[User]
    media:[Tweet]
    latest:[Tweet]
    hashtag:[HashTag]

}
`;
