import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    context?: {
      req: Request;
      res: Response;
    };
  }
}
