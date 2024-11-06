import { graphqlClient } from "@/clients/api";
import { gql } from "@apollo/client";

const UPLOAD_FILE = gql`
  mutation UploadFile($payload: uploadFilePayload) {
    uploadFile(payload: $payload) {
      url
    }
  }
`;
// export const uploadFile = async (payload: { files: any }) => {
//   const data = await graphqlClient.request(UPLOAD_FILE, { payload });
//   return data;
// };

export const uploadFile = async (payload: { files: File[] }) => {
  // FormData to handle file upload in multipart format

  // Send the files as multipart/form-data via graphql client
  const data = await graphqlClient.request(UPLOAD_FILE, {
    payload,
  });

  return data;
};
