import { NextFunction, Request, Response } from "express";
import { Server as SocketIOServer } from "socket.io";

interface ExtendedRequest extends Request {
  io: SocketIOServer;
}

const socketIOMiddleware = (io: SocketIOServer) => (req: Request, res: Response, next: NextFunction) => {
  (req as ExtendedRequest).io = io;
  next();
};

export default socketIOMiddleware;
