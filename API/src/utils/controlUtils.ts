import { ErrorRequestHandler } from "express";
import { middlewareFactory } from "../../types";

//middleware to parse queries for data
const parseQueries: middlewareFactory = (fields) => (req, res, next) => {
  try {
    let { sort = "-datetime", limit = "15", offset = "0" } = req.query;
    if (
      typeof sort !== "string" ||
      typeof limit != "string" ||
      typeof offset !== "string"
    ) {
      res.status(400).end();
      return;
    }

    //prepares object to be referenced by orderBy arg in prisma
    //e.g +username orders usernames in ascending order
    //-datetime orders datetime in descending order
    let orderByObj: { [key: string]: string } = {};
    sort.split(",").forEach((str) => {
      let order = "";
      switch (str[0]) {
        case "+":
          order = "asc";
          break;
        case "-":
          order = "desc";
          break;
        default:
          res.status(400).end();
          return;
      }
      const field = str.slice(1);

      if (fields.filter((currField) => field === currField).length === 0) {
        res.status(400).end();
      }
      orderByObj[field] = order;
    });

    req.body.skip = parseInt(offset);
    req.body.take = parseInt(limit);
    req.body.orderBy = orderByObj;
    next();
  } catch (error) {
    next(error);
  }
};

const handleError: ErrorRequestHandler = (err, req, res, next) => {
  if(err.code === "P2002"){
    res.status(400).end();
  }
    console.error(err);
    res.status(500).end();
}

export {parseQueries, handleError};