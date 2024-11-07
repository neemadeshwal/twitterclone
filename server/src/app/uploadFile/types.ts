export const types = `#graphql
scalar upload
type uploadedFile {
  filename: String!
  mimetype: String!
  encoding: String!
  url: String!
}

input uploadFilePayload{
    files:[upload]
}
`;
