import multer from "multer";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "./public");
  },
  filename(req, file, callback) {
    const id = uuid();
    const extName = file.originalname.split(" ").pop();
    callback(null, `${id}.${extName}`);
  },
});

export const fileUpload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 },
});
