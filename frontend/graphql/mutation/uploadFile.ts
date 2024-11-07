import { graphqlClient } from "@/clients/api";
import { gql } from "@apollo/client";
import { Upload } from "graphql-upload";

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

export const uploadFile = async (payload: { files: FileList }) => {
  const formData = new FormData();
  Array.from(payload.files).forEach((file) => {
    formData.append("files", file);
  });
  const data = await graphqlClient.request(UPLOAD_FILE, {
    payload: { files: formData.getAll("files") },
  });
  return data;
};
