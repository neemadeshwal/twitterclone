import { Request, Response } from "express";
import { Socket as SocketIoServer } from "socket.io";
export interface JWTUSER {
  id: string;
  email: string;
}

export interface GraphqlContext {
  user?: JWTUSER;
  io?: SocketIoServer;
}
