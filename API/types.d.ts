import { RequestHandler } from "express";

type middlewareFactory = (list: string[]) => RequestHandler;

declare global {
  namespace Express {
    interface User {
      id: string;
    }
    interface Request {
      user?: User;
    }
  }
}
