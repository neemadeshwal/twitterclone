import { GraphqlContext } from "../../interfaces";
import { uploadOnCloudinary } from "../../services/cloudinary";

const mutations = {
  uploadFile: async (
    parent: any,
    { payload }: { payload: { files: string[] } },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("Unauthorized.");
    }
    const { files } = payload;

    if (files.length === 0) {
      throw new Error("an error occured.");
    }

    try {
      const uploadResults = await Promise.all(
        files.map((file) => uploadOnCloudinary(file))
      );
      return uploadResults;
    } catch (error) {
      console.log(error);
      throw new Error("error while uploading to cloudinary");
    }
  },
};

export const resolvers = { mutations };
