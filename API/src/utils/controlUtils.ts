import { ErrorRequestHandler } from "express";
import { queryParser } from "../../types";

//middleware to parse queries for data
const parseQueries: queryParser = (fields) => (req, res, next) => {
  try {
    for(let field in req.query){
      if (typeof req.query[field] !== "string") {
        res.status(400).end();
        return;
      }
    }

    let { sort = "-datetime", limit = "15", offset = "0" } = req.query as Record<string, string>;
    //prepares object to be referenced by orderBy arg in prisma
    //e.g +username orders usernames in ascending order
    //-datetime orders datetime in descending order
    let orderByList: {[key:string]:string}[] = [];
    sort.split(",").forEach((str) => {
      const order = str[0] === "-" ? "desc" : "asc";
      const field = str.slice(1);
      if (fields.includes(field)) orderByList.push({[field]:order});
    });

    //example: ?fieldName1=1224513&fieldName2=1626
    let filterByObj: { [key: string]: string } = {};
    fields.forEach((field) => {
      if (field in req.query) {
        filterByObj[field] = req.query[field] as string;
      }
    });
    console.log(filterByObj);

    req.body.skip = parseInt(offset);
    req.body.take = parseInt(limit);
    req.body.orderBy = orderByList;
    req.body.where = filterByObj;
    next();
  } catch (error) {
    next(error);
  }
};

const handleError: ErrorRequestHandler = (err, req, res, next) => {
  //uniqueness constraint failed
  if (err.code === "P2002") {
    const errFields = err.meta.target.join(",");

    const message = `uniqueness constraint failed in ${errFields}`;
    res.status(400).json({ message });
  }
  //An operation failed because it depends on one or more records that were required but not found
  if (err.code === "P2025") {
    const message = err.meta.cause;
    res.status(404).json({ message });
  }
  console.error(err);
  res.status(500).end();
};

export { parseQueries, handleError };
