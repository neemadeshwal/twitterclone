export const types = `#graphql

type uploadedFile{

    url: String
  public_id: String
}

input uploadFilePayload{
    files:[Upload]
}
`;
