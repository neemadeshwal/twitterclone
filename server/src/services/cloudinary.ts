import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

import { Readable } from "stream"; // Node.js Readable stream
import { CLOUD_API_KEY, CLOUD_NAME, CLOUD_SECRET } from "../utils/constants";

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_SECRET,
});
export const uploadOnCloudinary = async (localFiles: any) => {
  console.log("multipleFilepath =>" + localFiles);

  try {
    const uploadedImages = [];
    for (const file of localFiles) {
      const response = await cloudinary.uploader.upload(file.path, {
        timeout: 60000,
        resource_type: "auto",
      });
      console.log("response", response);
      fs.unlinkSync(file.path);
      uploadedImages.push(response.secure_url);
      console.log("response=> " + response.public_id);
    }

    return uploadedImages;
  } catch (error) {
    console.log(error);

    for (const file of localFiles) {
      fs.unlinkSync(file.path);
    }

    return null;
  }
};
