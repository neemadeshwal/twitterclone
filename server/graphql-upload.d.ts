declare module "graphql-upload" {
  import { GraphQLScalarType } from "graphql";
  import { ReadStream } from "fs-capacitor";

  export const GraphQLUpload: GraphQLScalarType;

  export interface FileUpload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => ReadStream;
  }
}
