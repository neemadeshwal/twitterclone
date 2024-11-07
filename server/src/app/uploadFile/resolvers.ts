import { GraphQLUpload } from "graphql-upload";

import { uploadOnCloudinary } from "../../services/cloudinary";

// You can directly use GraphQLUpload as part of the resolver setup
const mutations = {
  uploadFile: async (parent: any, { file }: { file: any }, ctx: any) => {
    // Destructure the file object to get the readable stream
    const { createReadStream, filename, mimetype, encoding } = await file;

    // You now have access to the readable stream
    const fileStream = createReadStream();

    // Upload the file to Cloudinary
    const cloudinaryResponse = await uploadOnCloudinary(fileStream);

    // You can return additional metadata such as the file URL or Cloudinary response
    return {
      filename,
      mimetype,
      encoding,
      url: cloudinaryResponse, // If Cloudinary returns a secure URL
    };
  },
};

export const resolvers = { mutations, upload: GraphQLUpload };
