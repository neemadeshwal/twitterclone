import { Request, Response } from "express";
export interface JWTUSER {
  id: string;
  email: string;
}

export interface GraphqlContext {
  user?: JWTUSER;
}
