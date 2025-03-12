import { RequestHandler, Request } from "express";

type middlewareFactory = (list: string[]) => RequestHandler;

interface UserPayload {
  id: string
}

global {
  namespace Express {
    interface User {
      id: string
    }

    interface Request {
      user?: User
    }
  }
  
}
